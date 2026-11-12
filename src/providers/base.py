"""Capability-aware provider contracts. Credentials stay inside adapters."""
import ipaddress
import socket
from urllib.parse import urlparse

import httpx
from jsonschema import Draft202012Validator, SchemaError


class ProviderError(Exception):
    pass


def check_schema(schema):
    def inspect(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"$ref", "$dynamicRef"} and (not isinstance(child, str) or not child.startswith("#")):
                    raise ProviderError("Remote schema references are not supported")
                inspect(child)
        elif isinstance(value, list):
            for child in value:
                inspect(child)
    inspect(schema)
    try:
        Draft202012Validator.check_schema(schema)
    except SchemaError as exc:
        raise ProviderError("Agent schema is invalid") from exc


def validate_url(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.fragment:
        raise ProviderError("Provider URLs must use HTTPS without embedded credentials")
    host = parsed.hostname.lower()
    if host == "localhost" or host.endswith((".localhost", ".local", ".internal")):
        raise ProviderError("Provider URL must be public")
    try:
        if not ipaddress.ip_address(host).is_global:
            raise ProviderError("Provider URL must be public")
    except ValueError:
        pass
    return url


class ProviderAdapter:
    capabilities = frozenset()
    provider_id = ""

    def __init__(self, client=None, timeout=20):
        self.client = client or httpx.Client(timeout=timeout, follow_redirects=False)
        self.timeout = timeout

    def request(self, method, url, **kwargs):
        try:
            host = urlparse(validate_url(url)).hostname
            addresses = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
            if not addresses or any(not ipaddress.ip_address(a[4][0]).is_global for a in addresses):
                raise ProviderError('Provider destination resolved to a private network')
            response = self.client.request(method, url, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            data = response.json()
            if not isinstance(data, dict) or data.get("result") is False:
                raise ProviderError("Provider rejected the request")
            return data
        except httpx.TimeoutException as exc:
            raise ProviderError("Provider request timed out; execution outcome may be unknown") from exc
        except (httpx.HTTPError, ValueError, OSError) as exc:
            raise ProviderError("Provider request failed") from exc

    def validate_inputs(self, agent, inputs):
        schema = agent.get("input_schema")
        if not isinstance(schema, dict) or schema.get("type") != "object":
            raise ProviderError("Agent input schema is unavailable")
        try:
            check_schema(schema)
            errors = list(Draft202012Validator(schema).iter_errors(inputs))
        except SchemaError as exc:
            raise ProviderError("Agent input schema is invalid") from exc
        if errors:
            raise ProviderError("Inputs do not match the agent schema")

    def discover(self):
        raise ProviderError("Provider does not support discovery")

    def get_agent(self, provider_agent_id):
        raise ProviderError("Provider does not support metadata retrieval")

    def execute(self, agent, inputs):
        raise ProviderError("Provider does not support execution")

    def status(self, provider_execution_id):
        raise ProviderError("Provider does not support execution status")

    def results(self, provider_execution_id):
        return self.status(provider_execution_id).get("result")

    def usage(self, provider_execution_id):
        return self.status(provider_execution_id).get("usage")

    def health(self):
        return {"available": False, "reason": "Health check not supported"}
