"""Operator-only synchronization: python -m src.providers.sync --config config.yaml."""
import argparse
import json

from src.constraints import Constraints
from src.env import load_env
from src.storage import create_store
from .registry import AgentRegistry


def main():
    parser = argparse.ArgumentParser(description="Synchronize pinned provider agents; no execution or payments")
    parser.add_argument("--config", default="config.yaml")
    parser.add_argument("--data-dir")
    args = parser.parse_args()
    load_env()
    registry = AgentRegistry(create_store(args.data_dir), Constraints(args.config).raw.get("providers", {}))
    print(json.dumps(registry.sync(), indent=2))


if __name__ == "__main__":
    main()
