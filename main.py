"""nexscrow - Agent Escrow. FastAPI app: job board, escrow API, dashboard."""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from src.constraints import ConstraintError
from src.escrow import ReleaseBlocked
from src.jobs import JobNotFound
from src.payment import PaymentError
from src.system import NexscrowSystem


BASE_DIR = Path(__file__).parent


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


def create_app(
    config_path: str = "config.yaml",
    data_dir: str | None = None,
) -> FastAPI:
    app = FastAPI(title="nexscrow", version="1.0.0", docs_url="/api/docs")
    system = NexscrowSystem(config_path, data_dir)
    app.state.system = system

    templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
    app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

    def _handler(status_code: int):
        def inner(request: Request, exc: Exception) -> JSONResponse:
            return JSONResponse(status_code=status_code, content={"error": str(exc)})

        return inner

    for exc, code in (
        (ConstraintError, 400),
        (PaymentError, 400),
        (JobNotFound, 404),
        (ReleaseBlocked, 409),
    ):
        app.add_exception_handler(exc, _handler(code))  # type: ignore[arg-type]

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

    # -------------------------------------------------------------- api

    @app.get("/api/health")
    async def health() -> dict:
        return {"status": "ok", "service": "nexscrow"}

    @app.get("/api/config")
    async def config() -> dict:
        return system.public_view()

    @app.get("/api/jobs")
    async def list_jobs() -> dict:
        return system.board()

    @app.post("/api/jobs")
    async def create_job(body: JobCreate) -> dict:
        job = system.post_job(body.title, body.description, body.reward_usd, body.client)
        return {"job": job}

    @app.get("/api/jobs/{job_id}")
    async def get_job(job_id: str) -> dict:
        system.expire_jobs()
        return system.jobs.get(job_id)

    @app.post("/api/jobs/{job_id}/deposit/confirm")
    async def confirm_deposit(job_id: str) -> dict:
        return system.confirm_deposit(job_id)

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
    async def cancel_job(job_id: str) -> dict:
        return system.cancel_job(job_id)

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
