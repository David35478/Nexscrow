(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67820,e=>{"use strict";var t=e.i(375675);let r=t.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,i=t.css`
  ${e=>e.$isLoading?t.css`
          width: 35%;
          animation: ${r} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,i])},266799,e=>{"use strict";var t=e.i(177117),r=e.i(375675),i=e.i(67820);let n=r.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let t,i;"green"===e.$color&&(t="var(--privy-color-success-dark)",i="var(--privy-color-success-light)"),"red"===e.$color&&(t="var(--privy-color-error)",i="var(--privy-color-error-light)"),"gray"===e.$color&&(t="var(--privy-color-foreground-2)",i="var(--privy-color-background-2)");let n=r.keyframes`
      from, to {
        background-color: ${i};
      }

      50% {
        background-color: rgba(${i}, 0.8);
      }
    `;return r.css`
      color: ${t};
      background-color: ${i};
      ${e.$isPulsing&&r.css`
        animation: ${n} 3s linear infinite;
      `};
    `}}

  ${i.L}
`;e.s(["C",0,({children:e,color:r,isLoading:i,isPulsing:a,...o})=>(0,t.jsx)(n,{$color:r,$isLoading:i,$isPulsing:a,...o,children:e})])},293162,e=>{"use strict";let t=(0,e.i(319546).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",0,t],293162)},596577,e=>{"use strict";let t=(0,e.i(319546).default)("fingerprint-pattern",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);e.s(["FingerprintIcon",0,t],596577)},635665,e=>{"use strict";let t=(0,e.i(319546).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],635665)},6478,e=>{"use strict";var t=e.i(177117),r=e.i(635665),i=e.i(635267),n=e.i(691983),a=e.i(375675);let o=a.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px; /* 10px gap between items */
  padding-left: 8px; /* 8px indentation container */
`;a.styled.div`
  &&& {
    margin-left: 6px; /* Center the line under the checkbox (12px/2) */
    border-left: 2px solid var(--privy-color-foreground-4);
    height: 10px; /* 10px H padding between paragraphs */
    margin-top: 0;
    margin-bottom: 0;
  }
`;let s=a.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg)";case"error":return"var(--privy-color-error-bg)";default:return"var(--privy-color-background-2)"}}};
  flex-shrink: 0;
`,d=a.styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start; /* Align all elements to the top */
  text-align: left;
  gap: 8px;

  && {
    a {
      color: var(--privy-color-accent);
    }
  }
`;e.s(["T",0,o,"a",0,({children:e,variant:a="default",icon:o})=>{let l=()=>{switch(a){case"success":return"var(--privy-color-icon-success)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}};return(0,t.jsxs)(d,{children:[(0,t.jsx)(s,{$variant:a,"data-variant":a,children:(()=>{if(o)return n.default.isValidElement(o)?n.default.cloneElement(o,{stroke:l(),strokeWidth:2}):o;switch(a){case"success":default:return(0,t.jsx)(i.Check,{size:12,stroke:l(),strokeWidth:3});case"error":return(0,t.jsx)(r.X,{size:12,stroke:l(),strokeWidth:3})}})()}),e]})}])},544771,e=>{"use strict";var t=e.i(177117),r=e.i(293162),i=e.i(596577);let n=(0,e.i(319546).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);var a=e.i(691983),o=e.i(375675),s=e.i(691778),d=e.i(6478),l=e.i(859427),c=e.i(68297),u=e.i(463475),p=e.i(376305),h=e.i(962537);let g=({passkeys:e,name:n,isLoading:a,errorReason:o,success:s,expanded:d,onLinkPasskey:l,onUnlinkPasskey:c,onExpand:u,onBack:p,onClose:g})=>s?(0,t.jsx)(h.S,{title:"Passkeys updated",icon:r.CheckCircle,iconVariant:"success",primaryCta:{label:"Done",onClick:g},onClose:g,watermark:!0}):d?(0,t.jsx)(h.S,{icon:i.FingerprintIcon,title:"Your passkeys",onBack:p,onClose:g,watermark:!0,children:(0,t.jsx)(x,{passkeys:e,expanded:d,onUnlink:c,onExpand:u})}):(0,t.jsxs)(h.S,{icon:i.FingerprintIcon,title:"Set up passkey verification",subtitle:"Verify with passkey",primaryCta:{label:"Add new passkey",onClick:l,loading:a},onClose:g,watermark:!0,helpText:o||void 0,children:[0===e.length?(0,t.jsx)(k,{}):(0,t.jsx)(f,{children:(0,t.jsx)(x,{passkeys:e,expanded:d,onUnlink:c,onExpand:u})}),n?(0,t.jsxs)(y,{children:[(0,t.jsx)(v,{children:"New Passkey Name"}),(0,t.jsx)(m,{children:n})]}):null]}),f=o.styled.div`
  margin-bottom: 0.75rem;
`,y=o.styled.div`
  margin-top: 0.25rem;
`,v=o.styled.div`
  color: var(--privy-color-foreground-2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,m=o.styled.div`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`,x=({passkeys:e,expanded:r,onUnlink:i,onExpand:o})=>{let[d,l]=(0,a.useState)([]),c=r?e.length:2;return(0,t.jsxs)("div",{children:[(0,t.jsx)(T,{children:"Your passkeys"}),(0,t.jsxs)(P,{children:[e.slice(0,c).map(e=>(0,t.jsxs)(I,{children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(E,{children:e.authenticatorName?e.createdWithBrowser?`${e.authenticatorName} on ${e.createdWithBrowser}`:e.authenticatorName:e.createdWithBrowser?e.createdWithOs?`${e.createdWithBrowser} on ${e.createdWithOs}`:`${e.createdWithBrowser}`:"Unknown device"}),(0,t.jsxs)(j,{children:["Last used:"," ",(e.latestVerifiedAt??e.firstVerifiedAt)?.toLocaleString()??"N/A"]})]}),(0,t.jsx)(N,{disabled:d.includes(e.credentialId),onClick:()=>(async e=>{l(t=>t.concat([e])),await i(e),l(t=>t.filter(t=>t!==e))})(e.credentialId),children:d.includes(e.credentialId)?(0,t.jsx)(s.B,{}):(0,t.jsx)(n,{size:16})})]},e.credentialId)),e.length>2&&!r&&(0,t.jsx)(S,{onClick:o,children:"View all"})]})]})},k=()=>(0,t.jsxs)(d.T,{style:{color:"var(--privy-color-foreground)"},children:[(0,t.jsx)(d.a,{children:"Verify with Touch ID, Face ID, PIN, or hardware key"}),(0,t.jsx)(d.a,{children:"Takes seconds to set up and use"}),(0,t.jsx)(d.a,{children:"Use your passkey to verify transactions and login to your account"})]}),b={component:()=>{let{user:e}=(0,u.a)(),{unlink:r}=(0,p.u)(),{linkWithPasskey:i,closePrivyModal:n}=(0,c.u)(),{data:o}=(0,u.b)(),s=e?.linkedAccounts.filter(e=>"passkey"===e.type),[d,h]=(0,a.useState)(!1),[f,y]=(0,a.useState)(""),[v,m]=(0,a.useState)(!1),[x,k]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{0===s.length&&k(!1)},[s.length]),(0,t.jsx)(g,{passkeys:s,name:o?.passkeyAuthModalData?.name,isLoading:d,errorReason:f,success:v,expanded:x,onLinkPasskey:()=>{h(!0),i({name:o?.passkeyAuthModalData?.name}).then(()=>m(!0)).catch(e=>{if(e instanceof l.b){if(e.privyErrorCode===l.c.CANNOT_LINK_MORE_OF_TYPE)return void y("Cannot link more passkeys to account.");if(e.privyErrorCode===l.c.PASSKEY_NOT_ALLOWED)return void y("Passkey request timed out or rejected by user.")}y("Unknown error occurred.")}).finally(()=>{h(!1)})},onUnlinkPasskey:async e=>(h(!0),await r({credentialId:e}).then(()=>m(!0)).catch(e=>{e instanceof l.b&&e.privyErrorCode===l.c.MISSING_MFA_CREDENTIALS?y("Cannot unlink a passkey enrolled in MFA"):y("Unknown error occurred.")}).finally(()=>{h(!1)})),onExpand:()=>k(!0),onBack:()=>k(!1),onClose:()=>n()})}},w=o.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 90px;
  border-radius: 50%;
  svg + svg {
    margin-left: 12px;
  }
  > svg {
    z-index: 2;
    color: var(--privy-color-accent) !important;
    stroke: var(--privy-color-accent) !important;
    fill: var(--privy-color-accent) !important;
  }
`,C=o.css`
  && {
    width: 100%;
    font-size: 0.875rem;
    line-height: 1rem;

    /* Tablet and Up */
    @media (min-width: 440px) {
      font-size: 14px;
    }

    display: flex;
    gap: 12px;
    justify-content: center;

    padding: 6px 8px;
    background-color: var(--privy-color-background);
    transition: background-color 200ms ease;
    color: var(--privy-color-accent) !important;

    :focus {
      outline: none;
      box-shadow: none;
    }
  }
`,S=o.styled.button`
  ${C}
`,P=o.styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 0.5rem 0 0;
  flex-grow: 1;
  width: 100%;
`,T=o.styled.div`
  line-height: 20px;
  height: 20px;
  font-size: 1em;
  font-weight: 450;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`,E=o.styled.div`
  font-size: 1em;
  line-height: 1.3em;
  font-weight: 500;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,j=o.styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,I=o.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: left;
  border-radius: 8px;
  border: 1px solid var(--privy-color-border-default) !important;
  width: 100%;
  height: 5em;
`,F=o.css`
  :focus,
  :hover,
  :active {
    outline: none;
  }
  display: flex;
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
  svg {
    color: var(--privy-color-error);
  }
  svg:hover {
    color: var(--privy-color-foreground-3);
  }
`,N=o.styled.button`
  ${F}
`;e.s(["DoubleIconWrapper",0,w,"LinkButton",0,S,"LinkPasskeyScreen",0,b,"LinkPasskeyView",0,g,"default",0,b],544771)},957539,e=>{"use strict";var t=e.i(375675),r=e.i(781929),i=e.i(544771);let n=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,a=t.styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,o=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`,s=t.styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 0 16px;
  border-width: 1px !important;
  border-radius: 12px;
  cursor: text;

  &:focus-within {
    border-color: var(--privy-color-accent);
  }
`;t.styled.div`
  font-size: 42px !important;
`;let d=t.styled.input`
  background-color: var(--privy-color-background);
  width: 100%;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  && {
    font-size: 26px;
  }
`,l=(0,t.styled)(d)`
  && {
    font-size: 42px;
  }
`;t.styled.button`
  cursor: pointer;
  padding-left: 4px;
`;let c=t.styled.div`
  font-size: 18px;
`,u=t.styled.div`
  font-size: 12px;
  color: var(--privy-color-foreground-3);
  /* we need this container to maintain a static height if there's no content */
  height: 20px;
`;t.styled.div`
  display: flex;
  flex-direction: row;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  svg {
    margin: auto;
  }
`,(0,t.styled)(i.LinkButton)`
  margin-top: 16px;
`;let p=t.keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;(0,t.styled)(r.a)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${p} 0.3s ease-in-out;
`;let h=t.styled.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;e.s(["F",0,o,"I",0,a,"a",0,s,"b",0,l,"c",0,c,"d",0,u,"e",0,d,"f",0,n,"g",0,h])},608980,e=>{"use strict";var t=e.i(691983),r=e.i(215097),i=e.i(463475),n=e.i(68297),a=e.i(351190);e.s(["u",0,function(e){let{tokenPrice:o,isTokenPriceLoading:s,tokenPriceError:d}=(e=>{let{showFiatPrices:a,getUsdTokenPrice:o,chains:s}=(0,n.u)(),[d,l]=(0,t.useState)(!0),[c,u]=(0,t.useState)(void 0),[p,h]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{e||=i.C;let t=(0,r.addToDefaultChains)(s).find(t=>t.id===Number(e));(async()=>{if(a){if(!t)return l(!1),u(Error(`Unable to fetch token price on chain id ${e}`));try{l(!0);let e=await o(t);e?h(e):u(Error(`Unable to fetch token price on chain id ${t.id}`))}catch(e){u(e)}finally{l(!1)}}else l(!1)})()},[e]),{tokenPrice:p,isTokenPriceLoading:d,tokenPriceError:c}})("solana"===e?-1:e),{solPrice:l,isSolPriceLoading:c,solPriceError:u}=(0,a.u)({enabled:"solana"===e});return"solana"===e?{tokenPrice:l,isTokenPriceLoading:c,tokenPriceError:u}:{tokenPrice:o,isTokenPriceLoading:s,tokenPriceError:d}}])},790106,535218,e=>{"use strict";e.s(["A",0,"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","D",0,{"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}},"J",0,["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],"L",0,1e9,"R",0,["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],"S",0,"11111111111111111111111111111111","T",0,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","a",0,"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"],535218);let t=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2});e.s(["g",0,function(e,r){let i=parseFloat(e.toString())/1e9,n=t.format(r*i);return"$0.00"===n?"<$0.01":n}],790106)},649082,e=>{"use strict";var t=e.i(790106);function r(e,t=6,i=!1,n=!1){let a=(parseFloat(e.toString())/1e9).toFixed(t).replace(/0+$/,"").replace(/\.$/,""),o=n?"":" SOL";return i?`${a}${o}`:`${"0"===a?"<0.001":a}${o}`}e.s(["a",0,function({amount:e,fee:i,tokenPrice:n,isUsdc:a}){let o=BigInt(Math.floor(parseFloat(e)*10**(a?6:9))),s=a?o:o+i;return{fundingAmountInBaseUnit:o,fundingAmountInUsd:n?(0,t.g)(o,n):void 0,totalPriceInUsd:n?(0,t.g)(s,n):void 0,totalPriceInNativeCurrency:r(s),feePriceInNativeCurrency:r(i),feePriceInUsd:n?(0,t.g)(i,n):void 0}},"g",0,r])},642754,e=>{"use strict";var t=e.i(375675);let r=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,i=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,n=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,a=(0,t.styled)(i)`
  padding: 20px 0;
`,o=(0,t.styled)(i)`
  gap: 16px;
`,s=t.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,d=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;let l=t.styled.div`
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
`,e.s(["B",0,r,"C",0,o,"F",0,d,"H",0,n,"R",0,c,"S",0,l,"a",0,u,"b",0,p,"c",0,s,"d",0,a,"e",0,i])},351190,e=>{"use strict";var t=e.i(691983),r=e.i(68297);e.s(["u",0,({enabled:e=!0}={})=>{let{showFiatPrices:i,getUsdPriceForSol:n}=(0,r.u)(),[a,o]=(0,t.useState)(!0),[s,d]=(0,t.useState)(void 0),[l,c]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{(async()=>{if(i&&e)try{o(!0);let e=await n();e?c(e):d(Error("Unable to fetch SOL price"))}catch(e){d(e)}finally{o(!1)}else o(!1)})()},[]),{solPrice:l,isSolPriceLoading:a,solPriceError:s}}])},809681,e=>{"use strict";var t=e.i(368207),r=e.i(68297),i=e.i(312075);let n=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2}),a=(e,r=6,i=!1)=>{let n=parseFloat((0,t.formatEther)(e)).toFixed(r).replace(/0+$/,"").replace(/\.$/,"");return i?n:`${"0"===n?"<0.001":n}`};e.s(["a",0,(e,r)=>{let i,a=(i=r*parseFloat((0,t.formatEther)(e)),n.format(i));return"$0.00"===a?"<$0.01":a},"b",0,(e,t,r=6,i=!1)=>`${a(e,r,i)} ${t}`,"c",0,(e,t)=>{let{chains:n}=(0,r.u)(),a=`https://etherscan.io/address/${t}`,o=`${(0,i.d)(e,n)}/address/${t}`;try{new URL(o)}catch{return a}return o},"g",0,(e,t)=>{let r,i=(r=t*parseFloat(e),n.format(r));return"$0.00"!==i?i:"<$0.01"},"p",0,a,"s",0,e=>e.reduce((e,t)=>e+t,0n)])},257701,e=>{"use strict";var t=e.i(691983);let r=t.forwardRef(function({title:e,titleId:r,...i},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":r},i),e?t.createElement("title",{id:r},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))});e.s(["default",0,r])},336048,e=>{"use strict";var t=e.i(177117),r=e.i(7991),i=e.i(691983),n=e.i(528284),a=e.i(849793),o=e.i(93755),s=e.i(336027),d=e.i(6906),l=e.i(771427),c=e.i(215097),u=e.i(642754),p=e.i(657545),h=e.i(129945),g=e.i(526943),f=e.i(436896),y=e.i(463475),v=e.i(859427),m=e.i(312075),x=e.i(68297),k=e.i(608980),b=e.i(862953),w=e.i(758188),C=e.i(573486),S=e.i(334240),P=e.i(237144),T=e.i(649082),E=e.i(709418),j=e.i(623662),I=e.i(546453);let F={component:()=>{let e=(0,y.u)(),{rpcConfig:F,appId:N,closePrivyModal:U,createAnalyticsEvent:$}=(0,x.u)(),{navigate:A,setModalData:L,data:B}=(0,y.b)(),M=(0,y.u)(),{wallets:D}=(0,b.u)(),[z,W]=(0,i.useState)(null),[q,V]=(0,i.useState)(null),[R,O]=(0,i.useState)([]),[H,G]=(0,i.useState)(0),[Y,Z]=(0,i.useState)(!1),[J,_]=(0,i.useState)(!1),[K,Q]=(0,i.useState)(!1),[X,ee]=(0,i.useState)(!1),[et,er]=(0,i.useState)(),[ei,en]=(0,i.useState)(),[ea,eo]=(0,i.useState)();if(!B?.funding||"solana"!==B.funding.chainType)throw Error("Invalid funding data");let{address:es,chain:ed,connectedWallet:el}=B.funding,[ec,eu]=(0,i.useState)(B.funding.amount),ep=("ethereum"===el?.type?el:void 0)??D[0],eh=(0,m.u)(ep?.walletClientType||"unknown"),eg=eh?.name||"wallet",[ef,ey]=(0,i.useState)(null);(0,i.useEffect)(()=>{(async()=>{if(!ep)return;let e=await ep.getEthereumProvider();ey((0,n.createWalletClient)({account:ep.address,transport:(0,a.custom)(e)}).extend(o.publicActions))})().catch(console.error)},[ep]);let[ev,em]=(0,i.useState)(0n),ex=(0,T.g)(ev);(0,i.useEffect)(()=>{let t=e.solanaRpcs[ed];t?(0,S.i)({rpc:t.rpc,address:es}).then(e=>em(BigInt(e))).catch(console.error):console.warn("Unable to load solana rpc, skipping balance")},[]);let[ek,eb]=(0,i.useState)(),{tokenPrice:ew}=(0,k.u)("solana"),{fundingAmountInBaseUnit:eC,fundingAmountInUsd:eS}=(0,T.a)({amount:ec,fee:0n,tokenPrice:ew,isUsdc:B.funding.isUSDC});if((0,i.useEffect)(()=>{(async()=>{if(!ef||!ep)return;let e=["solana:testnet","solana:devnet"].includes(ed);e&&console.warn("Solana testnets are not supported for bridging");let t=(0,c.addToDefaultChains)(M.chains).filter(({testnet:t})=>!!t===e),r=(await (0,E.g)({chains:t,address:ep.address,appId:N,rpcConfig:F})).filter(e=>e.balance>0n);if(r.length<1)return void W(new v.P(`Wallet ${(0,m.f)(ep.address)} does not have enough funds.`,void 0,v.c.INSUFFICIENT_BALANCE));r.sort((e,t)=>Number(t.balance-e.balance));let i=(await Promise.allSettled(r.map(async e=>({...e,quote:await (0,C.g)({isTestnet:!1,input:(0,C.t)({appId:N,amount:eC.toString(),user:ep.address,recipient:es,destinationChainId:C.c,destinationCurrency:C.b,originChainId:e.chain.id})})})))).filter(e=>"fulfilled"===e.status).map(e=>e.value);if(i.length<1)return void W(new v.P(`Unable to fetch quotes for bridging. Wallet ${(0,m.f)(ep.address)} does not have enough funds.`,void 0,v.c.INSUFFICIENT_BALANCE));let n=i.map(({quote:e,balance:t,chain:r})=>({bridgeTx:(0,C.a)(e),balance:t,chain:r,isErc20Quote:!1})).filter(({bridgeTx:e})=>!!e);if(n.length>1)return void O(n);let a=n.at(0);a?(_(!0),eb({data:a.bridgeTx.data,to:a.bridgeTx.to,value:a.bridgeTx.value,requestId:a.bridgeTx.requestId,chain:a.chain})):W(new v.P(`Unable to select bridge option from quotes. Wallet ${(0,m.f)(ep.address)} does not have enough funds.`,void 0,v.c.INSUFFICIENT_BALANCE))})().catch(console.error)},[ef]),(0,i.useEffect)(()=>{(async()=>{let e,t;if(!ef||!ep||Y||K||!ek)return;Z(!0);let r=(0,s.createPublicClient)({chain:ek.chain,transport:(0,d.http)((0,j.a)(ek.chain,F,N))});try{e=await r.prepareTransactionRequest({account:ep.address,to:ek.to,chain:ek.chain,data:ek.data,value:BigInt(ek.value??0)})}catch(e){console.error(e),R.length>1&&V(e.shortMessage??"Something went wrong")}if(e){"eip1559"===e.type||"eip4844"===e.type||"eip7702"===e.type?void 0!==e.gasPrice&&delete e.gasPrice:("legacy"===e.type||"eip2930"===e.type)&&(void 0!==e.maxFeePerGas&&delete e.maxFeePerGas,void 0!==e.maxPriorityFeePerGas&&delete e.maxPriorityFeePerGas),Z(!1),Q(!0);try{await ef.switchChain({id:ek.chain.id})}catch(e){await ef.addChain({chain:ek.chain}),await ef.switchChain({id:ek.chain.id})}try{t=await ef.sendTransaction(e)}catch(e){console.error(e),"TransactionExecutionError"===e.name&&(R.length<1?W(new v.P(e.shortMessage,void 0,v.c.TRANSACTION_FAILURE)):V(e.shortMessage??"Something went wrong"))}if(t)return await ef.waitForTransactionReceipt({hash:t}),J?(eo("pending"),er(t),void en(ek.requestId)):(Q(!1),ee(!0),void $({eventName:w.O,payload:{provider:"external",status:"success",txHash:t,address:ep.address,chainId:ek.chain.id,chainType:"ethereum",value:ek.value?(0,l.formatUnits)(BigInt(ek.value),18):void 0,token:"ETH",destination:es,destinationClusterName:"mainnet-beta",destinationChainType:"solana",destinationValue:(0,l.formatUnits)(eC,9),destinationToken:"SOL"}}));Q(!1)}else Z(!1)})().catch(console.error)},[ef,ek]),(0,C.u)({transactionHash:et,requestId:ei,isTestnet:!1,bridgingStatus:ea,setBridgingStatus:eo,onSuccess({transactionHash:e}){_(!1),ee(!0),$({eventName:w.O,payload:{provider:"external",status:"success",txHash:e,address:ep?.address,chainId:ek?.chain.id,chainType:"ethereum",value:ek?.value?(0,l.formatUnits)(BigInt(ek.value),18):void 0,token:"ETH",destination:es,destinationClusterName:"mainnet-beta",destinationChainType:"solana",destinationValue:(0,l.formatUnits)(eC,9),destinationToken:"SOL"}})},onFailure({error:e}){_(!1),W(e)}}),(0,i.useEffect)(()=>{z&&(L({funding:B?.funding,solanaFundingData:B?.solanaFundingData,sendTransaction:B?.sendTransaction,errorModalData:{error:z,previousScreen:"TransferFromWalletScreen"}}),A("ErrorScreen",!1))},[z]),(0,i.useEffect)(()=>{if(!X)return;let e=setTimeout(U,y.j);return()=>clearTimeout(e)},[X]),X)return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(g.t,{}),(0,t.jsx)(u.R,{}),(0,t.jsxs)(u.C,{children:[(0,t.jsx)(r.default,{color:"var(--privy-color-success)",width:"64px",height:"64px"}),(0,t.jsx)(h.C,{title:"Success!",description:`You’ve successfully added ${ec} SOL to your ${M.name} wallet. It may take a minute before the funds are available to use.`})]}),(0,t.jsx)(u.a,{}),(0,t.jsx)(p.B,{})]});let eP=R[H];return R.length>1&&eP?(0,t.jsx)(E.B,{displayName:eg,configuredFundingChain:ed,formattedBalance:ex,fundingAmount:ec,fundingCurrency:"SOL",fundingAmountInUsd:eS,options:R,selectedOption:eP,isPreparing:Y,isSubmitting:K,addressToFund:es,fundingWalletAddress:ep?.address||"",errorMessage:q,onSubmit:()=>{B.funding?.amount===ec?(_(!0),eb({to:eP.bridgeTx.to,data:eP.bridgeTx.data,value:eP.bridgeTx.value,requestId:eP.bridgeTx.requestId,chain:eP.chain})):(async function(){if(ep&&eP)try{let e=await (0,C.g)({isTestnet:!1,input:(0,C.t)({appId:N,amount:eC.toString(),user:ep.address,recipient:es,destinationChainId:C.c,destinationCurrency:C.b,originChainId:eP.chain.id})}),t=(0,C.a)(e);if(!t)throw Error("Invalid transaction request");_(!0),eb({data:t.data,to:t.to,value:t.value,requestId:t.requestId,chain:eP.chain})}catch(e){console.error(e),W(new v.P("Unable to fetch quotes for bridging",e,v.c.INSUFFICIENT_BALANCE))}})().catch(console.error)},onSelect:e=>{e!==H&&(V(null),G(e))},onAmountChange:eu}):K&&ep?(0,t.jsx)(I.T,{walletClientType:ep?.walletClientType||"unknown",displayName:eg,addressToFund:es,isBridging:J,isErc20Flow:!1,chainId:"solana",chainName:(0,P.g)(ed),totalPriceInUsd:void 0,totalPriceInNativeCurrency:void 0,gasPriceInUsd:void 0,gasPriceInNativeCurrency:void 0}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(g.t,{}),(0,t.jsx)(f.N,{}),(0,t.jsx)("div",{style:{marginTop:"1rem"}}),(0,t.jsx)(p.B,{})]})}};e.s(["AwaitingEvmToSolBridgingScreen",0,F,"default",0,F])}]);