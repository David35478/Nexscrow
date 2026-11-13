(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,708093,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},i){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))});e.s(["default",0,n])},608980,e=>{"use strict";var t=e.i(691983),n=e.i(215097),a=e.i(463475),i=e.i(68297),r=e.i(351190);e.s(["u",0,function(e){let{tokenPrice:s,isTokenPriceLoading:o,tokenPriceError:l}=(e=>{let{showFiatPrices:r,getUsdTokenPrice:s,chains:o}=(0,i.u)(),[l,d]=(0,t.useState)(!0),[c,u]=(0,t.useState)(void 0),[p,y]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{e||=a.C;let t=(0,n.addToDefaultChains)(o).find(t=>t.id===Number(e));(async()=>{if(r){if(!t)return d(!1),u(Error(`Unable to fetch token price on chain id ${e}`));try{d(!0);let e=await s(t);e?y(e):u(Error(`Unable to fetch token price on chain id ${t.id}`))}catch(e){u(e)}finally{d(!1)}}else d(!1)})()},[e]),{tokenPrice:p,isTokenPriceLoading:l,tokenPriceError:c}})("solana"===e?-1:e),{solPrice:d,isSolPriceLoading:c,solPriceError:u}=(0,r.u)({enabled:"solana"===e});return"solana"===e?{tokenPrice:d,isTokenPriceLoading:c,tokenPriceError:u}:{tokenPrice:s,isTokenPriceLoading:o,tokenPriceError:l}}])},938467,346242,e=>{"use strict";var t=e.i(177117),n=e.i(375675);n.styled.label`
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
`,i=n.styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
`,r=n.styled.input.attrs({type:"checkbox"})`
  border: 0;
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`,s=n.styled.div`
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

  ${r}:focus + & {
    box-shadow: 0 0 0 1px ${e=>e.color};
  }

  ${i} {
    visibility: ${e=>e.checked?"visible":"hidden"};
  }
`;e.s(["C",0,({className:e,checked:n,color:o="var(--privy-color-accent)",...l})=>(0,t.jsx)("label",{children:(0,t.jsxs)(a,{className:e,children:[(0,t.jsx)(r,{checked:n,...l}),(0,t.jsx)(s,{color:o,checked:n,children:(0,t.jsx)(i,{viewBox:"0 0 24 24",children:(0,t.jsx)("polyline",{points:"20 6 9 17 4 12"})})})]})})],938467);var o=e.i(691983);let l=o.forwardRef(function({title:e,titleId:t,...n},a){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},n),e?o.createElement("title",{id:t},e):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"}))});e.s(["default",0,l],346242)},815119,e=>{"use strict";var t=e.i(375675);let n=t.styled.span`
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
`;e.s(["L",0,a])},573486,e=>{"use strict";var t=e.i(691983),n=e.i(859427);let a="0x0000000000000000000000000000000000000000",i="https://api.relay.link",r="https://api.testnets.relay.link",s=async({input:e,isTestnet:t})=>{let n=await fetch((t?r:i)+"/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),a=await n.json();if(!(n.ok||"string"==typeof a.message&&a.message.startsWith("Invalid address")))throw console.error("Relay error:",a),Error(a.message??"Error fetching quote from relay");return a};async function o({requestId:e,isTestnet:t}){let n=await fetch((t?r:i)+"/intents/status/v3?requestId="+encodeURIComponent(e)),a=await n.json();if(!n.ok){if("message"in a&&"string"==typeof a.message)throw Error(a.message);throw Error("Error fetching request from relay")}switch(a.status){case"refund":case"waiting":case"success":return a.status;case"failure":return a.refundFailReason?"failure":"pending";case"delayed":case"pending":case"depositing":case"submitted":case"unknown":return"pending";default:return console.warn(`Unexpected Relay request status: ${a.status}`),"pending"}}class l extends n.P{constructor(e,t){super("We were unable to complete the bridging transaction. Funds will be refunded on your wallet.",void 0,n.c.TRANSACTION_FAILURE),this.relayLink=t?`https://testnets.relay.link/transaction/${e}`:`https://relay.link/transaction/${e}`}}e.s(["R",0,l,"a",0,e=>{let t=e.steps[0],n=t?.items?.[0];if(t&&n)return{from:n.data.from,to:n.data.to,value:Number(n.data.value),chainId:Number(n.data.chainId),data:n.data.data,requestId:t.requestId}},"b",0,"11111111111111111111111111111111","c",0,0x2f3fb341,"d",0,e=>e.steps.flatMap(({requestId:e,items:t=[]})=>t.filter(({status:e})=>"incomplete"===e).map(({data:{from:t,to:n,value:a,chainId:i,data:r}})=>({from:t,to:n,value:Number(a),chainId:Number(i),data:r,requestId:e}))),"e",0,"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","g",0,s,"t",0,({appId:e,originCurrency:t,destinationCurrency:n,...i})=>({tradeType:"EXPECTED_OUTPUT",originCurrency:t??a,destinationCurrency:n??a,referrer:`privy|${e}`,...i}),"u",0,function({transactionHash:e,requestId:n,isTestnet:a,bridgingStatus:i,setBridgingStatus:r,onSuccess:s,onFailure:d}){(0,t.useEffect)(()=>{if(e&&i){if(!n)return console.error("Relay quote has no requestId, so the bridge status cannot be polled"),void d({error:new l(e,a)});if(["delayed","waiting","pending"].includes(i)){let e=setInterval(async()=>{try{let e=await o({requestId:n,isTestnet:a});r(e)}catch(e){console.error(e)}},1e3);return()=>clearInterval(e)}"success"===i?s({transactionHash:e}):["refund","failure"].includes(i)&&d({error:new l(e,a)})}},[i,e,n,a])}])},333882,e=>{"use strict";let t=(0,e.i(319546).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],333882)},969002,e=>{"use strict";let t=(0,e.i(319546).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,t],969002)},468478,e=>{"use strict";let t=new Set(["https:","mailto:"]);e.s(["t",0,function(e){if(!e)return null;try{if(t.has(new URL(e).protocol))return e}catch{}return null}])},144410,e=>{"use strict";var t=e.i(177117),n=e.i(333882);let a=(0,e.i(319546).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);var i=e.i(969002),r=e.i(375675),s=e.i(463475),o=e.i(334240),l=e.i(859427),d=e.i(573486),c=e.i(468478),u=e.i(962537);let p=({error:e,allowlistConfig:r,onRetry:s,onCaptchaReset:p,onBack:y})=>{let f=((e,r)=>{if(e instanceof d.R)return{title:"Transaction failed",detail:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{children:e.message}),(0,t.jsxs)("span",{children:[" ","Check the"," ",(0,t.jsx)(m,{href:e.relayLink,target:"_blank",children:"refund status"}),"."]})]}),ctaText:"Try again",icon:n.AlertTriangle};if(e instanceof l.P)switch(e.privyErrorCode){case l.c.CLIENT_REQUEST_TIMEOUT:return{title:"Timed out",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle};case l.c.INSUFFICIENT_BALANCE:return{title:"Insufficient balance",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle};case l.c.TRANSACTION_FAILURE:return{title:"Transaction failure",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:n.AlertTriangle}}if(e instanceof o.P&&"twilio_verification_failed"===e.type)return{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:a};if(!(e instanceof l.b))return e instanceof l.d&&e.status&&[400,422].includes(e.status)?{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:n.AlertTriangle}:{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:n.AlertTriangle};switch(e.privyErrorCode){case l.c.INVALID_CAPTCHA:return{title:"Something went wrong",detail:"Please try again.",ctaText:"Try again",icon:n.AlertTriangle};case l.c.DISALLOWED_LOGIN_METHOD:return{title:"Not allowed",detail:e.message,ctaText:"Try another method",icon:n.AlertTriangle};case l.c.ALLOWLIST_REJECTED:return{title:r.errorTitle||"You don't have access to this app",detail:r.errorDetail||"Have you been invited?",ctaText:r.errorCtaText||"Try another account",icon:i.Lock};case l.c.CAPTCHA_FAILURE:return{title:"Something went wrong",detail:"You did not pass CAPTCHA. Please try again.",ctaText:"Try again",icon:null};case l.c.CAPTCHA_TIMEOUT:return{title:"Something went wrong",detail:"Something went wrong! Please try again later.",ctaText:"Try again",icon:null};case l.c.LINKED_TO_ANOTHER_USER:return{title:"Authentication failed",detail:"This account has already been linked to another user.",ctaText:"Try again",icon:n.AlertTriangle};case l.c.NOT_SUPPORTED:return{title:"This region is not supported",detail:"SMS authentication from this region is not available",ctaText:"Try another method",icon:n.AlertTriangle};case l.c.TOO_MANY_REQUESTS:return{title:"Request failed",detail:"Too many attempts.",ctaText:"Try again later",icon:n.AlertTriangle};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:n.AlertTriangle}}})(e,r);return(0,t.jsx)(u.S,{title:f.title,subtitle:f.detail,icon:f.icon,onBack:y,iconVariant:"error",primaryCta:{label:f.ctaText,onClick:()=>{if(e instanceof l.b&&(e.privyErrorCode===l.c.INVALID_CAPTCHA&&p?.(),e.privyErrorCode===l.c.ALLOWLIST_REJECTED)){let e=(0,c.t)(r.errorCtaLink);if(e)return void window.open(e,"_blank","noopener,noreferrer")}s?.()},variant:"error"},watermark:!0})},y={component:()=>{let{navigate:e,data:n,lastScreen:a,currentScreen:i}=(0,s.b)(),r=(0,s.u)(),{reset:l}=(0,o.a)(),d=n?.errorModalData?.previousScreen||(a===i?void 0:a);return(0,t.jsx)(p,{error:n?.errorModalData?.error||Error(),allowlistConfig:r.allowlistConfig,onRetry:()=>{e(d||"LandingScreen",!1)},onCaptchaReset:l})}},m=r.styled.a`
  color: var(--privy-color-accent) !important;
  font-weight: 600;
`;e.s(["ErrorScreen",0,y,"ErrorScreenView",0,p,"default",0,y],144410)},790106,535218,e=>{"use strict";e.s(["A",0,"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","D",0,{"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}},"J",0,["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],"L",0,1e9,"R",0,["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],"S",0,"11111111111111111111111111111111","T",0,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","a",0,"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"],535218);let t=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2});e.s(["g",0,function(e,n){let a=parseFloat(e.toString())/1e9,i=t.format(n*a);return"$0.00"===i?"<$0.01":i}],790106)},649082,e=>{"use strict";var t=e.i(790106);function n(e,t=6,a=!1,i=!1){let r=(parseFloat(e.toString())/1e9).toFixed(t).replace(/0+$/,"").replace(/\.$/,""),s=i?"":" SOL";return a?`${r}${s}`:`${"0"===r?"<0.001":r}${s}`}e.s(["a",0,function({amount:e,fee:a,tokenPrice:i,isUsdc:r}){let s=BigInt(Math.floor(parseFloat(e)*10**(r?6:9))),o=r?s:s+a;return{fundingAmountInBaseUnit:s,fundingAmountInUsd:i?(0,t.g)(s,i):void 0,totalPriceInUsd:i?(0,t.g)(o,i):void 0,totalPriceInNativeCurrency:n(o),feePriceInNativeCurrency:n(a),feePriceInUsd:i?(0,t.g)(a,i):void 0}},"g",0,n])},642754,e=>{"use strict";var t=e.i(375675);let n=t.styled.div`
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
`,i=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,r=(0,t.styled)(a)`
  padding: 20px 0;
`,s=(0,t.styled)(a)`
  gap: 16px;
`,o=t.styled.div`
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
`;let d=t.styled.div`
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
`,c=t.styled.div`
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
`,e.s(["B",0,n,"C",0,s,"F",0,l,"H",0,i,"R",0,c,"S",0,d,"a",0,u,"b",0,p,"c",0,o,"d",0,r,"e",0,a])},351190,e=>{"use strict";var t=e.i(691983),n=e.i(68297);e.s(["u",0,({enabled:e=!0}={})=>{let{showFiatPrices:a,getUsdPriceForSol:i}=(0,n.u)(),[r,s]=(0,t.useState)(!0),[o,l]=(0,t.useState)(void 0),[d,c]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{(async()=>{if(a&&e)try{s(!0);let e=await i();e?c(e):l(Error("Unable to fetch SOL price"))}catch(e){l(e)}finally{s(!1)}else s(!1)})()},[]),{solPrice:d,isSolPriceLoading:r,solPriceError:o}}])},809681,e=>{"use strict";var t=e.i(368207),n=e.i(68297),a=e.i(312075);let i=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2}),r=(e,n=6,a=!1)=>{let i=parseFloat((0,t.formatEther)(e)).toFixed(n).replace(/0+$/,"").replace(/\.$/,"");return a?i:`${"0"===i?"<0.001":i}`};e.s(["a",0,(e,n)=>{let a,r=(a=n*parseFloat((0,t.formatEther)(e)),i.format(a));return"$0.00"===r?"<$0.01":r},"b",0,(e,t,n=6,a=!1)=>`${r(e,n,a)} ${t}`,"c",0,(e,t)=>{let{chains:i}=(0,n.u)(),r=`https://etherscan.io/address/${t}`,s=`${(0,a.d)(e,i)}/address/${t}`;try{new URL(s)}catch{return r}return s},"g",0,(e,t)=>{let n,a=(n=t*parseFloat(e),i.format(n));return"$0.00"!==a?a:"<$0.01"},"p",0,r,"s",0,e=>e.reduce((e,t)=>e+t,0n)])},257701,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},i){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))});e.s(["default",0,n])},914783,e=>{"use strict";var t=e.i(177117),n=e.i(375675),a=e.i(771427),i=e.i(809681),r=e.i(790106),s=e.i(649082),o=e.i(312075);let l=n.styled.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,d=n.styled.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,c=n.styled.span`
  font-size: 10px;
`,u=n.styled.span`
  display: flex;
  align-items: center;
`,p=n.styled.a`
  &:hover {
    text-decoration: underline;
  }
`;e.s(["H",0,({weiQuantities:e,tokenPrice:n,tokenSymbol:a})=>{let r=(0,i.s)(e),s=n?(0,i.a)(r,n):void 0,o=(0,i.b)(r,a);return(0,t.jsx)(l,{children:s||o})},"P",0,({weiQuantities:e,tokenPrice:n,tokenSymbol:a})=>{let r=(0,i.s)(e),s=n?(0,i.a)(r,n):void 0,o=(0,i.b)(r,a);return(0,t.jsx)(l,{children:s?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d,{children:"USD"}),"<$0.01"===s?(0,t.jsxs)(u,{children:[(0,t.jsx)(c,{children:"<"}),"$0.01"]}):s]}):o})},"S",0,({quantities:e,tokenPrice:n,tokenSymbol:i="SOL",tokenDecimals:o=9})=>{let d=e.reduce((e,t)=>e+t,0n),p=n&&"SOL"===i&&9===o?(0,r.g)(d,n):void 0,y="SOL"===i&&9===o?(0,s.g)(d):`${(0,a.formatUnits)(d,o)} ${i}`;return(0,t.jsx)(l,{children:p?(0,t.jsx)(t.Fragment,{children:"<$0.01"===p?(0,t.jsxs)(u,{children:[(0,t.jsx)(c,{children:"<"}),"$0.01"]}):p}):y})},"W",0,e=>{var n,a;return(0,t.jsx)(p,{href:"ethereum"===e.chainType?(0,i.c)(e.chainId,e.walletAddress):(n=e.walletAddress,a=e.chainId,`https://explorer.solana.com/account/${n}?chain=${a}`),target:"_blank",children:(0,o.f)(e.walletAddress)})}])},762406,e=>{"use strict";var t=e.i(177117),n=e.i(375675),a=e.i(914783),i=e.i(809681),r=e.i(642754),s=e.i(257701),o=e.i(691983),l=e.i(463475);let d=({label:e,children:n,valueStyles:a})=>(0,t.jsxs)(c,{children:[(0,t.jsx)("div",{children:e}),(0,t.jsx)(u,{style:{...a},children:n})]}),c=n.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > :first-child {
    color: var(--privy-color-foreground-3);
    text-align: left;
  }

  > :last-child {
    color: var(--privy-color-foreground-2);
    text-align: right;
  }
`,u=n.styled.div`
  font-size: 14px;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-2);
  padding: 4px 8px;
`,p=({gas:e,tokenPrice:n,tokenSymbol:s})=>(0,t.jsxs)(r.c,{style:{paddingBottom:"12px"},children:[(0,t.jsxs)(m,{children:[(0,t.jsx)(h,{children:"Est. Fees"}),(0,t.jsx)("div",{children:(0,t.jsx)(a.P,{weiQuantities:[BigInt(e)],tokenPrice:n,tokenSymbol:s})})]}),n&&(0,t.jsx)(f,{children:`${(0,i.b)(BigInt(e),s)}`})]}),y=({value:e,gas:n,tokenPrice:s,tokenSymbol:o})=>{let l=BigInt(e??0)+BigInt(n);return(0,t.jsxs)(r.c,{children:[(0,t.jsxs)(m,{children:[(0,t.jsx)(h,{children:"Total (including fees)"}),(0,t.jsx)("div",{children:(0,t.jsx)(a.P,{weiQuantities:[BigInt(e||0),BigInt(n)],tokenPrice:s,tokenSymbol:o})})]}),s&&(0,t.jsx)(f,{children:(0,i.b)(l,o)})]})},m=n.styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`,f=n.styled.div`
  display: flex;
  flex-direction: row;
  height: 12px;

  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
  font-weight: 400;
`,h=n.styled.div`
  font-size: 14px;
  line-height: 22.4px;
  font-weight: 400;
`,g=(0,o.createContext)(void 0),v=(0,o.createContext)(void 0),b=({defaultValue:e,children:n})=>{let[a,i]=(0,o.useState)(e||null);return(0,t.jsx)(g.Provider,{value:{activePanel:a,togglePanel:e=>{i(a===e?null:e)}},children:(0,t.jsx)(I,{children:n})})},x=({value:e,children:n})=>{let{activePanel:a,togglePanel:i}=(0,o.useContext)(g),r=a===e;return(0,t.jsx)(v.Provider,{value:{onToggle:()=>i(e),value:e},children:(0,t.jsx)(C,{isActive:r?"true":"false","data-open":String(r),children:n})})},T=({children:e})=>{let{activePanel:n}=(0,o.useContext)(g),{onToggle:a,value:i}=(0,o.useContext)(v),r=n===i;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(S,{onClick:a,"data-open":String(r),children:[(0,t.jsx)(j,{children:e}),(0,t.jsx)(F,{isactive:r?"true":"false",children:(0,t.jsx)(s.default,{height:"16px",width:"16px",strokeWidth:"2"})})]}),(0,t.jsx)(E,{})]})},w=({children:e})=>{let{activePanel:n}=(0,o.useContext)(g),{value:a}=(0,o.useContext)(v);return(0,t.jsx)(P,{"data-open":String(n===a),children:(0,t.jsx)(A,{children:e})})},k=({children:e})=>{let{activePanel:n}=(0,o.useContext)(g),{value:a}=(0,o.useContext)(v);return(0,t.jsx)(A,{children:"function"==typeof e?e({isActive:n===a}):e})},I=n.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`,S=n.styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding-bottom: 8px;
`,E=n.styled.div`
  width: 100%;

  && {
    border-top: 1px solid;
    border-color: var(--privy-color-foreground-4);
  }
  padding-bottom: 12px;
`,j=n.styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  width: 100%;
  padding-right: 8px;
`,C=n.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  padding: 12px;

  && {
    border: 1px solid;
    border-color: var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
  }
`,P=n.styled.div`
  position: relative;
  overflow: hidden;
  transition: max-height 25ms ease-out;

  &[data-open='true'] {
    max-height: 700px;
  }

  &[data-open='false'] {
    max-height: 0;
  }
`,A=n.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 1 auto;
  min-height: 1px;
`,F=n.styled.div`
  transform: ${e=>"true"===e.isactive?"rotate(180deg)":"rotate(0deg)"};
`,M=n.styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`,N=n.styled.div`
  flex-shrink: 0;
  padding-left: 8px;
`;e.s(["T",0,({from:e,to:n,txn:i,transactionInfo:r,tokenPrice:s,gas:o,tokenSymbol:c})=>{let u=BigInt(i?.value||0);return(0,t.jsx)(b,{...(0,l.u)().render.standalone?{defaultValue:"details"}:{},children:(0,t.jsxs)(x,{value:"details",children:[(0,t.jsx)(T,{children:(0,t.jsxs)(M,{children:[(0,t.jsx)("div",{children:r?.title||"Details"}),(0,t.jsx)(N,{children:(0,t.jsx)(a.H,{weiQuantities:[u],tokenPrice:s,tokenSymbol:c})})]})}),(0,t.jsxs)(w,{children:[(0,t.jsx)(d,{label:"From",children:(0,t.jsx)(a.W,{walletAddress:e,chainId:i.chainId||l.C,chainType:"ethereum"})}),(0,t.jsx)(d,{label:"To",children:(0,t.jsx)(a.W,{walletAddress:n,chainId:i.chainId||l.C,chainType:"ethereum"})}),r&&r.action&&(0,t.jsx)(d,{label:"Action",children:r.action}),o&&(0,t.jsx)(p,{value:i.value,gas:o,tokenPrice:s,tokenSymbol:c})]}),(0,t.jsx)(k,{children:({isActive:e})=>(0,t.jsx)(y,{value:i.value,displayFee:e,gas:o||"0x0",tokenPrice:s,tokenSymbol:c})})]})})}])},507359,e=>{"use strict";var t=e.i(691983),n=e.i(336027),a=e.i(6906),i=e.i(623662),r=e.i(68297);e.s(["u",0,function({rpcConfig:e,appId:s,address:o,chain:l}){let{chains:d}=(0,r.u)(),[c,u]=(0,t.useState)(0n),[p,y]=(0,t.useState)(!1),m=(0,t.useMemo)(()=>{let t=l||d[0];if(t)return(0,n.createPublicClient)({chain:l,transport:(0,a.http)((0,i.a)(t,e,s))})},[l,e,s]),f=(0,t.useCallback)(async()=>{if(!o||!m)return;y(!0);let e=await m.getBalance({address:o}).catch(console.error);return e?(u(e),y(!1),e):void 0},[m,o,u]);return(0,t.useEffect)(()=>{f().catch(console.error)},[]),{balance:c,isLoading:p,reloadBalance:f}}])},917053,e=>{"use strict";var t=e.i(177117),n=e.i(375675);let a=({data:e})=>{let n=e=>"object"==typeof e&&null!==e?(0,t.jsx)(r,{children:Object.entries(e).map(([e,a])=>(0,t.jsxs)("li",{children:[(0,t.jsxs)("strong",{children:[e,":"]})," ",n(a)]},e))}):(0,t.jsx)("span",{children:String(e)});return(0,t.jsx)("div",{children:n(e)})},i=n.styled.div`
  margin-top: 1.5rem;
  background-color: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  padding: 12px;
  text-align: left;
  max-height: 310px;
  overflow: scroll;
  white-space: pre-wrap;
  width: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
  line-height: 1.5;

  /* hide the scrollbars */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`,r=n.styled.ul`
  margin-left: 12px !important;
  white-space: nowrap;

  &:first-child {
    margin-left: 0 !important;
  }

  strong {
    font-weight: 500 !important;
  }
`;e.s(["D",0,({data:e,className:n})=>(0,t.jsx)(i,{className:n,children:(0,t.jsx)(a,{data:e})}),"M",0,i])},712722,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},i){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"}))});e.s(["default",0,n])},115965,e=>{"use strict";var t=e.i(177117),n=e.i(712722),a=e.i(375675);let i=a.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-error-bg);
  border: 1px solid var(--privy-color-border-error);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,r=a.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["E",0,({children:e,theme:a,className:s})=>(0,t.jsxs)(i,{$theme:a,className:s,children:[(0,t.jsx)(n.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-error)",strokeWidth:2,style:{flexShrink:0}}),(0,t.jsx)(r,{$theme:a,children:e})]})])},469183,e=>{"use strict";var t=e.i(336027),n=e.i(6906),a=e.i(623662);let i=async({address:e,chain:i,rpcConfig:s,privyAppId:o})=>{try{let l=(0,t.createPublicClient)({chain:i,transport:(0,n.http)((0,a.a)(i,s,o))}),[d,c]=await Promise.all([l.readContract({abi:r,address:e,functionName:"symbol"}),l.readContract({abi:r,address:e,functionName:"decimals"})]);return{decimals:c,symbol:d}}catch(e){return console.log(e),null}},r=[{inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"}];e.s(["g",0,i])},129945,e=>{"use strict";var t=e.i(177117),n=e.i(375675);let a=({title:e,description:n,children:a,...r})=>(0,t.jsx)(i,{...r,children:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("h3",{children:e}),"string"==typeof n?(0,t.jsx)("p",{children:n}):n,a]})});(0,n.styled)(a)`
  margin-bottom: 24px;
`;let i=n.styled.div`
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
`,r=(0,n.styled)(i)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`;e.s(["C",0,({title:e,description:n,icon:a,children:i,...s})=>(0,t.jsxs)(r,{...s,children:[a||null,(0,t.jsx)("h3",{children:e}),n&&"string"==typeof n?(0,t.jsx)("p",{children:n}):n,i]}),"S",0,a])},529609,e=>{"use strict";var t=e.i(375675),n=e.i(67820);let a=t.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`,i=(0,t.styled)(a)`
  color: var(--privy-color-accent);
`,r=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */
  word-break: break-all;
  text-align: right;

  ${n.L}
`;e.s(["L",0,a,"V",0,r,"a",0,i])},715097,e=>{"use strict";var t=e.i(375675);let n=t.styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`,a=t.styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
`;e.s(["R",0,n,"a",0,a])},101179,e=>{"use strict";let t=2n**256n-1n;e.s(["f",0,({amount:e,decimals:n})=>e===t?"Maximum":Intl.NumberFormat(void 0,{maximumFractionDigits:n}).format(Number(e)/10**n)])},574300,e=>{"use strict";e.s(["E",0,[{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],"a",0,[{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"}]])},59821,e=>{"use strict";var t=e.i(177117),n=e.i(691983),a=e.i(336027),i=e.i(6906),r=e.i(948005),s=e.i(805670),o=e.i(241320),l=e.i(368207),d=e.i(795086),c=e.i(682275),u=e.i(463475),p=e.i(871872),y=e.i(68297),m=e.i(608980),f=e.i(507359),h=e.i(469183),g=e.i(101179),v=e.i(809681),b=e.i(312075),x=e.i(623662),T=e.i(144410),w=e.i(375675),k=e.i(657545),I=e.i(781929),S=e.i(917053),E=e.i(981608),j=e.i(642754),C=e.i(129945),P=e.i(612780),A=e.i(762406),F=e.i(574300);let M=[{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"}],N=w.styled.div`
  display: flex;
  flex-direction: column;
  min-height: 72px;
`;var _=({onBack:e,details:n})=>(0,t.jsxs)(N,{children:[(0,t.jsx)(I.M,{backFn:e}),(0,t.jsx)(S.D,{data:n}),(0,t.jsx)(k.B,{})]});let L=({txn:e,receipt:n,transactionInfo:a,onClose:i,tokenPrice:s,tokenSymbol:o,receiptHeader:l,receiptDescription:d})=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(I.M,{onClose:i}),(0,t.jsx)(C.S,{title:l??"Transaction complete!",description:d??"You're all set."}),(0,t.jsx)(A.T,{tokenPrice:s,from:n.from,to:n.to,gas:(({gasUsed:e,effectiveGasPrice:t})=>{if(e&&t)try{return(0,r.toHex)(e*t)}catch(e){return}})(n),txn:e,transactionInfo:a,tokenSymbol:o}),(0,t.jsx)(P.G,{}),(0,t.jsx)($,{loading:!1,onClick:i,children:"All Done"}),(0,t.jsx)(j.a,{}),(0,t.jsx)(k.B,{})]}),$=(0,w.styled)(I.P)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`,R=[{constant:!1,inputs:[{name:"_salt",type:"bytes32"},{name:"_initializer",type:"bytes"}],name:"deployAccount",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],D=[{name:"from",type:"address"},{name:"param2",type:"address"},{name:"param3",type:"bytes"},{name:"param4",type:"tuple",components:[]},{type:"tuple",components:[{name:"param5",type:"address"},{name:"param6",type:"uint256"},{name:"param7",type:"uint256"},{name:"encodedInitData",type:"bytes"}]}],O=[{constant:!1,inputs:[{name:"spender",type:"address"},{name:"value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],B=[{inputs:[{name:"to",type:"address"},{name:"amount",type:"uint256"},{name:"memo",type:"bytes32"}],name:"transferWithMemo",outputs:[{name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}],U=[{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"mint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"mint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"mint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"mint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"quantity",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"quantity",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"},{internalType:"uint256[]",name:"quantities",type:"uint256[]"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mintBatch",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"},{internalType:"uint256[]",name:"quantities",type:"uint256[]"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mintBatch",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"quantity",type:"uint256"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"quantity",type:"uint256"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"batchMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"batchMint",outputs:[],stateMutability:"payable",type:"function"}],q=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],H=[{constant:!1,inputs:[{name:"_operator",type:"address"},{name:"_approved",type:"bool"}],name:"setApprovalForAll",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],z=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenId",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],V=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenIds",type:"uint256[]"},{name:"_amounts",type:"uint256[]"},{name:"_data",type:"bytes"}],name:"safeBatchTransferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],W=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenId",type:"uint256"},{name:"_amount",type:"uint256"},{name:"_data",type:"bytes"}],name:"safeTransferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],G=(e,t)=>{let n=Z(O,e);if(n)return{action:"approve",functionName:"approve",isErc20Ish:!0,isNFTIsh:!1,spender:n.args[0],amount:n.args[1]};let a=Z(F.E,e);if(a)return{action:"transfer",functionName:"transfer",isErc20Ish:!0,isNFTIsh:!1,transferTo:a.args[0],amount:a.args[1]};let i=Z(B,e);if(i)return{action:"transfer",functionName:"transferWithMemo",isErc20Ish:!0,isNFTIsh:!1,transferTo:i.args[0],amount:i.args[1]};if(!t)return{action:"transaction",functionName:"",isErc20Ish:!1,isNFTIsh:!1};let r=Z(R,e);if(r&&"string"==typeof r.args[1]){let e=J(r.args[1]);if(e&&e[4].encodedInitData)return G(e[4].encodedInitData,t)}let s=Z(H,e);if(s)return{action:"approve",functionName:"setApprovalForAll",isNFTIsh:!0,isErc20Ish:!1,operator:s.args[0],approved:s.args[1]};let o=Z(z,e);if(o)return{action:"transfer",functionName:"transferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:o.args[0],transferTo:o.args[1],tokenId:o.args[2]};let l=Z(q,e);if(l)return{action:"transfer",functionName:"safeTransferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:l.args[0],transferTo:l.args[1],tokenId:l.args[2]};let d=Z(W,e);if(d)return{action:"transfer",functionName:"safeTransferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:d.args[0],transferTo:d.args[1],tokenId:d.args[2],amount:d.args[3]};let c=Z(V,e);if(c)return{action:"batch transfer",functionName:"safeBatchTransferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:c.args[0],transferTo:c.args[1],tokenIds:c.args[2],amounts:c.args[3]};let u=Z(U,e);return u?{action:"mint",functionName:u.functionName,isNFTIsh:!0,isErc20Ish:!1,args:u.args}:{action:"transaction",isErc20Ish:!1,isNFTIsh:!1}},Z=(e,t)=>{try{let n=(0,s.decodeFunctionData)({abi:e,data:t});return{functionName:n.functionName,args:n.args||[]}}catch(e){return null}},J=e=>{try{if("string"==typeof e)return(0,o.decodeAbiParameters)(D,`0x${e.slice(10)}`)}catch(e){return null}},Q=e=>`${parseFloat(e).toFixed(2)}`,Y=new p.h(new p.i("There was an issue preparing your transaction",d.ProviderErrors.E32603_DEFAULT_INTERNAL_ERROR.eipCode)),K=(e,t)=>e?.sendTransaction?"transactionRequest"in e.sendTransaction?e.sendTransaction.transactionRequest:e.sendTransaction.transactionRequests[t]:void 0,X={component:()=>{let{data:e,onUserCloseViaDialogOrKeybindRef:r,setModalData:s,navigate:o}=(0,u.b)(),{client:w,rpcConfig:k,chains:I,closePrivyModal:S,walletProxy:j,showFiatPrices:C}=(0,y.u)(),{user:P}=(0,u.a)(),A=(0,u.u)(),[F,N]=(0,n.useState)(0),$=e?.sendTransaction?"transactionRequest"in e.sendTransaction?0:e.sendTransaction.transactionRequests.length-1:0,[R,D]=(0,n.useState)(K(e,F)),[O,B]=(0,n.useState)(null),[U,q]=(0,n.useState)(),[H,z]=(0,n.useState)(!1),[V,W]=(0,n.useState)(null),[Z,J]=(0,n.useState)(null),[X,ee]=(0,n.useState)(null),[et,en]=(0,n.useState)(void 0),[ea,ei]=(0,n.useState)(void 0),[er,es]=(0,n.useState)(!1),[eo,el]=(0,n.useState)(!1),[ed,ec]=(0,n.useState)([]),[eu,ep]=(0,n.useState)([]),[ey,em]=(0,n.useState)("uninitiated"),[ef,eh]=(0,n.useState)(void 0);if(!R||!e?.sendTransaction||!e?.sendTransaction)return(0,t.jsx)(T.ErrorScreenView,{error:Error("Invalid transaction request"),allowlistConfig:A.allowlistConfig,onRetry:()=>{e?.sendTransaction?.onFailure(Y),S({shouldCallAuthOnSuccess:!1})}});let{transactingWalletAddress:eg}=e.sendTransaction,ev=(0,n.useMemo)(()=>I.find(e=>Number(e.id)===Number(R.chainId)),[R.chainId]),eb=ev?.nativeCurrency.symbol??"ETH",ex=(0,n.useMemo)(()=>G(R.data,!!A.embeddedWallets.extendedCalldataDecoding),[R.data]),{action:eT,isErc20Ish:ew,isNFTIsh:ek,functionName:eI}=ex,{toAddress:eS,tokenAddress:eE}=(0,n.useMemo)(()=>({toAddress:ex.isErc20Ish?ex.transferTo:R.to??void 0,tokenAddress:ex.isErc20Ish?R.to:void 0}),[ex]);(0,n.useEffect)(()=>{R.to&&ev&&ew&&(0,h.g)({address:R.to,chain:ev,rpcConfig:A.rpcConfig,privyAppId:A.id}).then(B).catch(console.error)},[R.to,ev]);let{tokenPrice:ej,isTokenPriceLoading:eC}=(0,m.u)(R.chainId),{balance:eP}=(0,f.u)({rpcConfig:A.rpcConfig,appId:A.id,address:eg,chain:ev}),eA=function({rpcConfig:e,appId:t,address:r,chain:s,tokenInfo:o}){let{chains:l}=(0,y.u)(),[c,u]=(0,n.useState)(null),[p,m]=(0,n.useState)(!1),f=(0,n.useMemo)(()=>{let n=s||l[0];if(n)return(0,a.createPublicClient)({chain:s,transport:(0,i.http)((0,d.getJsonRpcEndpointFromChain)(n,e,t))})},[s,e,t]),h=(0,n.useCallback)(async()=>{if(r&&f&&o.address)try{return m(!0),await f.readContract({address:o.address,abi:M,functionName:"balanceOf",args:[r]})}catch(e){console.error(e)}finally{m(!1)}},[f,r,o?.address,s]);return(0,n.useEffect)(()=>{h().then(e=>null!=e&&u(e))},[h]),{balance:c,isLoading:p&&null==c,formattedBalance:(0,d.formatTokenAmount)({amount:c??BigInt(0),decimals:o.decimals})}}({rpcConfig:A.rpcConfig,appId:A.id,address:eg,tokenInfo:{address:eE||"",decimals:O?.decimals??18},chain:ev}),[eF,eM]=(0,n.useState)(x.c),[eN,e_]=(0,n.useState)(null),eL=(0,x.i)(R.chainId)&&!eF;(0,n.useEffect)(()=>{eL&&(0,x.l)().then(()=>eM(!0)).catch(e=>{console.error(e),e_(e instanceof Error?e:Error("Unable to load Tempo chains"))})},[eL]);let e$=(0,n.useMemo)(()=>eL?void 0:(0,x.d)(Number(R.chainId),I,k,{appId:A.id}),[R.chainId,k,eL]),eR=((e,t,a,i)=>{let[r,s]=(0,n.useState)(null),{walletProxy:o}=(0,y.u)();return(0,n.useEffect)(()=>{r&&s(null),(async()=>{if(!o||!t||!a)return null;let n=[],r=!0,s=await (0,p.k)(e,a,t,i).catch(t=>(t.message&&t.message.includes("Insufficient balance for transaction")||t.message&&t.message.includes("Insufficient funds for gas * price + value")||t.details&&t.details.includes("insufficient funds")||t.details&&t.details.includes("gas required exceeds allowance")?r=!1:n.push(t),e));return{tx:s,totalGasEstimate:s.gas,hasFunds:r,errors:n}})().then(s)},[e,void 0===a]),r})(R,eg,e$,e?.sendTransaction?.prepareTransactionRequest);(0,n.useEffect)(()=>{D(K(e,F))},[F]),(0,n.useEffect)(()=>{e.sendTransaction?.getIsSponsored?e.sendTransaction.getIsSponsored().then(q).catch(console.error):q(!1)},[e.sendTransaction.getIsSponsored]);let eD=()=>{if(!H)return V?e?.sendTransaction?.onSuccess({hash:V}):X||eN||eR?.errors[0]?e?.sendTransaction?.onFailure(X??eN??eR?.errors[0]??Y):e?.sendTransaction?.onFailure(new p.h(new p.i("The user rejected the request",d.ProviderErrors.E4001_USER_REJECTED_REQUEST.eipCode))),S({shouldCallAuthOnSuccess:!1})};r.current=eD;let eO=!!(e.funding&&e.funding.supportedOptions.length>0),eB=(0,v.b)(BigInt(eR?.totalGasEstimate??0n),eb),eU=C&&ej?(0,v.a)(BigInt(eR?.totalGasEstimate??0n),ej):void 0,eq=(0,v.b)(eP??0n,eb,void 0,!0),eH=C&&ej?(0,v.a)(eP??0n,ej):void 0,ez=O&&!eA.isLoading&&ew&&"approve"!==eT?`${eA.formattedBalance} ${O.symbol}`:void 0,eV=e.sendTransaction?.uiOptions?.transactionInfo?.title;eV||(eV="approve"===eT?ew?"Confirm address":"Confirm action":`Approve ${eT}`);let eW=(0,n.useMemo)(()=>{if(e.sendTransaction?.uiOptions?.description)return e.sendTransaction?.uiOptions?.description;if("approve"===eT&&"setApprovalForAll"===eI&&ex.approved){let e=(0,t.jsx)(c.A,{address:ex.operator||"",url:ev?.blockExplorers?.default?.url});return(0,t.jsxs)(t.Fragment,{children:[A.name," would like your permission for ",e," to transfer tokens on your behalf."]})}if("approve"===eT&&"setApprovalForAll"===eI&&!ex.approved){let e=(0,t.jsx)(c.A,{address:ex.operator||"",url:ev?.blockExplorers?.default?.url});return(0,t.jsxs)(t.Fragment,{children:[A.name," would like your permission to revoke permissions of ",e," from transferring tokens on your behalf."]})}return ew&&"approve"===eT||ew&&"approve"===eT?`${A.name} would like your permission for ${(0,b.f)(ex.spender)} to spend tokens on your behalf.`:`${A.name} wants your permission to approve the following transaction.`},[A.name,ew,ex,e.sendTransaction?.uiOptions.description,eI]),eG=e.sendTransaction?.uiOptions?.transactionInfo?.contractInfo?.imgUrl?(0,t.jsx)("img",{src:e.sendTransaction.uiOptions.transactionInfo.contractInfo.imgUrl,alt:e.sendTransaction.uiOptions.transactionInfo.contractInfo.imgAltText}):null,eZ=!(!eR||eR.errors[0]||eR.hasFunds||!1!==U),eJ=eZ&&eO,eQ=eJ?"Add funds":e.sendTransaction?.uiOptions?.buttonText||(F<$?"Continue":"Approve");if((0,n.useEffect)(()=>{e.sendTransaction?.scanTransaction&&A.embeddedWallets.transactionScanning.enabled&&"uninitiated"===ey&&(em("in progress"),e.sendTransaction.scanTransaction().then(e=>{(e=>{if(!e)throw Error("Transaction scan failed");if("Success"===e.validation.status&&("Benign"===e.validation.result_type?ei("safe"):"Warning"===e.validation.result_type?ei("warn"):"Malicious"===e.validation.result_type&&(ei("error"),el(!0))),"Success"!==e.simulation.status)throw Error("Simulation failed");{en(e.simulation.params);let{assetsIn:t,assetsOut:n}=function(e,t){let n=[],a=new Map;if(e){for(let t of e)if(t.in[0]){let e;e="ERC721"===t.asset.type||"approve_for_all"===t.in[0].value?{id:`nft:${t.asset.name}`,nftName:t.asset.name,nftCount:t.in.length}:{id:`token:${t.asset.type}:${t.asset.symbol}:${t.asset.name}`,iconUrl:t.asset.logo_url,value:t.in[0].value,symbol:t.asset.symbol,usdValue:t.in[0].usd_price?Q(t.in[0].usd_price):void 0,decimals:t.asset.decimals},n.push(e)}else if(t.out[0]?.value){let e;e="ERC721"===t.asset.type||"approve_for_all"===t.out[0].value?{id:`nft:${t.asset.name}`,nftName:t.asset.name}:{id:`token:${t.asset.type}:${t.asset.symbol}:${t.asset.name}`,iconUrl:t.asset.logo_url,value:t.out[0].value,symbol:t.asset.symbol,usdValue:t.out[0].usd_price?Q(t.out[0].usd_price):void 0,decimals:t.asset.decimals},a.has(e.id)||a.set(e.id,e)}}for(let e of t)for(let t of Object.keys(e.spenders)){let n;n="ERC721"===e.asset.type||"approve_for_all"===e.spenders[t]?.value?{id:`nft:${e.asset.name}`,nftName:e.asset.name}:{id:`token:${e.asset.type}:${e.asset.symbol}:${e.asset.name}`,iconUrl:e.asset.logo_url,value:e.spenders[t]?.value,symbol:e.asset.symbol,usdValue:e.spenders[t]?.usd_price?Q(e.spenders[t]?.usd_price):void 0,decimals:e.asset.decimals},a.has(n.id)||a.set(n.id,n)}return{assetsIn:n,assetsOut:Array.from(a.values())}}(e.simulation.assets_diffs,e.simulation.exposures);if(0===n.length&&0===t.length)throw Error("No tokens found");ec(n),ep(t)}})(e),em("completed")}).catch(()=>em("failed")))},[!!e.sendTransaction?.scanTransaction]),(0,n.useEffect)(()=>{e.sendTransaction?.scanTransaction&&"failed"!==ey||((e,t,n)=>{if(t.isErc20Ish&&t.amount&&n){let e=(0,g.f)({amount:t.amount,decimals:n.decimals});eh(e),ec([{value:e,symbol:n?.symbol,decimals:n?.decimals}])}else if(e.value){let t=BigInt(e.value),n=ej?(0,v.a)(t,ej):void 0;ec(C&&n?[{value:n}]:[{value:(0,v.p)(t),symbol:eb,decimals:18,usdValue:n}])}else ec(C?[{value:"$0"}]:[{value:"0",symbol:eb,decimals:18}])})(eR?.tx??R,ex,O)},[R,eR?.tx,ex,O,ey]),Z)return(0,t.jsx)(L,{txn:eR?.tx??R,onClose:eD,receipt:Z,transactionInfo:e.sendTransaction?.uiOptions.transactionInfo,tokenPrice:ej,tokenSymbol:eb,receiptHeader:e.sendTransaction?.uiOptions.successHeader,receiptDescription:e.sendTransaction?.uiOptions.successDescription});if(X)return(0,t.jsx)(E.T,{transactionError:X,transactionHash:V??void 0,chainType:"ethereum",chainId:eR?.tx.chainId??R.chainId,onClose:eD,onRetry:({resetNonce:e})=>{ee(null);let t={...eR?.tx??R};e&&(t.nonce=void 0),D(t)}});let eY=0!==$&&"number"==typeof F&&0!==F?()=>{N(F-1)}:void 0;return er&&et?(0,t.jsx)(_,{details:et,onBack:()=>es(!1)}):(0,t.jsx)(E.a,{transactionIndex:F,onBack:eY,maxIndex:$,disabled:eZ&&!eO||eo,isSubmitting:H,submitError:X,isPreparing:!eR&&!eN,isTokenPriceLoading:eC,isTokenContractInfoLoading:!ek&&!O,prepareError:eN??eR?.errors[0],symbol:O?.symbol,chain:ev,img:eG,title:eV,subtitle:eW,txValue:R.value,fee:eU??eB,isSponsored:U,from:eg??"",to:eS,tokenAddress:eE??void 0,network:A.chains.find(e=>e.id===R.chainId)?.name??"",transactionDetails:{...ex,formattedAmount:ef},cta:eQ,missingFunds:eZ,action:eT,balance:ez??eH??eq,onClose:eD,onClick:eJ?async()=>{if(!eg)return;if(!eO)throw Error("Funding wallet is not enabled");let t="FundingMethodSelectionScreen";s({...e,funding:{...e.funding,methodScreen:t,chainType:"ethereum",amount:(0,l.formatEther)(BigInt(eR?.tx.value??0)+BigInt(eR?.totalGasEstimate?.toString()??0)),chain:ev},solanaFundingData:e?.solanaFundingData}),o(t)}:async()=>{if(F<$)N(F+1);else{z(!0);try{let t=await w.getAccessToken();if(H||!t||!j||!P)return;let n=await e.sendTransaction.onConfirm({transactionRequest:eR?.tx??R});if(W(n),e.sendTransaction?.signOnly)return await new Promise(e=>setTimeout(e,u.D)),e?.sendTransaction?.onSuccess({hash:n}),S({shouldCallAuthOnSuccess:!1});let a=e$??await (0,x.b)(Number(R.chainId),I,k,{appId:A.id}),i=await a.waitForTransactionReceipt({hash:n});if("reverted"===i.status)throw Error("Transaction failed");J(i)}catch(e){console.warn({transaction:eR?.tx??R,error:e}),ee(e)}finally{z(!1)}}},validation:ea,hasScanDetails:!!et,setIsScanDetailsOpen:es,preventMaliciousTransaction:eo,setPreventMaliciousTransaction:el,tokensSent:ed,tokensReceived:eu,isScanning:"in progress"===ey,isCancellable:e.sendTransaction?.uiOptions?.isCancellable??!1,functionName:eI})}};e.s(["SendTransactionScreen",0,X,"default",0,X])}]);