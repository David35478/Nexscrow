"""Operator cron: poll stored billing orders without relying on an open browser."""
import argparse
import json

from src.billing import BillingService
from src.constraints import Constraints
from src.env import load_env
from src.storage import create_store
from src.intents import IntentsError


def main():
    parser = argparse.ArgumentParser(description='Reconcile stored 1Click billing orders; never creates quotes or transfers funds')
    parser.add_argument('--config', default='config.yaml')
    parser.add_argument('--limit', type=int, default=100)
    args = parser.parse_args()
    load_env()
    service = BillingService(create_store(), Constraints(args.config).raw.get('billing', {}))
    enabled, reason = service.readiness()
    if not enabled:
        parser.exit(1, reason + '\n')
    orders = service.store.read('credit_accounts', {}).get('orders', {})
    eligible = [o for o in orders.values() if o['status'] in {'pending', 'deposit_detected', 'processing', 'underpaid', 'paid'}]
    # Oldest checks first; include settled orders for post-settlement discrepancy detection.
    eligible.sort(key=lambda order: (order['status'] == 'paid', order.get('last_checked_at', order['created_at'])))
    for order in eligible[:max(1, min(args.limit, 1000))]:
        try:
            result = service.status({'user_id': order['user_id'], 'provider': 'operator'}, order['payment_id'])
            print(json.dumps({'payment_id': order['payment_id'], 'status': result['status']}))
        except IntentsError:
            print(json.dumps({'payment_id': order['payment_id'], 'error': 'Payment provider unavailable; will retry next run'}))


if __name__ == '__main__':
    main()
