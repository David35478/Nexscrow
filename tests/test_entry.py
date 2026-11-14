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
    assert all(value in portal.text for value in ['DAPPS PORTAL', 'Enter demo mode', 'Connect NEAR wallet'])
    for path in ['/app','/agents','/dashboard','/workspace','/billing','/account','/requests','/agents/agent-oracle-1']:
        response=c.get(path,follow_redirects=False)
        assert response.status_code==303
        assert response.headers['location']=='/login'
    c.post('/api/auth/demo')
    assert c.get('/app').status_code==200
    assert c.get('/agents').status_code==200
    assert c.get('/login',follow_redirects=False).headers['location']=='/app'
    assert '/static/app-theme.css' in c.get('/account').text
    assert c.get('/api/subscription/plans').json()['enabled'] is False


def test_account_profile_logout_revokes_current_session(tmp_path):
    c = TestClient(create_app(make_config(tmp_path), data_dir=tmp_path / 'data'))
    c.post('/api/auth/demo')
    account = c.get('/account')
    assert account.status_code == 200
    assert 'Log out of this account' in account.text
    assert 'id="logout-account"' in account.text
    logout = c.post('/api/auth/logout')
    assert logout.status_code == 200
    assert logout.json()['user'] is None
    assert c.get('/api/auth/session').json()['user'] is None


def test_agent_recommendations_are_reachable_from_marketplace(tmp_path):
    c = TestClient(create_app(make_config(tmp_path), data_dir=tmp_path / 'data'))
    c.post('/api/auth/demo')
    marketplace = c.get('/app')
    assert marketplace.status_code == 200
    assert 'agent-recommend-form' in marketplace.text
    assert '/static/marketplace.js' in marketplace.text
    recommendations = c.post('/api/agents/recommend', json={'title': 'research market analysis', 'description': 'competitor adoption'})
    assert recommendations.status_code == 200
    assert recommendations.json()['agents'][0]['match_score'] > 0
