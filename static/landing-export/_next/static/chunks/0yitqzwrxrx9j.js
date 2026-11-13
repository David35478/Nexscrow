(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,293162,r=>{"use strict";let e=(0,r.i(319546).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);r.s(["CheckCircle",0,e],293162)},596577,r=>{"use strict";let e=(0,r.i(319546).default)("fingerprint-pattern",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);r.s(["FingerprintIcon",0,e],596577)},898419,r=>{"use strict";var e=r.i(691983);let o=e.forwardRef(function({title:r,titleId:o,...i},a){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":o},i),r?e.createElement("title",{id:o},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});r.s(["default",0,o])},529359,r=>{"use strict";var e=r.i(691983);let o=e.forwardRef(function({title:r,titleId:o,...i},a){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":o},i),r?e.createElement("title",{id:o},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});r.s(["default",0,o])},781929,r=>{"use strict";var e=r.i(177117),o=r.i(375675),i=r.i(691778),a=r.i(898419),t=r.i(529359),l=r.i(691983);let n=l.forwardRef(function({title:r,titleId:e,...o},i){return l.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":e},o),r?l.createElement("title",{id:e},r):null,l.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var s=r.i(463475),c=r.i(68297);let d=o.styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;

  & {
    width: auto;
    cursor: pointer;
    border-radius: ${({$size:r})=>"sm"===r?"6px":"var(--privy-border-radius-sm)"};

    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.016px;
  }

  && {
    height: ${({$size:r})=>"sm"===r?"28px":"48px"};
    padding: 0 ${({$size:r})=>"sm"===r?"10px":"16px"};
  }
`,p=({children:r,loading:o,disabled:a,success:t,size:l="lg",loadingText:n="Loading...",as:s,onClick:c,...d})=>{let p="a"===s,v=!(!o&&!a);return(0,e.jsx)(h,{as:s,disabled:p?void 0:v,"aria-disabled":p?v:void 0,$success:t,$size:l,onClick:r=>{p&&v?r.preventDefault():c?.(r)},...d,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(i.B,{}),n?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:n}):null]}):r})},v=(0,o.styled)(d)`
  position: relative;

  && {
    background-color: var(--privy-color-accent);
    color: var(--privy-color-foreground-accent);

    transition: background-color 200ms ease;
  }

  &:hover {
    background-color: var(--privy-color-accent-dark);
  }

  &:active {
    background-color: var(--privy-color-accent-dark);
  }

  &:disabled,
  &:hover:disabled,
  &:active:disabled {
    cursor: not-allowed;
    color: var(--privy-color-foreground-disabled);
    background-color: var(--privy-color-accent-dark);
  }
`,h=(0,o.styled)(d)`
  position: relative;

  && {
    background-color: ${r=>r.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
    color: var(--privy-color-foreground-accent);

    transition: background-color 200ms ease;
  }

  &:hover {
    background-color: ${r=>r.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent-dark)"};
  }

  &:active {
    background-color: ${r=>r.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent-dark)"};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--privy-shadow-focus-ring);
  }

  &:disabled {
    background-color: var(--privy-color-background-2);
    border: 1px solid var(--privy-color-border-default);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  &:hover:disabled,
  &:active:disabled {
    background-color: var(--privy-color-background-2);
    border: 1px solid var(--privy-color-border-default);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  /* Emulate disabled look for anchors via the prop */
  ${r=>r.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        background-color: var(--privy-color-background-2);
        border: 1px solid var(--privy-color-border-default);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,u=({children:r,loading:o,disabled:a,size:t="lg",loadingText:l="Loading...",as:n,onClick:s,...c})=>{let d="a"===n,p=!(!o&&!a);return(0,e.jsx)(y,{as:n,disabled:d?void 0:p,"aria-disabled":d?p:void 0,$size:t,onClick:r=>{d&&p?r.preventDefault():s?.(r)},...c,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(i.B,{}),l?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:l}):null]}):r})},g=({children:r,loading:o,disabled:a,size:t="lg",loadingText:l="Loading...",as:n,onClick:s,...c})=>{let d="a"===n,p=!(!o&&!a);return(0,e.jsx)(x,{as:n,disabled:d?void 0:p,"aria-disabled":d?p:void 0,$size:t,onClick:r=>{d&&p?r.preventDefault():s?.(r)},...c,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(i.B,{}),l?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:l}):null]}):r})},y=(0,o.styled)(d)`
  && {
    border-width: 1px;
    border-style: solid;
    border-color: ${r=>r.$warn?"var(--privy-color-border-error)":"var(--privy-color-accent)"};
    background-color: var(--privy-color-background);
    color: ${r=>r.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
    transition:
      border-color 200ms ease,
      color 200ms ease,
      background-color 200ms ease;
  }

  &:hover {
    border-color: ${r=>r.$warn?"var(--privy-color-border-error)":"var(--privy-color-border-interactive-hover)"};
    background-color: ${r=>r.$warn?"var(--privy-color-error-light)":"var(--privy-color-info-bg-hover)"};
    color: ${r=>r.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
  }

  &:active {
    border-color: ${r=>r.$warn?"var(--privy-color-border-error)":"var(--privy-color-border-interactive)"};
    background-color: ${r=>r.$warn?"var(--privy-color-error-bg-hover)":"var(--privy-color-info-bg)"};
    color: ${r=>r.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
  }

  &:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  &:hover:disabled,
  &:active:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  /* Anchor disabled look (prop-driven) */
  ${r=>r.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,x=(0,o.styled)(d)`
  && {
    border-width: 1px;
    border-style: solid;
    border-color: var(--privy-color-border-default);
    background-color: transparent;
    color: var(--privy-color-foreground-2);

    transition:
      border-color 200ms ease,
      color 200ms ease,
      background-color 200ms ease;
  }

  &:hover {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-info-bg-hover);
    color: var(--privy-color-foreground-2);
  }

  &:active {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-info-bg);
    color: var(--privy-color-foreground-2);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--privy-shadow-focus-ring);
  }

  &:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  &:hover:disabled,
  &:active:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  /* Anchor disabled look (prop-driven) */
  ${r=>r.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,f=o.styled.button`
  && {
    padding: 12px 16px;
    font-weight: 500;
    text-align: center;
    color: var(--privy-color-foreground-accent);
    background-color: var(--privy-color-accent);
    border-radius: var(--privy-border-radius-sm);
    min-width: 144px;
    opacity: ${r=>r.invisible?"0":"1"};
    transition:
      opacity 200ms ease,
      background-color 200ms ease,
      color 200ms ease;
    user-select: none;

    ${r=>r.invisible&&o.css`
        pointer-events: none;
      `}

    &:hover {
      background-color: var(--privy-color-accent-dark);
    }
    &:active {
      background-color: var(--privy-color-accent-dark);
    }

    &:hover:disabled,
    &:active:disabled {
      background-color: var(--privy-color-background-2);
      color: var(--privy-color-foreground-disabled);
      cursor: not-allowed;
    }
  }
`;o.styled.div`
  /* Set to match height of SoftCtaButton to avoid reflow if conditionally rendered */
  height: 44px;
`;let b=o.styled.button`
  && {
    color: var(--privy-color-accent);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    border-radius: 0 var(--privy-border-radius-mdlg) var(--privy-border-radius-mdlg) 0;
    border: none;
    transition: color 200ms ease;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
    }

    :hover {
      color: var(--privy-color-accent-dark);
    }

    && > :first-child {
      opacity: ${r=>+!r.$isSubmitting};
    }

    && > :last-child {
      position: absolute;
      display: flex;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      /** Will map to the opposite of first span */
      opacity: ${r=>+!!r.$isSubmitting};
    }

    :disabled,
    :hover:disabled {
      color: var(--privy-color-foreground-disabled);
      cursor: not-allowed;
    }
  }
`,m=({backFn:r,disabled:o=!1,"aria-label":i})=>(0,e.jsx)("div",{children:(0,e.jsx)(j,{type:"button","aria-label":i,disabled:o,onClick:o?void 0:r,children:(0,e.jsx)(a.default,{height:"16px",width:"16px",strokeWidth:2})})}),k=({infoFn:r})=>(0,e.jsx)("div",{children:(0,e.jsx)($,{"aria-label":"info",onClick:r,children:(0,e.jsx)(t.default,{height:"22px",width:"22px",strokeWidth:2})})}),w=r=>(0,e.jsx)("div",{children:(0,e.jsx)(j,{type:"button","aria-label":r["aria-label"]??"close modal",onClick:r.onClose,children:(0,e.jsx)(n,{height:"16px",width:"16px",strokeWidth:2})})}),j=o.styled.button`
  && {
    cursor: pointer;
    display: flex;
    opacity: 0.6;

    background-color: var(--privy-color-background-2);
    border-radius: var(--privy-border-radius-full);
    padding: 4px;

    > svg {
      margin: auto;
      color: var(--privy-color-foreground);
    }

    :hover {
      opacity: 1;
    }

    :disabled {
      cursor: default;
      opacity: 0.3;
    }

    :disabled:hover {
      opacity: 0.3;
    }
  }
`,$=(0,o.styled)(j)`
  && {
    background-color: transparent;
  }
`,C=o.styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--privy-color-foreground);
  }
`,z=o.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,M=o.styled.div`
  display: flex;
  justify-content: flex-end;
`,S=o.styled.div`
  color: var(--privy-color-foreground);

  font-kerning: none;
  font-feature-settings: 'calt' off;
  /* text-xl/font-semiBold */
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2rem; /* 160% */

  text-align: left;

  margin-left: 0.5rem;
`,E=o.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;r.s(["B",0,({variant:r="primary",size:o="lg",children:i,success:a,...t})=>{switch(r){case"secondary":return(0,e.jsx)(u,{size:o,...t,children:i});case"error":return(0,e.jsx)(u,{$warn:!0,size:o,...t,children:i});case"muted":return(0,e.jsx)(g,{size:o,...t,children:i});default:return(0,e.jsx)(p,{size:o,success:a,...t,children:i})}},"E",0,({children:r,onClick:o,disabled:a,isSubmitting:t,...l})=>(0,e.jsxs)(b,{$isSubmitting:t,onClick:o,disabled:a,...l,children:[(0,e.jsx)("span",{children:r}),(0,e.jsx)("span",{children:(0,e.jsx)(i.B,{})})]}),"M",0,({backFn:r,infoFn:o,onClose:i,title:a,eyebrow:t,closeable:l=!0,className:n})=>{let{closePrivyModal:d}=(0,c.u)(),p=(0,s.u)();return(0,e.jsxs)(C,{className:n,children:[(0,e.jsxs)(z,{children:[r&&(0,e.jsx)(m,{backFn:r}),t&&(0,e.jsx)(E,{children:t}),!t&&a&&(0,e.jsx)(S,{id:"privy-dialog-title",children:a}),(0,e.jsx)("div",{style:{height:24}}),o&&(0,e.jsx)(k,{infoFn:o})]}),(0,e.jsx)(M,{children:!p.render.standalone&&l&&(0,e.jsx)(w,{onClose:i||(()=>d())})})]})},"P",0,p,"S",0,u,"a",0,f,"b",0,({children:r,loading:o,disabled:a,...t})=>(0,e.jsx)(v,{disabled:a,...t,children:o?(0,e.jsx)(i.B,{color:"var(--privy-color-foreground-accent)"}):r}),"d",0,g],781929)},657545,r=>{"use strict";var e=r.i(177117),o=r.i(375675),i=r.i(463475);function a(r){return(0,e.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...r,children:(0,e.jsx)("g",{fill:r.color||"var(--privy-color-foreground)",children:(0,e.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let t=o.styled.span`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);
  display: block;

  && > a {
    color: var(--privy-color-accent);
  }
`,l=o.styled.a`
  && {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,n=o.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 12px;
  gap: 8px;

  font-size: 13px;

  && a {
    padding: 0.5rem 0;

    &:hover {
      text-decoration: none;
    }
  }

  @media all and (display-mode: standalone) {
    padding-bottom: 30px;
  }
`;r.s(["B",0,({className:r})=>{let{appearance:o}=(0,i.u)();return(0,e.jsx)(n,{className:r,children:o.footerLogo??(0,e.jsx)(l,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,e.jsx)(a,{color:"currentColor",height:13,width:150})})})},"M",0,n,"T",0,function({app:{legal:{privacyPolicyUrl:r,termsAndConditionsUrl:o,requireUsersAcceptTerms:i}},alwaysShowImplicitConsent:a}){let l=!(!r||!o);return(!i||a)&&(o||r)?(0,e.jsxs)(t,{children:["By logging in I agree to the"," ",o&&(0,e.jsx)("a",{href:o,target:"_blank",children:l?"Terms":"Terms of Service"}),l&&" & ",r&&(0,e.jsx)("a",{href:r,target:"_blank",children:"Privacy Policy"})]}):(0,e.jsx)(t,{})}])},436896,r=>{"use strict";var e=r.i(177117),o=r.i(375675);let i=o.styled.div`
  --spinner-size: ${r=>r.$size?r.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,a=o.styled.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,t=o.styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg,
  img {
    width: calc(var(--spinner-size) * 0.4);
    height: calc(var(--spinner-size) * 0.4);
    border-radius: var(--privy-border-radius-full);
  }
`,l=o.styled.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,n=o.styled.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);
  animation: spin 1200ms linear infinite;

  && {
    border: 4px solid;
    border-color: var(--privy-color-icon-subtle) transparent transparent transparent;
    border-radius: 50%;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;r.s(["N",0,({size:r,centerIcon:o})=>(0,e.jsx)(i,{$size:r,children:(0,e.jsxs)(a,{children:[(0,e.jsx)(l,{}),(0,e.jsx)(n,{}),o?(0,e.jsx)(t,{children:o}):null]})})])},566305,r=>{"use strict";var e=r.i(177117),o=r.i(691983),i=r.i(375675),a=r.i(691778),t=r.i(657545),l=r.i(781929),n=r.i(436896);let s=i.styled.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,c=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,d=i.styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,p=(0,i.styled)(l.M)`
  margin: 0 -8px;
`,v=i.styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  /* Enable scrolling */
  overflow-y: auto;

  /* Hide scrollbar but keep functionality when scrollable */
  /* Add padding for focus outline space, offset with negative margin */
  padding: 3px;
  margin: -3px;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-gutter: stable both-edges;
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Gradient effect for scroll indication */
  ${({$colorScheme:r})=>"light"===r?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===r?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
`,h=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,u=i.styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,g=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,y=i.styled.h3`
  && {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: var(--privy-color-foreground);
    margin: 0;
  }
`,x=i.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,f=i.styled.div`
  background: ${({$variant:r})=>{switch(r){case"success":return"var(--privy-color-success-bg)";case"warning":return"var(--privy-color-warn)";case"error":return"var(--privy-color-error-bg)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,b=i.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,m=i.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > :first-child {
    position: relative;
  }

  > div > :last-child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`,k=({children:r,...o})=>(0,e.jsx)(s,{children:(0,e.jsx)(c,{...o,children:r})}),w=i.styled.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,j=(0,i.styled)(t.B)`
  padding: 0;
  && a {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,$=i.styled.div`
  height: 100%;
  width: ${({pct:r})=>r}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,C=({step:r})=>r?(0,e.jsx)(w,{children:(0,e.jsx)($,{pct:Math.min(100,r.current/r.total*100)})}):null;k.Header=({title:r,subtitle:o,icon:i,iconVariant:a,iconLoadingStatus:t,showBack:l,onBack:n,showInfo:s,onInfo:c,showClose:v,onClose:h,step:f,headerTitle:b,eyebrow:m,...w})=>(0,e.jsxs)(d,{...w,children:[(0,e.jsx)(p,{backFn:l?n:void 0,infoFn:s?c:void 0,onClose:v?h:void 0,title:b,eyebrow:m,closeable:v}),(i||a||r||o)&&(0,e.jsxs)(u,{children:[i||a?(0,e.jsx)(k.Icon,{icon:i,variant:a,loadingStatus:t}):null,!(!r&&!o)&&(0,e.jsxs)(g,{children:[r&&(0,e.jsx)(y,{children:r}),o&&(0,e.jsx)(x,{children:o})]})]}),f&&(0,e.jsx)(C,{step:f})]}),(k.Body=o.default.forwardRef(({children:r,...o},i)=>(0,e.jsx)(v,{ref:i,...o,children:r}))).displayName="Screen.Body",k.Footer=({children:r,...o})=>(0,e.jsx)(h,{id:"privy-content-footer-container",...o,children:r}),k.Actions=({children:r,...o})=>(0,e.jsx)(z,{...o,children:r}),k.HelpText=({children:r,...o})=>(0,e.jsx)(M,{...o,children:r}),k.FooterText=({children:r,...o})=>(0,e.jsx)(S,{...o,children:r}),k.Watermark=()=>(0,e.jsx)(j,{}),k.Icon=({icon:r,variant:i="subtle",loadingStatus:t})=>"logo"===i&&r?(0,e.jsx)(b,"string"==typeof r?{children:(0,e.jsx)("img",{src:r,alt:""})}:o.default.isValidElement(r)?{children:r}:{children:o.default.createElement(r)}):"loading"===i?r?(0,e.jsx)(m,{children:(0,e.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,e.jsx)(a.C,{success:t?.success,fail:t?.fail}),"string"==typeof r?(0,e.jsx)("span",{style:{background:`url('${r}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):o.default.isValidElement(r)?o.default.cloneElement(r,{style:{width:"38px",height:"38px"}}):o.default.createElement(r,{style:{width:"38px",height:"38px"}})]})}):(0,e.jsx)(f,{$variant:i,children:(0,e.jsx)(n.N,{size:"64px"})}):(0,e.jsx)(f,{$variant:i,children:r&&("string"==typeof r?(0,e.jsx)("img",{src:r,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):o.default.isValidElement(r)?r:o.default.createElement(r,{width:32,height:32,stroke:(()=>{switch(i){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let z=i.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,M=i.styled.div`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 13px;
    line-height: 20px;

    & a {
      text-decoration: underline;
    }
  }
`,S=i.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`;r.s(["S",0,k])},962537,r=>{"use strict";var e=r.i(177117),o=r.i(781929),i=r.i(566305);r.s(["S",0,({primaryCta:r,secondaryCta:a,helpText:t,footerText:l,watermark:n=!0,children:s,...c})=>{let d=r||a?(0,e.jsxs)(e.Fragment,{children:[r&&(()=>{let{label:i,...a}=r,t=a.variant||"primary";return(0,e.jsx)(o.B,{...a,variant:t,style:{width:"100%",...a.style},children:i})})(),a&&(()=>{let{label:r,...i}=a,t=i.variant||"secondary";return(0,e.jsx)(o.B,{...i,variant:t,style:{width:"100%",...i.style},children:r})})()]}):null;return(0,e.jsxs)(i.S,{id:c.id,className:c.className,children:[(0,e.jsx)(i.S.Header,{...c}),s?(0,e.jsx)(i.S.Body,{children:s}):null,t||d||n?(0,e.jsxs)(i.S.Footer,{children:[t?(0,e.jsx)(i.S.HelpText,{children:t}):null,d?(0,e.jsx)(i.S.Actions,{children:d}):null,n?(0,e.jsx)(i.S.Watermark,{}):null]}):null,l?(0,e.jsx)(i.S.FooterText,{children:l}):null]})}])},319546,r=>{"use strict";var e=r.i(691983);let o=r=>{let e=r.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,e,o)=>o?o.toUpperCase():e.toLowerCase());return e.charAt(0).toUpperCase()+e.slice(1)},i=(...r)=>r.filter((r,e,o)=>!!r&&""!==r.trim()&&o.indexOf(r)===e).join(" ").trim();var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let t=(0,e.forwardRef)(({color:r="currentColor",size:o=24,strokeWidth:t=2,absoluteStrokeWidth:l,className:n="",children:s,iconNode:c,...d},p)=>(0,e.createElement)("svg",{ref:p,...a,width:o,height:o,stroke:r,strokeWidth:l?24*Number(t)/Number(o):t,className:i("lucide",n),...!s&&!(r=>{for(let e in r)if(e.startsWith("aria-")||"role"===e||"title"===e)return!0})(d)&&{"aria-hidden":"true"},...d},[...c.map(([r,o])=>(0,e.createElement)(r,o)),...Array.isArray(s)?s:[s]]));r.s(["default",0,(r,a)=>{let l=(0,e.forwardRef)(({className:l,...n},s)=>(0,e.createElement)(t,{ref:s,iconNode:a,className:i(`lucide-${o(r).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${r}`,l),...n}));return l.displayName=o(r),l}],319546)},635267,r=>{"use strict";let e=(0,r.i(319546).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);r.s(["Check",0,e],635267)},635665,r=>{"use strict";let e=(0,r.i(319546).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);r.s(["X",0,e],635665)},6478,r=>{"use strict";var e=r.i(177117),o=r.i(635665),i=r.i(635267),a=r.i(691983),t=r.i(375675);let l=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px; /* 10px gap between items */
  padding-left: 8px; /* 8px indentation container */
`;t.styled.div`
  &&& {
    margin-left: 6px; /* Center the line under the checkbox (12px/2) */
    border-left: 2px solid var(--privy-color-foreground-4);
    height: 10px; /* 10px H padding between paragraphs */
    margin-top: 0;
    margin-bottom: 0;
  }
`;let n=t.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({$variant:r})=>{switch(r){case"success":return"var(--privy-color-success-bg)";case"error":return"var(--privy-color-error-bg)";default:return"var(--privy-color-background-2)"}}};
  flex-shrink: 0;
`,s=t.styled.div`
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
`;r.s(["T",0,l,"a",0,({children:r,variant:t="default",icon:l})=>{let c=()=>{switch(t){case"success":return"var(--privy-color-icon-success)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}};return(0,e.jsxs)(s,{children:[(0,e.jsx)(n,{$variant:t,"data-variant":t,children:(()=>{if(l)return a.default.isValidElement(l)?a.default.cloneElement(l,{stroke:c(),strokeWidth:2}):l;switch(t){case"success":default:return(0,e.jsx)(i.Check,{size:12,stroke:c(),strokeWidth:3});case"error":return(0,e.jsx)(o.X,{size:12,stroke:c(),strokeWidth:3})}})()}),r]})}])},544771,r=>{"use strict";var e=r.i(177117),o=r.i(293162),i=r.i(596577);let a=(0,r.i(319546).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);var t=r.i(691983),l=r.i(375675),n=r.i(691778),s=r.i(6478),c=r.i(859427),d=r.i(68297),p=r.i(463475),v=r.i(376305),h=r.i(962537);let u=({passkeys:r,name:a,isLoading:t,errorReason:l,success:n,expanded:s,onLinkPasskey:c,onUnlinkPasskey:d,onExpand:p,onBack:v,onClose:u})=>n?(0,e.jsx)(h.S,{title:"Passkeys updated",icon:o.CheckCircle,iconVariant:"success",primaryCta:{label:"Done",onClick:u},onClose:u,watermark:!0}):s?(0,e.jsx)(h.S,{icon:i.FingerprintIcon,title:"Your passkeys",onBack:v,onClose:u,watermark:!0,children:(0,e.jsx)(b,{passkeys:r,expanded:s,onUnlink:d,onExpand:p})}):(0,e.jsxs)(h.S,{icon:i.FingerprintIcon,title:"Set up passkey verification",subtitle:"Verify with passkey",primaryCta:{label:"Add new passkey",onClick:c,loading:t},onClose:u,watermark:!0,helpText:l||void 0,children:[0===r.length?(0,e.jsx)(m,{}):(0,e.jsx)(g,{children:(0,e.jsx)(b,{passkeys:r,expanded:s,onUnlink:d,onExpand:p})}),a?(0,e.jsxs)(y,{children:[(0,e.jsx)(x,{children:"New Passkey Name"}),(0,e.jsx)(f,{children:a})]}):null]}),g=l.styled.div`
  margin-bottom: 0.75rem;
`,y=l.styled.div`
  margin-top: 0.25rem;
`,x=l.styled.div`
  color: var(--privy-color-foreground-2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,f=l.styled.div`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`,b=({passkeys:r,expanded:o,onUnlink:i,onExpand:l})=>{let[s,c]=(0,t.useState)([]),d=o?r.length:2;return(0,e.jsxs)("div",{children:[(0,e.jsx)(z,{children:"Your passkeys"}),(0,e.jsxs)(C,{children:[r.slice(0,d).map(r=>(0,e.jsxs)(E,{children:[(0,e.jsxs)("div",{children:[(0,e.jsx)(M,{children:r.authenticatorName?r.createdWithBrowser?`${r.authenticatorName} on ${r.createdWithBrowser}`:r.authenticatorName:r.createdWithBrowser?r.createdWithOs?`${r.createdWithBrowser} on ${r.createdWithOs}`:`${r.createdWithBrowser}`:"Unknown device"}),(0,e.jsxs)(S,{children:["Last used:"," ",(r.latestVerifiedAt??r.firstVerifiedAt)?.toLocaleString()??"N/A"]})]}),(0,e.jsx)(B,{disabled:s.includes(r.credentialId),onClick:()=>(async r=>{c(e=>e.concat([r])),await i(r),c(e=>e.filter(e=>e!==r))})(r.credentialId),children:s.includes(r.credentialId)?(0,e.jsx)(n.B,{}):(0,e.jsx)(a,{size:16})})]},r.credentialId)),r.length>2&&!o&&(0,e.jsx)($,{onClick:l,children:"View all"})]})]})},m=()=>(0,e.jsxs)(s.T,{style:{color:"var(--privy-color-foreground)"},children:[(0,e.jsx)(s.a,{children:"Verify with Touch ID, Face ID, PIN, or hardware key"}),(0,e.jsx)(s.a,{children:"Takes seconds to set up and use"}),(0,e.jsx)(s.a,{children:"Use your passkey to verify transactions and login to your account"})]}),k={component:()=>{let{user:r}=(0,p.a)(),{unlink:o}=(0,v.u)(),{linkWithPasskey:i,closePrivyModal:a}=(0,d.u)(),{data:l}=(0,p.b)(),n=r?.linkedAccounts.filter(r=>"passkey"===r.type),[s,h]=(0,t.useState)(!1),[g,y]=(0,t.useState)(""),[x,f]=(0,t.useState)(!1),[b,m]=(0,t.useState)(!1);return(0,t.useEffect)(()=>{0===n.length&&m(!1)},[n.length]),(0,e.jsx)(u,{passkeys:n,name:l?.passkeyAuthModalData?.name,isLoading:s,errorReason:g,success:x,expanded:b,onLinkPasskey:()=>{h(!0),i({name:l?.passkeyAuthModalData?.name}).then(()=>f(!0)).catch(r=>{if(r instanceof c.b){if(r.privyErrorCode===c.c.CANNOT_LINK_MORE_OF_TYPE)return void y("Cannot link more passkeys to account.");if(r.privyErrorCode===c.c.PASSKEY_NOT_ALLOWED)return void y("Passkey request timed out or rejected by user.")}y("Unknown error occurred.")}).finally(()=>{h(!1)})},onUnlinkPasskey:async r=>(h(!0),await o({credentialId:r}).then(()=>f(!0)).catch(r=>{r instanceof c.b&&r.privyErrorCode===c.c.MISSING_MFA_CREDENTIALS?y("Cannot unlink a passkey enrolled in MFA"):y("Unknown error occurred.")}).finally(()=>{h(!1)})),onExpand:()=>m(!0),onBack:()=>m(!1),onClose:()=>a()})}},w=l.styled.div`
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
`,j=l.css`
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
`,$=l.styled.button`
  ${j}
`,C=l.styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 0.5rem 0 0;
  flex-grow: 1;
  width: 100%;
`,z=l.styled.div`
  line-height: 20px;
  height: 20px;
  font-size: 1em;
  font-weight: 450;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`,M=l.styled.div`
  font-size: 1em;
  line-height: 1.3em;
  font-weight: 500;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,S=l.styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,E=l.styled.div`
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
`,A=l.css`
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
`,B=l.styled.button`
  ${A}
`;r.s(["DoubleIconWrapper",0,w,"LinkButton",0,$,"LinkPasskeyScreen",0,k,"LinkPasskeyView",0,u,"default",0,k],544771)}]);