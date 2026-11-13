"""Prepaid billing, isolated from jobs, escrow and the public escrow ledger."""
import hashlib
import json
import os
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation, ROUND_CEILING
from uuid import uuid4

from src.credits import CreditService
from src.intents import IntentsError, one_click_client, verify_settlement
from src.storage import PostgresStore, utcnow


class BillingError(ValueError):
    pass


def timestamp(value):
    try:
        date = datetime.fromisoformat(str(value).replace('Z', '+00:00'))
        if not date.tzinfo:
            raise ValueError()
        return date.astimezone(timezone.utc)
    except (ValueError, TypeError) as exc:
        raise BillingError('Invalid payment timestamp') from exc


def empty():
    from src.credits import empty_state
    data = empty_state()
    data.setdefault('orders', {})
    data.setdefault('settlements', {})
    data.setdefault('plans', {})
    return data


class BillingService:
    def __init__(self, store, config=None, client=None):
        self.store = store
        self.config = config or {}
        self.client = client or one_click_client(os.environ.get('ONECLICK_API_KEY'))
        self.credits = CreditService(store)

    def _update(self, mutate):
        def wrapper(data):
            for key, default in empty().items():
                data.setdefault(key, default)
            return mutate(data)
        return self.store.update('credit_accounts', empty(), wrapper)

    def plans(self):
        from src.management import load_management
        override = load_management(self.store).get('billing')
        plans = (override if override is not None else self.config).get('plans', [])
        for p in plans:
            self._validate_offer(p, plan=True)
        if len({p['id'] for p in plans}) != len(plans):
            raise BillingError('Plan identifiers must be unique')
        return plans

    def packages(self):
        from src.management import load_management
        override = load_management(self.store).get('billing')
        packages = (override if override is not None else self.config).get('topup_packages', [])
        for package in packages:
            self._validate_offer(package)
        return packages

    def _validate_offer(self, offer, plan=False):
        try:
            if not isinstance(offer.get('id'), str) or not offer['id']:
                raise ValueError()
            price = Decimal(str(offer['price_usd']))
            if not price.is_finite() or price < 0 or price.as_tuple().exponent < -2:
                raise ValueError()
            if not isinstance(offer['credits'], int) or isinstance(offer['credits'], bool) or offer['credits'] <= 0:
                raise ValueError()
            if plan and (not isinstance(offer['period_days'], int) or isinstance(offer['period_days'], bool) or not 1 <= offer['period_days'] <= 366):
                raise ValueError()
            if plan and (not isinstance(offer.get('rollover', False), bool) or not isinstance(offer.get('allowed_agents', ['*']), list) or any(not isinstance(a, str) for a in offer.get('allowed_agents', ['*']))):
                raise ValueError()
            if not plan and price <= 0:
                raise ValueError()
        except (KeyError, ValueError, InvalidOperation):
            raise BillingError('Invalid billing offer configuration') from None

    def readiness(self):
        if not self.config.get('enabled'):
            return False, 'Crypto checkout is disabled pending deployment verification.'
        if not isinstance(self.store, PostgresStore):
            return False, 'Live billing requires PostgreSQL durable storage.'
        if not os.environ.get('BILLING_TREASURY_ADDRESS') or not os.environ.get('BILLING_SETTLEMENT_ASSET'):
            return False, 'Treasury destination and settlement asset are not configured.'
        return True, None

    def _require_live(self, user):
        enabled, reason = self.readiness()
        if not enabled:
            raise BillingError(reason)
        if user.get('provider') == 'demo':
            raise BillingError('Demo sessions cannot purchase subscriptions or credits')

    def assets(self):
        return self.client.tokens()

    def _offer(self, purpose, offer_id):
        offer = next((p for p in (self.plans() if purpose == 'subscription' else self.packages()) if p['id'] == offer_id), None)
        if not offer:
            raise BillingError('Unknown billing offer')
        return dict(offer)

    def subscription(self, user):
        self._apply_scheduled_change(user['user_id'])
        snapshot = self.credits.snapshot(user['user_id'])
        data = self.store.read('credit_accounts', empty())
        scheduled_change = data.get('subscriptions', {}).get(user['user_id'], {}).get('scheduled_change')
        snapshot['scheduled_change'] = scheduled_change
        if snapshot.get('subscription') and scheduled_change:
            snapshot['subscription'] = {**snapshot['subscription'], 'scheduled_change': scheduled_change}
        return {**snapshot, 'checkout_enabled': self.readiness()[0]}

    def _active(self, data, user_id, now):
        sub = data.get('subscriptions', {}).get(user_id, {})
        periods = sub.get('periods', [sub] if sub else [])
        active = [p for p in periods if timestamp(p.get('start_at', '1970-01-01T00:00:00+00:00')) <= now and (not p.get('expires_at') or now < timestamp(p['expires_at']))]
        return max(active, key=lambda p: p.get('start_at', '')) if active else None

    def free(self, user):
        if user.get('provider') == 'demo':
            raise BillingError('Sign in with a live account to activate a free plan')
        if not isinstance(self.store, PostgresStore):
            raise BillingError('Subscription accounting requires PostgreSQL')
        offer = next((p for p in self.plans() if Decimal(str(p['price_usd'])) == 0), None)
        if not offer:
            raise BillingError('A free plan is not configured')
        def activate(data):
            user_id = user['user_id']
            # One free enrollment per account; no repeat grant on expiry or refresh.
            if data.get('free_enrollments', {}).get(user_id):
                return
            if self._active(data, user_id, datetime.now(timezone.utc)):
                raise BillingError('An active subscription already exists')
            self._activate(data, user_id, offer, 'free:' + user_id, datetime.now(timezone.utc))
            data.setdefault('free_enrollments', {})[user_id] = utcnow()
        self._update(activate)
        return self.subscription(user)

    def schedule_change(self, user, plan_id):
        offer = self._offer('subscription', plan_id)
        def schedule(data):
            active = self._active(data, user['user_id'], datetime.now(timezone.utc))
            if not active:
                raise BillingError('There is no active subscription to change')
            if not active.get('expires_at'):
                raise BillingError('Legacy indefinite subscriptions require operator migration before changing plans')
            if Decimal(str(offer['price_usd'])) >= Decimal(str(active.get('price_usd', '0'))):
                raise BillingError('Upgrade through a new verified purchase; only downgrades can be scheduled')
            periods = data['subscriptions'][user['user_id']].get('periods', [active])
            effective_at = max(timestamp(p['expires_at']) for p in periods if p.get('expires_at'))
            data['subscriptions'][user['user_id']]['scheduled_change'] = {'plan_id': plan_id, 'effective_at': effective_at.isoformat(), 'requires_payment': Decimal(str(offer['price_usd'])) > 0}
        self._update(schedule)
        return self.subscription(user)

    def _apply_scheduled_change(self, user_id):
        # Paid changes require a fresh payment; scheduling never charges crypto.
        def apply(data):
            sub = data.get('subscriptions', {}).get(user_id, {})
            change = sub.get('scheduled_change')
            if change and timestamp(change['effective_at']) <= datetime.now(timezone.utc) and not change['requires_payment']:
                offer = self._offer('subscription', change['plan_id'])
                enrolled = bool(data.get('free_enrollments', {}).get(user_id))
                self._activate(data, user_id, offer, 'scheduled-free:' + user_id + ':' + change['effective_at'], timestamp(change['effective_at']), allocate_credits=not enrolled)
                data.setdefault('free_enrollments', {})[user_id] = utcnow()
                data['subscriptions'][user_id].pop('scheduled_change', None)
        self._update(apply)

    def quote(self, user, purpose, offer_id, origin_asset, refund_address):
        self._require_live(user)
        offer = self._offer(purpose, offer_id)
        if Decimal(str(offer['price_usd'])) <= 0:
            raise BillingError('Use free enrollment for the free plan')
        if purpose == 'subscription':
            data = self.store.read('credit_accounts', empty())
            active = self._active(data, user['user_id'], datetime.now(timezone.utc))
            if active and not active.get('expires_at'):
                raise BillingError('Legacy indefinite subscriptions require operator migration before checkout')
            if active and offer['id'] != active['plan'] and Decimal(str(offer['price_usd'])) < Decimal(str(active.get('price_usd', '0'))):
                raise BillingError('Downgrades take effect after the current period; schedule the change and pay after expiry')
            if active and active['plan'] != offer['id']:
                future = data.get('subscriptions', {}).get(user['user_id'], {}).get('periods', [])
                if any(timestamp(p['start_at']) > datetime.now(timezone.utc) for p in future):
                    raise BillingError('Prepaid future periods must be reconciled before changing plans')
        tokens = self.assets()
        origin = next((t for t in tokens if t['assetId'] == origin_asset), None)
        destination_asset = os.environ.get('BILLING_SETTLEMENT_ASSET')
        dest = next((t for t in tokens if t['assetId'] == destination_asset), None)
        if not origin or not dest:
            raise BillingError('Selected asset or configured settlement asset is not currently supported')
        if not isinstance(refund_address, str) or not 2 <= len(refund_address) <= 256 or any(c.isspace() for c in refund_address):
            raise BillingError('Provide a valid refund address on the origin network')
        try:
            price = Decimal(str(dest['price']))
            if not price.is_finite() or price <= 0 or timestamp(dest['priceUpdatedAt']) < datetime.now(timezone.utc) - timedelta(seconds=self.config.get('max_price_age_seconds', 600)):
                raise ValueError()
            decimals = dest['decimals']
            if not isinstance(decimals, int) or isinstance(decimals, bool) or not 0 <= decimals <= 36:
                raise ValueError()
            amount = str(int((Decimal(str(offer['price_usd'])) / price * (10 ** decimals)).to_integral_value(rounding=ROUND_CEILING)))
        except (ValueError, KeyError, InvalidOperation):
            raise BillingError('Settlement asset pricing is stale or invalid') from None
        deadline = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        payload = {'dry': True, 'swapType': 'EXACT_OUTPUT', 'slippageTolerance': self.config.get('slippage_bps', 100), 'originAsset': origin_asset, 'depositType': 'ORIGIN_CHAIN', 'destinationAsset': destination_asset, 'amount': amount, 'refundTo': refund_address, 'refundType': 'ORIGIN_CHAIN', 'recipient': os.environ['BILLING_TREASURY_ADDRESS'], 'recipientType': 'DESTINATION_CHAIN', 'deadline': deadline}
        response = self.client.quote(payload)
        self._validate_quote(response, payload, False)
        return {'purpose': purpose, 'offer_id': offer_id, 'price_usd': str(offer['price_usd']), 'credits': offer['credits'], 'quote_response': response, 'dry': True, 'payload': payload, 'offer': offer, 'origin_network': origin['blockchain'], 'origin_symbol': origin['symbol'], 'settlement_price_usd': str(price), 'quote_expires_at': deadline, 'estimated_fees': self._fees(response['quote'])}

    def _fees(self, quote):
        fees = {'note': 'Estimated route cost includes price impact and fees; not a guaranteed fee breakdown.'}
        try:
            spread = Decimal(str(quote['amountInUsd'])) - Decimal(str(quote['amountOutUsd']))
            if spread.is_finite():
                fees['route_cost_usd'] = str(max(Decimal('0'), spread).quantize(Decimal('0.01')))
        except (KeyError, InvalidOperation):
            pass
        for key in ('refundFee', 'withdrawFee'):
            if key in quote:
                fees[key] = quote[key]
        return fees

    def _validate_quote(self, response, payload, deposit):
        try:
            request = response['quoteRequest']
            quote = response['quote']
            if any(request.get(key) != value for key, value in payload.items() if key not in {'deadline'}):
                raise ValueError()
            if int(quote['amountOut']) != int(payload['amount']) or int(quote['amountIn']) <= 0 or int(quote['minAmountIn']) <= 0:
                raise ValueError()
            if not response.get('correlationId') or not response.get('signature'):
                raise ValueError()
            if deposit and (not quote.get('depositAddress') or timestamp(quote['deadline']) <= datetime.now(timezone.utc)):
                raise ValueError()
            if timestamp(request['deadline']) != timestamp(payload['deadline']):
                raise ValueError()
            if deposit and timestamp(quote['deadline']) > timestamp(payload['deadline']):
                raise ValueError()
        except (KeyError, ValueError, TypeError):
            raise BillingError('Provider returned an invalid or mismatched payment quote') from None

    def create(self, user, purpose, offer_id, origin_asset, refund_address, key):
        if not isinstance(key, str) or not 8 <= len(key) <= 128:
            raise BillingError('An idempotency key is required')
        self._require_live(user)
        digest = hashlib.sha256(f"{user['user_id']}:{key}".encode()).hexdigest()
        fingerprint = json.dumps([purpose, offer_id, origin_asset, refund_address])
        payment_id = uuid4().hex
        def reserve(data):
            previous = next((o for o in data['orders'].values() if o['idempotency_key'] == digest), None)
            if previous:
                if previous['fingerprint'] != fingerprint:
                    raise BillingError('Payment key was already used for another purchase')
                return dict(previous)
            order = {'payment_id': payment_id, 'user_id': user['user_id'], 'purpose': purpose, 'offer_id': offer_id, 'plan_id': offer_id if purpose == 'subscription' else None, 'status': 'creating', 'idempotency_key': digest, 'fingerprint': fingerprint, 'created_at': utcnow(), 'events': [{'at': utcnow(), 'status': 'creating'}]}
            data['orders'][payment_id] = order
            return dict(order)
        existing = self._update(reserve)
        if existing['payment_id'] != payment_id:
            return self.public(existing)
        try:
            preview = self.quote(user, purpose, offer_id, origin_asset, refund_address)
            payload = {**preview['payload'], 'dry': False}
            response = self.client.quote(payload)
            self._validate_quote(response, payload, True)
            quote = response['quote']
            def save(data):
                for other in data['orders'].values():
                    if other['payment_id'] != payment_id and other.get('deposit_address') == quote['depositAddress'] and other.get('deposit_memo') == quote.get('depositMemo'):
                        raise BillingError('Provider reused a payment deposit destination')
                order = data['orders'][payment_id]
                order.update({k: v for k, v in preview.items() if k not in {'payload', 'quote_response', 'dry'}})
                order.update(quote_response=response, expected_amount=payload['amount'], destination_asset=payload['destinationAsset'], treasury=payload['recipient'], deposit_address=quote['depositAddress'], deposit_memo=quote.get('depositMemo'), quote_expires_at=quote['deadline'])
                order['estimated_fees'] = self._fees(quote)
                self._transition(order, 'pending')
                data['plans'] = {p['id']: p for p in self.plans()}
                return self.public(order)
            return self._update(save)
        except Exception:
            def unknown(data):
                self._transition(data['orders'][payment_id], 'unknown')
            self._update(unknown)
            raise

    def public(self, order):
        return {k: v for k, v in order.items() if k not in {'idempotency_key', 'fingerprint', 'treasury'}}

    def get(self, user, payment_id):
        data = self.store.read('credit_accounts', empty())
        order = data.get('orders', {}).get(payment_id)
        if not order or order['user_id'] != user['user_id']:
            raise KeyError('Payment not found')
        return dict(order)

    def history(self, user):
        data = self.store.read('credit_accounts', empty())
        return sorted([self.public(o) for o in data.get('orders', {}).values() if o['user_id'] == user['user_id']], key=lambda o: o['created_at'], reverse=True)

    def _transition(self, order, status):
        if order['status'] != status:
            order['events'].append({'at': utcnow(), 'status': status})
            order.update(status=status, updated_at=utcnow())

    def status(self, user, payment_id):
        order = self.get(user, payment_id)
        if order['status'] == 'paid' and self.readiness()[0]:
            self._require_live(user)
            response = self.client.status(order['deposit_address'], order.get('deposit_memo'))
            try:
                checked_settlement = verify_settlement(order, response)
                if checked_settlement['settlement_id'] != order['settlement']['settlement_id']:
                    raise IntentsError('Previously settled transaction identity changed')
            except IntentsError:
                def quarantine(data):
                    current = data['orders'][payment_id]
                    self._transition(current, 'review_after_settlement')
                    current['reconciliation_response'] = response
                    data['accounts'][user['user_id']]['frozen'] = True
                    data['accounts'][user['user_id']]['freeze_reason'] = 'A previously settled payment changed status; reconciliation is required.'
                    return self.public(current)
                return self._update(quarantine)
            def checked(data):
                current = data['orders'][payment_id]
                current['last_checked_at'] = utcnow()
                return self.public(current)
            return self._update(checked)
        terminal = {'paid', 'expired', 'refunded', 'failed', 'review', 'review_after_settlement', 'unknown', 'creating'}
        if order['status'] in terminal:
            return self.public(order)
        self._require_live(user)
        response = self.client.status(order['deposit_address'], order.get('deposit_memo'))
        mapping = {'PENDING_DEPOSIT': 'pending', 'KNOWN_DEPOSIT_TX': 'deposit_detected', 'PROCESSING': 'processing', 'INCOMPLETE_DEPOSIT': 'underpaid', 'REFUNDED': 'refunded', 'FAILED': 'failed'}
        status = response.get('status')
        settlement = None
        if status == 'SUCCESS':
            try:
                settlement = verify_settlement(order, response)
                if timestamp(settlement['verified_at']) > timestamp(order['quote_expires_at']):
                    settlement = None
                    state = 'review'
                else:
                    state = 'paid'
            except IntentsError:
                state = 'review'
        else:
            state = mapping.get(status, 'review')
        def apply(data):
            current = data['orders'][payment_id]
            if current['status'] in terminal:
                return self.public(current)
            current['intents_status'] = status
            current['status_response'] = response
            current['last_checked_at'] = utcnow()
            if timestamp(current['quote_expires_at']) <= datetime.now(timezone.utc) and not settlement and status != 'SUCCESS':
                self._transition(current, 'expired')
                return self.public(current)
            if settlement:
                hashes = settlement['transaction_hashes']
                references = [current['destination_asset'] + ':' + h for h in hashes]
                if any(ref in data['settlements'] and data['settlements'][ref] != payment_id for ref in references):
                    self._transition(current, 'review')
                    return self.public(current)
                from src.credits import grant_in_state
                if current['purpose'] == 'subscription':
                    try:
                        self._activate(data, user['user_id'], current['offer'], 'payment:' + payment_id, datetime.now(timezone.utc))
                    except BillingError:
                        self._transition(current, 'review')
                        return self.public(current)
                    period = next(p for p in data['subscriptions'][user['user_id']]['periods'] if p.get('credit_reference') == 'payment:' + payment_id)
                    current['effective_at'] = period['start_at']
                    current['period_expires_at'] = period['expires_at']
                else:
                    grant_in_state(data, user['user_id'], current['credits'], 'payment:' + payment_id, 'topup')
                for ref in references:
                    data['settlements'][ref] = payment_id
                current['settlement'] = settlement
                current['credited_at'] = utcnow()
            self._transition(current, state)
            return self.public(current)
        return self._update(apply)

    def _activate(self, data, user_id, offer, reference, now, allocate_credits=True):
        from src.credits import grant_in_state
        subscription = data['subscriptions'].setdefault(user_id, {'periods': []})
        if 'periods' not in subscription:
            legacy = {key: value for key, value in subscription.items() if key != 'scheduled_change'}
            legacy.setdefault('start_at', '1970-01-01T00:00:00+00:00')
            subscription['periods'] = [legacy] if legacy.get('plan') else []
        periods = subscription.setdefault('periods', [])
        if any(p.get('credit_reference') == reference for p in periods):
            return
        active = self._active(data, user_id, now)
        start = now
        if active:
            current_price = Decimal(str(active.get('price_usd', '0')))
            new_price = Decimal(str(offer['price_usd']))
            if active['plan'] != offer['id'] and new_price < current_price:
                raise BillingError('Schedule a downgrade, then purchase it after the current period expires')
            if active['plan'] == offer['id']:
                start = max(timestamp(p['expires_at']) for p in periods if p.get('plan') == offer['id'])
            else:
                # Full-price immediate upgrade; existing unexpired grants retain original expiry.
                if any(timestamp(p['start_at']) > now for p in periods):
                    raise BillingError('Prepaid future periods require reconciliation before upgrading')
                for period in periods:
                    if timestamp(period['expires_at']) > now:
                        period['expires_at'] = now.isoformat()
        end = start + timedelta(days=offer['period_days'])
        period = {'plan': offer['id'], 'name': offer.get('name', offer['id']), 'allowed_agents': offer.get('allowed_agents', ['*']), 'start_at': start.isoformat(), 'expires_at': end.isoformat(), 'price_usd': str(offer['price_usd']), 'credit_reference': reference}
        periods.append(period)
        subscription.pop('scheduled_change', None)
        if allocate_credits:
            grant_in_state(data, user_id, offer['credits'], reference, 'plan', expires_at=None if offer.get('rollover') else end.isoformat(), starts_at=start.isoformat())
