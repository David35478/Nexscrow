from .base import ProviderAdapter


class MockAdapter(ProviderAdapter):
    provider_id = "mock"
    capabilities = frozenset({"discover", "metadata", "execute", "status", "results", "usage", "health"})

    def discover(self):
        return [{"provider_agent_id": "echo", "name": "Development echo", "description": "Development-only test adapter", "category": "Development", "input_schema": {"type": "object", "properties": {"prompt": {"type": "string"}}, "required": ["prompt"], "additionalProperties": False}, "output_schema": {"type": "string"}, "execution_supported": True}]

    def get_agent(self, provider_agent_id):
        return self.discover()[0]

    def execute(self, agent, inputs):
        self.validate_inputs(agent, inputs)
        return {"provider_execution_id": "mock-execution", "status": "succeeded", "result": inputs["prompt"], "usage": {"cost_usd": "0"}}

    def status(self, provider_execution_id):
        return {"provider_execution_id": provider_execution_id, "status": "succeeded", "result": "Development result", "usage": {"cost_usd": "0"}}

    def health(self):
        return {"available": True, "development_only": True}
