"""nexscrow - Agent Escrow. FastAPI app: job board, escrow API, dashboard."""

from __future__ import annotations

import os
import secrets

from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from src import privy_auth
from src.auth import SESSION_COOKIE, AuthError, AuthService
from src.constraints import ConstraintError
from src.env import load_env
from src.escrow import ReleaseBlocked
from src.jobs import JobNotFound
from src import network as near_network
from src.near_chain import NearChainError, NearChainTransportError
from src.payment import PaymentError
from src.system import NexscrowSystem
from src.marketplace import agent_details, marketplace_view
from src.providers.base import ProviderError
from src.providers.execution import ProviderPending
from src.requests import RequestService, RequestError
from src.credits import CreditError
from fastapi.responses import FileResponse
from src.billing import BillingService, BillingError
from src.intents import IntentsError
from src.customer import CustomerService
from src.management import ManagementService, ManagementError, is_admin


BASE_DIR = Path(__file__).parent

load_env()


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    reward_usd: float = Field(gt=0)
    client: str | None = None
    min_rank: float = Field(default=0, ge=0, le=100)
    deliverables: str = Field(default="", max_length=1000)
    deadline_hours: int | None = Field(default=None, ge=1, le=720)
    release_condition: str = Field(default="manual", pattern="^(manual|auto)$")
    provider_inputs: dict | None = None
    external_agent_id: str | None = None


class AdminLoginBody(BaseModel):
    model_config = {'extra': 'forbid'}
    email: str = Field(max_length=254)
    password: str = Field(max_length=256)


class AgentAction(BaseModel):
    agent_id: str


class TaskRequestCreate(BaseModel):
    model_config = {"extra": "forbid"}
    agent_id: str = Field(max_length=200)
    inputs: dict
    payment_method: str = Field(pattern="^(escrow|credits)$")
    idempotency_key: str = Field(min_length=8, max_length=128)


class BillingQuote(BaseModel):
    model_config = {"extra": "forbid"}
    origin_asset: str = Field(min_length=1, max_length=300)
    refund_address: str = Field(min_length=2, max_length=256)


class SubscriptionQuote(BillingQuote):
    plan_id: str = Field(min_length=1, max_length=80)


class SubscriptionCheckout(SubscriptionQuote):
    idempotency_key: str = Field(min_length=8, max_length=128)


class TopupQuote(BillingQuote):
    package_id: str = Field(min_length=1, max_length=80)


class TopupCreate(TopupQuote):
    idempotency_key: str = Field(min_length=8, max_length=128)


class SubscriptionChange(BaseModel):
    model_config = {"extra": "forbid"}
    plan_id: str = Field(min_length=1, max_length=80)


class NotificationPreferences(BaseModel):
    model_config = {'extra': 'forbid', 'strict': True}
    execution_updates: bool
    payment_updates: bool
    product_updates: bool


class AccountSettings(BaseModel):
    model_config = {'extra': 'forbid'}
    display_name: str = Field(min_length=1, max_length=80)
    notifications: NotificationPreferences


class AgentRecommendation(BaseModel):
    model_config = {"extra": "forbid"}
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=1000)


class ManagedAgent(BaseModel):
    model_config = {'extra': 'forbid'}
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(max_length=4000)
    category: str = Field(min_length=1, max_length=80)
    task_price_usd: float = Field(gt=0, allow_inf_nan=False)
    credit_cost: int | None = Field(default=None, gt=0, strict=True)
    payment_methods: list[str] = Field(min_length=1, max_length=2)
    enabled: bool = True


class DeveloperAgent(ManagedAgent):
    execution_url: str = Field(max_length=1000)
    input_schema: dict
    output_schema: dict


class DeveloperProfile(BaseModel):
    model_config = {'extra': 'forbid'}
    display_name: str = Field(min_length=1, max_length=120)
    contact_email: str = Field(min_length=3, max_length=254, pattern=r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


class ManagedProvider(BaseModel):
    model_config = {'extra': 'forbid'}
    enabled: bool
    timeout_seconds: int = Field(ge=1, le=60, strict=True)


class ManagedBilling(BaseModel):
    model_config = {'extra': 'forbid'}
    plans: list[dict] = Field(min_length=1, max_length=30)
    topup_packages: list[dict] = Field(max_length=30)


class ReviewNote(BaseModel):
    model_config = {'extra': 'forbid'}
    note: str = Field(min_length=3, max_length=2000)


class ListingReview(ReviewNote):
    decision: str = Field(pattern='^(approved|rejected)$')


class SubmissionTest(BaseModel):
    model_config = {'extra': 'forbid'}
    inputs: dict


class ProofSubmit(BaseModel):
    content: str | None = None


class DemoCycle(BaseModel):
    title: str = "Research report on NEAR Intents adoption"
    description: str = "A short research report on how NEAR Intents are being adopted."
    reward_usd: float = 5.0


class KillSwitch(BaseModel):
    enabled: bool


class DepositConfirm(BaseModel):
    tx_hash: str = Field(min_length=8, max_length=128)
    signer_id: str = Field(default="", max_length=128)


class PrivyToken(BaseModel):
    access_token: str = Field(min_length=1, max_length=16384)


class NearVerify(BaseModel):
    account_id: str
    public_key: str
    signature: str
    nonce: str
    recipient: str
    callback_url: str | None = None


class FastAuthVerify(BaseModel):
    token: str = Field(min_length=10)
    network: str = "testnet"


class PlaceBid(BaseModel):
    agent_id: str
    amount_usd: float = Field(gt=0)


class AwardBid(BaseModel):
    agent_id: str


class OpenDispute(BaseModel):
    reason: str = Field(min_length=3, max_length=500)


class ResolveDispute(BaseModel):
    outcome: str


def create_app(
    config_path: str = "config.yaml",
    data_dir: str | None = None,
) -> FastAPI:
    app = FastAPI(title="nexscrow", version="1.0.0", docs_url="/api/docs")
    system = NexscrowSystem(config_path, data_dir)
    app.state.system = system
    @app.middleware('http')
    async def app_entry_portal(request: Request, call_next):
        private_pages = {'/app', '/agents', '/dashboard', '/account', '/workspace', '/requests', '/billing', '/developer'}
        is_app_page = request.method == 'GET' and (request.url.path in private_pages or request.url.path.startswith('/agents/'))
        if is_app_page and not app.state.auth.get_user(request.cookies.get(SESSION_COOKIE)):
            return RedirectResponse('/login', status_code=303)
        return await call_next(request)
    from src.security import install_security
    install_security(app, system.store)
    auth = AuthService(system.store)
    app.state.auth = auth
    requests_service = RequestService(system)
    app.state.requests_service = requests_service
    billing_service = BillingService(system.store, system.constraints.raw.get('billing', {}))
    app.state.billing_service = billing_service
    customer_service = CustomerService(system, billing_service, auth)
    management_service = ManagementService(system, billing_service)
    app.state.management_service = management_service

    templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
    app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
    app.mount('/landing-assets', StaticFiles(directory=str(BASE_DIR / 'static' / 'landing-export'), check_dir=False), name='landing_assets')
    app.mount('/images', StaticFiles(directory=str(BASE_DIR / 'static' / 'landing-export' / 'images')), name='template_images')

    def _handler(status_code: int):
        def inner(request: Request, exc: Exception) -> JSONResponse:
            return JSONResponse(status_code=status_code, content={"error": str(exc)})

        return inner

    for exc, code in (
        (ConstraintError, 400),
        (PaymentError, 400),
        (near_network.NetworkError, 409),
        (NearChainTransportError, 502),
        (NearChainError, 400),
        (AuthError, 400),
        (JobNotFound, 404),
        (ReleaseBlocked, 409),
        (ProviderError, 400),
        (ProviderPending, 409),
        (RequestError, 400),
        (CreditError, 400),
        (BillingError, 400),
        (IntentsError, 502),
        (ManagementError, 400),
    ):
        app.add_exception_handler(exc, _handler(code))  # type: ignore[arg-type]

    def current_user(request: Request) -> dict | None:
        return auth.get_user(request.cookies.get(SESSION_COOKIE))

    def require_user(request: Request) -> dict:
        user = current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="login required")
        return user

    def require_admin(request: Request):
        user = require_user(request)
        if not is_admin(user):
            raise HTTPException(403, 'Administrator access required')
        return user

    @app.get('/admin/login')
    async def admin_login_page(request: Request):
        if is_admin(current_user(request)):
            return RedirectResponse('/admin', status_code=303)
        return templates.TemplateResponse(request=request, name='admin_login.html', context={})

    @app.get('/admin')
    async def admin_portal(request: Request):
        user = current_user(request)
        if not is_admin(user):
            return RedirectResponse('/admin/login', status_code=303)
        return templates.TemplateResponse(request=request, name='management.html', context={'mode': 'admin', 'user': user})

    @app.get('/developer')
    async def developer_portal(request: Request):
        user = require_user(request)
        return templates.TemplateResponse(request=request, name='management.html', context={'mode': 'developer', 'user': user})

    @app.get('/api/admin/overview')
    def admin_overview(request: Request):
        require_admin(request)
        return management_service.overview()

    @app.put('/api/admin/agents/{agent_id}')
    def admin_agent(agent_id: str, body: ManagedAgent, request: Request):
        return management_service.update_agent(require_admin(request), agent_id, body.model_dump())

    @app.put('/api/admin/providers/{provider_id}')
    def admin_provider(provider_id: str, body: ManagedProvider, request: Request):
        return management_service.update_provider(require_admin(request), provider_id, body.model_dump())

    @app.post('/api/admin/providers/{provider_id}/health')
    def admin_provider_health(provider_id: str, request: Request):
        return management_service.health(require_admin(request), provider_id)

    @app.post('/api/admin/providers/sync')
    def admin_provider_sync(request: Request):
        return management_service.synchronize(require_admin(request))

    @app.put('/api/admin/billing/config')
    def admin_billing(body: ManagedBilling, request: Request):
        return management_service.update_billing(require_admin(request), body.model_dump())

    @app.post('/api/admin/payments/{payment_id}/review')
    def admin_payment_review(payment_id: str, body: ReviewNote, request: Request):
        return management_service.review_payment(require_admin(request), payment_id, body.note)

    @app.post('/api/admin/developers/agents/{submission_id}/review')
    def admin_listing_review(submission_id: str, body: ListingReview, request: Request):
        try:
            return management_service.review_submission(require_admin(request), submission_id, body.decision, body.note)
        except KeyError:
            raise HTTPException(404, 'Submission not found') from None

    @app.get('/api/developer/overview')
    def developer_overview(request: Request):
        return management_service.developer_overview(require_user(request))

    @app.post('/api/developer/register')
    def developer_register(body: DeveloperProfile, request: Request):
        return management_service.register(require_user(request), body.model_dump())

    @app.post('/api/developer/agents')
    def developer_submit(body: DeveloperAgent, request: Request):
        fields = body.model_dump(exclude={'enabled'})
        return management_service.submit(require_user(request), fields)

    @app.put('/api/developer/agents/{submission_id}')
    def developer_edit(submission_id: str, body: DeveloperAgent, request: Request):
        try:
            record = management_service.developer_overview(require_user(request))
            if not any(a['submission_id'] == submission_id for a in record['agents']):
                raise KeyError()
            return management_service.submit(require_user(request), body.model_dump(exclude={'enabled'}), submission_id)
        except KeyError:
            raise HTTPException(404, 'Submission not found') from None

    @app.post('/api/developer/agents/{submission_id}/test')
    def developer_test(submission_id: str, body: SubmissionTest, request: Request):
        try:
            return management_service.test_submission(require_user(request), submission_id, body.inputs)
        except KeyError:
            raise HTTPException(404, 'Submission not found') from None

    def require_external_owner(job_id: str, request: Request, agent_id: str | None = None):
        job = system.jobs.get(job_id)
        if not job.get('simulated', True) or (agent_id or job.get("agent") or "").startswith("external-"):
            user = require_user(request)
            if job.get("client_id") != user["user_id"] or user.get("provider") == "demo":
                raise HTTPException(403, "Only the live posting client can execute this provider")

    def _external_base(request: Request) -> str:
        proto = request.headers.get("x-forwarded-proto", request.url.scheme)
        host = request.headers.get("host", request.url.netloc)
        configured = os.environ.get('APP_ORIGIN')
        if os.environ.get('APP_ENV') == 'production' and not configured:
            raise HTTPException(503, 'Production origin is not configured')
        return configured.rstrip('/') if configured else f"{proto}://{host}"

    @app.get('/account')
    async def customer_dashboard(request: Request):
        return templates.TemplateResponse(request=request, name='customer_dashboard.html', context={'user': current_user(request)})

    @app.get('/api/customer/dashboard')
    def customer_data(request: Request):
        return customer_service.dashboard(require_user(request))

    @app.get('/api/account/settings')
    def account_settings(request: Request):
        return customer_service.settings(require_user(request))

    @app.put('/api/account/settings')
    def save_account_settings(body: AccountSettings, request: Request):
        user = require_user(request)
        if not body.display_name.strip():
            raise HTTPException(400, 'Display name cannot be blank')
        return customer_service.save_settings(user, body.display_name, body.notifications.model_dump())

    @app.post('/api/account/sessions/revoke-other')
    def revoke_other_sessions(request: Request):
        return customer_service.revoke_other_sessions(require_user(request), request.cookies.get(SESSION_COOKIE))

    def owned_request(request: Request, request_id: str):
        user = require_user(request)
        try:
            record = requests_service.get(user, request_id)
        except KeyError:
            raise HTTPException(404, "Request not found") from None
        return user, record

    @app.get("/workspace")
    @app.get("/requests")
    async def workspace(request: Request):
        return templates.TemplateResponse(request=request, name="workspace.html", context={"user": current_user(request)})

    @app.get("/api/requests/options/{agent_id}")
    def request_options(agent_id: str, request: Request):
        return requests_service.options(require_user(request), agent_id)

    @app.post("/api/requests")
    def create_task_request(body: TaskRequestCreate, request: Request):
        return requests_service.create(require_user(request), body.agent_id, body.inputs, body.payment_method, body.idempotency_key)

    @app.get("/api/requests")
    def request_history(request: Request):
        return {"requests": requests_service.history(require_user(request))}

    @app.get("/api/requests/{request_id}")
    def request_detail(request_id: str, request: Request):
        return owned_request(request, request_id)[1]

    @app.post("/api/requests/{request_id}/advance")
    @app.post("/api/requests/{request_id}/retry")
    def advance_request(request_id: str, request: Request):
        user, _ = owned_request(request, request_id)
        return requests_service.advance(user, request_id)

    @app.post("/api/requests/{request_id}/approve")
    def approve_request(request_id: str, request: Request):
        user, record = owned_request(request, request_id)
        return requests_service.approve(user, request_id)

    # ------------------------------------------------------------- pages

    @app.get("/")
    async def index(request: Request):
        return FileResponse(BASE_DIR / 'static' / 'landing-export' / 'index.html', media_type='text/html')

    @app.get('/login')
    async def login_portal(request: Request):
        if current_user(request):
            return RedirectResponse('/app', status_code=303)
        return FileResponse(BASE_DIR / 'static' / 'landing-export' / 'portal.html', media_type='text/html')

    @app.get('/app')
    async def app_home(request: Request):
        if not current_user(request):
            return RedirectResponse('/login', status_code=303)
        return templates.TemplateResponse(request=request, name='marketplace_home.html', context={**marketplace_view(system), 'user': current_user(request)})

    @app.get("/agents/{agent_id}")
    async def agent_detail(request: Request, agent_id: str):
        agent = next((a for a in system.agent_catalog() if a["agent_id"] == agent_id), None)
        if agent is None:
            raise HTTPException(404, "Agent not found")
        stats = system.reputation(agent_id)
        return templates.TemplateResponse(request=request, name="agent_detail.html", context={"agent": agent_details(agent, stats), "user": current_user(request)})

    @app.get("/billing")
    async def billing(request: Request):
        return templates.TemplateResponse(request=request, name="billing.html", context={"user": current_user(request)})

    @app.get("/api/billing/payment-assets")
    def payment_assets():
        return billing_service.assets()

    @app.get('/api/subscription/plans')
    def subscription_plans():
        enabled, reason = billing_service.readiness()
        return {'plans': billing_service.plans(), 'enabled': enabled, 'disabled_reason': reason}

    @app.get('/api/credits/packages')
    def credit_packages():
        return {'packages': billing_service.packages()}

    @app.get('/api/subscription/me')
    def my_subscription(request: Request):
        return billing_service.subscription(require_user(request))

    @app.post('/api/subscription/free')
    def free_subscription(request: Request):
        return billing_service.free(require_user(request))

    @app.post('/api/subscription/change')
    def change_subscription(body: SubscriptionChange, request: Request):
        return billing_service.schedule_change(require_user(request), body.plan_id)

    @app.post('/api/subscription/quote')
    def subscription_quote(body: SubscriptionQuote, request: Request):
        result = billing_service.quote(require_user(request), 'subscription', body.plan_id, body.origin_asset, body.refund_address)
        return {k: v for k, v in result.items() if k not in {'payload', 'offer'}}

    @app.post('/api/subscription/checkout')
    def subscription_checkout(body: SubscriptionCheckout, request: Request):
        return billing_service.create(require_user(request), 'subscription', body.plan_id, body.origin_asset, body.refund_address, body.idempotency_key)

    @app.get('/api/credits/me')
    def my_credits(request: Request):
        return billing_service.credits.snapshot(require_user(request)['user_id'])

    @app.get('/api/credits/history')
    def credit_history(request: Request):
        entries = billing_service.credits.snapshot(require_user(request)['user_id'])['entries']
        return {'entries': [{**entry, 'type': entry.get('kind', entry.get('type')), 'delta': entry.get('amount', entry.get('delta'))} for entry in entries]}

    @app.post('/api/credits/topup/quote')
    def topup_quote(body: TopupQuote, request: Request):
        result = billing_service.quote(require_user(request), 'topup', body.package_id, body.origin_asset, body.refund_address)
        return {k: v for k, v in result.items() if k not in {'payload', 'offer'}}

    @app.post('/api/credits/topup/create')
    def topup_create(body: TopupCreate, request: Request):
        return billing_service.create(require_user(request), 'topup', body.package_id, body.origin_asset, body.refund_address, body.idempotency_key)

    @app.get('/api/credits/topup/{payment_id}/status')
    def payment_status(payment_id: str, request: Request):
        try:
            return billing_service.status(require_user(request), payment_id)
        except KeyError:
            raise HTTPException(404, 'Payment not found') from None

    @app.get('/api/billing/history')
    def billing_history(request: Request):
        return {'payments': billing_service.history(require_user(request))}

    @app.get("/dashboard")
    async def dashboard(request: Request):
        view = system.public_view()
        view["user"] = current_user(request)
        return templates.TemplateResponse(
            request=request,
            name="dashboard.html",
            context={"view": view},
        )

    @app.get("/job/{job_id}")
    async def job_page(request: Request, job_id: str):
        try:
            job = system.jobs.get(job_id)
        except JobNotFound:
            raise HTTPException(status_code=404, detail="job not found")
        view = system.public_view()
        view["user"] = current_user(request)
        return templates.TemplateResponse(
            request=request,
            name="job_detail.html",
            context={
                "view": view,
                "job_id": job_id,
                "proof_hash": job.get("proof_hash"),
                "explorer_url": near_network.TESTNET.explorer_url,
            },
        )

    @app.get("/near-callback")
    async def near_callback(request: Request):
        return templates.TemplateResponse(
            request=request,
            name="near_callback.html",
            context={},
        )

    @app.get("/agents")
    async def agents_page(request: Request):
        if not current_user(request):
            return RedirectResponse('/login', status_code=303)
        view = system.public_view()
        view["user"] = current_user(request)
        return templates.TemplateResponse(
            request=request,
            name="agents.html",
            context={"view": view},
        )

    # -------------------------------------------------------------- api

    # ------------------------------------------------------------- auth

    @app.get("/api/auth/session")
    async def auth_session(request: Request) -> dict:
        return {"user": current_user(request)}

    @app.post("/api/auth/demo")
    async def auth_demo(request: Request) -> dict:
        user = auth.demo_login()
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = JSONResponse(content={"user": user})
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, secure=os.environ.get("APP_ENV") == "production", samesite="lax", max_age=24 * 3600
        )
        return response

    @app.post("/api/auth/admin/login")
    async def auth_admin_login(body: AdminLoginBody) -> dict:
        from src import admin_auth
        user = admin_auth.authenticate(body.email, body.password)
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = JSONResponse(content={"user": user})
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, secure=os.environ.get("APP_ENV") == "production", samesite="lax", max_age=24 * 3600
        )
        return response

    @app.post("/api/auth/signup")
    async def auth_signup(request: Request) -> dict:
        """Login and signup are one action: a wallet or Google identity
        creates the account on first sign-in."""
        user = current_user(request)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="sign in with your wallet or Google to create an account",
            )
        return {"user": user}

    @app.post("/api/auth/logout")
    async def auth_logout(request: Request) -> dict:
        auth.logout(request.cookies.get(SESSION_COOKIE))
        response = JSONResponse(content={"user": None})
        response.delete_cookie(SESSION_COOKIE)
        return response

    @app.get("/api/auth/google/start")
    async def google_start(request: Request):
        redirect_uri = f"{_external_base(request)}/api/auth/google/callback"
        state = secrets.token_urlsafe(24)
        url = auth.google_auth_url(redirect_uri, state)
        response = RedirectResponse(url, status_code=302)
        response.set_cookie('nexscrow_oauth_state', state, httponly=True, secure=os.environ.get('APP_ENV') == 'production', samesite='lax', max_age=600)
        return response

    @app.get("/api/auth/google/callback")
    async def google_callback(request: Request):
        state = request.query_params.get('state', '')
        expected = request.cookies.get('nexscrow_oauth_state', '')
        if not state or not expected or not secrets.compare_digest(state, expected):
            raise HTTPException(400, 'Invalid OAuth state')
        error = request.query_params.get("error")
        if error:
            return RedirectResponse(f"/?auth_error={error}", status_code=302)
        code = request.query_params.get("code")
        if not code:
            return RedirectResponse("/?auth_error=missing_code", status_code=302)
        redirect_uri = f"{_external_base(request)}/api/auth/google/callback"
        user = auth.verify_google_code(code, redirect_uri)
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = RedirectResponse("/app", status_code=302)
        response.delete_cookie('nexscrow_oauth_state')
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, secure=os.environ.get("APP_ENV") == "production", samesite="lax", max_age=24 * 3600
        )
        return response

    @app.post("/api/auth/near/init")
    async def near_init() -> dict:
        return auth.issue_challenge()

    @app.post("/api/auth/near/verify")
    async def near_verify(body: NearVerify, request: Request) -> dict:
        user = auth.verify_near_login(
            body.account_id,
            body.public_key,
            body.signature,
            body.nonce,
            body.recipient,
            body.callback_url,
        )
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = JSONResponse(content={"user": user})
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, secure=os.environ.get("APP_ENV") == "production", samesite="lax", max_age=24 * 3600
        )
        return response

    @app.post("/api/auth/privy/verify")
    def privy_verify(body: PrivyToken, request: Request):
        subject = privy_auth.verify_access_token(body.access_token)
        token = auth.create_session("privy", f"privy:{subject}", "Privy account")
        response = JSONResponse({"ok": True, "user": auth.get_user(token)})
        response.set_cookie(SESSION_COOKIE, token, httponly=True, samesite="lax", max_age=86400, secure=os.environ.get("APP_ENV") == "production")
        return response

    @app.get("/api/auth/privy/config")
    def privy_config():
        return {"app_id": privy_auth.app_id() or None}

    @app.post("/api/auth/fastauth/verify")
    async def fastauth_verify(body: FastAuthVerify) -> dict:
        """NEAR Auth (Google login): verify the Auth0 token, issue a session."""
        user = auth.verify_fastauth_token(body.token, body.network)
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = JSONResponse(content={"user": user})
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, secure=os.environ.get("APP_ENV") == "production", samesite="lax", max_age=24 * 3600
        )
        return response

    @app.get("/api/health")
    async def health() -> dict:
        return {"status": "ok", "service": "nexscrow"}

    @app.get("/api/config")
    async def config() -> dict:
        view = system.public_view()
        chain = near_network.status(system.constraints.raw)
        view["network"] = chain
        view["auth"] = {
            "google_configured": auth.google_configured(),
            # Wallet sign-in always uses testnet accounts; it never moves funds.
            "near_network": near_network.TESTNET.network_id,
            "near_sign_in_contract": system.constraints.auth.get("near_sign_in_contract"),
        }
        near_auth_cfg = dict(system.constraints.near_auth)
        if os.environ.get("NEAR_AUTH_CLIENT_ID"):
            near_auth_cfg["client_id"] = os.environ["NEAR_AUTH_CLIENT_ID"]
        view["near_auth"] = (
            {
                "network": near_network.TESTNET.fast_auth_network,
                "client_id": near_auth_cfg.get("client_id", ""),
            }
            if near_auth_cfg.get("client_id")
            else None
        )
        view["live_agents_ready"] = bool(os.environ.get("NEAR_AI_API_KEY"))
        view["live_payouts_ready"] = bool(os.environ.get("ESCROW_PRIVATE_KEY")) and chain["enabled"]
        return view

    @app.get("/api/jobs")
    async def list_jobs() -> dict:
        return system.board()

    @app.post("/api/jobs")
    async def create_job(body: JobCreate, request: Request) -> dict:
        user = require_user(request)
        if body.external_agent_id:
            from src.storage import PostgresStore
            if user.get("provider") == "demo" or not isinstance(system.store, PostgresStore):
                raise HTTPException(400, "External providers require a live account and PostgreSQL storage")
            registration = system.provider_registry.get(body.external_agent_id)
            inputs = body.provider_inputs if body.provider_inputs is not None else {"prompt": f"{body.title}\n{body.description}\n{body.deliverables}"}
            system.provider_registry.adapters[registration["provider_id"]].validate_inputs(registration, inputs)
            if body.reward_usd > registration["pricing"]["max_task_usd"]:
                raise HTTPException(400, "Reward exceeds the agent task limit")
        job = system.post_job(
            body.title,
            body.description,
            body.reward_usd,
            client=user["name"],
            client_id=user["user_id"],
            min_rank=body.min_rank,
            dispute_window_minutes=None,
            deliverables=body.deliverables,
            deadline_hours=body.deadline_hours,
            release_condition=body.release_condition,
            # demo-session users create simulated jobs; everyone else is live
            simulated=(user.get("provider") == "demo"),
        )
        if body.provider_inputs is not None:
            job = system.jobs.update(job["job_id"], provider_inputs=body.provider_inputs)
        return {"job": job}

    @app.post("/api/jobs/{job_id}/approve-work")
    async def approve_work(job_id: str, request: Request) -> dict:
        user = require_user(request)
        return system.approve_work(job_id, client_id=user["user_id"])

    @app.get("/api/jobs/{job_id}")
    async def get_job(job_id: str, request: Request) -> dict:
        system.expire_jobs()
        job = system.jobs.get(job_id)
        user = current_user(request)
        owner = bool(user and job.get("client_id") and job["client_id"] == user["user_id"])
        return system.public_job(job, owner=owner)

    @app.post("/api/jobs/{job_id}/deposit/approve")
    async def approve_deposit(job_id: str, request: Request) -> dict:
        user = require_user(request)
        return system.approve_deposit(job_id, client_id=user["user_id"])

    @app.post("/api/jobs/{job_id}/deposit/prepare")
    async def prepare_deposit(job_id: str, request: Request) -> dict:
        """Return the wallet-payable deposit: escrow account + exact yoctoNEAR."""
        user = require_user(request)
        return system.prepare_deposit(job_id, client_id=user["user_id"])

    @app.post("/api/jobs/{job_id}/deposit/confirm")
    async def confirm_deposit(job_id: str, body: DepositConfirm, request: Request) -> dict:
        """Verify the wallet-signed NEAR deposit on-chain and lock escrow."""
        user = require_user(request)
        return system.confirm_deposit(
            job_id, body.tx_hash, body.signer_id, client_id=user["user_id"]
        )

    @app.post("/api/jobs/{job_id}/accept")
    async def accept_job(job_id: str, body: AgentAction, request: Request) -> dict:
        require_external_owner(job_id, request, body.agent_id)
        return system.accept_job(job_id, body.agent_id)

    @app.post("/api/jobs/{job_id}/work")
    async def run_work(job_id: str, request: Request) -> dict:
        require_external_owner(job_id, request)
        return system.run_work(job_id)

    @app.post("/api/jobs/{job_id}/proof")
    async def submit_proof(job_id: str, body: ProofSubmit, request: Request) -> dict:
        require_external_owner(job_id, request)
        if not system.jobs.get(job_id).get('simulated', True) and body.content is not None:
            raise HTTPException(400, "Live proof must use the stored agent result")
        return system.submit_proof(job_id, body.content)

    @app.post("/api/jobs/{job_id}/agent-run")
    async def agent_run(job_id: str, body: AgentAction, request: Request) -> dict:
        require_external_owner(job_id, request, body.agent_id)
        return system.agent_run(job_id, body.agent_id)

    @app.post("/api/jobs/{job_id}/bid")
    async def place_bid(job_id: str, body: PlaceBid, request: Request) -> dict:
        if not system.jobs.get(job_id).get('simulated', True):
            require_admin(request)
        return system.place_bid(job_id, body.agent_id, body.amount_usd)

    @app.post("/api/jobs/{job_id}/award")
    async def award_bid(job_id: str, body: AwardBid, request: Request) -> dict:
        user = require_user(request)
        return system.award_job(job_id, body.agent_id, client_id=user["user_id"])

    @app.post("/api/jobs/{job_id}/dispute")
    async def dispute(job_id: str, body: OpenDispute, request: Request) -> dict:
        user = require_user(request)
        return system.dispute(job_id, body.reason, client_id=user["user_id"])

    @app.post("/api/jobs/{job_id}/dispute/resolve")
    async def resolve(job_id: str, body: ResolveDispute, request: Request) -> dict:
        user = require_user(request)
        return system.resolve(job_id, body.outcome, client_id=user["user_id"])

    @app.get("/api/reputation")
    async def reputation(agent_id: str | None = None) -> dict:
        stats = system.reputation(agent_id)
        return {"agents": stats} if agent_id is None else stats

    @app.get("/api/agents")
    async def agents() -> dict:
        return {"agents": system.agent_catalog()}

    @app.get("/api/agents/recommend")
    async def recommend(title: str, description: str = "") -> dict:
        return {"agents": system.recommend_agents(title, description)}

    @app.post("/api/agents/recommend")
    async def recommend_from_brief(body: AgentRecommendation) -> dict:
        return {"agents": system.recommend_agents(body.title, body.description)}

    @app.get("/api/leaderboard")
    async def leaderboard() -> dict:
        return {"agents": system.leaderboard()}

    @app.post("/api/jobs/{job_id}/cancel")
    async def cancel_job(job_id: str, request: Request) -> dict:
        user = require_user(request)
        return system.cancel_job_as(job_id, client_id=user["user_id"])

    @app.post("/api/demo/cycle")
    async def demo_cycle(body: DemoCycle, request: Request) -> dict:
        require_user(request)
        return system.run_demo_cycle(body.title, body.description, body.reward_usd)

    @app.get("/api/ledger")
    async def ledger() -> dict:
        return {"events": system.ledger.events()}

    @app.post("/api/admin/kill-switch")
    async def kill_switch(body: KillSwitch, request: Request) -> dict:
        actor = require_admin(request)
        result = system.toggle_kill_switch(body.enabled)
        management_service.mutate(actor, 'platform.kill_switch', str(body.enabled), lambda data: None)
        return result

    return app


app = create_app()
