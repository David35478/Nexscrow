from fastapi.testclient import TestClient
from jinja2 import Environment, FileSystemLoader

from main import create_app
from src.marketplace import agent_details, marketplace_view
from tests.conftest import make_config


BUILT_IN_AGENTS = {
    "agent-oracle-1": 25.0,
    "agent-scribe-2": 25.0,
    "agent-quant-3": 10.0,
}


def test_builtin_agent_call_price_is_ten_cents_without_changing_credit_cost_or_cap(tmp_path):
    app = create_app(config_path="config.yaml", data_dir=tmp_path)
    client = TestClient(app)
    client.post("/api/auth/demo")

    for agent_id, cap in BUILT_IN_AGENTS.items():
        options = client.get(f"/api/requests/options/{agent_id}")
        assert options.status_code == 200
        assert options.json()["task_price_usd"] == 0.1
        assert options.json()["credit_cost"] == 10

        agent = next(a for a in app.state.system.agent_catalog(include_disabled=True) if a["agent_id"] == agent_id)
        assert agent["pricing"]["task_price_usd"] == 0.1
        assert agent["policy"]["max_txn_usd"] == cap

    marketplace = client.get("/app")
    assert marketplace.status_code == 200
    assert marketplace.text.count("$0.10") >= len(BUILT_IN_AGENTS)
    assert "Up to $" not in marketplace.text

    detail = client.get("/agents/agent-oracle-1")
    assert detail.status_code == 200
    assert "$0.10" in detail.text
    assert "Up to $" not in detail.text

    admin_agents = app.state.management_service.agent_records()
    for agent_id in BUILT_IN_AGENTS:
        record = next(agent for agent in admin_agents if agent["agent_id"] == agent_id)
        assert record["task_price_usd"] == 0.1


def test_legacy_profiles_without_explicit_price_render_marketplace(tmp_path):
    app = create_app(config_path=make_config(tmp_path), data_dir=tmp_path / "data")
    view = marketplace_view(app.state.system)

    assert view["agents"]
    assert all(agent["task_price_usd"] is not None for agent in view["agents"])
    templates = Environment(loader=FileSystemLoader("templates"))
    html = templates.get_template("marketplace_home.html").render(**view, user=None)
    assert "Price unavailable" not in html
    assert "$10.00" in html


def test_marketplace_labels_missing_external_price_unavailable():
    agent = agent_details(
        {
            "agent_id": "external-agent",
            "display_name": "External agent",
            "specialization": "General",
            "description": "An external agent.",
            "skills": [],
            "verified": False,
            "provider_id": "external",
            "pricing": None,
        },
        {},
    )
    templates = Environment(loader=FileSystemLoader("templates"))
    card = templates.get_template("marketplace_components.html").module.agent_card(agent)

    assert agent["task_price_usd"] is None
    assert "Price unavailable" in card


def test_marketplace_agent_cards_have_role_specific_local_banners(tmp_path):
    app = create_app(config_path="config.yaml", data_dir=tmp_path)
    client = TestClient(app)
    client.post("/api/auth/demo")
    html = client.get("/app").text
    assert '/static/images/agents/research.svg' in html
    assert '/static/images/agents/writing.svg' in html
    assert '/static/images/agents/analytics.svg' in html
    assert 'alt="Research illustration for Oracle"' in html
