"""Read-only operational report; never retries work or modifies financial state."""
import json
from datetime import datetime, timezone
from src.env import load_env
from src.storage import create_store


def main():
    load_env()
    store=create_store()
    now=datetime.now(timezone.utc)
    for request in store.read('task_requests',{}).values():
        deadline=request.get('execution_deadline')
        stalled=deadline and datetime.fromisoformat(deadline)<=now and request['status'] in {'pending','running','settling'}
        if stalled or request['status'] in {'unknown','creating','approving'}:
            print(json.dumps({'request_id':request['request_id'],'status':request['status'],'overdue':bool(stalled)}))
    for job in store.read('jobs',{}).values():
        if job.get('transfer_intent') and job['payment_status']=='locked':
            print(json.dumps({'job_id':job['job_id'],'operation':job['transfer_intent']['operation'],'status':'escrow_transfer_requires_reconciliation'}))


if __name__=='__main__': main()
