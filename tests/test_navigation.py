import re

import pytest
from fastapi.testclient import TestClient
from main import create_app

PAGES = [("/app", "/app"), ("/requests", "/requests"), ("/billing", "/billing"), ("/account", "/account"), ("/agents", "/app")]


@pytest.mark.parametrize("path,current", PAGES)
def test_nav_has_four_items_and_current(tmp_path, path, current):
    client = TestClient(create_app(config_path="config.yaml", data_dir=tmp_path))
    client.post("/api/auth/demo")
    html = client.get(path).text
    assert html.count('class="main-nav"') == 1
    nav = re.search(r'<nav class="main-nav".*?</nav>', html, re.S).group(0)
    for label in ("Marketplace", "My tasks", "Billing", "Account"):
        assert nav.count(f">{label}</a>") == 1
    assert nav.count('aria-current="page"') == 1
    assert re.search(rf'aria-current="page" href="{current}"', nav)
    assert "My requests" not in html
    assert "Log out" in html


def test_workspace_has_step_tracker(tmp_path):
    client = TestClient(create_app(config_path="config.yaml", data_dir=tmp_path))
    client.post("/api/auth/demo")
    html = client.get("/workspace?agent=agent-oracle-1").text
    assert 'id="step-tracker"' in html and "<ol" in html
