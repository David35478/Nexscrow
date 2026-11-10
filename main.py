"""nexscrow - Agent Escrow. FastAPI app: job board, escrow API, dashboard."""

from __future__ import annotations

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
from src.payment import PaymentError
from src.system import NexscrowSystem


BASE_DIR = Path(__file__).parent

load_env()


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    reward_usd: float = Field(gt=0)
    client: str | None = None


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


class NearVerify(BaseModel):
    account_id: str
    public_key: str
    signature: str
    nonce: str
    recipient: str
    callback_url: str | None = None


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
        )
        return {"job": job}

    @app.get("/api/jobs/{job_id}")
    async def get_job(job_id: str) -> dict:
        system.expire_jobs()
        return system.jobs.get(job_id)

    @app.post("/api/jobs/{job_id}/deposit/approve")
    async def approve_deposit(job_id: str, request: Request) -> dict:
        user = require_user(request)
        return system.approve_deposit(job_id, client_id=user["user_id"])

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

    @app.post("/api/jobs/{job_id}/cancel")
    async def cancel_job(job_id: str, request: Request) -> dict:
        user = require_user(request)
        return system.cancel_job_as(job_id, client_id=user["user_id"])

    @app.post("/api/demo/cycle")
    async def demo_cycle(body: DemoCycle) -> dict:
        return system.run_demo_cycle(body.title, body.description, body.reward_usd)

    @app.get("/api/ledger")
    async def ledger() -> dict:
        return {"events": system.ledger.events()}

    @app.post("/api/admin/kill-switch")
    async def kill_switch(body: KillSwitch) -> dict:
        return system.toggle_kill_switch(body.enabled)

    return app


app = create_app()
