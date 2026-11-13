"""Read-only production preflight. Outputs variable names and checks, never values."""
import os
import sys
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src.constraints import Constraints


def main():
    config = Constraints(sys.argv[1] if len(sys.argv) > 1 else 'config.yaml')
    failures = []
    warnings = []
    def require(name):
        if not os.environ.get(name): failures.append('Missing ' + name)
    if os.environ.get('APP_ENV') != 'production': failures.append('APP_ENV must be production')
    require('APP_ORIGIN')
    origin = urlparse(os.environ.get('APP_ORIGIN', ''))
    if origin.scheme != 'https' or not origin.hostname or origin.path not in {'', '/'} or origin.username or origin.query:
        failures.append('APP_ORIGIN must be a canonical HTTPS origin')
    if not (os.environ.get('DATABASE_URL') or os.environ.get('POSTGRES_URL')): failures.append('PostgreSQL is required')
    if config.demo_mode: failures.append('demo_mode must be false')
    from src import network
    chain = network.status(config.raw)
    if not chain['enabled']: warnings.append('On-chain escrow disabled: ' + chain['reason'])
    else: print('INFO NEAR network: ' + chain['label'] + ' (test tokens only)')
    if not config.kill_switch: warnings.append('Kill switch is off; keep it on until live rehearsal approval')
    if not os.environ.get('ESCROW_PRIVATE_KEY'): warnings.append('ESCROW_PRIVATE_KEY absent: no live payout/refund readiness')
    if not os.environ.get('NEAR_AI_API_KEY'): warnings.append('NEAR_AI_API_KEY absent: first-party live execution unavailable')
    if not os.environ.get('NEXSCROW_ADMIN_USER_IDS'): warnings.append('No admin identities configured')
    billing = config.raw.get('billing', {})
    if billing.get('enabled'):
        for name in ['BILLING_TREASURY_ADDRESS', 'BILLING_SETTLEMENT_ASSET']: require(name)
        warnings.append('Billing is enabled: require external settlement approval and scheduled reconciliation')
    else: warnings.append('Live Intents billing remains disabled')
    for provider_id, provider in config.raw.get('providers', {}).items():
        if provider.get('enabled') and provider.get('api_key_env'):
            require(provider['api_key_env'])
        if provider.get('enabled'): warnings.append('Enabled provider requires commercial permission and egress review: ' + provider_id)
    for message in warnings: print('WARN ' + message)
    for message in failures: print('FAIL ' + message)
    print('Preflight ' + ('FAILED' if failures else 'passed configuration checks; this is not live payment proof'))
    return bool(failures)


if __name__ == '__main__':
    raise SystemExit(main())
