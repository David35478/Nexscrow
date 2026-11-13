(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67820,e=>{"use strict";var t=e.i(375675);let r=t.keyframes`
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
          animation: ${r} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,a])},266799,e=>{"use strict";var t=e.i(177117),r=e.i(375675),a=e.i(67820);let i=r.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let t,a;"green"===e.$color&&(t="var(--privy-color-success-dark)",a="var(--privy-color-success-light)"),"red"===e.$color&&(t="var(--privy-color-error)",a="var(--privy-color-error-light)"),"gray"===e.$color&&(t="var(--privy-color-foreground-2)",a="var(--privy-color-background-2)");let i=r.keyframes`
      from, to {
        background-color: ${a};
      }

      50% {
        background-color: rgba(${a}, 0.8);
      }
    `;return r.css`
      color: ${t};
      background-color: ${a};
      ${e.$isPulsing&&r.css`
        animation: ${i} 3s linear infinite;
      `};
    `}}

  ${a.L}
`;e.s(["C",0,({children:e,color:r,isLoading:a,isPulsing:n,...s})=>(0,t.jsx)(i,{$color:r,$isLoading:a,$isPulsing:n,...s,children:e})])},293162,e=>{"use strict";let t=(0,e.i(319546).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",0,t],293162)},596577,e=>{"use strict";let t=(0,e.i(319546).default)("fingerprint-pattern",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);e.s(["FingerprintIcon",0,t],596577)},635665,e=>{"use strict";let t=(0,e.i(319546).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],635665)},6478,e=>{"use strict";var t=e.i(177117),r=e.i(635665),a=e.i(635267),i=e.i(691983),n=e.i(375675);let s=n.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px; /* 10px gap between items */
  padding-left: 8px; /* 8px indentation container */
`;n.styled.div`
  &&& {
    margin-left: 6px; /* Center the line under the checkbox (12px/2) */
    border-left: 2px solid var(--privy-color-foreground-4);
    height: 10px; /* 10px H padding between paragraphs */
    margin-top: 0;
    margin-bottom: 0;
  }
`;let o=n.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg)";case"error":return"var(--privy-color-error-bg)";default:return"var(--privy-color-background-2)"}}};
  flex-shrink: 0;
`,d=n.styled.div`
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
`;e.s(["T",0,s,"a",0,({children:e,variant:n="default",icon:s})=>{let c=()=>{switch(n){case"success":return"var(--privy-color-icon-success)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}};return(0,t.jsxs)(d,{children:[(0,t.jsx)(o,{$variant:n,"data-variant":n,children:(()=>{if(s)return i.default.isValidElement(s)?i.default.cloneElement(s,{stroke:c(),strokeWidth:2}):s;switch(n){case"success":default:return(0,t.jsx)(a.Check,{size:12,stroke:c(),strokeWidth:3});case"error":return(0,t.jsx)(r.X,{size:12,stroke:c(),strokeWidth:3})}})()}),e]})}])},544771,e=>{"use strict";var t=e.i(177117),r=e.i(293162),a=e.i(596577);let i=(0,e.i(319546).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);var n=e.i(691983),s=e.i(375675),o=e.i(691778),d=e.i(6478),c=e.i(859427),l=e.i(68297),u=e.i(463475),p=e.i(376305),h=e.i(962537);let y=({passkeys:e,name:i,isLoading:n,errorReason:s,success:o,expanded:d,onLinkPasskey:c,onUnlinkPasskey:l,onExpand:u,onBack:p,onClose:y})=>o?(0,t.jsx)(h.S,{title:"Passkeys updated",icon:r.CheckCircle,iconVariant:"success",primaryCta:{label:"Done",onClick:y},onClose:y,watermark:!0}):d?(0,t.jsx)(h.S,{icon:a.FingerprintIcon,title:"Your passkeys",onBack:p,onClose:y,watermark:!0,children:(0,t.jsx)(x,{passkeys:e,expanded:d,onUnlink:l,onExpand:u})}):(0,t.jsxs)(h.S,{icon:a.FingerprintIcon,title:"Set up passkey verification",subtitle:"Verify with passkey",primaryCta:{label:"Add new passkey",onClick:c,loading:n},onClose:y,watermark:!0,helpText:s||void 0,children:[0===e.length?(0,t.jsx)(b,{}):(0,t.jsx)(f,{children:(0,t.jsx)(x,{passkeys:e,expanded:d,onUnlink:l,onExpand:u})}),i?(0,t.jsxs)(g,{children:[(0,t.jsx)(v,{children:"New Passkey Name"}),(0,t.jsx)(m,{children:i})]}):null]}),f=s.styled.div`
  margin-bottom: 0.75rem;
`,g=s.styled.div`
  margin-top: 0.25rem;
`,v=s.styled.div`
  color: var(--privy-color-foreground-2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,m=s.styled.div`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`,x=({passkeys:e,expanded:r,onUnlink:a,onExpand:s})=>{let[d,c]=(0,n.useState)([]),l=r?e.length:2;return(0,t.jsxs)("div",{children:[(0,t.jsx)(S,{children:"Your passkeys"}),(0,t.jsxs)(j,{children:[e.slice(0,l).map(e=>(0,t.jsxs)(A,{children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(T,{children:e.authenticatorName?e.createdWithBrowser?`${e.authenticatorName} on ${e.createdWithBrowser}`:e.authenticatorName:e.createdWithBrowser?e.createdWithOs?`${e.createdWithBrowser} on ${e.createdWithOs}`:`${e.createdWithBrowser}`:"Unknown device"}),(0,t.jsxs)(E,{children:["Last used:"," ",(e.latestVerifiedAt??e.firstVerifiedAt)?.toLocaleString()??"N/A"]})]}),(0,t.jsx)(P,{disabled:d.includes(e.credentialId),onClick:()=>(async e=>{c(t=>t.concat([e])),await a(e),c(t=>t.filter(t=>t!==e))})(e.credentialId),children:d.includes(e.credentialId)?(0,t.jsx)(o.B,{}):(0,t.jsx)(i,{size:16})})]},e.credentialId)),e.length>2&&!r&&(0,t.jsx)(I,{onClick:s,children:"View all"})]})]})},b=()=>(0,t.jsxs)(d.T,{style:{color:"var(--privy-color-foreground)"},children:[(0,t.jsx)(d.a,{children:"Verify with Touch ID, Face ID, PIN, or hardware key"}),(0,t.jsx)(d.a,{children:"Takes seconds to set up and use"}),(0,t.jsx)(d.a,{children:"Use your passkey to verify transactions and login to your account"})]}),k={component:()=>{let{user:e}=(0,u.a)(),{unlink:r}=(0,p.u)(),{linkWithPasskey:a,closePrivyModal:i}=(0,l.u)(),{data:s}=(0,u.b)(),o=e?.linkedAccounts.filter(e=>"passkey"===e.type),[d,h]=(0,n.useState)(!1),[f,g]=(0,n.useState)(""),[v,m]=(0,n.useState)(!1),[x,b]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{0===o.length&&b(!1)},[o.length]),(0,t.jsx)(y,{passkeys:o,name:s?.passkeyAuthModalData?.name,isLoading:d,errorReason:f,success:v,expanded:x,onLinkPasskey:()=>{h(!0),a({name:s?.passkeyAuthModalData?.name}).then(()=>m(!0)).catch(e=>{if(e instanceof c.b){if(e.privyErrorCode===c.c.CANNOT_LINK_MORE_OF_TYPE)return void g("Cannot link more passkeys to account.");if(e.privyErrorCode===c.c.PASSKEY_NOT_ALLOWED)return void g("Passkey request timed out or rejected by user.")}g("Unknown error occurred.")}).finally(()=>{h(!1)})},onUnlinkPasskey:async e=>(h(!0),await r({credentialId:e}).then(()=>m(!0)).catch(e=>{e instanceof c.b&&e.privyErrorCode===c.c.MISSING_MFA_CREDENTIALS?g("Cannot unlink a passkey enrolled in MFA"):g("Unknown error occurred.")}).finally(()=>{h(!1)})),onExpand:()=>b(!0),onBack:()=>b(!1),onClose:()=>i()})}},w=s.styled.div`
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
`,C=s.css`
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
`,I=s.styled.button`
  ${C}
`,j=s.styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 0.5rem 0 0;
  flex-grow: 1;
  width: 100%;
`,S=s.styled.div`
  line-height: 20px;
  height: 20px;
  font-size: 1em;
  font-weight: 450;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`,T=s.styled.div`
  font-size: 1em;
  line-height: 1.3em;
  font-weight: 500;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,E=s.styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,A=s.styled.div`
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
`,N=s.css`
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
`,P=s.styled.button`
  ${N}
`;e.s(["DoubleIconWrapper",0,w,"LinkButton",0,I,"LinkPasskeyScreen",0,k,"LinkPasskeyView",0,y,"default",0,k],544771)},957539,e=>{"use strict";var t=e.i(375675),r=e.i(781929),a=e.i(544771);let i=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,n=t.styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,s=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`,o=t.styled.div`
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
`,c=(0,t.styled)(d)`
  && {
    font-size: 42px;
  }
`;t.styled.button`
  cursor: pointer;
  padding-left: 4px;
`;let l=t.styled.div`
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
`,(0,t.styled)(a.LinkButton)`
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
`;e.s(["F",0,s,"I",0,n,"a",0,o,"b",0,c,"c",0,l,"d",0,u,"e",0,d,"f",0,i,"g",0,h])},513656,e=>{"use strict";var t=e.i(811964);e.s(["parseEther",0,function(e,r="wei"){return t.fromEther(e,r)}])},574300,e=>{"use strict";e.s(["E",0,[{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],"a",0,[{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"}]])},738815,e=>{"use strict";var t=e.i(177117),r=e.i(7991),a=e.i(691983),i=e.i(513656),n=e.i(528284),s=e.i(849793),o=e.i(93755),d=e.i(336027),c=e.i(6906),l=e.i(680788),u=e.i(771427),p=e.i(215097),h=e.i(642754),y=e.i(657545),f=e.i(129945),g=e.i(526943),v=e.i(436896),m=e.i(463475),x=e.i(859427),b=e.i(312075),k=e.i(68297),w=e.i(608980),C=e.i(862953),I=e.i(574300),j=e.i(101179),S=e.i(809681),T=e.i(758188),E=e.i(573486),A=e.i(334240),N=e.i(709418),P=e.i(793206),$=e.i(623662),F=e.i(546453);let B={component:()=>{let{rpcConfig:e,appId:B,closePrivyModal:M,createAnalyticsEvent:U}=(0,k.u)(),{navigate:L,setModalData:W,data:q}=(0,m.b)(),z=(0,m.u)(),{wallets:_}=(0,C.u)(),[D,O]=(0,a.useState)(!1),[V,H]=(0,a.useState)(0n),[R,G]=(0,a.useState)(!1),[Y,K]=(0,a.useState)(null),[Q,X]=(0,a.useState)(null),[Z,J]=(0,a.useState)([]),[ee,et]=(0,a.useState)(0),[er,ea]=(0,a.useState)([]),[ei,en]=(0,a.useState)(!1),[es,eo]=(0,a.useState)(!1),[ed,ec]=(0,a.useState)(!1),[el,eu]=(0,a.useState)(!1),[ep,eh]=(0,a.useState)(),[ey,ef]=(0,a.useState)(),[eg,ev]=(0,a.useState)();if(!q?.funding||"ethereum"!==q.funding.chainType)throw Error("Invalid funding data");let{erc20ContractInfo:em,chain:ex,connectedWallet:eb}=q.funding,ek=q.funding.address,ew=q.funding.erc20Address,[eC,eI]=(0,a.useState)(q.funding.amount);(0,a.useEffect)(()=>{ew&&!em&&K(Error("Unable to fetch token details"))},[]);let ej=!!ew&&!!em,eS=ej?BigInt(parseFloat(eC)*10**em.decimals):(0,i.parseEther)(eC),eT=("ethereum"===eb?.type?eb:void 0)??_[0],eE=(0,b.u)(eT?.walletClientType||"unknown"),eA=eE?.name||"wallet",[eN,eP]=(0,a.useState)(null);(0,a.useEffect)(()=>{(async()=>{if(!eT)return;let e=await eT.getEthereumProvider();eP((0,n.createWalletClient)({account:eT.address,transport:(0,s.custom)(e)}).extend(o.publicActions))})().catch(console.error)},[eT]);let[e$,eF]=(0,a.useState)(0n);(0,a.useEffect)(()=>{(0,d.createPublicClient)({chain:ex,transport:(0,c.http)((0,$.a)(ex,e,B))}).getBalance({address:ek}).then(eF).catch(console.error)},[]);let[eB,eM]=(0,a.useState)(0n);(0,a.useEffect)(()=>{ej&&(0,P.g)({chain:ex,address:ek,appId:B,rpcConfig:e,erc20Address:ew}).then(e=>eM(e.balance)).catch(console.error)},[]);let{tokenPrice:eU}=(0,w.u)(ex.id),[eL,eW]=(0,a.useState)({to:ek,chain:ex,value:eS,data:void 0,requestId:void 0});(0,a.useEffect)(()=>{(async()=>{let t,r;if(!eN||!eT||ei||ed)return;en(!0);let a=(0,d.createPublicClient)({chain:eL.chain,transport:(0,c.http)((0,$.a)(eL.chain,e,B))});if(ej&&!eL.data)return await a.simulateContract({address:ew,chain:eL.chain,abi:I.E,functionName:"transfer",args:[ek,eS],account:eT.address}).catch(e=>{if("ContractFunctionZeroDataError"===e?.cause?.name||e?.message?.includes("returned no data"))return a.simulateContract({address:ew,chain:eL.chain,abi:I.a,functionName:"transfer",args:[ek,eS],account:eT.address}).catch(e=>{console.warn("Simulated token transfer failed with error, fetching bridge options.",e)});console.warn("Simulated token transfer failed with error, fetching bridge options.",e)})?(en(!1),void eW({to:ew,chain:eL.chain,data:(0,l.encodeFunctionData)({abi:I.E,functionName:"transfer",args:[ek,eS]}),value:"0x0",requestId:void 0})):(en(!1),void G(!0));try{t=await a.prepareTransactionRequest({account:eT.address,to:eL.to,chain:eL.chain,data:eL.data,value:BigInt(eL.value??0)})}catch(e){if(console.error(e),Z.length>1)X(e.shortMessage??"Something went wrong");else if(es&&0===Z.length)return void K(new x.P(`Wallet ${(0,b.f)(eT.address)} does not have enough funds.`,void 0,x.c.INSUFFICIENT_BALANCE))}if(!t)return en(!1),void G(!0);"eip1559"===t.type||"eip4844"===t.type||"eip7702"===t.type?void 0!==t.gasPrice&&delete t.gasPrice:("legacy"===t.type||"eip2930"===t.type)&&(void 0!==t.maxFeePerGas&&delete t.maxFeePerGas,void 0!==t.maxPriorityFeePerGas&&delete t.maxPriorityFeePerGas),en(!1),ec(!0),O(!0),H(t.gas);try{await eN.switchChain({id:eL.chain.id})}catch(e){await eN.addChain({chain:eL.chain}),await eN.switchChain({id:eL.chain.id})}try{r=await eN.sendTransaction(t)}catch(e){if(console.error(e),"TransactionExecutionError"===e.name)if(Z.length<1){let t=e.shortMessage;(e.shortMessage.includes("rejected the request")||e.details.includes("rejected the request"))&&(t="User rejected the request."),K(new x.P(t,void 0,x.c.TRANSACTION_FAILURE))}else X(e.shortMessage??"Something went wrong")}if(r){if(await eN.waitForTransactionReceipt({hash:r}),ec(!1),es){if(er.length>0){let[e,...t]=er;if(!e)return;return ea(t),void eW(e)}return eh(r),ef(eL.requestId),void ev("pending")}eu(!0),W((0,A.j)(q,"completed",r,eT?.walletClientType,ej,em,ex)),U({eventName:T.O,payload:{provider:"external",status:"success",txHash:r,address:eT.address,chainId:eL.chain.id,chainType:"ethereum",value:eL.value?(0,u.formatUnits)(BigInt(eL.value),em?.decimals??18):void 0,token:em?.symbol??ew??"ETH",destinationAddress:ek,destinationChainId:ex.id,destinationChainType:"ethereum",destinationValue:eS?(0,u.formatUnits)(eS,em?.decimals??18):void 0,destinationToken:em?.symbol??ew??ex.nativeCurrency.name}})}else ec(!1)})().catch(console.error)},[eN,eL]),(0,a.useEffect)(()=>{(async()=>{if(!R||!eN||!eT)return;let t=(0,p.addToDefaultChains)(z.chains).filter(e=>e.id!==ex.id&&!!e.testnet==!!ex.testnet);ej&&t.unshift(ex);let r=await (0,N.g)({chains:t,address:eT.address,appId:B,rpcConfig:e}),a=ej?r.filter(e=>e.balance>0n):r.filter(e=>e.balance>eS),i=ej&&r.every(e=>0n===e.balance);if(a.length<1)return void K(new x.P(i?`Wallet ${(0,b.f)(eT.address)} doesn't have enough funds to cover gas fees. Top up your wallet and try again.`:`Wallet ${(0,b.f)(eT.address)} does not have enough funds.`,void 0,x.c.INSUFFICIENT_BALANCE));a.sort((e,t)=>Number(ej?(t.erc20Balance??0n)-(e.erc20Balance??0n):t.balance-e.balance));let n=a.flatMap(e=>{let t=[{...e,isErc20Quote:!1,isTestnet:!!ex.testnet,input:(0,E.t)({appId:B,amount:eS.toString(),user:eT.address,recipient:ek,destinationChainId:ex.id,destinationCurrency:ew,originChainId:e.chain.id})}];return ej&&ew&&(e.erc20Balance??0n)>0n&&t.push({...e,isErc20Quote:!0,isTestnet:!!ex.testnet,input:(0,E.t)({appId:B,amount:eS.toString(),user:eT.address,recipient:ek,destinationChainId:ex.id,destinationCurrency:ew,originChainId:e.chain.id,originCurrency:e.erc20Address})}),t}),s=(await Promise.allSettled(n.map(async e=>({...e,quote:await (0,E.g)(e)})))).filter(e=>"fulfilled"===e.status).map(e=>e.value);if(s.length<1)return void K(new x.P(`Wallet ${(0,b.f)(eT.address)} does not have enough funds.`,void 0,x.c.INSUFFICIENT_BALANCE));let o=s.map(e=>({bridgeTx:(0,E.a)(e.quote),allTxSteps:(0,E.d)(e.quote),balance:e.balance,chain:e.chain,erc20Balance:e.erc20Balance,isErc20Quote:e.isErc20Quote})).filter(e=>!!e.bridgeTx);if(o.length>1)return void J(o);let d=o[0];if(!d)return void K(new x.P(`Wallet ${(0,b.f)(eT.address)} does not have enough funds.`,void 0,x.c.INSUFFICIENT_BALANCE));let[c,...l]=d.allTxSteps??[d.bridgeTx];c?(eo(!0),ea(l.map(e=>({...e,chain:d.chain}))),eW({data:c.data,to:c.to,value:c.value,requestId:c.requestId,chain:d.chain})):K(new x.P(`Wallet ${(0,b.f)(eT.address)} does not have enough funds.`,void 0,x.c.INSUFFICIENT_BALANCE))})().catch(console.error)},[R]),(0,E.u)({transactionHash:ep,requestId:ey,isTestnet:!!ex.testnet,bridgingStatus:eg,setBridgingStatus:ev,onSuccess({transactionHash:e}){eo(!1),eu(!0),W((0,A.j)(q,"completed",e,eT?.walletClientType,ej,em,ex)),U({eventName:T.O,payload:{provider:"external",status:"success",txHash:e,address:eT?.address,chainId:eL.chain.id,chainType:"ethereum",value:eL.value?(0,u.formatUnits)(BigInt(eL.value),em?.decimals??18):void 0,token:em?.symbol??ew??"ETH",destinationAddress:ek,destinationChainId:ex.id,destinationChainType:"ethereum",destinationValue:eS?(0,u.formatUnits)(eS,em?.decimals??18):void 0,destinationToken:em?.symbol??ew??ex.nativeCurrency.name}})},onFailure({error:e}){eo(!1),K(e)}}),(0,a.useEffect)(()=>{Y&&(W({funding:q?.funding,solanaFundingData:q?.solanaFundingData,sendTransaction:q?.sendTransaction,errorModalData:{error:Y,previousScreen:"TransferFromWalletScreen"}}),L("ErrorScreen",!1))},[Y]);let eq=!ej&&eU?(0,S.g)(eC??"0",eU):void 0,ez=ej?V:(0,S.s)([V,eS]),e_=ez&&eU?(0,S.a)(ez,eU):void 0,eD=ez?(0,S.b)(ez,q?.funding?.erc20Address?q?.funding?.erc20ContractInfo?.symbol||"ETH":q?.funding?.chain.nativeCurrency.symbol||"ETH"):void 0,eO=V&&eU?(0,S.a)(V,eU):void 0,eV=V?(0,S.b)(V,ex?.nativeCurrency?.symbol||"ETH"):void 0;if((0,a.useEffect)(()=>{if(!el)return;let e=setTimeout(M,m.j);return()=>clearTimeout(e)},[el]),el)return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(g.t,{}),(0,t.jsx)(h.R,{}),(0,t.jsxs)(h.C,{children:[(0,t.jsx)(r.default,{color:"var(--privy-color-success)",width:"64px",height:"64px"}),(0,t.jsx)(f.C,{title:"Success!",description:`You’ve successfully added ${eC} ${ej?em.symbol:ex.nativeCurrency.symbol} to your ${z.name} wallet. It may take a minute before the funds are available to use.`})]}),(0,t.jsx)(h.a,{}),(0,t.jsx)(y.B,{})]});let eH=ej?`${(0,j.f)({amount:eB,decimals:em.decimals})}  ${em.symbol}`:(0,S.b)(e$,ex.nativeCurrency.symbol,3,!0),eR=Z[ee];return Z.length>1&&eR?(0,t.jsx)(N.B,{displayName:eA,configuredFundingChain:ex,formattedBalance:eH,fundingAmount:eC,fundingCurrency:ej?em.symbol:ex.nativeCurrency.symbol,fundingAmountInUsd:eq,options:Z,selectedOption:eR,isPreparing:ei,isSubmitting:ed,addressToFund:ek,fundingWalletAddress:eT?.address||"",errorMessage:Q,onSubmit:()=>{if(q.funding?.amount===eC){let[e,...t]=eR.allTxSteps??[eR.bridgeTx];if(!e)return;return eo(!0),ea(t.map(e=>({...e,chain:eR.chain}))),void eW({to:e.to,data:e.data,value:e.value,requestId:e.requestId,chain:eR.chain})}(async function(){if(eT&&eR)try{let e=await (0,E.g)({isTestnet:!!ex.testnet,input:(0,E.t)({appId:B,amount:eS.toString(),user:eT.address,recipient:ek,destinationChainId:ex.id,destinationCurrency:ew,originChainId:eR.chain.id})}),[t,...r]=(0,E.d)(e);if(!t)throw Error("Invalid transaction request");eo(!0),ea(r.map(e=>({...e,chain:eR.chain}))),eW({data:t.data,to:t.to,value:t.value,requestId:t.requestId,chain:eR.chain})}catch(e){console.error(e),K(new x.P("Unable to fetch quotes for bridging",e,x.c.INSUFFICIENT_BALANCE))}})().catch(console.error)},onSelect:e=>{e!==ee&&(X(null),et(e))},onAmountChange:eI}):D&&V&&eT&&q?.funding?(0,t.jsx)(F.T,{walletClientType:eT?.walletClientType||"unknown",displayName:eA,addressToFund:ek,isBridging:es,isErc20Flow:ej,totalPriceInUsd:e_,totalPriceInNativeCurrency:eD,gasPriceInUsd:eO,gasPriceInNativeCurrency:eV,chainId:ex.id,chainName:ex.name}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(g.t,{}),(0,t.jsx)(v.N,{}),(0,t.jsx)("div",{style:{marginTop:"1rem"}}),(0,t.jsx)(y.B,{})]})}};e.s(["AwaitingExternalEthereumTransferScreen",0,B,"default",0,B])}]);