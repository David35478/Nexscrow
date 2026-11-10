"""Run the full simulated escrow cycle from the command line.

Usage:
    python demo_mode.py
    python demo_mode.py --topic "AI agent market sizes" --reward 5
"""

from __future__ import annotations

import argparse

from src.env import load_env
from src.system import NexscrowSystem


def main() -> None:
    load_env()
    parser = argparse.ArgumentParser(description="nexscrow demo cycle (no real money)")
    parser.add_argument(
        "--topic",
        default="Research report on NEAR Intents adoption",
        help="job title for the demo job",
    )
    parser.add_argument("--reward", type=float, default=5.0, help="reward in USD")
    args = parser.parse_args()

    system = NexscrowSystem()
    result = system.run_demo_cycle(
        title=args.topic,
        description=f"A short research report on {args.topic.lower()}.",
        reward_usd=args.reward,
    )
    job = result["job"]
    print("=" * 60)
    print("nexscrow demo cycle - Lock money. Hire agents. Release only on proof.")
    print("=" * 60)
    for step in result["trace"]:
        print(f"  -> {step['step']}: {step['detail']}")
    print("-" * 60)
    print(f"job_id          : {job['job_id']}")
    print(f"status          : {job['status']}")
    print(f"payment_status  : {job['payment_status']}")
    print(f"proof_hash      : {job['proof_hash']}")
    print(f"agent_payout    : ${job['agent_payout_usd']:.2f}")
    print(f"protocol_fee    : ${job['fee_usd']:.2f}")
    print("=" * 60)
    print("Full deliverable:")
    print()
    print(job["deliverable"])


if __name__ == "__main__":
    main()
