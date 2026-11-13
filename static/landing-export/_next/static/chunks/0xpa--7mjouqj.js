(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,758188,e=>{"use strict";e.s(["O",0,"sdk_fiat_on_ramp_completed_with_status"])},526943,e=>{"use strict";var t=e.i(177117),n=e.i(463475),a=e.i(781929);e.s(["t",0,function({title:e}){let{currentScreen:r,navigateBack:i,navigate:o,data:s,setModalData:d}=(0,n.b)();return(0,t.jsx)(a.M,{title:e,backFn:"ManualTransferScreen"===r?i:r===s?.funding?.methodScreen?s.funding.comingFromSendTransactionScreen?()=>o("SendTransactionScreen"):void 0:s?.funding?.methodScreen?()=>{let e=s.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),d({funding:e,solanaFundingData:s?.solanaFundingData}),o(e.methodScreen)}:void 0})}])},144407,e=>{"use strict";var t=e.i(177117);e.s(["W",0,({...e})=>(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...e,children:[(0,t.jsx)("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}),(0,t.jsx)("path",{d:"M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"}),(0,t.jsx)("path",{d:"M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"})]})])},957539,e=>{"use strict";var t=e.i(375675),n=e.i(781929),a=e.i(544771);let r=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,i=t.styled.div`
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
`,(0,t.styled)(a.LinkButton)`
  margin-top: 16px;
`;let h=t.keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;(0,t.styled)(n.a)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${h} 0.3s ease-in-out;
`;let p=t.styled.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;e.s(["F",0,o,"I",0,i,"a",0,s,"b",0,l,"c",0,c,"d",0,u,"e",0,d,"f",0,r,"g",0,p])},431924,e=>{"use strict";var t=e.i(177117),n=e.i(691983);let a=n.forwardRef(function({title:e,titleId:t,...a},r){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},a),e?n.createElement("title",{id:t},e):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"}))});var r=e.i(375675);let i=r.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-info-bg);
  border: 1px solid var(--privy-color-border-info);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,o=r.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  flex: 1;
  text-align: left;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["I",0,({children:e,theme:n,className:r})=>(0,t.jsxs)(i,{$theme:n,className:r,children:[(0,t.jsx)(a,{width:"16px",height:"16px",color:"var(--privy-color-foreground-2)",strokeWidth:2,style:{flexShrink:0}}),(0,t.jsx)(o,{$theme:n,children:e})]})],431924)},384759,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{fillRule:"evenodd",d:"M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z",clipRule:"evenodd"}))});e.s(["default",0,n])},459383,e=>{"use strict";var t=e.i(757086),n=e.i(691983),a=e.i(463475),r=e.i(68297),i=e.i(758188);let o="moonpay";e.s(["a",0,function(e){return parseFloat(e)},"u",0,function(e,s=!1){let[d,l]=(0,n.useState)(null),{createAnalyticsEvent:c}=(0,r.u)(),{data:u,navigate:h,setModalData:p}=(0,a.b)(),g=u?.funding,f=(0,n.useRef)(0);return(0,n.useEffect)(()=>{let n=setInterval(async()=>{if(e)try{let[r]=await async function(e,n){return(0,t.ofetch)(`${n?a.M:a.k}/transactions/ext/${e}`,{query:{apiKey:n?a.l:a.m}})}(e,s),d="waitingAuthorization"===r.status&&"credit_debit_card"===r.paymentMethod?"pending":r.status;if(["failed","completed","awaitingAuthorization"].includes(d)&&(c({eventName:i.O,payload:{status:d,provider:o,paymentMethod:r.paymentMethod,cardPaymentType:r.cardPaymentType,currency:r.currency?.code,baseCurrencyAmount:r.baseCurrencyAmount,quoteCurrencyAmount:r.quoteCurrencyAmount,feeAmount:r.feeAmount,extraFeeAmount:r.extraFeeAmount,networkFeeAmount:r.networkFeeAmount,isSandbox:s}}),clearInterval(n)),"failed"===d||"serviceFailure"===d)return p({funding:{...g,errorMessage:"Something went wrong adding funds from Moonpay. Please try again or use another method to fund your wallet."},solanaFundingData:u?.solanaFundingData}),void h("FundingMethodSelectionScreen");l(d)}catch(e){404!==e.response?.status&&(f.current+=1),f.current>=3&&(c({eventName:i.O,payload:{status:"serviceFailure",provider:o}}),clearInterval(n),p({funding:{...g,errorMessage:"Something went wrong adding funds from Moonpay. Please try again or use another method to fund your wallet."},solanaFundingData:u?.solanaFundingData}),h("FundingMethodSelectionScreen"))}},3e3);return()=>clearInterval(n)},[e,f]),d}])},712722,e=>{"use strict";var t=e.i(691983);let n=t.forwardRef(function({title:e,titleId:n,...a},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"}))});e.s(["default",0,n])},115965,e=>{"use strict";var t=e.i(177117),n=e.i(712722),a=e.i(375675);let r=a.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-error-bg);
  border: 1px solid var(--privy-color-border-error);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,i=a.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["E",0,({children:e,theme:a,className:o})=>(0,t.jsxs)(r,{$theme:a,className:o,children:[(0,t.jsx)(n.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-error)",strokeWidth:2,style:{flexShrink:0}}),(0,t.jsx)(i,{$theme:a,children:e})]})])},469183,e=>{"use strict";var t=e.i(336027),n=e.i(6906),a=e.i(623662);let r=async({address:e,chain:r,rpcConfig:o,privyAppId:s})=>{try{let d=(0,t.createPublicClient)({chain:r,transport:(0,n.http)((0,a.a)(r,o,s))}),[l,c]=await Promise.all([d.readContract({abi:i,address:e,functionName:"symbol"}),d.readContract({abi:i,address:e,functionName:"decimals"})]);return{decimals:c,symbol:l}}catch(e){return console.log(e),null}},i=[{inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"}];e.s(["g",0,r])},2620,442629,e=>{"use strict";var t=e.i(177117);e.s(["A",0,e=>(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 210.2",xmlSpace:"preserve",...e,children:(0,t.jsx)("path",{d:"M93.6,27.1C87.6,34.2,78,39.8,68.4,39c-1.2-9.6,3.5-19.8,9-26.1c6-7.3,16.5-12.5,25-12.9  C103.4,10,99.5,19.8,93.6,27.1 M102.3,40.9c-13.9-0.8-25.8,7.9-32.4,7.9c-6.7,0-16.8-7.5-27.8-7.3c-14.3,0.2-27.6,8.3-34.9,21.2  c-15,25.8-3.9,64,10.6,85c7.1,10.4,15.6,21.8,26.8,21.4c10.6-0.4,14.8-6.9,27.6-6.9c12.9,0,16.6,6.9,27.8,6.7  c11.6-0.2,18.9-10.4,26-20.8c8.1-11.8,11.4-23.3,11.6-23.9c-0.2-0.2-22.4-8.7-22.6-34.3c-0.2-21.4,17.5-31.6,18.3-32.2  C123.3,42.9,107.7,41.3,102.3,40.9 M182.6,11.9v155.9h24.2v-53.3h33.5c30.6,0,52.1-21,52.1-51.4c0-30.4-21.1-51.2-51.3-51.2H182.6z   M206.8,32.3h27.9c21,0,33,11.2,33,30.9c0,19.7-12,31-33.1,31h-27.8V32.3z M336.6,169c15.2,0,29.3-7.7,35.7-19.9h0.5v18.7h22.4V90.2  c0-22.5-18-37-45.7-37c-25.7,0-44.7,14.7-45.4,34.9h21.8c1.8-9.6,10.7-15.9,22.9-15.9c14.8,0,23.1,6.9,23.1,19.6v8.6l-30.2,1.8  c-28.1,1.7-43.3,13.2-43.3,33.2C298.4,155.6,314.1,169,336.6,169z M343.1,150.5c-12.9,0-21.1-6.2-21.1-15.7c0-9.8,7.9-15.5,23-16.4  l26.9-1.7v8.8C371.9,140.1,359.5,150.5,343.1,150.5z M425.1,210.2c23.6,0,34.7-9,44.4-36.3L512,54.7h-24.6l-28.5,92.1h-0.5  l-28.5-92.1h-25.3l41,113.5l-2.2,6.9c-3.7,11.7-9.7,16.2-20.4,16.2c-1.9,0-5.6-0.2-7.1-0.4v18.7C417.3,210,423.3,210.2,425.1,210.2z"})})],2620),e.s(["G",0,e=>(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 80 38.1",xmlSpace:"preserve",...e,children:[(0,t.jsx)("path",{style:{fill:"#5F6368"},d:"M37.8,19.7V29h-3V6h7.8c1.9,0,3.7,0.7,5.1,2c1.4,1.2,2.1,3,2.1,4.9c0,1.9-0.7,3.6-2.1,4.9c-1.4,1.3-3.1,2-5.1,2  L37.8,19.7L37.8,19.7z M37.8,8.8v8h5c1.1,0,2.2-0.4,2.9-1.2c1.6-1.5,1.6-4,0.1-5.5c0,0-0.1-0.1-0.1-0.1c-0.8-0.8-1.8-1.3-2.9-1.2  L37.8,8.8L37.8,8.8z"}),(0,t.jsx)("path",{style:{fill:"#5F6368"},d:"M56.7,12.8c2.2,0,3.9,0.6,5.2,1.8s1.9,2.8,1.9,4.8V29H61v-2.2h-0.1c-1.2,1.8-2.9,2.7-4.9,2.7  c-1.7,0-3.2-0.5-4.4-1.5c-1.1-1-1.8-2.4-1.8-3.9c0-1.6,0.6-2.9,1.8-3.9c1.2-1,2.9-1.4,4.9-1.4c1.8,0,3.2,0.3,4.3,1v-0.7  c0-1-0.4-2-1.2-2.6c-0.8-0.7-1.8-1.1-2.9-1.1c-1.7,0-3,0.7-3.9,2.1l-2.6-1.6C51.8,13.8,53.9,12.8,56.7,12.8z M52.9,24.2  c0,0.8,0.4,1.5,1,1.9c0.7,0.5,1.5,0.8,2.3,0.8c1.2,0,2.4-0.5,3.3-1.4c1-0.9,1.5-2,1.5-3.2c-0.9-0.7-2.2-1.1-3.9-1.1  c-1.2,0-2.2,0.3-3,0.9C53.3,22.6,52.9,23.3,52.9,24.2z"}),(0,t.jsx)("path",{style:{fill:"#5F6368"},d:"M80,13.3l-9.9,22.7h-3l3.7-7.9l-6.5-14.7h3.2l4.7,11.3h0.1l4.6-11.3H80z"}),(0,t.jsx)("path",{style:{fill:"#4285F4"},d:"M25.9,17.7c0-0.9-0.1-1.8-0.2-2.7H13.2v5.1h7.1c-0.3,1.6-1.2,3.1-2.6,4v3.3H22C24.5,25.1,25.9,21.7,25.9,17.7z"}),(0,t.jsx)("path",{style:{fill:"#34A853"},d:"M13.2,30.6c3.6,0,6.6-1.2,8.8-3.2l-4.3-3.3c-1.2,0.8-2.7,1.3-4.5,1.3c-3.4,0-6.4-2.3-7.4-5.5H1.4v3.4  C3.7,27.8,8.2,30.6,13.2,30.6z"}),(0,t.jsx)("path",{style:{fill:"#FBBC04"},d:"M5.8,19.9c-0.6-1.6-0.6-3.4,0-5.1v-3.4H1.4c-1.9,3.7-1.9,8.1,0,11.9L5.8,19.9z"}),(0,t.jsx)("path",{style:{fill:"#EA4335"},d:"M13.2,9.4c1.9,0,3.7,0.7,5.1,2l0,0l3.8-3.8c-2.4-2.2-5.6-3.5-8.8-3.4c-5,0-9.6,2.8-11.8,7.3l4.4,3.4  C6.8,11.7,9.8,9.4,13.2,9.4z"})]})],442629)},911788,e=>{"use strict";var t=e.i(691983);e.s(["u",0,e=>{let[n,a]=(0,t.useState)();return(0,t.useEffect)(()=>{e().then(e=>{a(e)}).catch(()=>{})},[]),n}])},625425,e=>{"use strict";var t=e.i(177117),n=e.i(691983);let a=n.forwardRef(function({title:e,titleId:t,...a},r){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},a),e?n.createElement("title",{id:t},e):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"}))}),r=n.forwardRef(function({title:e,titleId:t,...a},r){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},a),e?n.createElement("title",{id:t},e):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"}),n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"}))});var i=e.i(384759),o=e.i(168889),s=e.i(657545),d=e.i(526943),l=e.i(115965),c=e.i(431924),u=e.i(2620),h=e.i(442629),p=e.i(463475),g=e.i(312075),f=e.i(911788),m=e.i(68297),v=e.i(862953),y=e.i(144407),x=e.i(469183),w=e.i(215097),b=e.i(795086),M=e.i(852714),C=e.i(859427),F=e.i(459383),j=e.i(659366),k=e.i(612780),S=e.i(957539);let A={[w.mainnet.id]:"ethereum",[w.base.id]:"base",[w.optimism.id]:"optimism",[w.polygon.id]:"polygon",[w.arbitrum.id]:"arbitrum",[w.avalanche.id]:"avacchain",[w.monadMainnet.id]:"monad"},T=(e,t,n,a,r,i)=>new Promise(async(o,s)=>{let d=(0,M.trigger)();if(!d)return void s(Error("Unable to initialize flow"));let l="ethereum"===t.chainType?function(e){let t=A[e];if(!t)throw new C.P(`Unsupported chainId: ${e} for Coinbase Onramp`);return t}(t.chain.id):"solana",c=t.isUSDC?"USDC":"ethereum"===t.chainType?(0,b.toCoinbaseAssetId)(t.chain.id,"native-currency"):"SOL",u=await e.initCoinbaseOnRamp({addresses:[{address:t.address,blockchains:[l]}],assets:[c]}),{url:h}=(0,b.getCoinbaseOnRampUrl)({appId:e.getAppId(),input:u,amount:t.amount,blockchain:l,asset:c,experience:i});d.location=h.toString();let p={...r?.funding,showAlternateFundingMethod:!0};t.usingDefaultFundingMethod&&(p.usingDefaultFundingMethod=!1),n({funding:p,solanaFundingData:r?.solanaFundingData,coinbaseOnrampStatus:{popup:d}}),a("CoinbaseOnrampStatusScreen"),e.createAnalyticsEvent({eventName:"sdk_fiat_on_ramp_started",payload:{provider:"coinbase-onramp",value:t.amount,chainType:t.chainType,chainId:"ethereum"===t.chainType?t.chain.id:t.chain}}),setTimeout(()=>{n({funding:p,solanaFundingData:r?.solanaFundingData,coinbaseOnrampStatus:{partnerUserId:u.partner_user_id,popup:d}})},5e3),o()}),W=async(e,t,n,a,r,i,o,s)=>{let d=(0,M.trigger)();if(!d)throw Error("Unable to initialize flow");let l="ethereum"===t.chainType?(0,b.chainToMoonpayCurrency)(t.chain.id,a):t.isUSDC?"USDC_SOL":"SOL",{signedUrl:c,externalTransactionId:u}=await e.signMoonpayOnRampUrl({address:t.address,useSandbox:n.fundingMethodConfig.moonpay.useSandbox??!1,config:{uiConfig:{accentColor:n.appearance.palette.accent,theme:n.appearance.palette.colorScheme},paymentMethod:s,currencyCode:l,quoteCurrencyAmount:(0,F.a)(t.amount)}});e.createAnalyticsEvent({eventName:"sdk_fiat_on_ramp_started",payload:{provider:"moonpay",value:t.amount,chainType:t.chainType,chainId:"ethereum"===t.chainType?t.chain.id:t.chain}}),d.location=c;let h={...o?.funding,showAlternateFundingMethod:!0};t.usingDefaultFundingMethod&&(h.usingDefaultFundingMethod=!1),r({moonpayStatus:{},funding:h,solanaFundingData:o?.solanaFundingData}),i("MoonpayStatusScreen"),setTimeout(()=>{r({moonpayStatus:{externalTransactionId:u},funding:h,solanaFundingData:o?.solanaFundingData})},8e3)},D={component:()=>{let{wallets:e}=(0,v.u)(),{connectors:w}=(0,m.u)(),M=w.filter(g.j).flatMap(e=>e.wallets),{navigate:C,data:F,setModalData:A}=(0,p.b)(),{client:D}=(0,m.u)(),E=(0,p.u)(),L=F?.funding,I=(0,j.i)(),z=(0,f.u)(j.a),O="solana"===L.chainType,_=O?void 0:L,Z=(0,n.useMemo)(()=>((e,t,n,a,r,i)=>{let o,s,d="solana"===n.chainType,l=d?void 0:n,c=n.isUSDC?"USDC":l?.erc20Address?void 0:"native-currency",u=!!d||c&&(0,b.isSupportedChainIdForMoonpay)(Number(n.chain.id),c),h=!!d||c&&(0,b.isSupportedChainIdForCoinbaseOnramp)(Number(n.chain.id),c),p=[];for(let o of(n.preferredCardProvider&&n.supportedOptions.sort(e=>e.provider===n.preferredCardProvider?-1:1),n.supportedOptions))"card"===o.method&&"coinbase"===o.provider&&h&&p.push(()=>T(t,n,a,r,i,"buy")),"card"===o.method&&"moonpay"===o.provider&&u&&c&&p.push(()=>W(t,n,e,c,a,r,i,"credit_debit_card"));for(let e of n.supportedOptions)"exchange"===e.method&&"coinbase"===e.provider&&h&&(o=()=>T(t,n,a,r,i,"buy"));for(let e of i?.funding?.supportedOptions??[])"wallets"===e.method&&(s=()=>r("TransferFromWalletScreen"));return{onFundWithCard:p,onFundWithExchange:o,onFundWithWallet:s}})(E,D,L,A,C,F),[E,D,L,F,A,C]),B=O?M.find(({address:e})=>e===L.address):e.find(({address:e})=>(0,o.getAddress)(e)===(0,o.getAddress)(L.address)),U=(0,g.u)(B?.walletClientType||"unknown"),H=U?.name||"wallet",R=B&&"privy"!==B.walletClientType?H:E.name,P=(0,n.useMemo)(()=>L.uiConfig?.landing?.title?L.uiConfig?.landing?.title:`Add funds to your ${R?.toLowerCase().endsWith("wallet")?R:R+" wallet"}`,[L.uiConfig?.landing?.title,R]);(0,n.useEffect)(()=>{if(L?.defaultFundingMethod&&L.usingDefaultFundingMethod)switch(A({funding:{...L,usingDefaultFundingMethod:!1},solanaFundingData:F?.solanaFundingData}),L?.defaultFundingMethod){case"card":Z.onFundWithCard[0]&&Z.onFundWithCard[0]();break;case"exchange":Z.onFundWithExchange&&Z.onFundWithExchange();break;case"wallet":Z.onFundWithWallet&&Z.onFundWithWallet();break;case"manual":C("ManualTransferScreen")}},[]),(0,n.useEffect)(()=>{_?.erc20Address&&!_.erc20ContractInfo&&(0,x.g)({address:_.erc20Address,chain:_.chain,rpcConfig:E.rpcConfig,privyAppId:E.id}).then(e=>{A({...F,funding:{..._,erc20ContractInfo:e?{symbol:e.symbol,decimals:e.decimals}:void 0}})}).catch(console.error)},[_?.erc20Address,_?.chain]);let $=!(!_?.erc20Address||_?.erc20ContractInfo);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.t,{}),(0,t.jsx)("h3",{children:P}),(0,t.jsxs)(S.f,{children:[L.errorMessage&&(0,t.jsx)(l.E,{theme:E.appearance.palette.colorScheme,children:L.errorMessage}),Z.onFundWithCard?.[0]&&(0,t.jsxs)(k.L,{disabled:$,onClick:Z.onFundWithCard[0],children:[(0,t.jsx)(S.I,{children:(0,t.jsx)(a,{style:{width:24}})}),"Pay with card",I?(0,t.jsx)(u.A,{style:{marginLeft:"auto",maxWidth:"100%",width:"auto",height:"0.875rem"}}):z?(0,t.jsx)(h.G,{style:{marginLeft:"auto",maxWidth:"100%",width:"auto",height:"0.875rem"}}):null]}),Z.onFundWithExchange&&(0,t.jsxs)(k.L,{disabled:$,onClick:Z.onFundWithExchange,children:[(0,t.jsx)(S.I,{children:(0,t.jsx)(i.default,{style:{width:24}})}),"Transfer from an exchange"]}),Z.onFundWithWallet&&(0,t.jsxs)(k.L,{disabled:$,onClick:Z.onFundWithWallet,children:[(0,t.jsx)(S.I,{children:(0,t.jsx)(y.W,{style:{width:24}})}),"Transfer from wallet"]}),(0,t.jsxs)(k.L,{disabled:$,onClick:()=>C("ManualTransferScreen"),children:[(0,t.jsx)(S.I,{children:(0,t.jsx)(r,{style:{width:24}})}),"Receive funds"]}),L?.showAlternateFundingMethod&&Z.onFundWithCard?.[1]&&(0,t.jsxs)(c.I,{theme:E.appearance.palette.colorScheme,children:["Having trouble or facing location restrictions?"," ",(0,t.jsx)(S.g,{onClick:Z.onFundWithCard[1],children:"Try a different provider."})]})]}),(0,t.jsx)(s.B,{})]})}};e.s(["FundingMethodSelectionScreen",0,D,"default",0,D],625425)}]);