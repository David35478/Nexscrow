(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,708093,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))});e.s(["default",0,n])},7991,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))});e.s(["default",0,n])},129945,e=>{"use strict";var t=e.i(177117),n=e.i(375675);let a=({title:e,description:n,children:a,...i})=>(0,t.jsx)(r,{...i,children:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("h3",{children:e}),"string"==typeof n?(0,t.jsx)("p",{children:n}):n,a]})});(0,n.styled)(a)`
  margin-bottom: 24px;
`;let r=n.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;

  && h3 {
    font-size: 17px;
    color: var(--privy-color-foreground);
  }

  /* Sugar assuming children are paragraphs. Otherwise, handling styling on your own */
  && p {
    color: var(--privy-color-foreground-2);
    font-size: 14px;
  }
`,i=(0,n.styled)(r)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`;e.s(["C",0,({title:e,description:n,icon:a,children:r,...o})=>(0,t.jsxs)(i,{...o,children:[a||null,(0,t.jsx)("h3",{children:e}),n&&"string"==typeof n?(0,t.jsx)("p",{children:n}):n,r]}),"S",0,a])},715097,e=>{"use strict";var t=e.i(375675);let n=t.styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`,a=t.styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
`;e.s(["R",0,n,"a",0,a])},529609,e=>{"use strict";var t=e.i(375675),n=e.i(67820);let a=t.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`,r=(0,t.styled)(a)`
  color: var(--privy-color-accent);
`,i=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */
  word-break: break-all;
  text-align: right;

  ${n.L}
`;e.s(["L",0,a,"V",0,i,"a",0,r])},938467,346242,e=>{"use strict";var t=e.i(177117),n=e.i(375675);n.styled.label`
  && {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-align: left;
    border-radius: 0.5rem;
    border: 1px solid var(--privy-color-foreground-4);
    width: 100%;
  }
`;let a=n.styled.div`
  display: inline-block;
  vertical-align: middle;
`,r=n.styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
`,i=n.styled.input.attrs({type:"checkbox"})`
  border: 0;
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`,o=n.styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  transition: all 150ms;
  cursor: pointer;
  border-color: ${e=>e.color};
  border-radius: 3px;
  background: ${e=>e.checked?e.color:"var(--privy-color-background)"};

  && {
    /* This is necessary to override css reset for border width */
    border-width: 1px;
  }

  ${i}:focus + & {
    box-shadow: 0 0 0 1px ${e=>e.color};
  }

  ${r} {
    visibility: ${e=>e.checked?"visible":"hidden"};
  }
`;e.s(["C",0,({className:e,checked:n,color:s="var(--privy-color-accent)",...l})=>(0,t.jsx)("label",{children:(0,t.jsxs)(a,{className:e,children:[(0,t.jsx)(i,{checked:n,...l}),(0,t.jsx)(o,{color:s,checked:n,children:(0,t.jsx)(r,{viewBox:"0 0 24 24",children:(0,t.jsx)("polyline",{points:"20 6 9 17 4 12"})})})]})})],938467);var s=e.i(691983);let l=s.forwardRef(function({title:e,titleId:t,...n},a){return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},n),e?s.createElement("title",{id:t},e):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"}))});e.s(["default",0,l],346242)},815119,e=>{"use strict";var t=e.i(375675);let n=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.875rem; /* 166.667% */
  text-align: center;
`;e.s(["T",0,n])},960256,e=>{"use strict";var t=e.i(375675);let n=t.styled.span`
  margin-top: 4px;
  color: var(--privy-color-foreground);
  text-align: center;

  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */

  && a {
    color: var(--privy-color-accent);
  }
`;e.s(["S",0,n])},67820,e=>{"use strict";var t=e.i(375675);let n=t.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,a=t.css`
  ${e=>e.$isLoading?t.css`
          width: 35%;
          animation: ${n} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,a])},573486,e=>{"use strict";var t=e.i(691983),n=e.i(859427);let a="0x0000000000000000000000000000000000000000",r="https://api.relay.link",i="https://api.testnets.relay.link",o=async({input:e,isTestnet:t})=>{let n=await fetch((t?i:r)+"/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),a=await n.json();if(!(n.ok||"string"==typeof a.message&&a.message.startsWith("Invalid address")))throw console.error("Relay error:",a),Error(a.message??"Error fetching quote from relay");return a};async function s({requestId:e,isTestnet:t}){let n=await fetch((t?i:r)+"/intents/status/v3?requestId="+encodeURIComponent(e)),a=await n.json();if(!n.ok){if("message"in a&&"string"==typeof a.message)throw Error(a.message);throw Error("Error fetching request from relay")}switch(a.status){case"refund":case"waiting":case"success":return a.status;case"failure":return a.refundFailReason?"failure":"pending";case"delayed":case"pending":case"depositing":case"submitted":case"unknown":return"pending";default:return console.warn(`Unexpected Relay request status: ${a.status}`),"pending"}}class l extends n.P{constructor(e,t){super("We were unable to complete the bridging transaction. Funds will be refunded on your wallet.",void 0,n.c.TRANSACTION_FAILURE),this.relayLink=t?`https://testnets.relay.link/transaction/${e}`:`https://relay.link/transaction/${e}`}}e.s(["R",0,l,"a",0,e=>{let t=e.steps[0],n=t?.items?.[0];if(t&&n)return{from:n.data.from,to:n.data.to,value:Number(n.data.value),chainId:Number(n.data.chainId),data:n.data.data,requestId:t.requestId}},"b",0,"11111111111111111111111111111111","c",0,0x2f3fb341,"d",0,e=>e.steps.flatMap(({requestId:e,items:t=[]})=>t.filter(({status:e})=>"incomplete"===e).map(({data:{from:t,to:n,value:a,chainId:r,data:i}})=>({from:t,to:n,value:Number(a),chainId:Number(r),data:i,requestId:e}))),"e",0,"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","g",0,o,"t",0,({appId:e,originCurrency:t,destinationCurrency:n,...r})=>({tradeType:"EXPECTED_OUTPUT",originCurrency:t??a,destinationCurrency:n??a,referrer:`privy|${e}`,...r}),"u",0,function({transactionHash:e,requestId:n,isTestnet:a,bridgingStatus:r,setBridgingStatus:i,onSuccess:o,onFailure:c}){(0,t.useEffect)(()=>{if(e&&r){if(!n)return console.error("Relay quote has no requestId, so the bridge status cannot be polled"),void c({error:new l(e,a)});if(["delayed","waiting","pending"].includes(r)){let e=setInterval(async()=>{try{let e=await s({requestId:n,isTestnet:a});i(e)}catch(e){console.error(e)}},1e3);return()=>clearInterval(e)}"success"===r?o({transactionHash:e}):["refund","failure"].includes(r)&&c({error:new l(e,a)})}},[r,e,n,a])}])},333882,e=>{"use strict";let t=(0,e.i(319546).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],333882)},969002,e=>{"use strict";let t=(0,e.i(319546).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,t],969002)},468478,e=>{"use strict";let t=new Set(["https:","mailto:"]);e.s(["t",0,function(e){if(!e)return null;try{if(t.has(new URL(e).protocol))return e}catch{}return null}])},144410,e=>{"use strict";var t=e.i(177117),n=e.i(333882);let a=(0,e.i(319546).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);var r=e.i(969002),i=e.i(375675),o=e.i(463475),s=e.i(334240),l=e.i(859427),c=e.i(573486),d=e.i(468478),u=e.i(962537);let p=({error:e,allowlistConfig:i,onRetry:o,onCaptchaReset:p,onBack:m})=>{let g=((e,i)=>{if(e instanceof c.R)return{title:"Transaction failed",detail:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{children:e.message}),(0,t.jsxs)("span",{children:[" ","Check the"," ",(0,t.jsx)(f,{href:e.relayLink,target:"_blank",children:"refund status"}),"."]})]}),ctaText:"Try again",icon:n.AlertTriangle};if(e instanceof l.P)switch(e.privyErrorCode){case l.c.CLIENT_REQUEST_TIMEOUT:return{title:"Timed out",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle};case l.c.INSUFFICIENT_BALANCE:return{title:"Insufficient balance",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle};case l.c.TRANSACTION_FAILURE:return{title:"Transaction failure",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:n.AlertTriangle}}if(e instanceof s.P&&"twilio_verification_failed"===e.type)return{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:a};if(!(e instanceof l.b))return e instanceof l.d&&e.status&&[400,422].includes(e.status)?{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle}:{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:n.AlertTriangle};switch(e.privyErrorCode){case l.c.INVALID_CAPTCHA:return{title:"Something went wrong",detail:"Please try again.",ctaText:"Try again",icon:n.AlertTriangle};case l.c.DISALLOWED_LOGIN_METHOD:return{title:"Not allowed",detail:e.message,ctaText:"Try another method",icon:n.AlertTriangle};case l.c.ALLOWLIST_REJECTED:return{title:i.errorTitle||"You don't have access to this app",detail:i.errorDetail||"Have you been invited?",ctaText:i.errorCtaText||"Try another account",icon:r.Lock};case l.c.CAPTCHA_FAILURE:return{title:"Something went wrong",detail:"You did not pass CAPTCHA. Please try again.",ctaText:"Try again",icon:null};case l.c.CAPTCHA_TIMEOUT:return{title:"Something went wrong",detail:"Something went wrong! Please try again later.",ctaText:"Try again",icon:null};case l.c.LINKED_TO_ANOTHER_USER:return{title:"Authentication failed",detail:"This account has already been linked to another user.",ctaText:"Try again",icon:n.AlertTriangle};case l.c.NOT_SUPPORTED:return{title:"This region is not supported",detail:"SMS authentication from this region is not available",ctaText:"Try another method",icon:n.AlertTriangle};case l.c.TOO_MANY_REQUESTS:return{title:"Request failed",detail:"Too many attempts.",ctaText:"Try again later",icon:n.AlertTriangle};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:n.AlertTriangle}}})(e,i);return(0,t.jsx)(u.S,{title:g.title,subtitle:g.detail,icon:g.icon,onBack:m,iconVariant:"error",primaryCta:{label:g.ctaText,onClick:()=>{if(e instanceof l.b&&(e.privyErrorCode===l.c.INVALID_CAPTCHA&&p?.(),e.privyErrorCode===l.c.ALLOWLIST_REJECTED)){let e=(0,d.t)(i.errorCtaLink);if(e)return void window.open(e,"_blank","noopener,noreferrer")}o?.()},variant:"error"},watermark:!0})},m={component:()=>{let{navigate:e,data:n,lastScreen:a,currentScreen:r}=(0,o.b)(),i=(0,o.u)(),{reset:l}=(0,s.a)(),c=n?.errorModalData?.previousScreen||(a===r?void 0:a);return(0,t.jsx)(p,{error:n?.errorModalData?.error||Error(),allowlistConfig:i.allowlistConfig,onRetry:()=>{e(c||"LandingScreen",!1)},onCaptchaReset:l})}},f=i.styled.a`
  color: var(--privy-color-accent) !important;
  font-weight: 600;
`;e.s(["ErrorScreen",0,m,"ErrorScreenView",0,p,"default",0,m],144410)},328121,e=>{"use strict";var t=e.i(375675);let n=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > :last-child {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`;e.s(["e",0,n])},790106,535218,e=>{"use strict";e.s(["A",0,"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","D",0,{"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}},"J",0,["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],"L",0,1e9,"R",0,["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],"S",0,"11111111111111111111111111111111","T",0,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","a",0,"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"],535218);let t=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2});e.s(["g",0,function(e,n){let a=parseFloat(e.toString())/1e9,r=t.format(n*a);return"$0.00"===r?"<$0.01":r}],790106)},649082,e=>{"use strict";var t=e.i(790106);function n(e,t=6,a=!1,r=!1){let i=(parseFloat(e.toString())/1e9).toFixed(t).replace(/0+$/,"").replace(/\.$/,""),o=r?"":" SOL";return a?`${i}${o}`:`${"0"===i?"<0.001":i}${o}`}e.s(["a",0,function({amount:e,fee:a,tokenPrice:r,isUsdc:i}){let o=BigInt(Math.floor(parseFloat(e)*10**(i?6:9))),s=i?o:o+a;return{fundingAmountInBaseUnit:o,fundingAmountInUsd:r?(0,t.g)(o,r):void 0,totalPriceInUsd:r?(0,t.g)(s,r):void 0,totalPriceInNativeCurrency:n(s),feePriceInNativeCurrency:n(a),feePriceInUsd:r?(0,t.g)(a,r):void 0}},"g",0,n])},642754,e=>{"use strict";var t=e.i(375675);let n=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,a=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,r=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,i=(0,t.styled)(a)`
  padding: 20px 0;
`,o=(0,t.styled)(a)`
  gap: 16px;
`,s=t.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,l=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;let c=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  background: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  && h4 {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
    text-decoration: underline;
    font-weight: 500;
  }
  && p {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
  }
`,d=t.styled.div`
  height: 16px;
`,u=t.styled.div`
  height: 12px;
`;t.styled.div`
  position: relative;
`;let p=t.styled.div`
  height: ${e=>e.height??"12"}px;
`;t.styled.div`
  background-color: var(--privy-color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-color: white;
  border-width: 2px !important;
`,e.s(["B",0,n,"C",0,o,"F",0,l,"H",0,r,"R",0,d,"S",0,c,"a",0,u,"b",0,p,"c",0,s,"d",0,i,"e",0,a])},351190,e=>{"use strict";var t=e.i(691983),n=e.i(68297);e.s(["u",0,({enabled:e=!0}={})=>{let{showFiatPrices:a,getUsdPriceForSol:r}=(0,n.u)(),[i,o]=(0,t.useState)(!0),[s,l]=(0,t.useState)(void 0),[c,d]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{(async()=>{if(a&&e)try{o(!0);let e=await r();e?d(e):l(Error("Unable to fetch SOL price"))}catch(e){l(e)}finally{o(!1)}else o(!1)})()},[]),{solPrice:c,isSolPriceLoading:i,solPriceError:s}}])},809681,e=>{"use strict";var t=e.i(368207),n=e.i(68297),a=e.i(312075);let r=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2}),i=(e,n=6,a=!1)=>{let r=parseFloat((0,t.formatEther)(e)).toFixed(n).replace(/0+$/,"").replace(/\.$/,"");return a?r:`${"0"===r?"<0.001":r}`};e.s(["a",0,(e,n)=>{let a,i=(a=n*parseFloat((0,t.formatEther)(e)),r.format(a));return"$0.00"===i?"<$0.01":i},"b",0,(e,t,n=6,a=!1)=>`${i(e,n,a)} ${t}`,"c",0,(e,t)=>{let{chains:r}=(0,n.u)(),i=`https://etherscan.io/address/${t}`,o=`${(0,a.d)(e,r)}/address/${t}`;try{new URL(o)}catch{return i}return o},"g",0,(e,t)=>{let n,a=(n=t*parseFloat(e),r.format(n));return"$0.00"!==a?a:"<$0.01"},"p",0,i,"s",0,e=>e.reduce((e,t)=>e+t,0n)])},257701,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))});e.s(["default",0,n])},914783,e=>{"use strict";var t=e.i(177117),n=e.i(375675),a=e.i(771427),r=e.i(809681),i=e.i(790106),o=e.i(649082),s=e.i(312075);let l=n.styled.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,c=n.styled.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,d=n.styled.span`
  font-size: 10px;
`,u=n.styled.span`
  display: flex;
  align-items: center;
`,p=n.styled.a`
  &:hover {
    text-decoration: underline;
  }
`;e.s(["H",0,({weiQuantities:e,tokenPrice:n,tokenSymbol:a})=>{let i=(0,r.s)(e),o=n?(0,r.a)(i,n):void 0,s=(0,r.b)(i,a);return(0,t.jsx)(l,{children:o||s})},"P",0,({weiQuantities:e,tokenPrice:n,tokenSymbol:a})=>{let i=(0,r.s)(e),o=n?(0,r.a)(i,n):void 0,s=(0,r.b)(i,a);return(0,t.jsx)(l,{children:o?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c,{children:"USD"}),"<$0.01"===o?(0,t.jsxs)(u,{children:[(0,t.jsx)(d,{children:"<"}),"$0.01"]}):o]}):s})},"S",0,({quantities:e,tokenPrice:n,tokenSymbol:r="SOL",tokenDecimals:s=9})=>{let c=e.reduce((e,t)=>e+t,0n),p=n&&"SOL"===r&&9===s?(0,i.g)(c,n):void 0,m="SOL"===r&&9===s?(0,o.g)(c):`${(0,a.formatUnits)(c,s)} ${r}`;return(0,t.jsx)(l,{children:p?(0,t.jsx)(t.Fragment,{children:"<$0.01"===p?(0,t.jsxs)(u,{children:[(0,t.jsx)(d,{children:"<"}),"$0.01"]}):p}):m})},"W",0,e=>{var n,a;return(0,t.jsx)(p,{href:"ethereum"===e.chainType?(0,r.c)(e.chainId,e.walletAddress):(n=e.walletAddress,a=e.chainId,`https://explorer.solana.com/account/${n}?chain=${a}`),target:"_blank",children:(0,s.f)(e.walletAddress)})}])},154200,e=>{"use strict";var t=e.i(701983),n=e.i(376305);async function a({solanaClient:e,tx:r}){let i=(0,t.getBase64Decoder)().decode(await (0,n.g)(r)),{value:o}=await e.rpc.getFeeForMessage(i).send();return o??0n}async function r({solanaClient:e,tx:n,replaceRecentBlockhash:a}){let{value:i}=await e.rpc.simulateTransaction((0,t.getBase64Decoder)().decode(n),{commitment:"confirmed",encoding:"base64",sigVerify:!1,replaceRecentBlockhash:a}).send();if("BlockhashNotFound"===i.err&&a)throw Error("Simulation failed: Blockhash not found");return"BlockhashNotFound"===i.err?await r({solanaClient:e,tx:n,replaceRecentBlockhash:!0}):{logs:i.logs??[],error:i.err,hasError:!!i.err,hasFunds:i.logs?.every(e=>!/insufficient funds/gi.test(e)&&!/insufficient lamports/gi.test(e))??!0}}e.s(["f",0,a,"s",0,r])},453158,e=>{"use strict";var t=e.i(236710),n=e.i(4706),a=e.i(977886),r=e.i(454174),i=e.i(931763),o=e.i(701983),s=e.i(667643),l=globalThis.AbortController;function c({rpc:e,rpcSubscriptions:t}){return async function({abortSignal:r,commitment:i,signature:o}){let c=new l;r.addEventListener("abort",function(){c.abort()},{signal:c.signal});let d=await t.signatureNotifications(o,{commitment:i}).subscribe({abortSignal:c.signal}),u=(async()=>{for await(let e of d)if(!e.value.err)return;else throw(0,n.getSolanaErrorFromTransactionError)(e.value.err)})(),p=(async()=>{let{value:t}=await e.getSignatureStatuses([o]).send({abortSignal:c.signal}),r=t[0];if(r?.err)throw(0,n.getSolanaErrorFromTransactionError)(r.err);r?.confirmationStatus&&(0,a.commitmentComparator)(r.confirmationStatus,i)>=0||await new Promise(()=>{})})();try{return await (0,s.safeRace)([u,p])}finally{c.abort()}}}async function d({abortSignal:e,commitment:t}){return await new Promise((n,a)=>{e.addEventListener("abort",e=>{clearTimeout(i),a(new DOMException(e.target.reason,"AbortError"))});let r=performance.now(),i=setTimeout(()=>{let e=performance.now()-r;a(new DOMException(`Timeout elapsed after ${e} ms`,"TimeoutError"))},"processed"===t?3e4:6e4)})}async function u(e,t,n){let{abortSignal:a,commitment:r,getRecentSignatureConfirmationPromise:i}=t;a?.throwIfAborted();let o=new l;a&&a.addEventListener("abort",()=>{o.abort()},{signal:o.signal});try{let a=n({...t,abortSignal:o.signal});return await (0,s.safeRace)([i({abortSignal:o.signal,commitment:r,signature:e}),...a])}finally{o.abort()}}async function p(e){await u((0,i.getSignatureFromTransaction)(e.transaction),e,function({abortSignal:e,commitment:t,getNonceInvalidationPromise:n,transaction:a}){return[n({abortSignal:e,commitment:t,currentNonceValue:a.lifetimeConstraint.nonce,nonceAccountAddress:a.lifetimeConstraint.nonceAccountAddress})]})}async function m(e){await u((0,i.getSignatureFromTransaction)(e.transaction),e,function({abortSignal:e,commitment:t,getBlockHeightExceedencePromise:n,transaction:a}){return[n({abortSignal:e,commitment:t,lastValidBlockHeight:a.lifetimeConstraint.lastValidBlockHeight})]})}async function f(e){await u(e.signature,e,function({abortSignal:e,commitment:t,getTimeoutPromise:n}){return[n({abortSignal:e,commitment:t})]})}async function g({abortSignal:e,commitment:t,confirmSignatureOnlyTransaction:n,lamports:a,recipientAddress:r,rpc:i}){let o=await i.requestAirdrop(r,a,{commitment:t}).send({abortSignal:e});return await n({abortSignal:e,commitment:t,signature:o}),o}async function h(e,n,a){if(0===e.length)return{};let r=await (0,t.fetchJsonParsedAccounts)(n,e,a);return(0,t.assertAccountsDecoded)(r),(0,t.assertAccountsExist)(r),r.reduce((e,t)=>({...e,[t.address]:t.data.addresses}),{})}async function y(e,t,n){let a=("addressTableLookups"in e&&void 0!==e.addressTableLookups&&e.addressTableLookups.length>0?e.addressTableLookups:[]).map(e=>e.lookupTableAddress),{lastValidBlockHeight:i,...o}=n??{},s=a.length>0?await h(a,t,o):{};return(0,r.decompileTransactionMessage)(e,{addressesByLookupTableAddress:s,lastValidBlockHeight:i})}async function w({abortSignal:e,commitment:t,rpc:n,transaction:r,...o}){let s=(0,i.getBase64EncodedWireTransaction)(r);return await n.sendTransaction(s,{...!o?.preflightCommitment&&0>(0,a.commitmentComparator)(t,"finalized")?{...o,preflightCommitment:t}:o,encoding:"base64"}).send({abortSignal:e})}async function v({abortSignal:e,commitment:t,confirmDurableNonceTransaction:n,rpc:a,transaction:r,...i}){let o=await w({...i,abortSignal:e,commitment:t,rpc:a,transaction:r});return await n({abortSignal:e,commitment:t,transaction:r}),o}async function b({abortSignal:e,commitment:t,confirmRecentTransaction:n,rpc:a,transaction:r,...i}){let o=await w({...i,abortSignal:e,commitment:t,rpc:a,transaction:r});return await n({abortSignal:e,commitment:t,transaction:r}),o}e.s(["airdropFactory",0,function({rpc:e,rpcSubscriptions:t}){let n=c({rpc:e,rpcSubscriptions:t});async function a(e){await f({...e,getRecentSignatureConfirmationPromise:n,getTimeoutPromise:d})}return async function(t){return await g({...t,confirmSignatureOnlyTransaction:a,rpc:e})}},"decompileTransactionMessageFetchingLookupTables",0,y,"fetchAddressesForLookupTables",0,h,"getMinimumBalanceForRentExemption",0,function(e){return(128n+e)*3480n*2n},"sendAndConfirmDurableNonceTransactionFactory",0,function({rpc:e,rpcSubscriptions:t}){let r=function({rpc:e,rpcSubscriptions:t}){return async function({abortSignal:a,commitment:r,currentNonceValue:i,nonceAccountAddress:c}){let d=new l;a.addEventListener("abort",function(){d.abort()},{signal:d.signal});let u=await t.accountNotifications(c,{commitment:r,encoding:"base64"}).subscribe({abortSignal:d.signal}),p=(0,o.getBase58Decoder)(),m=(0,o.getBase64Encoder)(),f=(async()=>{for await(let e of u){let t=function([e]){let t=m.encode(e).slice(40,72);return p.decode(t)}(e.value.data);if(t!==i)throw new n.SolanaError(n.SOLANA_ERROR__INVALID_NONCE,{actualNonceValue:t,expectedNonceValue:i})}})(),g=(async()=>{let{value:t}=await e.getAccountInfo(c,{commitment:r,dataSlice:{length:32,offset:40},encoding:"base58"}).send({abortSignal:d.signal});if(!t)throw new n.SolanaError(n.SOLANA_ERROR__NONCE_ACCOUNT_NOT_FOUND,{nonceAccountAddress:c});let a=t.data[0];if(a!==i)throw new n.SolanaError(n.SOLANA_ERROR__INVALID_NONCE,{actualNonceValue:a,expectedNonceValue:i});await new Promise(()=>{})})();try{return await (0,s.safeRace)([f,g])}finally{d.abort()}}}({rpc:e,rpcSubscriptions:t}),d=c({rpc:e,rpcSubscriptions:t});async function u(t){var o;let s=(o=(0,i.getSignatureFromTransaction)(t.transaction),async function(t){try{return await r(t)}catch(r){if((0,n.isSolanaError)(r,n.SOLANA_ERROR__INVALID_NONCE)){let i;try{let{value:n}=await e.getSignatureStatuses([o]).send({abortSignal:t.abortSignal});i=n[0]}catch{throw r}if(null==i)throw r;if(null!==i.confirmationStatus&&(0,a.commitmentComparator)(i.confirmationStatus,t.commitment)>=0){if(null!==i.err)throw(0,n.getSolanaErrorFromTransactionError)(i.err);return}return await new Promise(()=>{})}throw r}});await p({...t,getNonceInvalidationPromise:s,getRecentSignatureConfirmationPromise:d})}return async function(t,n){await v({...n,confirmDurableNonceTransaction:u,rpc:e,transaction:t})}},"sendAndConfirmTransactionFactory",0,function({rpc:e,rpcSubscriptions:t}){let a=function({rpc:e,rpcSubscriptions:t}){return async function({abortSignal:a,commitment:r,lastValidBlockHeight:i}){a.throwIfAborted();let o=new l;async function s(){let{absoluteSlot:t,blockHeight:n}=await e.getEpochInfo({commitment:r}).send({abortSignal:o.signal});return{blockHeight:n,differenceBetweenSlotHeightAndBlockHeight:t-n}}a.addEventListener("abort",()=>{o.abort()},{signal:o.signal});try{let[e,{blockHeight:r,differenceBetweenSlotHeightAndBlockHeight:l}]=await Promise.all([t.slotNotifications().subscribe({abortSignal:o.signal}),s()]);a.throwIfAborted();let c=r;if(c<=i){let t=l;for await(let n of e){let{slot:e}=n;if(e-t>i){let{blockHeight:e,differenceBetweenSlotHeightAndBlockHeight:n}=await s();if((c=e)>i)break;t=n}}}throw a.throwIfAborted(),new n.SolanaError(n.SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED,{currentBlockHeight:c,lastValidBlockHeight:i})}finally{o.abort()}}}({rpc:e,rpcSubscriptions:t}),r=c({rpc:e,rpcSubscriptions:t});async function i(e){await m({...e,getBlockHeightExceedencePromise:a,getRecentSignatureConfirmationPromise:r})}return async function(t,n){await b({...n,confirmRecentTransaction:i,rpc:e,transaction:t})}},"sendTransactionWithoutConfirmingFactory",0,function({rpc:e}){return async function(t,n){await w({...n,rpc:e,transaction:t})}}],453158)},801965,e=>{"use strict";var t=e.i(177117),n=e.i(691983),a=e.i(795086),r=e.i(463475),i=e.i(68297),o=e.i(351190),s=e.i(144410),l=e.i(7991),c=e.i(375675),d=e.i(781929),u=e.i(642754),p=e.i(657545),m=e.i(129945),f=e.i(715097),g=e.i(529609),h=e.i(914783),y=e.i(328121),w=e.i(612780),v=e.i(981608),b=e.i(649082),x=e.i(184883),T=e.i(454174),S=e.i(931763),k=e.i(701983),A=e.i(453158),C=e.i(376305),E=e.i(790106),I=e.i(535218),L=e.i(154200);let j=c.styled.span`
  && {
    width: 82px;
    height: 82px;
    border-width: 4px;
    border-style: solid;
    border-color: ${e=>e.color??"var(--privy-color-accent)"};
    background-color: ${e=>e.color??"var(--privy-color-accent)"};
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
  }
`,O=({instruction:e,fees:n,transactionInfo:a,solPrice:r,chain:i})=>(0,t.jsxs)(f.R,{children:[a?.action&&(0,t.jsxs)(f.a,{children:[(0,t.jsx)(g.L,{children:"Action"}),(0,t.jsx)(g.V,{children:a.action})]}),null!=e?.total&&(0,t.jsxs)(f.a,{children:[(0,t.jsx)(g.L,{children:"Total"}),(0,t.jsx)(g.V,{children:e.total})]}),!e?.total&&null!=e?.amount&&(0,t.jsxs)(f.a,{children:[(0,t.jsx)(g.L,{children:"Total"}),(0,t.jsx)(g.V,{children:(0,t.jsx)(h.S,{quantities:[e.amount,n],tokenPrice:r})})]}),(0,t.jsxs)(f.a,{children:[(0,t.jsx)(g.L,{children:"Fees"}),(0,t.jsx)(g.V,{children:(0,t.jsx)(h.S,{quantities:[n],tokenPrice:r})})]}),e?.to&&(0,t.jsxs)(f.a,{children:[(0,t.jsx)(g.L,{children:"To"}),(0,t.jsx)(g.V,{children:(0,t.jsx)(h.W,{walletAddress:e.to,chainId:i,chainType:"solana"})})]})]}),F=({fees:e,onClose:n,receiptHeader:a,receiptDescription:r,transactionInfo:i,solPrice:o,signOnly:s,instruction:c,chain:f})=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.M,{onClose:n}),(0,t.jsx)(y.e,{style:{marginBottom:"16px"},children:(0,t.jsxs)("div",{children:[(0,t.jsx)(j,{color:"var(--privy-color-success-light)"}),(0,t.jsx)(l.default,{height:38,width:38,strokeWidth:2,stroke:"var(--privy-color-success)"})]})}),(0,t.jsx)(m.C,{title:a??`Transaction ${s?"signed":"complete"}!`,description:r??"You're all set."}),(0,t.jsx)(O,{solPrice:o,instruction:c,fees:e,transactionInfo:i,chain:f}),(0,t.jsx)(w.G,{}),(0,t.jsx)(P,{loading:!1,onClick:n,children:"Close"}),(0,t.jsx)(u.a,{}),(0,t.jsx)(p.B,{})]}),P=(0,c.styled)(d.P)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`;async function $(e,t){try{return await e}catch{return t}}async function N({privyClient:e,chain:t,mint:n}){let a=I.D[t];if(!a[n]){let r=await e.getSplTokenMetadata({mintAddress:n,cluster:function(e){switch(e){case"solana:mainnet":return"mainnet-beta";case"solana:devnet":return"devnet";case"solana:testnet":return"testnet"}}(t)});r&&(a[n]={address:n,symbol:r.symbol,decimals:r.decimals})}return a[n]}async function R({tx:e,solanaClient:t,privyClient:n,checkFunds:a}){let r=(0,T.getCompiledTransactionMessageDecoder)().decode(await (0,C.g)(e)),i=r.staticAccounts[0]??"",o=1===r.version?await $((0,L.f)({solanaClient:t,tx:e})):await (0,L.f)({solanaClient:t,tx:e}),s=a?await $((0,L.s)({solanaClient:t,tx:e})):void 0,l=s?.hasFunds??!0,c={},d=[],u=await async function({solanaClient:e,message:t}){if(!("addressTableLookups"in t)||!t.addressTableLookups)return[...t.staticAccounts];let n=t.addressTableLookups.map(e=>e.lookupTableAddress),a=await (0,A.fetchAddressesForLookupTables)(n,e.rpc),r=n.map((e,n)=>[...t.addressTableLookups[n]?.writableIndexes.map(t=>{let r=a[e]?.[t];if(r)return{key:r,isWritable:!0,altIdx:n}})??[],...t.addressTableLookups[n]?.readonlyIndexes.map(t=>{let r=a[e]?.[t];if(r)return{key:r,isWritable:!1,altIdx:n}})??[]]).flat().filter(e=>!!e).sort((e,t)=>e.isWritable!==t.isWritable?e.isWritable?-1:1:e.altIdx-t.altIdx).map(({key:e})=>e);return[...t.staticAccounts,...r]}({solanaClient:t,message:r});for(let e of"instructionHeaders"in r?r.instructionHeaders.map((e,t)=>{let n=r.instructionPayloads[t];return{programAddressIndex:e.programAccountIndex,accountIndices:n?.instructionAccountIndices,data:n?.instructionData}}):[...r.instructions]){let a=r.staticAccounts[e.programAddressIndex]||"";if(a!==I.T&&a!==I.a)if(a!==I.S){if(a===I.A){let t=await $(function(e,t,n){let[a,r,i,o]=e.accountIndices?.map(e=>t[e])??[];return{type:"ata-creation",program:n,payer:a,ata:r,owner:i,mint:o}}(e,u,a));if(!t){d.push({type:"unknown",program:a,discriminator:e.data?.[0]});continue}if(d.push(t),t.ata&&t.owner&&t.mint){c[t.ata]={owner:t.owner,mint:t.mint};continue}}if(I.R.includes(a)){let r=await $(M(e,u,t,n,a));if(!r){d.push({type:"unknown",program:a,discriminator:e.data?.[0]});continue}d.push(r)}else if(I.J.includes(a)){let r=await $(U(e,u,t,n,a));if(!r){d.push({type:"unknown",program:a,discriminator:e.data?.[0]});continue}d.push(r)}else d.push({type:"unknown",program:a,discriminator:e.data?.[0]})}else{let t=await $(B(e,u));if(!t){d.push({type:"unknown",program:a,discriminator:e.data?.[0]});continue}d.push(t)}else{let r=await $(D(e,u,t,n,c,a));if(!r){d.push({type:"unknown",program:a,discriminator:e.data?.[0]});continue}d.push(r),"spl-transfer"===r.type&&(r.fromAta&&r.fromAccount&&r.token.address&&(c[r.fromAta]??={owner:r.fromAccount,mint:r.token.address}),r.toAta&&r.toAccount&&r.token.address&&(c[r.toAta]??={owner:r.toAccount,mint:r.token.address}))}}return{spender:i,fee:o,instructions:d,hasFunds:!!l}}function _(e,t=0){try{return function(e,t=0){let n=0n;for(let a=0;a<8;a++)n|=BigInt(e[t+a])<<BigInt(8*a);return n}(e,t)}catch{}try{return e.readBigInt64LE(t)}catch{}let n=(0,C.d)(e);try{return((e,t=0)=>{let n=e[t],a=e[t+7];if(!n||!a)throw Error(`Buffer offset out of range: first: ${n}, last: ${a}.`);return(BigInt(e[t+4]+256*e[t+5]+65536*e[t+6]+(a<<24))<<32n)+BigInt(n+256*e[++t]+65536*e[++t]+0x1000000*e[++t])})(n)}catch{}try{return n.subarray(t).readBigInt64LE()}catch{}try{return n.readBigInt64LE(t)}catch{}return 0n}async function D(e,t,n,a,r,i){let o=e.data?.[0],s=e.accountIndices?.map(e=>t[e])??[];if(1===o){let[e,t,n]=s;return{type:"spl-init-account",program:i,account:e,mint:t,owner:n}}if(3===o){let t,o,[l,c,d]=s,u="",p=c?r[c]:void 0;if(p)t=p.owner,u=p.mint;else if(c){let e=await n.rpc.getAccountInfo(c,{commitment:"confirmed",encoding:"jsonParsed"}).send(),a=e.value?.data;t=a?.parsed?.info?.owner,u=a?.parsed?.info?.mint??"",o=a?.parsed?.info?.tokenAmount?.decimals}if(!u&&l){let e=await n.rpc.getAccountInfo(l,{commitment:"confirmed",encoding:"jsonParsed"}).send(),t=e.value?.data;u=t?.parsed?.info?.mint??""}let m=await N({privyClient:a,chain:n.chain,mint:u}),f=m?.symbol??"";return o??=m?.decimals??9,{type:"spl-transfer",program:i,fromAta:l,fromAccount:d,toAta:c,toAccount:t,value:_(e.data,1),token:{symbol:f,decimals:o,address:u}}}if(9===o){let[e,t,n]=s;return{type:"spl-close-account",program:i,source:e,destination:t,owner:n}}if(17===o)return{type:"spl-sync-native",program:i};throw Error(`Token program instruction type ${o} not supported`)}async function B(e,t){let n=e.data?.[0],a=e.accountIndices?.map(e=>t[e])??[];if(0===n){let[,t]=a;return{type:"create-account",program:I.S,account:t?.toString(),value:_(e.data,4),withSeed:!1}}if(2===n){let[t,n]=a;return{type:"sol-transfer",program:I.S,fromAccount:t,toAccount:n,token:{symbol:"SOL",decimals:9},value:_(e.data,4),withSeed:!1}}if(3===n){let[,t]=a;return{type:"create-account",program:I.S,account:t,withSeed:!0,value:_(e.data.slice(e.data.length-32-8-8))}}if(11===n){let[t,n,r]=a;if(!t||!n||!r)throw Error("TransferWithSeed requires source, base signer, and destination accounts");return{type:"sol-transfer",program:I.S,fromAccount:t,toAccount:r,value:_(e.data,4),token:{symbol:"SOL",decimals:9},withSeed:!0}}throw Error(`System program instruction type ${n} not supported`)}async function M(e,t,n,a,r){let i=e.accountIndices?.map(e=>t[e])??[],o=e.data?.[0];if(143===o){let t=i[10],o=i[11];return{type:"raydium-swap-base-input",program:r,mintIn:t,mintOut:o,tokenIn:t?await N({privyClient:a,chain:n.chain,mint:t}):void 0,tokenOut:o?await N({privyClient:a,chain:n.chain,mint:o}):void 0,amountIn:_(e.data,8),minimumAmountOut:_(e.data,16)}}if(55===o){let t=i[10],o=i[11];return{type:"raydium-swap-base-output",program:r,mintIn:t,mintOut:o,tokenIn:t?await N({privyClient:a,chain:n.chain,mint:t}):void 0,tokenOut:o?await N({privyClient:a,chain:n.chain,mint:o}):void 0,maxAmountIn:_(e.data,8),amountOut:_(e.data,16)}}throw Error(`Raydium swap program instruction type ${o} not supported`)}async function U(e,t,n,a,r){let i=e.data?.[0],o=e.accountIndices?.map(e=>t[e])??[];if([208,51,239,151,123,43,237,92].includes(i)){let t=o[5],i=o[6];return{type:"jupiter-swap-exact-out-route",program:r,mintIn:t,mintOut:i,tokenIn:t?await N({privyClient:a,chain:n.chain,mint:t}):void 0,tokenOut:i?await N({privyClient:a,chain:n.chain,mint:i}):void 0,outAmount:_(e.data,e.data.length-1-2-8-8),quotedInAmount:_(e.data,e.data.length-1-2-8)}}if([176,209,105,168,154,125,69,62].includes(i)){let t=o[7],i=o[8];return{type:"jupiter-swap-exact-out-route",program:r,mintIn:t,mintOut:i,tokenIn:t?await N({privyClient:a,chain:n.chain,mint:t}):void 0,tokenOut:i?await N({privyClient:a,chain:n.chain,mint:i}):void 0,outAmount:_(e.data,e.data.length-1-2-8-8),quotedInAmount:_(e.data,e.data.length-1-2-8)}}if([193,32,155,51,65,214,156,129].includes(i)){let t=o[7],i=o[8];return{type:"jupiter-swap-shared-accounts-route",program:r,mintIn:t,mintOut:i,tokenIn:t?await N({privyClient:a,chain:n.chain,mint:t}):void 0,tokenOut:i?await N({privyClient:a,chain:n.chain,mint:i}):void 0,inAmount:_(e.data,e.data.length-1-2-8-8),quotedOutAmount:_(e.data,e.data.length-1-2-8)}}throw[62,198,214,193,213,159,108,210].includes(i)&&console.warn("Jupiter swap program instruction 'claim' not implemented"),[116,206,27,191,166,19,0,73].includes(i)&&console.warn("Jupiter swap program instruction 'claim_token' not implemented"),[26,74,236,151,104,64,183,249].includes(i)&&console.warn("Jupiter swap program instruction 'close_token' not implemented"),[229,194,212,172,8,10,134,147].includes(i)&&console.warn("Jupiter swap program instruction 'create_open_orders' not implemented"),[28,226,32,148,188,136,113,171].includes(i)&&console.warn("Jupiter swap program instruction 'create_program_open_orders' not implemented"),[232,242,197,253,240,143,129,52].includes(i)&&console.warn("Jupiter swap program instruction 'create_token_ledger' not implemented"),[147,241,123,100,244,132,174,118].includes(i)&&console.warn("Jupiter swap program instruction 'create_token_account' not implemented"),[229,23,203,151,122,227,173,42].includes(i)&&console.warn("Jupiter swap program instruction 'route' not implemented"),[150,86,71,116,167,93,14,104].includes(i)&&console.warn("Jupiter swap program instruction 'route_with_token_ledger' not implemented"),[228,85,185,112,78,79,77,2].includes(i)&&console.warn("Jupiter swap program instruction 'set_token_ledger' not implemented"),[230,121,143,80,119,159,106,170].includes(i)&&console.warn("Jupiter swap program instruction 'shared_accounts_route_with_token_ledger' not implemented"),Error(`Jupiter swap program instruction type ${i} not supported`)}let q="Fee unavailable",H={component:()=>{let{data:e,onUserCloseViaDialogOrKeybindRef:l,setModalData:c,navigate:d}=(0,r.b)(),{client:u,closePrivyModal:p,walletProxy:m,showFiatPrices:f}=(0,i.u)(),g=(0,r.u)(),{user:h}=(0,r.a)(),y=(0,C.c)()(e?.standardSignAndSendTransaction?.chain??"solana:mainnet"),[w,A]=(0,n.useState)(e?.standardSignAndSendTransaction?.transaction),[I,L]=(0,n.useState)(),[j,O]=(0,n.useState)(),[P,$]=(0,n.useState)({value:0n,isLoading:!1}),[N,_]=(0,n.useState)(!1),[D,B]=(0,n.useState)({}),[M,U]=(0,n.useState)(),H=e?.standardSignAndSendTransaction?.account,V=!!e?.standardSignAndSendTransaction?.signOnly,J=!!e?.standardSignAndSendTransaction?.isSponsored,W=H?.imported?(0,r.s)(h).find(e=>e.address===H.address):(0,r.i)(h),{solPrice:z,isSolPriceLoading:G}=(0,o.u)({enabled:f}),Z=(0,n.useMemo)(()=>{if(!I)return;let e=I.spender,t=void 0===I.fee?q:(0,b.g)(I.fee),n=(0,b.g)(P.value,3,!0),r=I.instructions.filter(e=>["sol-transfer","spl-transfer","raydium-swap-base-input","raydium-swap-base-output","jupiter-swap-shared-accounts-route","jupiter-swap-exact-out-route"].includes(e.type)),i=r.at(0);return!i||r.length>1?{fee:t,spender:e,balance:n}:"sol-transfer"===i.type?{fee:t,spender:e,balance:n,total:(0,b.g)(i.value)}:"spl-transfer"===i.type?{fee:t,spender:e,balance:n,total:`${(0,a.formatTokenAmount)({amount:i.value,decimals:i.token.decimals})} ${i.token.symbol}`}:"raydium-swap-base-input"===i.type&&i.tokenIn&&i.tokenOut?{fee:t,spender:e,balance:n,swap:`${(0,a.formatTokenAmount)({amount:i.amountIn,decimals:i.tokenIn.decimals})} ${i.tokenIn.symbol} → ${(0,a.formatTokenAmount)({amount:i.minimumAmountOut,decimals:i.tokenOut.decimals})} ${i.tokenOut.symbol}`}:"raydium-swap-base-output"===i.type&&i.tokenIn&&i.tokenOut?{fee:t,spender:e,balance:n,swap:`${(0,a.formatTokenAmount)({amount:i.maxAmountIn,decimals:i.tokenIn.decimals})} ${i.tokenIn.symbol} → ${(0,a.formatTokenAmount)({amount:i.amountOut,decimals:i.tokenOut.decimals})} ${i.tokenOut.symbol}`}:"jupiter-swap-shared-accounts-route"===i.type&&i.tokenIn&&i.tokenOut?{fee:t,spender:e,balance:n,swap:`${(0,a.formatTokenAmount)({amount:i.inAmount,decimals:i.tokenIn.decimals})} ${i.tokenIn.symbol} → ${(0,a.formatTokenAmount)({amount:i.quotedOutAmount,decimals:i.tokenOut.decimals})} ${i.tokenOut.symbol}`}:"jupiter-swap-exact-out-route"===i.type&&i.tokenIn&&i.tokenOut?{fee:t,spender:e,balance:n,swap:`${(0,a.formatTokenAmount)({amount:i.quotedInAmount,decimals:i.tokenIn.decimals})} ${i.tokenIn.symbol} → ${(0,a.formatTokenAmount)({amount:i.outAmount,decimals:i.tokenOut.decimals})} ${i.tokenOut.symbol}`}:{fee:t,spender:e,balance:n}},[I,H?.address,P]),Y=(0,n.useMemo)(()=>{let e;if(!I||!f||!z||G)return;function t(...e){return(0,E.g)(e.reduce((e,t)=>e+t,0n),z??0)}let n=H?.address===I.spender;n&&(e=void 0===I.fee?q:t(I.fee));let r=t(P.value),i=I.instructions.filter(e=>"sol-transfer"===e.type||"spl-transfer"===e.type).at(0);return!i||I.instructions.length>1?{fee:e,balance:r}:"sol-transfer"===i.type?n&&void 0===I.fee?{fee:e,balance:r}:{fee:e,balance:r,total:t(i.value,n?I.fee??0n:0n)}:"spl-transfer"===i.type?{fee:e,balance:r,total:`${(0,a.formatTokenAmount)({amount:i.value,decimals:i.token.decimals})} ${i.token.symbol}`}:{fee:e,balance:r}},[I,f,z,G,H?.address,P]);if((0,n.useEffect)(()=>{!async function(){if(w&&u)try{O(void 0);let e=await R({tx:w,solanaClient:y,privyClient:u,checkFunds:!V&&!J});L(e)}catch(e){console.error("Failed to prepare transaction",e),O(e)}}()},[w,y,u,V]),(0,n.useEffect)(()=>{(async function(){if(!H)return;$({value:P.value,isLoading:!0});let{value:e}=await y.rpc.getBalance(H.address,{commitment:"confirmed"}).send();$({value:e??0n,isLoading:!1})})().catch(console.error)},[I]),!w||!e?.standardSignAndSendTransaction||!H){let n=Error("Invalid transaction request");return(0,t.jsx)(s.ErrorScreenView,{error:n,allowlistConfig:g.allowlistConfig,onRetry:()=>{e?.standardSignAndSendTransaction?.onFailure(n),p({shouldCallAuthOnSuccess:!1})}})}let K=()=>{if(!N)return D.signature||D.signedTransaction?e?.standardSignAndSendTransaction?.onSuccess({signature:D.signature,signedTransaction:D.signedTransaction}):e?.standardSignAndSendTransaction?.onFailure(M??j??Error("User exited the modal before submitting the transaction")),p({shouldCallAuthOnSuccess:!1})};l.current=K;let Q=e.standardSignAndSendTransaction?.uiOptions?.transactionInfo?.contractInfo?.imgUrl?(0,t.jsx)("img",{src:e.standardSignAndSendTransaction.uiOptions.transactionInfo.contractInfo.imgUrl,alt:e.standardSignAndSendTransaction.uiOptions.transactionInfo.contractInfo.imgAltText}):null,X=!!(e.funding&&e.funding.supportedOptions.length>0),ee=!I?.hasFunds&&X&&!J;if(D.signature||D.signedTransaction){let n=I?.instructions.filter(e=>"sol-transfer"===e.type||"spl-transfer"===e.type),a=1===n?.length?n?.at(0):void 0;return(0,t.jsx)(F,{fees:D.fees??0n,onClose:K,transactionInfo:e.standardSignAndSendTransaction?.uiOptions.transactionInfo,solPrice:z,receiptHeader:e.standardSignAndSendTransaction?.uiOptions.successHeader,receiptDescription:e.standardSignAndSendTransaction?.uiOptions.successDescription,chain:y.chain,signOnly:V,instruction:"sol-transfer"===a?.type?{to:a.toAccount,amount:a.value}:{to:a?.toAccount||a?.toAta,total:Z?.total}})}return M?(0,t.jsx)(v.T,{transactionError:M,chainId:y.chain,onClose:K,chainType:"solana",onRetry:async()=>{U(void 0);let{value:e}=await y.rpc.getLatestBlockhash().send();A(await async function(e,t){let n=await (0,C.g)(e);return(0,x.pipe)((0,T.getCompiledTransactionMessageDecoder)().decode(n),e=>(0,T.decompileTransactionMessage)(e),e=>(0,T.setTransactionMessageLifetimeUsingBlockhash)(t,e),e=>(0,S.compileTransaction)(e),e=>new Uint8Array((0,S.getTransactionEncoder)().encode(e)))}(w,e))}}):(0,t.jsx)(v.S,{img:Q,title:e.standardSignAndSendTransaction?.uiOptions?.transactionInfo?.title||"Confirm transaction",subtitle:e.standardSignAndSendTransaction?.uiOptions?.description||`${g.name} wants your permission to approve the following transaction.`,cta:ee?"Add funds":e.standardSignAndSendTransaction?.uiOptions?.buttonText||"Approve",instructions:I?.instructions??[],network:"solana:mainnet"==y.chain?"Solana":y.chain.replace("solana:",""),blockExplorerUrl:y.blockExplorerUrl,total:f?Y?.total:Z?.total,fee:f?Y?.fee:Z?.fee,balance:f?Y?.balance:Z?.balance,swap:Z?.swap,transactingWalletAddress:H.address,disabled:!I?.hasFunds&&!X,isSubmitting:N,isPreparing:!I||P.isLoading,isTokenPriceLoading:f&&G,isMissingFunds:!I?.hasFunds,submitError:M??void 0,isSponsored:!!e.standardSignAndSendTransaction?.isSponsored,parseError:j,onClick:ee?async()=>{if(!H)return;if(!X)throw Error("Funding wallet is not enabled");let t="FundingMethodSelectionScreen";c({...e,funding:{...e.funding,methodScreen:t},solanaFundingData:e?.solanaFundingData}),d(t)}:async()=>{try{if(_(!0),N||!H||!m||!h||!W)return;let t=await e.standardSignAndSendTransaction.onConfirm(w);if("signature"in t){let e=await async function({solanaClient:e,signature:t}){let n=(0,k.getBase58Decoder)().decode(t),a=await e.rpc.getTransaction(n,{maxSupportedTransactionVersion:1,commitment:"confirmed",encoding:"base64"}).send().catch(()=>null);return a?{fee:a.meta?.fee??0n}:null}({solanaClient:y,signature:t.signature});return void B({...t,fees:e?.fee})}B(t)}catch(e){console.warn({transaction:w,error:e}),U(e)}finally{_(!1)}},onClose:K})}};e.s(["StandardSignAndSendTransactionScreen",0,H,"default",0,H])}]);