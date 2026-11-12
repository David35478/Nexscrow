import hashlib
import hmac
import json

import httpx
import pytest

from src.providers.wiro import WiroAdapter


def adapter(handler, **kwargs):
    client = httpx.Client(transport=httpx.MockTransport(handler), base_url="https://api.wiro.ai/v1")
    return WiroAdapter("test-key", client=client, **kwargs)


def test_auth_signature_uses_key_as_hmac_key_and_never_sends_secret(monkeypatch):
    monkeypatch.setattr("src.providers.wiro.time.time", lambda: 1234)
    seen = {}

    def handler(request):
        seen.update(request.headers)
        return httpx.Response(200, json={"result": True, "tool": {"slugowner": "o", "slugproject": "p", "inputs": {"prompt": {"type": "string"}}}})

    instance = adapter(handler, api_secret="private")
    instance.get_agent("o/p")
    assert seen["x-nonce"] == "1234"
    assert seen["x-signature"] == hmac.new(b"test-key", b"private1234", hashlib.sha256).hexdigest()
    assert "private" not in str(seen)


def test_discovery_includes_only_tools_with_supported_declared_inputs():
    def handler(request):
        if request.url.path.endswith("/Tool/List"):
            return httpx.Response(200, json={"result": True, "tool": [
                {"slugowner": "o", "slugproject": "good"},
                {"slugowner": "o", "slugproject": "unknown"},
            ], "total": "2"})
        if request.url.path.endswith("/Tool/Detail"):
            project = json.loads(request.content)["slugproject"]
            inputs = {"prompt": {"type": "string"}} if project == "good" else {"file": {"type": "image"}}
            return httpx.Response(200, json={"result": True, "tool": {
                "slugowner": "o", "slugproject": project, "name": project, "inputs": inputs,
            }})
        return httpx.Response(404)

    found = adapter(handler).discover()
    assert [agent["provider_agent_id"] for agent in found] == ["o/good"]
    assert found[0]["input_schema"]["properties"]["prompt"]["type"] == "string"
    assert found[0]["input_schema"]["additionalProperties"] is False


def test_discovery_has_fixed_scan_bound_even_for_unknown_total():
    calls = []

    def handler(request):
        calls.append(request)
        if request.url.path.endswith("/Tool/List"):
            return httpx.Response(200, json={"result": True, "total": "unknown", "tool": [
                {"slugowner": "o", "slugproject": "unsupported"} for _ in range(20)
            ]})
        return httpx.Response(200, json={"result": True, "tool": {
            "slugowner": "o", "slugproject": "unsupported", "inputs": {"input": {"type": "unknown"}}
        }})

    assert adapter(handler).discover() == []
    assert sum(request.url.path.endswith("/Tool/List") for request in calls) == 5
    assert sum(request.url.path.endswith("/Tool/Detail") for request in calls) == 100


def test_schema_excludes_provider_control_fields():
    schema, executable = WiroAdapter._inputs({"inputs": {
        "prompt": {"type": "string"}, "callbackUrl": {"type": "string"},
        "config": {"type": "string"},
    }})
    assert executable
    assert set(schema["properties"]) == {"prompt"}
    assert schema["additionalProperties"] is False


def test_run_and_task_terminal_semantics():
    def handler(request):
        if request.url.path.endswith("/Run/o/p"):
            return httpx.Response(200, json={"result": True, "taskid": "task-1"})
        if request.url.path.endswith("/Task/Detail") and json.loads(request.content)["taskid"] == "task-1":
            return httpx.Response(200, json={"result": True, "tasklist": [{
                "status": "task_postprocess_end", "pexit": "0", "outputs": [{"url": "safe-output", "socketAccessToken": "secret", "debug": "private", "unexpected": "private"}], "totalcost": 2,
            }]})
        return httpx.Response(200, json={"result": True, "tasklist": [{"status": "task_error", "pexit": "1"}]})

    instance = adapter(handler)
    agent = {"provider_agent_id": "o/p", "execution_supported": True,
             "input_schema": {"type": "object", "properties": {"prompt": {"type": "string"}}, "required": ["prompt"], "additionalProperties": False}}
    run = instance.execute(agent, {"prompt": "hello"})
    assert run["provider_execution_id"] == "task-1"
    assert run["status"] == "running"
    result = instance.status("task-1")
    assert result["status"] == "succeeded"
    assert result["result"] == [{"url": "safe-output"}]
    assert result["usage"] == {"totalcost": 2}
    assert instance.status("other")["status"] == "running"


def test_status_rejects_mismatched_returned_task_id():
    def handler(_request):
        return httpx.Response(200, json={"result": True, "tasklist": [{
            "taskid": "another-task", "status": "task_running",
        }]})

    with pytest.raises(Exception, match="different task ID"):
        adapter(handler).status("requested-task")


def test_error_response_does_not_leak_provider_body_or_credentials():
    def handler(_request):
        return httpx.Response(500, text="private provider diagnostic")

    with pytest.raises(Exception) as error:
        adapter(handler).get_agent("o/p")
    assert "private provider diagnostic" not in str(error.value)
    assert "test-key" not in str(error.value)
