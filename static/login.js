(() => {
  const wallet=document.getElementById('portal-wallet'),google=document.getElementById('portal-google'),demo=document.getElementById('portal-demo'),error=document.getElementById('auth-error');
  const fail=message=>{error.textContent=message;error.hidden=false;};
  wallet.addEventListener('click',async()=>{wallet.disabled=true;try{await window.connectNearWallet();}catch(e){fail(e.message||'Wallet sign-in could not be completed');}finally{wallet.disabled=false;}});
  demo.addEventListener('click',async()=>{demo.disabled=true;error.hidden=true;try{const r=await fetch('/api/auth/demo',{method:'POST'});const d=await r.json();if(!r.ok)throw Error(d.error||d.detail||'Demo is unavailable');location.assign('/app');}catch(e){fail(e.message);demo.disabled=false;}});
  google.disabled=true;
  fetch('/api/config').then(r=>{if(!r.ok)throw Error();return r.json();}).then(config=>{
    const direct=config.auth?.google_configured,fast=config.near_auth?.client_id;
    google.disabled=!direct&&!fast;
    document.getElementById('google-note').textContent=google.disabled?'Google sign-in is not configured on this deployment. Use a wallet or try the demo.':'Secure sign-in. No payment is authorized by logging in.';
    google.addEventListener('click',()=>{if(direct)location.assign('/api/auth/google/start');else if(fast)window.nearAuthLogin();});
  }).catch(()=>{document.getElementById('google-note').textContent='Sign-in availability could not be loaded. Please refresh to retry.';});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelector('video')?.pause();
})();
