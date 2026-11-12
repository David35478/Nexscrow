"""Same-origin write protection and durable, bounded API throttling."""
import hashlib
import logging
import os
import time
from uuid import uuid4

from starlette.responses import JSONResponse

logger = logging.getLogger('nexscrow.http')


def install_security(app, store):
    @app.middleware('http')
    async def protect(request, call_next):
        request_id = uuid4().hex
        started = time.monotonic()
        origin = request.headers.get('origin')
        expected = os.environ.get('APP_ORIGIN')
        if not expected:
            expected = str(request.base_url).rstrip('/')
        unsafe = request.method not in {'GET', 'HEAD', 'OPTIONS'}
        if unsafe and (request.headers.get('sec-fetch-site') == 'cross-site' or (origin and origin.rstrip('/') != expected.rstrip('/'))):
            return JSONResponse({'error': 'Cross-origin writes are not allowed'}, status_code=403)
        length = request.headers.get('content-length')
        if length and (not length.isdigit() or int(length) > 262144):
            return JSONResponse({'error': 'Request body is too large'}, status_code=413)
        if unsafe:
            body = bytearray()
            async for chunk in request.stream():
                body.extend(chunk)
                if len(body) > 262144:
                    return JSONResponse({'error': 'Request body is too large'}, status_code=413)
            request._body = bytes(body)
        if request.url.path.startswith('/api/') and unsafe:
            bucket = int(time.time() // 60)
            # Never persist raw session tokens or IP addresses in throttling records.
            client_ip = request.client.host if request.client else 'unknown'
            token = request.cookies.get('nexscrow_session')
            session = store.read('sessions', {}).get(token, {}) if token else {}
            authenticated = session.get('expires_at', 0) > time.time()
            identity = session['user_id'] if authenticated and not request.url.path.startswith('/api/auth/') else client_ip
            key = hashlib.sha256(identity.encode()).hexdigest()
            limit = 30 if request.url.path.startswith('/api/auth/') else 120
            def throttle(data):
                for old in [k for k, v in data.items() if v['bucket'] < bucket - 1]:
                    del data[old]
                record = data.setdefault(key, {'bucket': bucket, 'count': 0})
                if record['bucket'] != bucket:
                    record.update(bucket=bucket, count=0)
                record['count'] += 1
                return record['count'] <= limit
            if not store.update('rate_limits', {}, throttle):
                return JSONResponse({'error': 'Too many requests; retry shortly'}, status_code=429, headers={'Retry-After': '60'})
        try:
            response = await call_next(request)
        except Exception:
            logger.error('request_failed id=%s method=%s route=%s', request_id, request.method, request.url.path)
            return JSONResponse({'error': 'An internal error occurred', 'request_id': request_id}, status_code=500)
        response.headers['X-Request-ID'] = request_id
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['Content-Security-Policy'] = "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https:"
        if request.url.path.startswith('/api/') or request.url.path in {'/app', '/login', '/account', '/admin', '/developer', '/workspace', '/requests', '/billing'}:
            response.headers['Cache-Control'] = 'no-store'
        if os.environ.get('APP_ENV') == 'production':
            response.headers['Strict-Transport-Security'] = 'max-age=31536000'
        logger.info('request_complete id=%s method=%s route=%s status=%s ms=%s', request_id, request.method, request.url.path, response.status_code, round((time.monotonic()-started)*1000))
        return response
