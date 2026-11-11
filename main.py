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

from src.auth import SESSION_COOKIE, AuthError, AuthService
from src.constraints import ConstraintError
from src.env import load_env
from src.escrow import ReleaseBlocked
from src.jobs import JobNotFound
from src.near_chain import NearChainError
from src.payment import PaymentError
from src.system import NexscrowSystem


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


class AgentAction(BaseModel):
    agent_id: str


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
    auth = AuthService(system.store)
    app.state.auth = auth

    templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
    app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

    def _handler(status_code: int):
        def inner(request: Request, exc: Exception) -> JSONResponse:
            return JSONResponse(status_code=status_code, content={"error": str(exc)})

        return inner

    for exc, code in (
        (ConstraintError, 400),
        (PaymentError, 400),
        (NearChainError, 400),
        (AuthError, 400),
        (JobNotFound, 404),
        (ReleaseBlocked, 409),
    ):
        app.add_exception_handler(exc, _handler(code))  # type: ignore[arg-type]

    def current_user(request: Request) -> dict | None:
        return auth.get_user(request.cookies.get(SESSION_COOKIE))

    def require_user(request: Request) -> dict:
        user = current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="login required")
        return user

    def _external_base(request: Request) -> str:
        proto = request.headers.get("x-forwarded-proto", request.url.scheme)
        host = request.headers.get("host", request.url.netloc)
        return f"{proto}://{host}"

    # ------------------------------------------------------------- pages

    @app.get("/")
    async def index(request: Request):
        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context={"view": system.public_view()},
        )

    @app.get("/dashboard")
    async def dashboard(request: Request):
        return templates.TemplateResponse(
            request=request,
            name="dashboard.html",
            context={"view": system.public_view()},
        )

    @app.get("/job/{job_id}")
    async def job_page(request: Request, job_id: str):
        try:
            system.jobs.get(job_id)
        except JobNotFound:
            raise HTTPException(status_code=404, detail="job not found")
        return templates.TemplateResponse(
            request=request,
            name="job_detail.html",
            context={"view": system.public_view(), "job_id": job_id},
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
        return templates.TemplateResponse(
            request=request,
            name="agents.html",
            context={"view": system.public_view()},
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
            SESSION_COOKIE, token, httponly=True, samesite="lax", max_age=24 * 3600
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
        return RedirectResponse(url, status_code=302)

    @app.get("/api/auth/google/callback")
    async def google_callback(request: Request):
        error = request.query_params.get("error")
        if error:
            return RedirectResponse(f"/?auth_error={error}", status_code=302)
        code = request.query_params.get("code")
        if not code:
            return RedirectResponse("/?auth_error=missing_code", status_code=302)
        redirect_uri = f"{_external_base(request)}/api/auth/google/callback"
        user = auth.verify_google_code(code, redirect_uri)
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = RedirectResponse("/", status_code=302)
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, samesite="lax", max_age=24 * 3600
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
            SESSION_COOKIE, token, httponly=True, samesite="lax", max_age=24 * 3600
        )
        return response

    @app.post("/api/auth/fastauth/verify")
    async def fastauth_verify(body: FastAuthVerify) -> dict:
        """NEAR Auth (Google login): verify the Auth0 token, issue a session."""
        user = auth.verify_fastauth_token(body.token, body.network)
        token = auth.create_session(user["provider"], user["user_id"], user["name"])
        response = JSONResponse(content={"user": user})
        response.set_cookie(
            SESSION_COOKIE, token, httponly=True, samesite="lax", max_age=24 * 3600
        )
        return response

    @app.get("/api/health")
    async def health() -> dict:
        return {"status": "ok", "service": "nexscrow"}

    @app.get("/api/config")
    async def config() -> dict:
        view = system.public_view()
        view["auth"] = {
            "google_configured": auth.google_configured(),
            "near_network": system.constraints.auth.get("near_network", "mainnet"),
            "near_sign_in_contract": system.constraints.auth.get(
                "near_sign_in_contract", "intents.near"
            ),
        }
        near_auth_cfg = dict(system.constraints.near_auth)
        if os.environ.get("NEAR_AUTH_NETWORK"):
            near_auth_cfg["network"] = os.environ["NEAR_AUTH_NETWORK"]
        if os.environ.get("NEAR_AUTH_CLIENT_ID"):
            near_auth_cfg["client_id"] = os.environ["NEAR_AUTH_CLIENT_ID"]
        view["near_auth"] = (
            {
                "network": near_auth_cfg.get("network", "testnet"),
                "client_id": near_auth_cfg.get("client_id", ""),
            }
            if near_auth_cfg.get("client_id")
            else None
        )
        view["live_agents_ready"] = bool(os.environ.get("NEAR_AI_API_KEY"))
        view["live_payouts_ready"] = bool(os.environ.get("ESCROW_PRIVATE_KEY"))
        return view

    @app.get("/api/jobs")
    async def list_jobs() -> dict:
        return system.board()

    @app.post("/api/jobs")
    async def create_job(body: JobCreate, request: Request) -> dict:
        user = require_user(request)
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
        return {"job": job}

    @app.post("/api/jobs/{job_id}/approve-work")
    async def approve_work(job_id: str, request: Request) -> dict:
        user = require_user(request)
        return system.approve_work(job_id, client_id=user["user_id"])

    @app.get("/api/jobs/{job_id}")
    async def get_job(job_id: str) -> dict:
        system.expire_jobs()
        return system.jobs.get(job_id)

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
    async def accept_job(job_id: str, body: AgentAction) -> dict:
        return system.accept_job(job_id, body.agent_id)

    @app.post("/api/jobs/{job_id}/work")
    async def run_work(job_id: str) -> dict:
        return system.run_work(job_id)

    @app.post("/api/jobs/{job_id}/proof")
    async def submit_proof(job_id: str, body: ProofSubmit) -> dict:
        return system.submit_proof(job_id, body.content)

    @app.post("/api/jobs/{job_id}/agent-run")
    async def agent_run(job_id: str, body: AgentAction) -> dict:
        return system.agent_run(job_id, body.agent_id)

    @app.post("/api/jobs/{job_id}/bid")
    async def place_bid(job_id: str, body: PlaceBid) -> dict:
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
    async def kill_switch(body: KillSwitch) -> dict:
        return system.toggle_kill_switch(body.enabled)

    return app


app = create_app()
