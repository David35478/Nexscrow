"""Private customer views; never aggregate another user's public-board records."""
from collections import defaultdict
from datetime import datetime, timezone

from src import network
from src.storage import utcnow


DEFAULT_NOTIFICATIONS = {'execution_updates': True, 'payment_updates': True, 'product_updates': False}


class CustomerService:
    def __init__(self, system, billing, auth):
        self.system = system
        self.store = system.store
        self.billing = billing
        self.auth = auth

    def settings(self, user):
        record = self.store.read('customer_settings', {}).get(user['user_id'], {})
        return {'display_name': record.get('display_name', user['name']), 'notifications': {**DEFAULT_NOTIFICATIONS, **record.get('notifications', {})}}

    def save_settings(self, user, display_name, notifications):
        name = display_name.strip()
        if not name:
            raise ValueError('Display name cannot be blank')
        def save(data):
            data[user['user_id']] = {'display_name': name, 'notifications': notifications, 'updated_at': utcnow()}
            return self.settings_from_record(data[user['user_id']])
        return self.store.update('customer_settings', {}, save)

    def settings_from_record(self, record):
        return {'display_name': record['display_name'], 'notifications': record['notifications']}

    def security(self, user):
        import time
        sessions = self.store.read('sessions', {})
        active = sum(s.get('user_id') == user['user_id'] and s.get('expires_at', 0) > time.time() for s in sessions.values())
        identity = user['user_id']
        wallet = identity.removeprefix('near:') if user['provider'] == 'near' and identity.startswith('near:') else None
        return {'provider': user['provider'], 'session_count': active, 'wallet_account': wallet, 'wallet_linking_supported': False, 'notification_delivery_enabled': False}

    def revoke_other_sessions(self, user, current_token):
        def revoke(sessions):
            keys = [key for key, session in sessions.items() if session.get('user_id') == user['user_id'] and key != current_token]
            for key in keys:
                del sessions[key]
            return {'revoked_count': len(keys)}
        return self.store.update('sessions', {}, revoke)

    def dashboard(self, user):
        user_id = user['user_id']
        records = self.system.store.read('task_requests', {})
        owned = sorted([r for r in records.values() if r.get('user_id') == user_id], key=lambda r: r['created_at'], reverse=True)
        jobs = sorted([j for j in self.system.jobs.list() if j.get('client_id') == user_id], key=lambda j: j['created_at'], reverse=True)
        jobs_by_id = {j['job_id']: j for j in jobs}
        subscription = self.billing.subscription(user)
        credits = self.billing.credits.snapshot(user_id)
        payments = self.billing.history(user)
        catalog = {a['agent_id']: a for a in self.system.agent_catalog()}
        requests = []
        agent_usage = defaultdict(lambda: {'usage_count': 0, 'last_used': None})
        linked_jobs = set()
        for record in owned:
            job = jobs_by_id.get(record.get('job_id'))
            status = record['status']
            if job:
                linked_jobs.add(job['job_id'])
                if job['payment_status'] == 'released':
                    status = 'completed'
                elif job['status'] in {'cancelled', 'expired'}:
                    status = job['status']
            usage = record.get('usage') or {}
            request = {'request_id': record['request_id'], 'agent_id': record['agent_id'], 'agent_name': record['agent_name'], 'provider_id': record['provider_id'], 'created_at': record['created_at'], 'status': status, 'payment_method': record['payment_method'], 'cost_usd': record['pricing']['task_price_usd'] if record['payment_method'] == 'escrow' else None, 'credits_used': usage.get('credits_charged', 0) if record['payment_method'] == 'credits' else None, 'result_available': record.get('result') is not None, 'demo': record.get('demo', False)}
            requests.append(request)
            stats = agent_usage[record['agent_id']]
            stats.update(name=record['agent_name'], provider=record['provider_id'])
            stats['usage_count'] += 1
            stats['last_used'] = max(stats['last_used'] or '', record['created_at'])
        # Legacy escrow tasks remain visible without fabricating request IDs.
        legacy = [job for job in jobs if job['job_id'] not in linked_jobs]
        for job in legacy:
            if job.get('agent'):
                agent = catalog.get(job['agent'], {})
                stats = agent_usage[job['agent']]
                stats.update(name=agent.get('display_name', job['agent']), provider=agent.get('provider_id', 'nexscrow'))
                stats['usage_count'] += 1
                stats['last_used'] = max(stats['last_used'] or '', job['created_at'])
        active = credits.get('subscription')
        if active and active.get('expires_at') and datetime.fromisoformat(active['expires_at'].replace('Z', '+00:00')) <= datetime.now(timezone.utc):
            active = None
        allowed = active.get('allowed_agents', []) if active else []
        agents = []
        for agent_id in set(agent_usage) | {a for a in catalog if ('*' in allowed or a in allowed) and 'credits' in catalog[a].get('supported_payment_methods', [])}:
            metadata = catalog.get(agent_id)
            stats = agent_usage.get(agent_id, {})
            agents.append({'agent_id': agent_id, 'name': stats.get('name', (metadata or {}).get('display_name', agent_id)), 'provider': stats.get('provider', (metadata or {}).get('provider_id', 'Unavailable provider')), 'usage_count': stats.get('usage_count', 0), 'last_used': stats.get('last_used'), 'payment_methods': (metadata or {}).get('supported_payment_methods', []), 'available': metadata is not None, 'relationship': 'used' if stats else 'plan_access'})
        agents.sort(key=lambda a: (a['last_used'] or '', a['name']), reverse=True)
        escrow = [{key: job.get(key) for key in ['job_id', 'title', 'status', 'payment_status', 'deposit_tx_hash', 'payout_tx_hash', 'refund_tx_hash', 'created_at', 'simulated']} | {'amount_usd': job['reward_usd'], 'explorer_tx_base': None if job.get('simulated') else f"{network.TESTNET.explorer_url}/txns/"} for job in jobs]
        activity = [{'at': r['created_at'], 'title': r['agent_name'], 'detail': r['status'].replace('_', ' ') + ' · ' + r['payment_method'], 'href': '/workspace?request=' + r['request_id']} for r in requests]
        activity += [{'at': p['created_at'], 'title': 'Subscription payment' if p['purpose'] == 'subscription' else 'Credit top-up', 'detail': p['status'], 'href': '/billing'} for p in payments]
        activity += [{'at': j['created_at'], 'title': j['title'], 'detail': 'Escrow task · ' + j['status'], 'href': '/job/' + j['job_id']} for j in legacy]
        activity.sort(key=lambda a: a['at'], reverse=True)
        recent_payments = [{**p, 'type': 'subscription_credits'} for p in payments]
        recent_payments += [{'payment_id': j['job_id'], 'purpose': 'escrow', 'price_usd': j['amount_usd'], 'status': j['payment_status'], 'created_at': j['created_at'], 'type': 'escrow', 'simulated': j['simulated']} for j in escrow]
        recent_payments.sort(key=lambda p: p['created_at'], reverse=True)
        legacy_history = [{'request_id': j['job_id'], 'agent_id': j.get('agent'), 'agent_name': catalog.get(j.get('agent'), {}).get('display_name', j.get('agent') or 'Unassigned escrow task'), 'provider_id': catalog.get(j.get('agent'), {}).get('provider_id', 'nexscrow'), 'created_at': j['created_at'], 'status': j['status'], 'payment_method': 'escrow', 'cost_usd': j['reward_usd'], 'credits_used': None, 'result_available': bool(j.get('deliverable')), 'demo': j.get('simulated', False), 'legacy_job': True, 'result_href': '/job/' + j['job_id']} for j in legacy]
        total = len(requests) + len(legacy)
        successful = sum(r['status'] in {'delivered', 'completed'} for r in requests) + sum(j['status'] in {'delivered', 'completed'} for j in legacy)
        requests += legacy_history
        requests.sort(key=lambda r: r['created_at'], reverse=True)
        return {'user': user, 'settings': self.settings(user), 'security': self.security(user), 'overview': {'total_requests': total, 'successful_executions': successful, 'active_subscriptions': int(active is not None), 'available_credits': credits['available']}, 'agents': agents, 'requests': requests, 'escrow_payments': escrow, 'subscription': active, 'scheduled_subscriptions': credits.get('scheduled_subscriptions', []), 'scheduled_change': subscription.get('scheduled_change'), 'credits': credits, 'payments': payments, 'activity': activity[:10], 'recent_payments': recent_payments[:6], 'legacy_requests': len(legacy)}
