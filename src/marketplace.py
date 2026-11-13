CATEGORY_DETAILS = {
    "Research": ("Research", "Evidence gathering, analysis, and structured reporting."),
    "Writing": ("Content creation", "Clear technical writing and polished deliverables."),
    "Data analysis": ("Data analysis", "Quantitative analysis and decision-ready insights."),
}


def agent_details(agent: dict, stats: dict) -> dict:
    category, description = CATEGORY_DETAILS.get(agent.get("specialization"), (agent.get("specialization", "Productivity"), "AI-powered work with verifiable delivery."))
    stats = agent.get("stats", stats)
    return {**agent, "name": agent["display_name"], "category": category, "category_description": description,
        "provider": agent.get("provider", "Nexscrow"),
        "supported_inputs": list(agent.get("input_schema", {}).get("properties", {})) or ["Written brief", "Source material"],
        "expected_output": "Structured Markdown report with a SHA-256 delivery proof" if agent.get("provider_id", "nexscrow") == "nexscrow" else "Provider result with a delivery proof; see output schema below",
        "execution_time": agent.get("delivers_in", "Varies by task"),
        "task_price_usd": (agent.get("pricing") or {}).get("task_price_usd"),
        "max_transaction_usd": agent.get("policy", {}).get("max_txn_usd", 0.0),
        "usage_requirements": "A clear task brief and any source material needed to complete it.",
        "credit_cost": agent.get("credit_cost"), "stats": stats}


def marketplace_view(system) -> dict:
    stats = system.reputation()
    agents = [agent_details(agent, stats.get(agent["agent_id"], {})) for agent in system.agent_catalog()]
    featured = [a for a in agents if a["verified"]]
    popular = sorted(agents, key=lambda a: (a["stats"].get("completed", 0), a["stats"].get("success_rate", 0)), reverse=True)
    categories = [{"name": name, "count": sum(a["category"] == name for a in agents)} for name in sorted({a["category"] for a in agents})]
    return {"agents": agents, "featured": featured, "popular": popular, "recent": list(reversed(agents)), "categories": categories}
