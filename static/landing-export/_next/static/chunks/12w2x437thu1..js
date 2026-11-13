(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67820,e=>{"use strict";var n=e.i(375675);let t=n.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,l=n.css`
  ${e=>e.$isLoading?n.css`
          width: 35%;
          animation: ${t} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,l])},266799,e=>{"use strict";var n=e.i(177117),t=e.i(375675),l=e.i(67820);let a=t.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let n,l;"green"===e.$color&&(n="var(--privy-color-success-dark)",l="var(--privy-color-success-light)"),"red"===e.$color&&(n="var(--privy-color-error)",l="var(--privy-color-error-light)"),"gray"===e.$color&&(n="var(--privy-color-foreground-2)",l="var(--privy-color-background-2)");let a=t.keyframes`
      from, to {
        background-color: ${l};
      }

      50% {
        background-color: rgba(${l}, 0.8);
      }
    `;return t.css`
      color: ${n};
      background-color: ${l};
      ${e.$isPulsing&&t.css`
        animation: ${a} 3s linear infinite;
      `};
    `}}

  ${l.L}
`;e.s(["C",0,({children:e,color:t,isLoading:l,isPulsing:i,...o})=>(0,n.jsx)(a,{$color:t,$isLoading:l,$isPulsing:i,...o,children:e})])},960256,e=>{"use strict";var n=e.i(375675);let t=n.styled.span`
  margin-top: 4px;
  color: var(--privy-color-foreground);
  text-align: center;

  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */

  && a {
    color: var(--privy-color-accent);
  }
`;e.s(["S",0,t])},957539,e=>{"use strict";var n=e.i(375675),t=e.i(781929),l=e.i(544771);let a=n.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,i=n.styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,o=n.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`,r=n.styled.div`
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
`;n.styled.div`
  font-size: 42px !important;
`;let c=n.styled.input`
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
`,s=(0,n.styled)(c)`
  && {
    font-size: 42px;
  }
`;n.styled.button`
  cursor: pointer;
  padding-left: 4px;
`;let d=n.styled.div`
  font-size: 18px;
`,p=n.styled.div`
  font-size: 12px;
  color: var(--privy-color-foreground-3);
  /* we need this container to maintain a static height if there's no content */
  height: 20px;
`;n.styled.div`
  display: flex;
  flex-direction: row;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  svg {
    margin: auto;
  }
`,(0,n.styled)(l.LinkButton)`
  margin-top: 16px;
`;let u=n.keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;(0,n.styled)(t.a)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${u} 0.3s ease-in-out;
`;let y=n.styled.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;e.s(["F",0,o,"I",0,i,"a",0,r,"b",0,s,"c",0,d,"d",0,p,"e",0,c,"f",0,a,"g",0,y])},129945,e=>{"use strict";var n=e.i(177117),t=e.i(375675);let l=({title:e,description:t,children:l,...i})=>(0,n.jsx)(a,{...i,children:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("h3",{children:e}),"string"==typeof t?(0,n.jsx)("p",{children:t}):t,l]})});(0,t.styled)(l)`
  margin-bottom: 24px;
`;let a=t.styled.div`
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
`,i=(0,t.styled)(a)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`;e.s(["C",0,({title:e,description:t,icon:l,children:a,...o})=>(0,n.jsxs)(i,{...o,children:[l||null,(0,n.jsx)("h3",{children:e}),t&&"string"==typeof t?(0,n.jsx)("p",{children:t}):t,a]}),"S",0,l])},526943,e=>{"use strict";var n=e.i(177117),t=e.i(463475),l=e.i(781929);e.s(["t",0,function({title:e}){let{currentScreen:a,navigateBack:i,navigate:o,data:r,setModalData:c}=(0,t.b)();return(0,n.jsx)(l.M,{title:e,backFn:"ManualTransferScreen"===a?i:a===r?.funding?.methodScreen?r.funding.comingFromSendTransactionScreen?()=>o("SendTransactionScreen"):void 0:r?.funding?.methodScreen?()=>{let e=r.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),c({funding:e,solanaFundingData:r?.solanaFundingData}),o(e.methodScreen)}:void 0})}])},779414,e=>{"use strict";var n=e.i(691983);let t=n.forwardRef(function({title:e,titleId:t,...l},a){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},l),e?n.createElement("title",{id:t},e):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"}))});e.s(["default",0,t])},473056,e=>{"use strict";var n=e.i(177117),t=e.i(779414);e.s(["I",0,({icon:e,name:l})=>"string"==typeof e?(0,n.jsx)("img",{alt:`${l||"wallet"} logo`,src:e,style:{height:24,width:24,borderRadius:4}}):void 0===e?(0,n.jsx)(t.default,{style:{height:24,width:24}}):e?(0,n.jsx)(e,{style:{height:24,width:24}}):null])},209086,e=>{"use strict";let n=(0,e.i(319546).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,n],209086)},675052,e=>{"use strict";var n=e.i(177117),t=e.i(209086),l=e.i(612780);e.s(["W",0,({onClick:e,text:a})=>(0,n.jsxs)(l.L,{onClick:e,children:[(0,n.jsx)(l.a,{children:(0,n.jsx)(t.Wallet,{})}),(0,n.jsx)(l.G,{children:a})]})])},840459,e=>{"use strict";var n=e.i(177117),t=e.i(691983),l=e.i(657545),a=e.i(781929),i=e.i(129945),o=e.i(526943),r=e.i(473056),c=e.i(266799),s=e.i(960256),d=e.i(463475),p=e.i(312075),u=e.i(68297),y=e.i(862953),h=e.i(675052),g=e.i(561774),f=e.i(375675),m=e.i(334240),w=e.i(612780),x=e.i(957539);let v=({provider:e,displayName:l,logo:a,connectOnly:i,connector:o})=>{let c,{navigate:s,setModalData:y}=(0,d.b)(),{connectWallet:h,walletConnectionStatus:f}=(0,u.u)(),x=(0,w.b)(),[v,j]=(0,t.useState)(!1),S="wallet_connect_v2"===o.connectorType?e:o.walletClientType,[$,_]=(0,t.useState)(!1);(0,t.useEffect)(()=>{$&&("connected"===f?.status||f?.connectError)&&(s(i?"ConnectOnlyStatusScreen":"ConnectionStatusScreen"),_(!1))},[$,f]);let k=(0,p.u)(e),W=window.matchMedia("(display-mode: standalone)").matches,O=(0,p.k)({connectorType:o.connectorType,walletClientType:S});c=O&&O.chainTypes.includes(o.chainType)?()=>{O.isInstalled||"solana"===o.chainType&&"isInstalled"in o&&o.isInstalled?(h(o,S),s(i?"ConnectOnlyStatusScreen":"ConnectionStatusScreen")):(0,p.l)({isMobile:g.isMobile,walletConfig:O})?(y(n=>({...n,externalConnectWallet:{...n?.externalConnectWallet,preSelectedWalletId:e,walletChainType:"solana"===o.chainType?"solana-only":"ethereum-only"}})),s(i?"ConnectOnlyLandingScreen":"AuthenticateWithWalletScreen")):g.isMobile?(y({installWalletModalData:{walletConfig:O,chainType:o.chainType,connectOnly:i}}),s("WalletInterstitialScreen")):(y({installWalletModalData:{walletConfig:O,chainType:o.chainType,connectOnly:i}}),s("InstallWalletScreen"))}:"coinbase_wallet"!==o.connectorType||"eoaOnly"!==o.coinbaseWalletConfig.preference?.options||!g.isMobile||W||(0,p.m)()?()=>{if(!(0,m.o)(window.navigator.userAgent)||event?.isTrusted){if("mobile_wallet_adapter"===o.walletClientType)return h(o,S),void _(!0);h(o,S),i?"wallet_connect_v2"===o.connectorType?(y(e=>({...e,externalConnectWallet:{...e?.externalConnectWallet,preSelectedWalletId:"wallet_connect_qr"}})),s("ConnectOnlyLandingScreen")):s("ConnectOnlyStatusScreen"):s("ConnectionStatusScreen")}}:()=>{window.location.href=`https://go.cb-w.com/dapp?cb_url=${encodeURI(window.location.href)}`};let M=l||k?.metadata?.shortName||k?.name||o.walletClientType;return(0,n.jsxs)(T,{onClick:()=>{v||(j(!0),setTimeout(()=>j(!1),2e3),c())},disabled:v,children:[(0,n.jsx)(r.I,{icon:a||k?.image_url?.md,name:M}),(0,n.jsx)("span",{children:M}),(0,n.jsxs)(b,{id:"chip-container",children:[x?.walletClientType===S&&x?.chainType===o.chainType?(0,n.jsx)(C,{color:"gray",children:"Recent"}):(0,n.jsx)("span",{id:"connect-text",children:"Connect"}),"solana"===o.chainType&&(0,n.jsx)(C,{color:"gray",children:"Solana"})]})]})},T=(0,f.styled)(w.L)`
  /* Wallet name text color */
  > span {
    color: var(--privy-color-foreground);
  }

  /* Show "Connect" on hover */
  > #chip-container > #connect-text {
    font-weight: 500;
    color: var(--privy-color-accent);
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  :hover > #chip-container > #connect-text {
    opacity: 1;
  }

  @media (max-width: 440px) {
    > #chip-container > #connect-text {
      display: none;
    }
  }
`,C=(0,f.styled)(c.C)`
  margin-left: auto;
`,b=f.styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
`,j=["coinbase_wallet","base_account"],S=["metamask","okx_wallet","rainbow","uniswap","bybit_wallet","ronin_wallet","haha_wallet","uniswap_extension","zerion","rabby_wallet","cryptocom","binance","kraken_wallet","robinhood_wallet"],$=["safe"],_=["phantom","backpack","solflare","jupiter","universal_profile"],k={component:()=>{let e,{connectors:r}=(0,u.u)(),{setModalData:c,data:g,navigate:f}=(0,d.b)(),m=(0,d.u)(),{wallets:x}=(0,y.u)(),T=r.filter(p.j).flatMap(e=>e.wallets),[C,b]=(0,t.useState)("default"),k="solana"===g?.funding?.chainType,O=!!g?.funding?.crossChainBridgingEnabled;e="ethereum"===g?.funding?.chainType?g.funding.erc20Address&&!g.funding.isUSDC?"ethereum-only":O&&!g.funding.chain.testnet?"ethereum-and-solana":"ethereum-only":O&&!g.funding?.isUSDC?"ethereum-and-solana":"solana-only";let M=x.filter(e=>"privy"!==e.walletClientType),F=M.map(e=>e.walletClientType),D=T.filter(e=>"privy"!==e.walletClientType),B=D.map(e=>e.walletClientType),L=[],E={...g.funding};E.usingDefaultFundingMethod&&(E.usingDefaultFundingMethod=!1);let A=({wallet:e,walletChainType:n})=>{c({...g,funding:{...E,connectedWallet:e,onContinueWithExternalWallet:()=>f(z({destChainType:k?"solana":"ethereum",sourceChainType:n}))},solanaFundingData:g?.solanaFundingData?{...g.solanaFundingData,sourceWalletData:{address:e.address,walletClientType:e.walletClientType}}:void 0}),f("FundingAmountEditScreen")};"solana-only"!==e&&L.push(...M.map((e,t)=>(0,n.jsx)(W,{onClick:()=>A({wallet:e,walletChainType:"ethereum"}),icon:e.meta.icon,name:e.meta.name,chainType:e.type},t))),"ethereum-only"!==e&&L.push(...D.map((e,t)=>(0,n.jsx)(W,{onClick:()=>A({wallet:e,walletChainType:"solana"}),icon:e.meta.icon,name:e.meta.name,chainType:e.type},t))),L.push(...(({walletList:e,walletChainType:t,connectors:l,connectOnly:a,ignore:i,walletConnectEnabled:o,forceWallet:r})=>{let c=[],s=[],d=[],p=l.filter(e=>"ethereum-only"===t?"ethereum"===e.chainType:"solana-only"!==t||"solana"===e.chainType),u=p.find(e=>"wallet_connect_v2"===e.connectorType);for(let[l,y]of(r?[r.wallet]:e).entries()){if("detected_ethereum_wallets"===y)for(let[e,t]of p.filter(({chainType:e,connectorType:n,walletClientType:t})=>"solana"!==e&&("uniswap_wallet_extension"===t||"uniswap_extension"===t?!i.includes("uniswap"):"crypto.com_wallet_extension"===t||"crypto.com_onchain"===t?!i.includes("cryptocom"):"injected"===n&&!i.includes(t))).entries()){let{walletClientType:i,walletBranding:o,chainType:r}=t;("unknown"===i?s:c).push((0,n.jsx)(v,{connectOnly:a,provider:i,logo:o.icon,displayName:o.name,connector:t},`${l}-${y}-${i}-${r}-${e}`))}if("detected_solana_wallets"===y)for(let[e,o]of p.filter(({chainType:e,walletClientType:n})=>{if("solana"===e)return"ethereum-only"!==t&&!i.includes(n)}).entries()){let{walletClientType:t,walletBranding:i,chainType:r}=o;("unknown"===t?s:c).push((0,n.jsx)(v,{connectOnly:a,provider:t,logo:i.icon,displayName:i.name,connector:o},`${l}-${y}-${t}-${r}-${e}`))}if(_.includes(y)){let e=p.find(e=>"injected"===e.connectorType&&e.walletClientType===y||e.connectorType===y);if(e&&c.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:e},`${l}-${y}`)),"solana-only"===t||"ethereum-and-solana"===t){let e=p.find(({chainType:e,walletClientType:n})=>"solana"===e&&n===y);e&&c.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:e},`${y}-solana`))}}else if(S.includes(y)){let e=p.find(e=>"uniswap"===y?"uniswap_wallet_extension"===e.walletClientType||"uniswap_extension"===e.walletClientType:"cryptocom"===y?"crypto.com_wallet_extension"===e.walletClientType||"crypto.com_onchain"===e.walletClientType:"injected"===e.connectorType&&e.walletClientType===y);if(o&&!e&&(e=u),e&&c.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:e,logo:"injected"===e.connectorType?e.walletBranding.icon:void 0,displayName:"injected"===e.connectorType?e.walletBranding.name:void 0},`${l}-${y}`)),"solana-only"===t||"ethereum-and-solana"===t){let e=p.find(({chainType:e,walletClientType:n})=>"solana"===e&&n===y);e&&c.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:e},`${y}-solana`))}}else if(j.includes(y)){let e=p.find(({connectorType:e})=>e===y);e&&c.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:e,displayName:e.walletBranding.name,logo:e.walletBranding.icon},`${l}-${y}`))}else if($.includes(y))u&&d.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:u},`${l}-${y}`));else if("wallet_connect"===y)u&&d.push((0,n.jsx)(v,{connectOnly:a,provider:y,connector:u,logo:u.walletBranding.icon,displayName:"WalletConnect"},`${l}-${y}`));else if(y===r?.wallet){let t="ethereum"===r.chainType&&e.includes("detected_ethereum_wallets"),i="solana"===r.chainType&&e.includes("detected_solana_wallets");if(t||i){let e=p.find(({walletClientType:e})=>e===y);e&&c.push((0,n.jsx)(v,{connectOnly:a,provider:y,displayName:e.walletBranding?.name,logo:e.walletBranding?.icon,connector:e},`${l}-${y}`))}}}return[...s,...c,...d]})({walletList:m.appearance.walletList.filter(e=>!M.some(n=>n.walletClientType===e)&&!D.some(n=>n.walletClientType===e)),walletChainType:e,connectors:r,connectOnly:!0,ignore:[...m.appearance.walletList,...F,...B],walletConnectEnabled:m.externalWallets.walletConnect.enabled}));let I=(0,n.jsx)(h.W,{text:"More wallets",onClick:()=>b("overflow")}),z=({sourceChainType:e,destChainType:n})=>"ethereum"===e&&"solana"===n?"AwaitingEvmToSolBridgingScreen":"ethereum"===e&&"ethereum"===n?"AwaitingExternalEthereumTransferScreen":"solana"===e&&"ethereum"===n?"AwaitingSolToEvmBridgingScreen":E.externalSolanaFundingScreen;return(0,t.useEffect)(()=>{c({...g,externalConnectWallet:{onCompleteNavigateTo:({address:e,walletClientType:n,walletChainType:t})=>{let l=t??"ethereum",a="ethereum"===l?M.find(t=>t.address===e&&t.walletClientType===n):D.find(t=>t.address===e&&t.walletClientType===n);return c({...g,funding:{...E,connectedWallet:a,onContinueWithExternalWallet:()=>{f(z({destChainType:k?"solana":"ethereum",sourceChainType:l}))}},solanaFundingData:g?.solanaFundingData?{...g.solanaFundingData,sourceWalletData:{address:e||"",walletClientType:n||""}}:void 0}),"FundingAmountEditScreen"}}})},[]),(0,n.jsxs)(n.Fragment,"overflow"===C?{children:[(0,n.jsx)(a.M,{backFn:()=>b("default")},"header"),(0,n.jsxs)(w.c,{children:[(0,n.jsx)(s.S,{style:{color:"var(--privy-color-foreground-3)",textAlign:"left"},children:"More wallets"}),L]}),(0,n.jsx)(l.B,{})]}:{children:[(0,n.jsx)(o.t,{}),(0,n.jsx)(i.C,{title:"Transfer from wallet",description:"Connect a wallet to deposit funds or send funds manually to your wallet address."}),(0,n.jsxs)(w.c,{children:[L.length>4?L.slice(0,3):L,L.length>4&&I]}),(0,n.jsx)(l.B,{})]})}},W=({onClick:e,icon:t,name:l,chainType:a})=>(0,n.jsxs)(w.L,{onClick:e,children:[(0,n.jsx)(x.I,{style:{width:20},children:(0,n.jsx)(r.I,{icon:t,name:l})}),l,(0,n.jsx)(c.C,{color:"gray",style:{marginLeft:"auto"},children:"Connected"}),"solana"===a&&(0,n.jsx)(c.C,{color:"gray",children:"Solana"})]});e.s(["TransferFromWalletScreen",0,k,"default",0,k])}]);