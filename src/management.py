"""Audited administration and non-paying developer onboarding."""
import copy
import os
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from uuid import uuid4

from src.providers.base import ProviderAdapter, ProviderError, check_schema, validate_url
from src.storage import utcnow


class ManagementError(ValueError):
    pass


def is_admin(user):
    identities = {value.strip() for value in os.environ.get('NEXSCROW_ADMIN_USER_IDS', '').split(',') if value.strip()}
    return bool(user and user.get('provider') != 'demo' and user['user_id'] in identities)


def management_state():
    return {'agents': {}, 'providers': {}, 'billing': None, 'developers': {}, 'submissions': {}, 'audit': [], 'payment_reviews': {}}


def load_management(store):
    return store.read('marketplace_management', management_state())


def audit(data, actor, action, target, detail=None):
    data['audit'].append({'id': uuid4().hex, 'at': utcnow(), 'actor': actor['user_id'], 'action': action, 'target': target, 'detail': detail})


def public_agent(agent, overrides):
    override = overrides.get(agent['agent_id'])
    if not override:
        return agent
    if not override['enabled']:
        return None
    return {**agent, 'name': override['name'], 'display_name': override['name'], 'description': override['description'], 'category': override['category'], 'specialization': override['category'], 'credit_cost': override['credit_cost'], 'supported_payment_methods': override['payment_methods'], 'pricing': {**agent.get('pricing', {}), 'task_price_usd': override['task_price_usd'], 'credit_cost': override['credit_cost']}}


class ManagementService:
    def __init__(self, system, billing):
        self.system = system
        self.billing = billing
        self.store = system.store

    def mutate(self, actor, action, target, operation):
        def update(data):
            for key, default in management_state().items():
                data.setdefault(key, copy.deepcopy(default))
            result = operation(data)
            audit(data, actor, action, target)
            return result
        return self.store.update('marketplace_management', management_state(), update)

    def validate_agent(self, fields):
        if not fields['name'].strip() or not fields['category'].strip():
            raise ManagementError('Name and category are required')
        price = Decimal(str(fields['task_price_usd']))
        if not price.is_finite() or not 0 < price <= Decimal(str(self.system.constraints.max_job_reward_usd)) or price.as_tuple().exponent < -2:
            raise ManagementError('Task price must be positive USD cents within the platform cap')
        credits = fields['credit_cost']
        if credits is not None and (not isinstance(credits, int) or isinstance(credits, bool) or credits <= 0):
            raise ManagementError('Credit cost must be a positive integer')
        methods = fields['payment_methods']
        if not methods or len(set(methods)) != len(methods) or set(methods) - {'escrow', 'credits'} or ('credits' in methods and credits is None):
            raise ManagementError('Select supported payment methods and configure credit pricing')

    def agent_records(self):
        # Disabled records remain visible to administrators.
        catalog = self.system.agent_catalog(include_disabled=True)
        overrides = load_management(self.store)['agents']
        return [{**agent, 'task_price_usd': min(agent.get('policy', {}).get('max_txn_usd') or self.system.constraints.max_job_reward_usd, self.system.constraints.max_job_reward_usd), 'payment_methods': agent.get('supported_payment_methods', ['escrow']), **overrides.get(agent['agent_id'], {}), 'enabled': overrides.get(agent['agent_id'], {}).get('enabled', True)} for agent in catalog]

    def update_agent(self, actor, agent_id, fields):
        agent = next((a for a in self.agent_records() if a['agent_id'] == agent_id), None)
        if agent is None:
            raise ManagementError('Unknown executable agent; use developer submission for new APIs')
        self.validate_agent(fields)
        cap = agent.get('policy', {}).get('max_txn_usd')
        if cap is not None and fields['task_price_usd'] > cap:
            raise ManagementError('Task price exceeds the reviewed provider cap')
        record = {**fields, 'agent_id': agent_id, 'updated_at': utcnow()}
        def save(data):
            data['agents'][agent_id] = record
            return record
        return self.mutate(actor, 'agent.update', agent_id, save)

    def providers(self):
        management = load_management(self.store)
        rows = []
        for provider_id, config in self.system.constraints.raw.get('providers', {}).items():
            effective = {**config, **management['providers'].get(provider_id, {})}
            adapter = self.system.provider_registry.adapters.get(provider_id)
            key_env, secret_env = config.get('api_key_env', ''), config.get('api_secret_env', '')
            rows.append({'provider_id': provider_id, 'kind': config['kind'], 'enabled': bool(effective.get('enabled')), 'configured': adapter is not None, 'capabilities': sorted(adapter.capabilities) if adapter else [], 'credentials': {'key_env': key_env, 'key_configured': bool(os.environ.get(key_env)), 'secret_env': secret_env, 'secret_configured': bool(os.environ.get(secret_env))}, 'agents_count': len(config.get('agents', [])), 'timeout_seconds': effective.get('timeout_seconds', 20)})
        return rows

    def update_provider(self, actor, provider_id, fields):
        if provider_id not in self.system.constraints.raw.get('providers', {}):
            raise ManagementError('Unknown provider')
        def save(data):
            data['providers'][provider_id] = fields
            return {**fields, 'provider_id': provider_id, 'restart_required': True}
        return self.mutate(actor, 'provider.configure', provider_id, save)

    def health(self, actor, provider_id):
        adapter = self.system.provider_registry.adapters.get(provider_id)
        if adapter is None:
            raise ManagementError('Provider is disabled, unsupported, or credentials are unavailable')
        result = adapter.health()
        return self.mutate(actor, 'provider.health', provider_id, lambda data: result)

    def synchronize(self, actor):
        result = self.system.provider_registry.sync()
        return self.mutate(actor, 'provider.sync', 'registry', lambda data: {**result, 'restart_required': True})

    def update_billing(self, actor, fields):
        for plan in fields['plans']:
            self.billing._validate_offer(plan, plan=True)
        for package in fields['topup_packages']:
            self.billing._validate_offer(package)
        if len({p['id'] for p in fields['plans']}) != len(fields['plans']):
            raise ManagementError('Plan IDs must be unique')
        if not fields['plans'] or len({p['id'] for p in fields['topup_packages']}) != len(fields['topup_packages']):
            raise ManagementError('Plans are required and package IDs must be unique')
        def save(data):
            data['billing'] = fields
            return fields
        return self.mutate(actor, 'billing.configure', 'offers', save)

    def review_payment(self, actor, payment_id, note):
        if payment_id not in self.store.read('credit_accounts', {}).get('orders', {}):
            raise ManagementError('Unknown billing payment')
        def save(data):
            review = {'payment_id': payment_id, 'note': note, 'status': 'investigating', 'at': utcnow(), 'reviewer': actor['user_id']}
            data['payment_reviews'].setdefault(payment_id, []).append(review)
            return review
        return self.mutate(actor, 'payment.investigate', payment_id, save)

    def register(self, user, fields):
        def save(data):
            prior = data['developers'].get(user['user_id'], {})
            profile = {**fields, 'user_id': user['user_id'], 'created_at': prior.get('created_at', utcnow()), 'updated_at': utcnow(), 'payouts_enabled': False}
            data['developers'][user['user_id']] = profile
            return profile
        return self.mutate(user, 'developer.register', user['user_id'], save)

    def submit(self, user, fields, submission_id=None):
        self.validate_agent({**fields, 'enabled': False})
        validate_url(fields['execution_url'])
        from urllib.parse import urlparse
        if urlparse(fields['execution_url']).query:
            raise ManagementError('Use a credential-free fixed API URL; secrets are configured by operators')
        check_schema(fields['input_schema'])
        check_schema(fields['output_schema'])
        if fields['input_schema'].get('type') != 'object':
            raise ManagementError('Input schema must describe a JSON object')
        submission_id = submission_id or uuid4().hex
        def save(data):
            if user['user_id'] not in data['developers']:
                raise ManagementError('Register a developer profile first')
            existing = data['submissions'].get(submission_id)
            if existing and existing['owner_id'] != user['user_id']:
                raise KeyError('Submission not found')
            record = {**fields, 'submission_id': submission_id, 'owner_id': user['user_id'], 'status': 'pending', 'commercial_authorization_status': 'unverified', 'revision': existing['revision'] + 1 if existing else 1, 'created_at': existing['created_at'] if existing else utcnow(), 'updated_at': utcnow(), 'payouts_enabled': False, 'revenue_sharing_enabled': False}
            data['submissions'][submission_id] = record
            return record
        return self.mutate(user, 'developer.submit', submission_id, save)

    def review_submission(self, actor, submission_id, decision, note):
        def review(data):
            record = data['submissions'].get(submission_id)
            if not record:
                raise KeyError('Submission not found')
            record.update(status=decision, review_note=note, reviewer=actor['user_id'], reviewed_at=utcnow())
            record['publication_status'] = 'blocked_pending_commercial_and_provider_verification'
            return record
        return self.mutate(actor, 'developer.review', submission_id, review)

    def test_submission(self, user, submission_id, inputs):
        record = load_management(self.store)['submissions'].get(submission_id)
        if not record or record['owner_id'] != user['user_id']:
            raise KeyError('Submission not found')
        adapter = ProviderAdapter()
        try:
            adapter.validate_inputs(record, inputs)
        finally:
            adapter.client.close()
        return self.mutate(user, 'developer.validate_schema', submission_id, lambda data: {'valid': True, 'mode': 'schema_only', 'executed': False, 'note': 'No outbound request or provider charge. Live API testing requires operator configuration and approval.'})

    def developer_overview(self, user):
        state = load_management(self.store)
        agents = [s for s in state['submissions'].values() if s['owner_id'] == user['user_id']]
        # Submissions are not executable listings until separately provisioned.
        return {'profile': state['developers'].get(user['user_id']), 'agents': agents, 'executions': [], 'payouts_enabled': False, 'revenue_sharing_enabled': False}

    def overview(self):
        from src.credits import CreditService
        state = load_management(self.store)
        sessions = self.store.read('sessions', {})
        customer_settings = self.store.read('customer_settings', {})
        requests = list(self.store.read('task_requests', {}).values())
        jobs = self.system.jobs.list()
        finance = self.store.read('credit_accounts', {})
        orders = list(finance.get('orders', {}).values())
        executions = list(self.store.read('provider_executions', {}).values())
        users = set(self.store.read('user_directory', {})) | set(customer_settings) | set(finance.get('accounts', {})) | set(state['developers'])
        users |= {s['user_id'] for s in sessions.values()} | {r['user_id'] for r in requests} | {j['client_id'] for j in jobs if j.get('client_id')}
        now = datetime.now(timezone.utc)
        def current_subscription(sub):
            active = CreditService._active_subscription(sub, now)
            return bool(active and (not active.get('expires_at') or datetime.fromisoformat(active['expires_at'].replace('Z', '+00:00')) > now))
        active = sum(current_subscription(sub) for sub in finance.get('subscriptions', {}).values())
        live_jobs = [j for j in jobs if not j.get('simulated', True)]
        paid = [o for o in orders if o['status'] == 'paid']
        def amount(record, field):
            try:
                value = Decimal(str(record.get(field) or 0))
                return value if value.is_finite() else Decimal(0)
            except InvalidOperation:
                return Decimal(0)
        provider_cost = Decimal(0)
        unknown = 0
        for execution in executions:
            usage = execution.get('usage') or {}
            raw = usage.get('totalcost', usage.get('cost_usd'))
            if raw is None or (execution.get('provider_id') != 'wiro' and usage.get('currency') != 'USD'):
                unknown += 1
            else:
                provider_cost += amount({'cost': raw}, 'cost')
        fees = sum((amount(j, 'fee_usd') for j in live_jobs if j['payment_status'] == 'released'), Decimal(0))
        failed_payments = sum(o['status'] in {'failed', 'expired', 'underpaid', 'refunded', 'review', 'review_after_settlement', 'unknown'} for o in orders)
        failed_requests = sum(r['status'] in {'failed', 'unknown'} for r in requests)
        metrics = {'total_users': len(users), 'active_subscriptions': active, 'agent_executions': sum(r['status'] in {'running', 'pending', 'delivered', 'completed', 'failed', 'unknown', 'settling'} for r in requests), 'escrow_volume_usd': str(sum((amount(j, 'reward_usd') for j in live_jobs if j['payment_status'] in {'locked', 'released', 'refunded'}), Decimal(0))), 'subscription_volume_usd': str(sum((amount(o, 'price_usd') for o in paid if o['purpose'] == 'subscription'), Decimal(0))), 'credit_purchases_usd': str(sum((amount(o, 'price_usd') for o in paid if o['purpose'] == 'topup'), Decimal(0))), 'provider_cost_usd': str(provider_cost), 'provider_cost_unknown_count': unknown, 'platform_revenue_usd': str(fees), 'failed_payment_rate': round(100 * failed_payments / len(orders), 2) if orders else 0, 'failed_execution_rate': round(100 * failed_requests / len(requests), 2) if requests else 0}
        notes = ['Escrow volume excludes simulated jobs; subscription receipts and top-up receipts are independent.', 'Platform revenue shows recorded released-escrow protocol fees only. Prepaid receipts are not recognized as earned revenue; profit is not calculated.', 'Provider costs include only explicitly reported USD costs; missing costs are unknown, not zero.', 'User count is distinct persisted identities, not unique humans. Demo identities are included.', 'Developer payouts and revenue sharing are disabled. Approval does not publish an unverified external API.']
        return {'metrics': metrics, 'notes': notes, 'agents': self.agent_records(), 'providers': self.providers(), 'payments': [self.billing.public(o) for o in orders], 'ledger': finance.get('entries', []), 'executions': [{k: v for k, v in e.items() if k not in {'fingerprint', 'result'}} for e in executions], 'audit': state['audit'][-100:], 'developer_profiles': list(state['developers'].values()), 'submissions': list(state['submissions'].values()), 'billing_config': {'plans': self.billing.plans(), 'topup_packages': self.billing.packages()}, 'payment_reviews': state['payment_reviews']}
