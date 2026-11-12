"""Explicit opt-in contract for operator-owned JSON agent APIs."""
from .base import ProviderAdapter, ProviderError, check_schema, validate_url


class CustomAdapter(ProviderAdapter):
    capabilities = frozenset({"metadata", "execute", "results"})

    def __init__(self, provider_id, agents, api_key=None, client=None, timeout=20):
        super().__init__(client=client, timeout=timeout)
        self.provider_id = provider_id
        self.agents = {agent["provider_agent_id"]: agent for agent in agents}
        self.api_key = api_key
        for agent in self.agents.values():
            validate_url(agent["execution_url"])
            check_schema(agent["input_schema"])
            check_schema(agent.get("output_schema", {}))

    def get_agent(self, provider_agent_id):
        if provider_agent_id not in self.agents:
            raise ProviderError("Unknown provider agent")
        agent = self.agents[provider_agent_id]
        return {key: value for key, value in agent.items() if key != "execution_url"}

    def execute(self, agent, inputs):
        self.validate_inputs(agent, inputs)
        configured = self.agents[agent["provider_agent_id"]]
        headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        data = self.request("POST", configured["execution_url"], headers=headers, json={"inputs": inputs})
        if not isinstance(data.get("execution_id"), str) or "result" not in data:
            raise ProviderError("Custom provider returned an invalid execution response")
        from jsonschema import Draft202012Validator
        if list(Draft202012Validator(agent.get("output_schema", {})).iter_errors(data["result"])):
            raise ProviderError("Provider result does not match the output schema")
        return {"provider_execution_id": data["execution_id"], "status": "succeeded", "result": data["result"], "usage": data.get("usage")}
