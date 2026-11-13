(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,815119,e=>{"use strict";var t=e.i(375675);let i=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.875rem; /* 166.667% */
  text-align: center;
`;e.s(["T",0,i])},608980,e=>{"use strict";var t=e.i(691983),i=e.i(215097),r=e.i(463475),n=e.i(68297),o=e.i(351190);e.s(["u",0,function(e){let{tokenPrice:a,isTokenPriceLoading:s,tokenPriceError:d}=(e=>{let{showFiatPrices:o,getUsdTokenPrice:a,chains:s}=(0,n.u)(),[d,l]=(0,t.useState)(!0),[c,u]=(0,t.useState)(void 0),[p,f]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{e||=r.C;let t=(0,i.addToDefaultChains)(s).find(t=>t.id===Number(e));(async()=>{if(o){if(!t)return l(!1),u(Error(`Unable to fetch token price on chain id ${e}`));try{l(!0);let e=await a(t);e?f(e):u(Error(`Unable to fetch token price on chain id ${t.id}`))}catch(e){u(e)}finally{l(!1)}}else l(!1)})()},[e]),{tokenPrice:p,isTokenPriceLoading:d,tokenPriceError:c}})("solana"===e?-1:e),{solPrice:l,isSolPriceLoading:c,solPriceError:u}=(0,o.u)({enabled:"solana"===e});return"solana"===e?{tokenPrice:l,isTokenPriceLoading:c,tokenPriceError:u}:{tokenPrice:a,isTokenPriceLoading:s,tokenPriceError:d}}])},642754,e=>{"use strict";var t=e.i(375675);let i=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,r=t.styled.div`
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
`,o=(0,t.styled)(r)`
  padding: 20px 0;
`,a=(0,t.styled)(r)`
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
`,e.s(["B",0,i,"C",0,a,"F",0,d,"H",0,n,"R",0,c,"S",0,l,"a",0,u,"b",0,p,"c",0,s,"d",0,o,"e",0,r])},351190,e=>{"use strict";var t=e.i(691983),i=e.i(68297);e.s(["u",0,({enabled:e=!0}={})=>{let{showFiatPrices:r,getUsdPriceForSol:n}=(0,i.u)(),[o,a]=(0,t.useState)(!0),[s,d]=(0,t.useState)(void 0),[l,c]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{(async()=>{if(r&&e)try{a(!0);let e=await n();e?c(e):d(Error("Unable to fetch SOL price"))}catch(e){d(e)}finally{a(!1)}else a(!1)})()},[]),{solPrice:l,isSolPriceLoading:o,solPriceError:s}}])},809681,e=>{"use strict";var t=e.i(368207),i=e.i(68297),r=e.i(312075);let n=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2}),o=(e,i=6,r=!1)=>{let n=parseFloat((0,t.formatEther)(e)).toFixed(i).replace(/0+$/,"").replace(/\.$/,"");return r?n:`${"0"===n?"<0.001":n}`};e.s(["a",0,(e,i)=>{let r,o=(r=i*parseFloat((0,t.formatEther)(e)),n.format(r));return"$0.00"===o?"<$0.01":o},"b",0,(e,t,i=6,r=!1)=>`${o(e,i,r)} ${t}`,"c",0,(e,t)=>{let{chains:n}=(0,i.u)(),o=`https://etherscan.io/address/${t}`,a=`${(0,r.d)(e,n)}/address/${t}`;try{new URL(a)}catch{return o}return a},"g",0,(e,t)=>{let i,r=(i=t*parseFloat(e),n.format(i));return"$0.00"!==r?r:"<$0.01"},"p",0,o,"s",0,e=>e.reduce((e,t)=>e+t,0n)])},526943,e=>{"use strict";var t=e.i(177117),i=e.i(463475),r=e.i(781929);e.s(["t",0,function({title:e}){let{currentScreen:n,navigateBack:o,navigate:a,data:s,setModalData:d}=(0,i.b)();return(0,t.jsx)(r.M,{title:e,backFn:"ManualTransferScreen"===n?o:n===s?.funding?.methodScreen?s.funding.comingFromSendTransactionScreen?()=>a("SendTransactionScreen"):void 0:s?.funding?.methodScreen?()=>{let e=s.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),d({funding:e,solanaFundingData:s?.solanaFundingData}),a(e.methodScreen)}:void 0})}])},957539,e=>{"use strict";var t=e.i(375675),i=e.i(781929),r=e.i(544771);let n=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,o=t.styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,a=t.styled.div`
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
`,(0,t.styled)(r.LinkButton)`
  margin-top: 16px;
`;let p=t.keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;(0,t.styled)(i.a)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${p} 0.3s ease-in-out;
`;let f=t.styled.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;e.s(["F",0,a,"I",0,o,"a",0,s,"b",0,l,"c",0,c,"d",0,u,"e",0,d,"f",0,n,"g",0,f])},307869,e=>{"use strict";var t=e.i(177117),i=e.i(691983),r=e.i(781929),n=e.i(642754),o=e.i(657545),a=e.i(526943),s=e.i(436896),d=e.i(815119),l=e.i(463475),c=e.i(608980),u=e.i(809681),p=e.i(957539);let f={component:()=>{let{data:e,setModalData:f}=(0,l.b)(),g=e?.funding,x="solana"===g.chainType,y=(0,i.useRef)(null),{tokenPrice:h}=(0,c.u)(x?"solana":g.chain.id),m=x?void 0:g,v=!(!m?.erc20Address||m?.erc20ContractInfo),b=x?g.isUSDC?"USDC":"SOL":g.erc20Address?g.erc20ContractInfo?.symbol:g.chain.nativeCurrency.symbol||"ETH",S=parseFloat(g.amount),k=!isNaN(S)&&S>0,w=h?(0,u.g)(g.amount,h):void 0;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.t,{}),(0,t.jsx)(d.T,{children:"Confirm or edit amount"}),(0,t.jsxs)(n.c,{style:{marginTop:"32px"},children:[(0,t.jsx)(p.F,{children:v?(0,t.jsx)(s.N,{size:"50px"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(p.a,{onClick:()=>y.current?.focus(),children:[(0,t.jsx)(p.b,{ref:y,value:g.amount,onChange:t=>{let i=t.target.value;/^[0-9.]*$/.test(i)&&i.split(".").length-1<=1&&f({...e,funding:{...g,amount:i},solanaFundingData:e?.solanaFundingData?{...e.solanaFundingData,amount:i}:void 0})}}),(0,t.jsx)(p.c,{children:b})]}),!m?.erc20Address&&!(x&&g.isUSDC)&&(0,t.jsx)(p.d,{children:w&&k?`${w} USD`:""})]})}),(0,t.jsx)(r.b,{style:{marginTop:"1rem"},disabled:!k,onClick:g.onContinueWithExternalWallet,children:"Continue"})]}),(0,t.jsx)(o.B,{})]})}};e.s(["FundingAmountEditScreen",0,f,"default",0,f])}]);