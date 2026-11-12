import copy
import json

import httpx
import pytest

from src.providers.base import ProviderError
from src.providers.custom import CustomAdapter
from src.providers.execution import ProviderExecutions, ProviderPending
from src.providers.mock import MockAdapter
from src.providers.registry import AgentRegistry
from src.storage import JsonStore


def registry(tmp_path):
    config = {"mock": {"enabled": True, "agents": [{"provider_agent_id": "echo", "listing_status": "active", "commercial_authorization_status": "approved", "commercial_authorization_reference": "test-fixture-only", "pricing": {"max_task_usd": 5}, "payout_account": "treasury.near"}]}}
    adapter = MockAdapter()
    result = AgentRegistry(JsonStore(tmp_path), config, {"mock": adapter})
    result.sync()
    return result, adapter


def test_registry_pinned_normalized_and_revocation(tmp_path):
    reg, adapter = registry(tmp_path)
    agent = reg.agents()[0]
    assert agent["provider_id"] == "mock"
    assert agent["provider_agent_id"] == "echo"
    assert agent["supported_payment_methods"] == ["escrow"]
    assert reg.catalog()[0]["agent_id"] == agent["internal_agent_id"]
    original_id = agent["internal_agent_id"]
    reg.sync()
    assert reg.agents()[0]["internal_agent_id"] == original_id
    reg.configuration["mock"]["agents"][0]["commercial_authorization_status"] = "unverified"
    assert reg.agents() == []
    with pytest.raises(ProviderError):
        reg.get(original_id)


def test_unknown_commercial_permission_and_missing_credentials_hidden(tmp_path):
    reg, _ = registry(tmp_path)
    reg.configuration["mock"]["agents"][0].pop("commercial_authorization_reference")
    assert reg.sync()["listed"] == 0
    reg.adapters = {}
    assert reg.agents() == []


def test_invalid_inputs_and_execution_idempotency(tmp_path):
    reg, adapter = registry(tmp_path)
    service = ProviderExecutions(reg)
    agent_id = reg.agents()[0]["internal_agent_id"]
    with pytest.raises(ProviderError):
        service.run(agent_id, {"prompt": 12}, "invalid")
    first = service.run(agent_id, {"prompt": "hello"}, "job-1")
    adapter.execute = lambda *args: pytest.fail("duplicate upstream execution")
    second = service.run(agent_id, {"prompt": "hello"}, "job-1")
    assert first["provider_execution_id"] == second["provider_execution_id"]
    assert second["result"] == "hello"
    with pytest.raises(ProviderError):
        service.run(agent_id, {"prompt": "changed"}, "job-1")


def test_async_polling_and_unknown_submission_never_retries(tmp_path):
    reg, adapter = registry(tmp_path)
    service = ProviderExecutions(reg)
    agent_id = reg.agents()[0]["internal_agent_id"]
    adapter.execute = lambda *args: {"provider_execution_id": "upstream-42", "status": "running"}
    with pytest.raises(ProviderPending):
        service.run(agent_id, {"prompt": "hello"}, "job-async")
    adapter.execute = lambda *args: pytest.fail("must poll existing task")
    result = service.run(agent_id, {"prompt": "hello"}, "job-async")
    assert result["status"] == "succeeded"
    def timeout(*args):
        raise ProviderError("Provider request timed out")
    adapter.execute = timeout
    with pytest.raises(ProviderError):
        service.run(agent_id, {"prompt": "hello"}, "job-timeout")
    adapter.execute = lambda *args: pytest.fail("ambiguous POST must never retry")
    with pytest.raises(ProviderError, match="unknown"):
        service.run(agent_id, {"prompt": "hello"}, "job-timeout")


def test_custom_explicit_contract_secret_and_schema(monkeypatch):
    monkeypatch.setattr('src.providers.base.socket.getaddrinfo', lambda *a, **kw: [(2, 1, 6, '', ('8.8.8.8', 443))])
    agent = {"provider_agent_id": "owned", "execution_url": "https://agents.example.org/invoke", "input_schema": {"type": "object", "properties": {"prompt": {"type": "string"}}, "required": ["prompt"], "additionalProperties": False}, "output_schema": {"type": "string"}}
    def transport(request):
        assert request.url.path == "/invoke"
        assert request.headers["Authorization"] == "Bearer secret-value"
        assert json.loads(request.content) == {"inputs": {"prompt": "hello"}}
        return httpx.Response(200, json={"execution_id": "owned-1", "result": "done", "usage": {"units": 1}})
    adapter = CustomAdapter("owned", [agent], "secret-value", httpx.Client(transport=httpx.MockTransport(transport)))
    assert "execution_url" not in adapter.get_agent("owned")
    assert adapter.execute(agent, {"prompt": "hello"})["result"] == "done"
    assert "status" not in adapter.capabilities
    with pytest.raises(ProviderError):
        adapter.status("owned-1")
    private = copy.deepcopy(agent)
    private["execution_url"] = "https://127.0.0.1/invoke"
    with pytest.raises(ProviderError):
        CustomAdapter("owned", [private])


def test_external_escrow_work_preserves_existing_lifecycle(tmp_path):
    from src.system import NexscrowSystem
    from tests.conftest import make_config
    system = NexscrowSystem(make_config(tmp_path), data_dir=tmp_path / "jobs")
    reg, adapter = registry(tmp_path / "provider")
    system.provider_registry = reg
    system.provider_executions = ProviderExecutions(reg)
    agent_id = reg.agents()[0]["internal_agent_id"]
    system.constraints.allowed_agents.append(agent_id)
    job = system.post_job("A brief", "Research", 5, client_id="near:buyer.near", simulated=False)
    system.jobs.update(job["job_id"], payment_status="locked")
    system.accept_job(job["job_id"], agent_id)
    adapter.execute = lambda *args: {"provider_execution_id": "actual-task", "status": "succeeded", "result": "Verified provider work. " * 20, "usage": {"cost_usd": "0.1"}}
    worked = system.run_work(job["job_id"])
    assert worked["provider_execution_id"] == "actual-task"
    assert worked["payment_status"] == "locked"
    assert system.submit_proof(job["job_id"])["status"] == "delivered"
    assert system.jobs.get(job["job_id"])["payment_status"] == "locked"


def test_external_api_requires_live_owner(tmp_path):
    from fastapi.testclient import TestClient
    from main import create_app
    from tests.conftest import make_config
    app = create_app(make_config(tmp_path), data_dir=tmp_path / "api")
    job = app.state.system.post_job("test", "brief", 5, client_id="near:buyer.near", simulated=False)
    client = TestClient(app)
    response = client.post(f"/api/jobs/{job['job_id']}/agent-run", json={"agent_id": "external-example"})
    assert response.status_code == 401


def test_sync_failure_hides_previously_listed_agent(tmp_path):
    reg, adapter = registry(tmp_path)
    assert reg.agents()
    def unavailable(*args):
        raise ProviderError("Unavailable")
    adapter.get_agent = unavailable
    result = reg.sync()
    assert result["listed"] == 0
    assert result["failures"]
    assert reg.agents() == []


def test_live_execution_refuses_json_storage(tmp_path):
    reg, _ = registry(tmp_path)
    service = ProviderExecutions(reg, require_postgres=True)
    with pytest.raises(ProviderError, match="PostgreSQL"):
        service.run(reg.agents()[0]["internal_agent_id"], {"prompt": "hello"}, "job")


def test_remote_schema_references_rejected_without_fetching():
    from src.providers.base import check_schema
    with pytest.raises(ProviderError, match="Remote"):
        check_schema({"type": "object", "properties": {"prompt": {"$ref": "https://private.example/schema"}}})
