"""Owned task requests. Escrow jobs and credit reservations never share money state."""
import hashlib
import json
import math
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from src.credits import CreditService, CreditError
from src.providers.base import ProviderAdapter, ProviderError
from src.providers.execution import ProviderPending
from src.storage import PostgresStore, utcnow


class RequestError(ValueError):
    pass


class RequestService:
    def __init__(self, system):
        self.system = system
        self.store = system.store
        self.credits = CreditService(self.store)

    def agent(self, agent_id):
        agent = next((a for a in self.system.agent_catalog() if a['agent_id'] == agent_id), None)
        if not agent:
            raise RequestError('Agent is unavailable')
        return agent

    def pricing(self, agent):
        if agent.get('pricing', {}).get('task_price_usd') is not None:
            config = agent['pricing']
        elif agent['provider_id'] == 'nexscrow':
            config = self.system.constraints.agent_profiles[agent['agent_id']]
        else:
            config = agent['pricing']
        price = config.get('task_price_usd')
        # The configured escrow cap is the existing catalog's task price ceiling.
        if price is None:
            price = agent.get('policy', {}).get('max_txn_usd')
            if isinstance(price, (int, float)) and not isinstance(price, bool):
                price = min(price, self.system.constraints.max_job_reward_usd)
        if not isinstance(price, (int, float)) or isinstance(price, bool) or not math.isfinite(price):
            raise RequestError('Agent pricing is unavailable')
        self.system.constraints.check_reward(price)
        cap = agent.get('policy', {}).get('max_txn_usd')
        if cap is not None and price > cap:
            raise RequestError('Configured task price exceeds this agent’s escrow cap')
        credits = config.get('credit_cost')
        if credits is not None and (not isinstance(credits, int) or isinstance(credits, bool) or credits <= 0):
            raise RequestError('Agent credit pricing is invalid')
        return {'task_price_usd': price, 'credit_cost': credits}

    def options(self, user, agent_id):
        agent = self.agent(agent_id)
        pricing = self.pricing(agent)
        if 'credits' not in agent.get('supported_payment_methods', []):
            pricing['credit_cost'] = None
        if 'escrow' not in agent.get('supported_payment_methods', []):
            pricing['task_price_usd'] = None
        return {'agent': agent, **pricing, 'credits': self.credits.entitlement(user['user_id'], agent_id), 'file_upload_supported': False}

    def create(self, user, agent_id, inputs, payment_method, key):
        if payment_method not in {'escrow', 'credits'}:
            raise RequestError('Choose escrow or subscription credits')
        if not isinstance(key, str) or not 8 <= len(key) <= 128:
            raise RequestError('An idempotency key of 8–128 characters is required')
        if not isinstance(inputs, dict) or len(json.dumps(inputs)) > 30000:
            raise RequestError('Inputs must be a JSON object no larger than 30 KB')
        digest = hashlib.sha256(f"{user['user_id']}:{key}".encode()).hexdigest()
        fingerprint = json.dumps([agent_id, inputs, payment_method], sort_keys=True)
        previous = next((r for r in self.store.read('task_requests', {}).values() if r['idempotency_key'] == digest), None)
        if previous:
            if previous['fingerprint'] != fingerprint:
                raise RequestError('Idempotency key already used for different inputs')
            return self.public(previous)
        agent = self.agent(agent_id)
        validator = ProviderAdapter()
        try:
            validator.validate_inputs(agent, inputs)
        finally:
            validator.client.close()
        pricing = self.pricing(agent)
        external = agent['provider_id'] != 'nexscrow'
        if payment_method not in agent.get('supported_payment_methods', []):
            raise RequestError('This payment method is disabled for the agent')
        if user.get('provider') == 'demo' and (external or payment_method == 'credits'):
            raise RequestError('Demo sessions support simulated first-party escrow tasks only')
        if user.get('provider') != 'demo' and not isinstance(self.store, PostgresStore):
            raise RequestError('Live requests require PostgreSQL durable storage')
        if payment_method == 'credits':
            if pricing['credit_cost'] is None:
                raise RequestError('This agent does not support credits')
            if not self.credits.entitlement(user['user_id'], agent_id)['allowed']:
                raise RequestError('Your subscription does not allow this agent')
        request_id = uuid4().hex
        def reserve(data):
            previous = next((r for r in data.values() if r['idempotency_key'] == digest), None)
            if previous:
                if previous['fingerprint'] != fingerprint:
                    raise RequestError('Idempotency key already used for different inputs')
                return dict(previous)
            record = {'request_id': request_id, 'user_id': user['user_id'], 'agent_id': agent_id, 'agent_name': agent['display_name'], 'provider_id': agent['provider_id'], 'provider_agent_id': agent['provider_agent_id'], 'inputs': inputs, 'payment_method': payment_method, 'pricing': pricing, 'status': 'creating', 'job_id': None, 'result': None, 'usage': None, 'idempotency_key': digest, 'fingerprint': fingerprint, 'created_at': utcnow(), 'updated_at': utcnow(), 'logs': [{'at': utcnow(), 'message': 'Request created'}], 'demo': user.get('provider') == 'demo'}
            record['execution_deadline'] = None
            data[request_id] = record
            return dict(record)
        record = self.store.update('task_requests', {}, reserve)
        if record['request_id'] != request_id:
            return self.public(record)
        try:
            if payment_method == 'escrow':
                job = self.system.post_job(f"{agent['display_name']} task", str(inputs.get('prompt', 'Structured agent task')), pricing['task_price_usd'], client=user['name'], client_id=user['user_id'], release_condition='manual', simulated=record['demo'])
                self.system.jobs.update(job['job_id'], provider_inputs=inputs, request_id=request_id, require_live_result=not record['demo'])
                self.update(request_id, status='awaiting_funding', job_id=job['job_id'], message='Escrow job created; verified funding required')
            else:
                self.credits.reserve(user['user_id'], agent_id, request_id, pricing['credit_cost'])
                self.update(request_id, status='ready', message='Subscription credits reserved; escrow not used')
        except (RequestError, CreditError, ProviderError) as exc:
            self.update(request_id, status='failed', error=str(exc), message='Request could not be prepared')
            raise
        return self.get(user, request_id)

    def public(self, record):
        return {k: v for k, v in record.items() if k not in {'fingerprint', 'idempotency_key', 'lease'}}

    def get(self, user, request_id):
        record = self.store.read('task_requests', {}).get(request_id)
        if not record or record['user_id'] != user['user_id']:
            raise KeyError('Request not found')
        return self.public(record)

    def history(self, user):
        return sorted([self.public(r) for r in self.store.read('task_requests', {}).values() if r['user_id'] == user['user_id']], key=lambda r: r['created_at'], reverse=True)

    def approve(self, user, request_id):
        record = self.get(user, request_id)
        if record['payment_method'] != 'escrow':
            raise RequestError('Credit requests do not use escrow approval')
        def claim(data):
            current = data[request_id]
            if current['status'] != 'delivered':
                return False
            current.update(status='approving', updated_at=utcnow())
            return True
        if not self.store.update('task_requests', {}, claim):
            return self.get(user, request_id)
        try:
            self.system.approve_work(record['job_id'], user['user_id'])
        except Exception:
            self.update(request_id, status='unknown', error='Escrow release requires reconciliation before another approval', message='Approval interrupted; automatic release retry blocked')
            raise
        self.update(request_id, status='completed', message='Client approved escrow release')
        return self.get(user, request_id)

    def update(self, request_id, message=None, **fields):
        def mutate(data):
            record = data[request_id]
            record.update(fields, updated_at=utcnow())
            if message:
                record['logs'].append({'at': utcnow(), 'message': message})
            return dict(record)
        return self.store.update('task_requests', {}, mutate)

    def advance(self, user, request_id):
        record = self.get(user, request_id)
        if record['status'] in {'completed', 'delivered', 'failed', 'unknown', 'creating'}:
            return record
        now = datetime.now(timezone.utc)
        token = uuid4().hex
        def claim(data):
            current = data[request_id]
            if current['status'] in {'completed', 'delivered', 'failed', 'unknown', 'creating'}:
                return False
            lease = current.get('lease')
            if lease and datetime.fromisoformat(lease['until']) > now:
                return False
            if lease and current['status'] == 'running' and current['provider_id'] == 'nexscrow':
                current.update(status='unknown', error='Execution interrupted; reconcile before retrying', lease=None)
                return False
            current['lease'] = {'token': token, 'until': (now + timedelta(seconds=180)).isoformat()}
            return True
        if not self.store.update('task_requests', {}, claim):
            return self.get(user, request_id)
        record = self.get(user, request_id)
        try:
            if record['status'] == 'settling':
                try:
                    self.credits.settle(request_id, record['pricing']['credit_cost'])
                except CreditError:
                    return self.get(user, request_id)
                usage = {'provider_usage': record.get('usage'), 'credits_charged': record['pricing']['credit_cost'], 'task_price_usd': record['pricing']['task_price_usd'], 'pricing_model': 'fixed_per_execution'}
                self.update(request_id, status='completed', usage=usage, error=None, message='Credit settlement recovered without rerunning provider')
                return self.get(user, request_id)
            if record['payment_method'] == 'escrow':
                job = self.system.jobs.get(record['job_id'])
                if job['payment_status'] != 'locked':
                    if job['payment_status'] in {'refunded', 'released'}:
                        self.update(request_id, status='completed' if job['payment_status'] == 'released' else 'failed', message='Escrow payment state finalized')
                    return self.get(user, request_id)
            deadline = record.get('execution_deadline')
            if deadline and datetime.fromisoformat(deadline) <= now:
                self.update(request_id, status='unknown', error='Execution monitoring timed out; reconcile with provider before retrying', message='Execution deadline exceeded; no automatic resubmission or charge')
                return self.get(user, request_id)
            self.update(request_id, status='running', execution_deadline=deadline or (now + timedelta(minutes=30)).isoformat(), message='Checking agent execution')
            if record['payment_method'] == 'escrow':
                if job['status'] in {'delivered', 'completed'}:
                    outcome = job
                else:
                    outcome = self.system.agent_run(record['job_id'], record['agent_id'])['job']
                result = outcome['deliverable']
                status = 'delivered' if outcome['status'] == 'delivered' else 'completed'
                execution = self.store.read('provider_executions', {}).get(record['job_id'], {})
            else:
                agent = self.agent(record['agent_id'])
                if record['provider_id'] == 'nexscrow':
                    if not record['demo']:
                        import os
                        if not os.environ.get('NEAR_AI_API_KEY'):
                            raise RequestError('Live agent execution is not configured')
                    job = {'job_id': request_id, 'title': agent['display_name'], 'description': record['inputs'].get('prompt', ''), 'reward_usd': record['pricing']['task_price_usd']}
                    from src.providers.internal import InternalAdapter
                    execution = InternalAdapter(self.system.agent).execute({'provider_agent_id': record['agent_id']}, {'job_id': request_id, 'job': job, 'require_live_result': True})
                    result = execution['result']
                else:
                    execution = self.system.provider_executions.run(record['agent_id'], record['inputs'], 'credit-' + request_id)
                    result = execution['result']
                # Fixed per-execution pricing is captured only after confirmed success.
                self.update(request_id, result=result, usage=execution.get('usage'), provider_execution_id=execution.get('provider_execution_id'), status='settling', message='Provider success verified; reconciling fixed execution charge')
                try:
                    self.credits.settle(request_id, record['pricing']['credit_cost'])
                except CreditError:
                    return self.get(user, request_id)
                status = 'completed'
            usage = {'provider_usage': execution.get('usage'), 'credits_charged': record['pricing']['credit_cost'] if record['payment_method'] == 'credits' else 0, 'task_price_usd': record['pricing']['task_price_usd'], 'pricing_model': 'fixed_per_execution'}
            self.update(request_id, result=result, usage=usage, provider_execution_id=execution.get('provider_execution_id', request_id), status=status, message='Result saved')
        except ProviderPending:
            self.update(request_id, status='pending', message='Provider is still running; polling will reuse the same execution')
        except (ProviderError, RequestError, CreditError) as exc:
            execution = self.store.read('provider_executions', {}).get(('credit-' + request_id) if record['payment_method'] == 'credits' else record['job_id'], {})
            ambiguous = execution.get('status') in {'unknown', 'submitting'}
            if record['payment_method'] == 'credits' and not ambiguous:
                self.credits.release(request_id)
            self.update(request_id, status='unknown' if ambiguous else 'failed', error=str(exc), message='Execution requires reconciliation' if ambiguous else 'Execution failed; no automatic resubmission')
        except Exception:
            current = self.get(user, request_id)
            if current['status'] == 'settling':
                self.update(request_id, error='Settlement interrupted; check status to reconcile without rerunning the agent', message='Result retained; credit settlement pending')
            else:
                self.update(request_id, status='unknown', error='Execution was interrupted; reconciliation is required before retrying', message='Outcome unknown; funds retained pending reconciliation')
        finally:
            def unlock(data):
                lease = data[request_id].get('lease')
                if lease and lease['token'] == token:
                    data[request_id]['lease'] = None
            self.store.update('task_requests', {}, unlock)
        return self.get(user, request_id)
