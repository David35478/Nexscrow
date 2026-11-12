"""Wiro AI provider adapter."""

from __future__ import annotations

import hashlib
import hmac
import time
from typing import Any
from urllib.parse import quote

import httpx

from .base import ProviderAdapter, ProviderError


class WiroAdapter(ProviderAdapter):
    """Adapter for Wiro's Tool and Run APIs."""

    provider_id = "wiro"
    capabilities = frozenset(
        {"discover", "metadata", "execute", "status", "results", "usage", "health"}
    )
    base_url = "https://api.wiro.ai/v1"
    _supported_types = {"string": "string", "number": "number", "integer": "integer", "boolean": "boolean"}
    _forbidden_input_names = {"callbackurl", "callbackurls", "callback_url", "callback_urls", "config", "configuration"}
    _sensitive_output_names = {"socketaccesstoken", "socket_access_token", "debug", "rawdebug", "raw_debug"}
    _safe_output_names = {
        "url", "uri", "name", "filename", "file_name", "type", "format", "mimetype",
        "mime_type", "size", "duration", "width", "height", "text", "value", "output",
    }
    _discovery_page_size = 20
    _discovery_max_pages = 5

    def __init__(
        self,
        api_key: str,
        api_secret: str | None = None,
        client: httpx.Client | None = None,
        timeout: float = 20,
    ) -> None:
        if not api_key:
            raise ValueError("Wiro API key is required")
        self.api_key = api_key
        self.api_secret = api_secret
        self.timeout = timeout
        self.client = client or httpx.Client(base_url=self.base_url, timeout=timeout)

    def _headers(self) -> dict[str, str]:
        headers = {"x-api-key": self.api_key}
        if self.api_secret:
            nonce = str(int(time.time()))
            signature = hmac.new(
                self.api_key.encode(), (self.api_secret + nonce).encode(), hashlib.sha256
            ).hexdigest()
            headers.update({"x-nonce": nonce, "x-signature": signature})
        return headers

    def _request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
        return self.request(method, f"{self.base_url}{path}", headers=self._headers(), **kwargs)

    @classmethod
    def _safe_output(cls, value: Any) -> Any:
        if isinstance(value, dict):
            return {
                key: cls._safe_output(item)
                for key, item in value.items()
                if isinstance(key, str)
                and key.lower().replace("-", "_") in cls._safe_output_names
                and key.lower().replace("-", "_") not in cls._sensitive_output_names
            }
        if isinstance(value, list):
            return [cls._safe_output(item) for item in value]
        return value

    @staticmethod
    def _object(value: Any) -> dict[str, Any] | None:
        if isinstance(value, dict):
            return value
        if isinstance(value, list) and value and isinstance(value[0], dict):
            return value[0]
        return None

    @staticmethod
    def _slug(tool: dict[str, Any]) -> tuple[str, str]:
        owner = tool.get("slugowner")
        project = tool.get("slugproject")
        if not isinstance(owner, str) or not owner or not isinstance(project, str) or not project:
            raise ProviderError("Wiro tool is missing owner or project identifiers")
        return owner, project

    @classmethod
    def _inputs(cls, tool: dict[str, Any]) -> tuple[dict[str, Any], bool]:
        """Translate declared Wiro parameters, rejecting unknown types."""
        params = tool.get("inputs", tool.get("parameters"))
        if isinstance(params, dict):
            params = params.get("properties", params)
        if not isinstance(params, (dict, list)) or not params:
            return {}, False
        entries = params.items() if isinstance(params, dict) else (
            (p.get("name"), p) for p in params if isinstance(p, dict)
        )
        properties: dict[str, Any] = {}
        required: list[str] = []
        for name, spec in entries:
            if not isinstance(name, str) or not name or not isinstance(spec, dict):
                return {}, False
            if name.lower() in cls._forbidden_input_names:
                continue
            raw_type = spec.get("type")
            if not isinstance(raw_type, str) or raw_type.lower() not in cls._supported_types:
                return {}, False
            properties[name] = {
                "type": cls._supported_types[raw_type.lower()],
                **({"description": spec["description"]} if isinstance(spec.get("description"), str) else {}),
            }
            if spec.get("required") is True:
                required.append(name)
        if not properties:
            return {}, False
        schema: dict[str, Any] = {"type": "object", "properties": properties, "additionalProperties": False}
        if required:
            schema["required"] = required
        return schema, True

    def get_agent(self, provider_agent_id: str) -> dict[str, Any]:
        parts = provider_agent_id.split("/", 1)
        if len(parts) != 2 or not all(parts):
            raise ProviderError("Wiro agent ID must be owner/project")
        body = self._request("POST", "/Tool/Detail", json={
            "slugowner": parts[0], "slugproject": parts[1], "summary": False,
        })
        tool = self._object(body.get("tool"))
        if tool is None:
            raise ProviderError("Wiro tool detail was missing")
        owner, project = self._slug(tool)
        schema, executable = self._inputs(tool)
        cost = tool.get("dynamicprice")
        return {
            "provider_id": self.provider_id,
            "provider_agent_id": f"{owner}/{project}",
            "name": tool.get("title") or tool.get("name") or project,
            "description": tool.get("description") or "",
            "category": tool.get("category") or "other",
            "capabilities": ["execute"] if executable else [],
            "input_schema": schema,
            "output_schema": {},
            "provider_execution_cost": cost if isinstance(cost, (str, int, float)) else None,
            "execution_supported": executable,
        }

    def discover(self) -> list[dict[str, Any]]:
        agents: list[dict[str, Any]] = []
        start = 0
        scanned = 0
        for _ in range(self._discovery_max_pages):
            body = self._request("POST", "/Tool/List", json={"start": str(start), "limit": str(self._discovery_page_size)})
            tools = body.get("tool")
            if isinstance(tools, dict):
                tools = [tools]
            if not isinstance(tools, list) or not tools:
                break
            page = tools[: self._discovery_page_size]
            for item in page:
                if scanned >= self._discovery_page_size * self._discovery_max_pages:
                    break
                scanned += 1
                if not isinstance(item, dict):
                    continue
                try:
                    owner, project = self._slug(item)
                    agent = self.get_agent(f"{owner}/{project}")
                    if agent["execution_supported"]:
                        agents.append(agent)
                except ProviderError:
                    continue
            start += len(page)
            total = body.get("total")
            try:
                total_count = int(total) if total is not None else None
            except (TypeError, ValueError):
                total_count = None
            if (total_count is not None and start >= total_count) or len(page) < self._discovery_page_size:
                break
        return agents

    def validate_inputs(self, agent: dict[str, Any], inputs: dict[str, Any]) -> None:
        if not agent.get("execution_supported"):
            raise ProviderError("Wiro agent inputs are not supported")
        super().validate_inputs(agent, inputs)

    def execute(self, agent: dict[str, Any], inputs: dict[str, Any]) -> dict[str, Any]:
        self.validate_inputs(agent, inputs)
        owner, project = self._slug({"slugowner": agent["provider_agent_id"].split("/", 1)[0],
                                     "slugproject": agent["provider_agent_id"].split("/", 1)[1]})
        body = self._request("POST", f"/Run/{quote(owner, safe='')}/{quote(project, safe='')}", json=inputs)
        task_id = body.get("taskid")
        if not isinstance(task_id, (str, int)):
            raise ProviderError("Wiro run response was missing a task ID")
        return {"provider_execution_id": str(task_id), "status": "running", "result": None, "usage": None}

    def status(self, provider_execution_id: str) -> dict[str, Any]:
        body = self._request("POST", "/Task/Detail", json={"taskid": provider_execution_id})
        tasks = body.get("tasklist")
        task = self._object(tasks)
        if task is None:
            raise ProviderError("Wiro task detail was missing")
        returned_id = task.get("taskid")
        if returned_id is not None and str(returned_id) != str(provider_execution_id):
            raise ProviderError("Wiro returned a different task ID")
        raw_status = task.get("status")
        if raw_status == "task_postprocess_end":
            status = "succeeded" if str(task.get("pexit")) == "0" else "failed"
        elif raw_status == "task_cancel":
            status = "cancelled"
        elif raw_status == "task_queued":
            status = "queued"
        elif raw_status in {"task_running", "task_postprocess", "task_error"}:
            status = "running"
        else:
            status = "pending"
        result = self._safe_output(task.get("outputs")) if status == "succeeded" else None
        usage = {"totalcost": task["totalcost"]} if "totalcost" in task else None
        return {"provider_execution_id": provider_execution_id, "status": status, "result": result, "usage": usage}

    def health(self) -> dict[str, Any]:
        try:
            self._request("POST", "/Tool/List", json={"start": "0", "limit": "1"})
            return {"status": "healthy"}
        except ProviderError:
            return {"status": "unhealthy"}
