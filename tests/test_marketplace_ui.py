from fastapi.testclient import TestClient
from main import create_app


def test_discovery_and_agent_pages(tmp_path):
    client = TestClient(create_app(config_path="config.yaml", data_dir=tmp_path))
    client.post("/api/auth/demo")
    home = client.get("/app")
    assert home.status_code == 200
    assert "Featured agents" in home.text
    assert "Popular agents" in home.text
    assert "Recently added" in home.text
    detail = client.get("/agents/agent-oracle-1")
    assert detail.status_code == 200
    assert "Pay per Call" in detail.text
    assert "Use plan call" in detail.text
    assert "Separate from escrow payments" in detail.text
    assert client.get("/agents/not-an-agent").status_code == 404


def test_billing_identifies_unavailable_services(tmp_path):
    client = TestClient(create_app(config_path="config.yaml", data_dir=tmp_path))
    client.post("/api/auth/demo")
    response = client.get("/billing")
    assert response.status_code == 200
    assert "Calls and escrow are separate" in response.text
    assert "near intents" in response.text.lower()
    assert "No activity yet" in response.text
