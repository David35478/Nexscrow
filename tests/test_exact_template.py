from pathlib import Path
from fastapi.testclient import TestClient
from main import create_app
from tests.conftest import make_config


def test_original_component_export_and_assets(tmp_path):
    client=TestClient(create_app(make_config(tmp_path),data_dir=tmp_path/'data'))
    response=client.get('/')
    assert response.status_code==200
    assert '/landing-assets/_next/' in response.text
    assert 'agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4' in response.text
    assert '/login' in response.text
    assert client.get('/images/arc.png').status_code==200
    assert client.get('/images/footer.png').status_code==200
    for component in ['intro-animation','stacking-agent-cards','agent-interface','live-agent-feed','devex-section','mobile-nav']:
        assert Path(f'frontend/components/{component}.tsx').is_file()


def test_python_deployment_does_not_require_frontend_source(tmp_path, monkeypatch):
    import os
    original = os.path.isdir
    monkeypatch.setattr(os.path, 'isdir', lambda path: False if 'frontend/public' in str(path) else original(path))
    client = TestClient(create_app(make_config(tmp_path), data_dir=tmp_path / 'data'))
    assert client.get('/api/health').status_code == 200
    assert client.get('/').status_code == 200
    assert client.get('/images/arc.png').status_code == 200
