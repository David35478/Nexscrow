from fastapi.testclient import TestClient
from main import create_app
from tests.conftest import make_config


def test_public_landing_login_and_authenticated_app(tmp_path):
    c=TestClient(create_app(make_config(tmp_path),data_dir=tmp_path/'data'))
    landing=c.get('/')
    assert landing.status_code==200
    assert '/login' in landing.text
    assert '/landing-assets/_next/' in landing.text
    portal=c.get('/login')
    assert all(value in portal.text for value in ['portal-wallet','portal-google','portal-demo'])
    for path in ['/app','/agents','/dashboard','/workspace','/billing','/account','/requests','/agents/agent-oracle-1','/job/example']:
        response=c.get(path,follow_redirects=False)
        assert response.status_code==303
        assert response.headers['location']=='/login'
    c.post('/api/auth/demo')
    assert c.get('/app').status_code==200
    assert c.get('/agents').status_code==200
    assert c.get('/login',follow_redirects=False).headers['location']=='/app'
    assert '/static/app-theme.css' in c.get('/account').text
    assert c.get('/api/subscription/plans').json()['enabled'] is False
