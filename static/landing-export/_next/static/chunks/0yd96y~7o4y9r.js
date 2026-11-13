(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,898419,e=>{"use strict";var r=e.i(691983);let o=r.forwardRef(function({title:e,titleId:o,...t},i){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":o},t),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});e.s(["default",0,o])},529359,e=>{"use strict";var r=e.i(691983);let o=r.forwardRef(function({title:e,titleId:o,...t},i){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":o},t),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});e.s(["default",0,o])},781929,e=>{"use strict";var r=e.i(177117),o=e.i(375675),t=e.i(691778),i=e.i(898419),a=e.i(529359),l=e.i(691983);let s=l.forwardRef(function({title:e,titleId:r,...o},t){return l.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},o),e?l.createElement("title",{id:r},e):null,l.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var n=e.i(463475),c=e.i(68297);let d=o.styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;

  & {
    width: auto;
    cursor: pointer;
    border-radius: ${({$size:e})=>"sm"===e?"6px":"var(--privy-border-radius-sm)"};

    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.016px;
  }

  && {
    height: ${({$size:e})=>"sm"===e?"28px":"48px"};
    padding: 0 ${({$size:e})=>"sm"===e?"10px":"16px"};
  }
`,u=({children:e,loading:o,disabled:i,success:a,size:l="lg",loadingText:s="Loading...",as:n,onClick:c,...d})=>{let u="a"===n,p=!(!o&&!i);return(0,r.jsx)(v,{as:n,disabled:u?void 0:p,"aria-disabled":u?p:void 0,$success:a,$size:l,onClick:e=>{u&&p?e.preventDefault():c?.(e)},...d,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.B,{}),s?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:s}):null]}):e})},p=(0,o.styled)(d)`
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
`,v=(0,o.styled)(d)`
  position: relative;

  && {
    background-color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
    color: var(--privy-color-foreground-accent);

    transition: background-color 200ms ease;
  }

  &:hover {
    background-color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent-dark)"};
  }

  &:active {
    background-color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent-dark)"};
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
  ${e=>e.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        background-color: var(--privy-color-background-2);
        border: 1px solid var(--privy-color-border-default);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,h=({children:e,loading:o,disabled:i,size:a="lg",loadingText:l="Loading...",as:s,onClick:n,...c})=>{let d="a"===s,u=!(!o&&!i);return(0,r.jsx)(y,{as:s,disabled:d?void 0:u,"aria-disabled":d?u:void 0,$size:a,onClick:e=>{d&&u?e.preventDefault():n?.(e)},...c,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.B,{}),l?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:l}):null]}):e})},g=({children:e,loading:o,disabled:i,size:a="lg",loadingText:l="Loading...",as:s,onClick:n,...c})=>{let d="a"===s,u=!(!o&&!i);return(0,r.jsx)(f,{as:s,disabled:d?void 0:u,"aria-disabled":d?u:void 0,$size:a,onClick:e=>{d&&u?e.preventDefault():n?.(e)},...c,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.B,{}),l?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:l}):null]}):e})},y=(0,o.styled)(d)`
  && {
    border-width: 1px;
    border-style: solid;
    border-color: ${e=>e.$warn?"var(--privy-color-border-error)":"var(--privy-color-accent)"};
    background-color: var(--privy-color-background);
    color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
    transition:
      border-color 200ms ease,
      color 200ms ease,
      background-color 200ms ease;
  }

  &:hover {
    border-color: ${e=>e.$warn?"var(--privy-color-border-error)":"var(--privy-color-border-interactive-hover)"};
    background-color: ${e=>e.$warn?"var(--privy-color-error-light)":"var(--privy-color-info-bg-hover)"};
    color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
  }

  &:active {
    border-color: ${e=>e.$warn?"var(--privy-color-border-error)":"var(--privy-color-border-interactive)"};
    background-color: ${e=>e.$warn?"var(--privy-color-error-bg-hover)":"var(--privy-color-info-bg)"};
    color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
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
  ${e=>e.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,f=(0,o.styled)(d)`
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
  ${e=>e.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,b=o.styled.button`
  && {
    padding: 12px 16px;
    font-weight: 500;
    text-align: center;
    color: var(--privy-color-foreground-accent);
    background-color: var(--privy-color-accent);
    border-radius: var(--privy-border-radius-sm);
    min-width: 144px;
    opacity: ${e=>e.invisible?"0":"1"};
    transition:
      opacity 200ms ease,
      background-color 200ms ease,
      color 200ms ease;
    user-select: none;

    ${e=>e.invisible&&o.css`
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
`;let m=o.styled.button`
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
      opacity: ${e=>+!e.$isSubmitting};
    }

    && > :last-child {
      position: absolute;
      display: flex;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      /** Will map to the opposite of first span */
      opacity: ${e=>+!!e.$isSubmitting};
    }

    :disabled,
    :hover:disabled {
      color: var(--privy-color-foreground-disabled);
      cursor: not-allowed;
    }
  }
`,x=({backFn:e,disabled:o=!1,"aria-label":t})=>(0,r.jsx)("div",{children:(0,r.jsx)(j,{type:"button","aria-label":t,disabled:o,onClick:o?void 0:e,children:(0,r.jsx)(i.default,{height:"16px",width:"16px",strokeWidth:2})})}),k=({infoFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(C,{"aria-label":"info",onClick:e,children:(0,r.jsx)(a.default,{height:"22px",width:"22px",strokeWidth:2})})}),w=e=>(0,r.jsx)("div",{children:(0,r.jsx)(j,{type:"button","aria-label":e["aria-label"]??"close modal",onClick:e.onClose,children:(0,r.jsx)(s,{height:"16px",width:"16px",strokeWidth:2})})}),j=o.styled.button`
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
`,C=(0,o.styled)(j)`
  && {
    background-color: transparent;
  }
`,$=o.styled.div`
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
`,S=o.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,z=o.styled.div`
  display: flex;
  justify-content: flex-end;
`,A=o.styled.div`
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
`,B=o.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;e.s(["B",0,({variant:e="primary",size:o="lg",children:t,success:i,...a})=>{switch(e){case"secondary":return(0,r.jsx)(h,{size:o,...a,children:t});case"error":return(0,r.jsx)(h,{$warn:!0,size:o,...a,children:t});case"muted":return(0,r.jsx)(g,{size:o,...a,children:t});default:return(0,r.jsx)(u,{size:o,success:i,...a,children:t})}},"E",0,({children:e,onClick:o,disabled:i,isSubmitting:a,...l})=>(0,r.jsxs)(m,{$isSubmitting:a,onClick:o,disabled:i,...l,children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("span",{children:(0,r.jsx)(t.B,{})})]}),"M",0,({backFn:e,infoFn:o,onClose:t,title:i,eyebrow:a,closeable:l=!0,className:s})=>{let{closePrivyModal:d}=(0,c.u)(),u=(0,n.u)();return(0,r.jsxs)($,{className:s,children:[(0,r.jsxs)(S,{children:[e&&(0,r.jsx)(x,{backFn:e}),a&&(0,r.jsx)(B,{children:a}),!a&&i&&(0,r.jsx)(A,{id:"privy-dialog-title",children:i}),(0,r.jsx)("div",{style:{height:24}}),o&&(0,r.jsx)(k,{infoFn:o})]}),(0,r.jsx)(z,{children:!u.render.standalone&&l&&(0,r.jsx)(w,{onClose:t||(()=>d())})})]})},"P",0,u,"S",0,h,"a",0,b,"b",0,({children:e,loading:o,disabled:i,...a})=>(0,r.jsx)(p,{disabled:i,...a,children:o?(0,r.jsx)(t.B,{color:"var(--privy-color-foreground-accent)"}):e}),"d",0,g],781929)},657545,e=>{"use strict";var r=e.i(177117),o=e.i(375675),t=e.i(463475);function i(e){return(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...e,children:(0,r.jsx)("g",{fill:e.color||"var(--privy-color-foreground)",children:(0,r.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let a=o.styled.span`
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
`,s=o.styled.div`
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
`;e.s(["B",0,({className:e})=>{let{appearance:o}=(0,t.u)();return(0,r.jsx)(s,{className:e,children:o.footerLogo??(0,r.jsx)(l,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,r.jsx)(i,{color:"currentColor",height:13,width:150})})})},"M",0,s,"T",0,function({app:{legal:{privacyPolicyUrl:e,termsAndConditionsUrl:o,requireUsersAcceptTerms:t}},alwaysShowImplicitConsent:i}){let l=!(!e||!o);return(!t||i)&&(o||e)?(0,r.jsxs)(a,{children:["By logging in I agree to the"," ",o&&(0,r.jsx)("a",{href:o,target:"_blank",children:l?"Terms":"Terms of Service"}),l&&" & ",e&&(0,r.jsx)("a",{href:e,target:"_blank",children:"Privacy Policy"})]}):(0,r.jsx)(a,{})}])},436896,e=>{"use strict";var r=e.i(177117),o=e.i(375675);let t=o.styled.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,i=o.styled.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,a=o.styled.div`
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
`,s=o.styled.div`
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
`;e.s(["N",0,({size:e,centerIcon:o})=>(0,r.jsx)(t,{$size:e,children:(0,r.jsxs)(i,{children:[(0,r.jsx)(l,{}),(0,r.jsx)(s,{}),o?(0,r.jsx)(a,{children:o}):null]})})])},566305,e=>{"use strict";var r=e.i(177117),o=e.i(691983),t=e.i(375675),i=e.i(691778),a=e.i(657545),l=e.i(781929),s=e.i(436896);let n=t.styled.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,c=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,d=t.styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,u=(0,t.styled)(l.M)`
  margin: 0 -8px;
`,p=t.styled.div`
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
  ${({$colorScheme:e})=>"light"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
`,v=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,h=t.styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,g=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,y=t.styled.h3`
  && {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: var(--privy-color-foreground);
    margin: 0;
  }
`,f=t.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,b=t.styled.div`
  background: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg)";case"warning":return"var(--privy-color-warn)";case"error":return"var(--privy-color-error-bg)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,m=t.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,x=t.styled.div`
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
`,k=({children:e,...o})=>(0,r.jsx)(n,{children:(0,r.jsx)(c,{...o,children:e})}),w=t.styled.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,j=(0,t.styled)(a.B)`
  padding: 0;
  && a {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,C=t.styled.div`
  height: 100%;
  width: ${({pct:e})=>e}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,$=({step:e})=>e?(0,r.jsx)(w,{children:(0,r.jsx)(C,{pct:Math.min(100,e.current/e.total*100)})}):null;k.Header=({title:e,subtitle:o,icon:t,iconVariant:i,iconLoadingStatus:a,showBack:l,onBack:s,showInfo:n,onInfo:c,showClose:p,onClose:v,step:b,headerTitle:m,eyebrow:x,...w})=>(0,r.jsxs)(d,{...w,children:[(0,r.jsx)(u,{backFn:l?s:void 0,infoFn:n?c:void 0,onClose:p?v:void 0,title:m,eyebrow:x,closeable:p}),(t||i||e||o)&&(0,r.jsxs)(h,{children:[t||i?(0,r.jsx)(k.Icon,{icon:t,variant:i,loadingStatus:a}):null,!(!e&&!o)&&(0,r.jsxs)(g,{children:[e&&(0,r.jsx)(y,{children:e}),o&&(0,r.jsx)(f,{children:o})]})]}),b&&(0,r.jsx)($,{step:b})]}),(k.Body=o.default.forwardRef(({children:e,...o},t)=>(0,r.jsx)(p,{ref:t,...o,children:e}))).displayName="Screen.Body",k.Footer=({children:e,...o})=>(0,r.jsx)(v,{id:"privy-content-footer-container",...o,children:e}),k.Actions=({children:e,...o})=>(0,r.jsx)(S,{...o,children:e}),k.HelpText=({children:e,...o})=>(0,r.jsx)(z,{...o,children:e}),k.FooterText=({children:e,...o})=>(0,r.jsx)(A,{...o,children:e}),k.Watermark=()=>(0,r.jsx)(j,{}),k.Icon=({icon:e,variant:t="subtle",loadingStatus:a})=>"logo"===t&&e?(0,r.jsx)(m,"string"==typeof e?{children:(0,r.jsx)("img",{src:e,alt:""})}:o.default.isValidElement(e)?{children:e}:{children:o.default.createElement(e)}):"loading"===t?e?(0,r.jsx)(x,{children:(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,r.jsx)(i.C,{success:a?.success,fail:a?.fail}),"string"==typeof e?(0,r.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):o.default.isValidElement(e)?o.default.cloneElement(e,{style:{width:"38px",height:"38px"}}):o.default.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,r.jsx)(b,{$variant:t,children:(0,r.jsx)(s.N,{size:"64px"})}):(0,r.jsx)(b,{$variant:t,children:e&&("string"==typeof e?(0,r.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):o.default.isValidElement(e)?e:o.default.createElement(e,{width:32,height:32,stroke:(()=>{switch(t){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let S=t.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,z=t.styled.div`
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
`,A=t.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`;e.s(["S",0,k])},962537,e=>{"use strict";var r=e.i(177117),o=e.i(781929),t=e.i(566305);e.s(["S",0,({primaryCta:e,secondaryCta:i,helpText:a,footerText:l,watermark:s=!0,children:n,...c})=>{let d=e||i?(0,r.jsxs)(r.Fragment,{children:[e&&(()=>{let{label:t,...i}=e,a=i.variant||"primary";return(0,r.jsx)(o.B,{...i,variant:a,style:{width:"100%",...i.style},children:t})})(),i&&(()=>{let{label:e,...t}=i,a=t.variant||"secondary";return(0,r.jsx)(o.B,{...t,variant:a,style:{width:"100%",...t.style},children:e})})()]}):null;return(0,r.jsxs)(t.S,{id:c.id,className:c.className,children:[(0,r.jsx)(t.S.Header,{...c}),n?(0,r.jsx)(t.S.Body,{children:n}):null,a||d||s?(0,r.jsxs)(t.S.Footer,{children:[a?(0,r.jsx)(t.S.HelpText,{children:a}):null,d?(0,r.jsx)(t.S.Actions,{children:d}):null,s?(0,r.jsx)(t.S.Watermark,{}):null]}):null,l?(0,r.jsx)(t.S.FooterText,{children:l}):null]})}])},319546,e=>{"use strict";var r=e.i(691983);let o=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,o)=>o?o.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},t=(...e)=>e.filter((e,r,o)=>!!e&&""!==e.trim()&&o.indexOf(e)===r).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,r.forwardRef)(({color:e="currentColor",size:o=24,strokeWidth:a=2,absoluteStrokeWidth:l,className:s="",children:n,iconNode:c,...d},u)=>(0,r.createElement)("svg",{ref:u,...i,width:o,height:o,stroke:e,strokeWidth:l?24*Number(a)/Number(o):a,className:t("lucide",s),...!n&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(d)&&{"aria-hidden":"true"},...d},[...c.map(([e,o])=>(0,r.createElement)(e,o)),...Array.isArray(n)?n:[n]]));e.s(["default",0,(e,i)=>{let l=(0,r.forwardRef)(({className:l,...s},n)=>(0,r.createElement)(a,{ref:n,iconNode:i,className:t(`lucide-${o(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,l),...s}));return l.displayName=o(e),l}],319546)},635267,e=>{"use strict";let r=(0,e.i(319546).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",0,r],635267)},483535,e=>{"use strict";let r=(0,e.i(319546).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",0,r],483535)},995015,e=>{"use strict";let r=(0,e.i(319546).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",0,r],995015)},431924,e=>{"use strict";var r=e.i(177117),o=e.i(691983);let t=o.forwardRef(function({title:e,titleId:r,...t},i){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":r},t),e?o.createElement("title",{id:r},e):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"}))});var i=e.i(375675);let a=i.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-info-bg);
  border: 1px solid var(--privy-color-border-info);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,l=i.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  flex: 1;
  text-align: left;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["I",0,({children:e,theme:o,className:i})=>(0,r.jsxs)(a,{$theme:o,className:i,children:[(0,r.jsx)(t,{width:"16px",height:"16px",color:"var(--privy-color-foreground-2)",strokeWidth:2,style:{flexShrink:0}}),(0,r.jsx)(l,{$theme:o,children:e})]})],431924)},105223,e=>{"use strict";var r=e.i(177117),o=e.i(635267),t=e.i(483535),i=e.i(691983),a=e.i(375675);let l=a.styled.button`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;

  && {
    color: var(--privy-color-foreground);
    font-weight: 500;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`,s=a.styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--privy-color-foreground-2);
`,n=(0,a.styled)(o.Check)`
  color: var(--privy-color-icon-success);
  flex-shrink: 0;
`,c=(0,a.styled)(t.Copy)`
  color: var(--privy-color-icon-muted);
  flex-shrink: 0;
`;e.s(["C",0,function({children:e,iconOnly:o,value:t,hideCopyIcon:a,onCopy:d,iconSize:u=14,...p}){let[v,h]=(0,i.useState)(!1);return(0,r.jsxs)(l,{...p,onClick:()=>{navigator.clipboard.writeText(t||("string"==typeof e?e:"")).then(()=>d?.()).catch(console.error),h(!0),setTimeout(()=>h(!1),1500)},children:[e," ",v?(0,r.jsxs)(s,{children:[(0,r.jsx)(n,{size:u})," ",!o&&"Copied"]}):!a&&(0,r.jsx)(c,{size:u})]})},"a",0,({value:e,includeChildren:o,children:t,...a})=>{let[d,u]=(0,i.useState)(!1),p=()=>{navigator.clipboard.writeText(e).catch(console.error),u(!0),setTimeout(()=>u(!1),1500)};return(0,r.jsxs)(r.Fragment,{children:[o?(0,r.jsx)(l,{...a,onClick:p,children:t}):(0,r.jsx)(r.Fragment,{children:t}),(0,r.jsx)(l,{...a,onClick:p,children:d?(0,r.jsx)(s,{children:(0,r.jsx)(n,{})}):(0,r.jsx)(c,{})})]})}])},799738,e=>{"use strict";let r=(0,e.i(319546).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,r],799738)},207098,e=>{"use strict";let r=(0,e.i(319546).default)("hourglass",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]]);e.s(["Hourglass",0,r],207098)},261316,e=>{"use strict";var r=e.i(177117),o=e.i(799738),t=e.i(691983),i=e.i(375675),a=e.i(659366),l=e.i(962537);let s=i.styled.span`
  position: relative;
  background-color: var(--privy-color-background);
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  font-kerning: none;
  font-feature-settings: 'calt' off;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;

  && {
    color: var(--privy-color-foreground);
    font-size: ${({$size:e})=>"small"===e?"2.25rem":"compact"===e?"3rem":"3.75rem"};
    font-style: normal;
    font-weight: 600;
    line-height: 5.375rem;
  }
`,n=i.styled.input`
  appearance: none;
  align-self: flex-start;
  min-width: 1ch;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  text-align: left;
  caret-color: currentcolor;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
`,c=i.styled.span`
  position: absolute;
  visibility: hidden;
  white-space: pre;
  pointer-events: none;
`,d=i.styled.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: ${({$size:e})=>"small"===e?"0.75rem":"compact"===e?"0.875rem":"1rem"};
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  margin-top: 0.75rem;
`,u=i.styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  gap: 0.5rem;
  border: 1px solid var(--privy-color-border-default);
  border-radius: var(--privy-border-radius-full);

  && {
    margin: auto;
    padding: 0.5rem 1rem;
  }
`,p=i.styled.div`
  svg {
    width: 1rem;
    height: 1rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
    border: solid 0.1px var(--privy-color-border-default);
  }
`,v=i.styled.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
`,h=i.styled.div`
  color: var(--privy-color-foreground);

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`,g=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-height: 20.875rem;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`,y=i.styled.button`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-mdlg);
  border-style: solid;
  display: flex;

  && {
    padding: 0.75rem 1rem;
  }
`,f=i.styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`,b=i.styled.div`
  svg {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
    border: solid 0.1px var(--privy-color-border-default);
  }
`,m=i.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
`,x=i.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
`,k=i.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
`;e.s(["A",0,({currency:e="usd",value:o,onChange:i,inputMode:l="decimal",autoFocus:u})=>{let[p,v]=(0,t.useState)("0"),[h,g]=(0,t.useState)(null),y=(0,t.useRef)(null),f=(0,t.useRef)(null),b=o??p,m=a.S[e]?.symbol??"$",x=b.length>9?"small":b.length>6?"compact":"default";(0,t.useLayoutEffect)(()=>{let e=f.current?.offsetWidth;g(e?Math.ceil(e)+2:null)},[x,b]);let k=(0,t.useCallback)(e=>{let r=e.target.value,o=(r=r.replace(/[^\d.]/g,"")).split(".");o.length>2&&(r=o[0]+"."+o.slice(1).join(""));let[t="",a]=r.split("."),l=t.replace(/^0+(?=\d)/,"");(""===(r=void 0!==a?`${l||"0"}.${a}`:l||"0")||"."===r)&&(r="0"),i?i(r):v(r)},[i]),w=(0,t.useCallback)(e=>{!(["Delete","Backspace","Tab","Escape","Enter",".","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)||(e.ctrlKey||e.metaKey)&&["a","c","v","x"].includes(e.key.toLowerCase()))&&(e.key>="0"&&e.key<="9"||e.preventDefault())},[]);return(0,r.jsxs)(s,{$size:x,onClick:()=>y.current?.focus(),children:[(0,r.jsx)(d,{$size:x,children:m}),(0,r.jsx)(n,{ref:y,type:"text",inputMode:l,value:b,onChange:k,onKeyDown:w,autoFocus:u,placeholder:"0","aria-label":"Amount",style:h?{width:`${h}px`}:void 0}),(0,r.jsx)(c,{ref:f,"aria-hidden":"true",children:b}),(0,r.jsx)(d,{$size:x,style:{opacity:0},children:m})]})},"C",0,({selectedAsset:e,onEditSourceAsset:t})=>{let{icon:i}=a.S[e];return(0,r.jsxs)(u,{onClick:t,children:[(0,r.jsx)(p,{children:i}),(0,r.jsx)(v,{children:e.toLocaleUpperCase()}),(0,r.jsx)(h,{children:(0,r.jsx)(o.ChevronDown,{})})]})},"S",0,({opts:e,isLoading:o,onSelectSource:t})=>(0,r.jsx)(l.S,{showClose:!1,showBack:!0,onBack:()=>t(e.source.selectedAsset),title:"Select currency",children:(0,r.jsx)(g,{children:e.source.assets.map(e=>{let{icon:i,name:l}=a.S[e];return(0,r.jsx)(y,{onClick:()=>t(e),disabled:o,children:(0,r.jsxs)(f,{children:[(0,r.jsx)(b,{children:i}),(0,r.jsxs)(m,{children:[(0,r.jsx)(x,{children:l}),(0,r.jsx)(k,{children:e.toLocaleUpperCase()})]})]})},e)})})})])},834775,e=>{"use strict";var r=e.i(177117),o=e.i(691983),t=e.i(795086),i=e.i(852714),a=e.i(463475),l=e.i(561774),s=e.i(375675),n=e.i(105223),c=e.i(659366),d=e.i(962537),u=e.i(995015),p=e.i(207098);let v=(0,e.i(319546).default)("user-check",[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);var h=e.i(635267),g=e.i(431924),y=e.i(261316);let f=({data:e,onClose:o})=>(0,r.jsx)(d.S,{showClose:!0,onClose:o,title:"Initiate bank transfer",subtitle:"Use the details below to complete a bank transfer from your bank.",primaryCta:{label:"Done",onClick:o},watermark:!1,footerText:"Exchange rates and fees are set when you authorize and determine the amount you receive. You'll see the applicable rates and fees for your transaction separately",children:(0,r.jsx)(b,{children:(c.D[e.deposit_instructions.asset]||[]).map(([o,t],i)=>{let a=e.deposit_instructions[o];if(!a||Array.isArray(a))return null;let s="asset"===o?a.toUpperCase():a,c=s.length>100?`${s.slice(0,9)}...${s.slice(-9)}`:s;return(0,r.jsxs)(m,{children:[(0,r.jsx)(x,{children:t}),(0,r.jsx)(n.a,{value:s,includeChildren:l.isMobile,children:(0,r.jsx)(k,{children:c})})]},i)})})}),b=s.styled.ol`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-mdlg);
  border-style: solid;
  display: flex;
  flex-direction: column;

  && {
    padding: 0 1rem;
  }
`,m=s.styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;

  &:not(:first-of-type) {
    border-top: 1px solid var(--privy-color-border-default);
  }

  & > {
    :nth-child(1) {
      flex-basis: 30%;
    }

    :nth-child(2) {
      flex-basis: 60%;
    }
  }
`,x=s.styled.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-variant-numeric: lining-nums proportional-nums;
  font-feature-settings: 'calt' off;

  /* text-xs/font-regular */
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 150% */

  text-align: left;
  flex-shrink: 0;
`,k=s.styled.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;

  /* text-sm/font-medium */
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */

  text-align: right;
  word-break: break-all;
`,w=({onClose:e})=>(0,r.jsx)(d.S,{showClose:!0,onClose:e,icon:u.XCircle,iconVariant:"error",title:"Something went wrong",subtitle:"We couldn't complete account setup. This isn't caused by anything you did.",primaryCta:{label:"Close",onClick:e},watermark:!0}),j=({onClose:e,reason:o})=>{let t=o?o.charAt(0).toLowerCase()+o.slice(1):void 0;return(0,r.jsx)(d.S,{showClose:!0,onClose:e,icon:u.XCircle,iconVariant:"error",title:"Identity verification failed",subtitle:t?`We can't complete identity verification because ${t}. Please try again or contact support for assistance.`:"We couldn't verify your identity. Please try again or contact support for assistance.",primaryCta:{label:"Close",onClick:e},watermark:!0})},C=({onClose:e,email:o})=>(0,r.jsx)(d.S,{showClose:!0,onClose:e,icon:p.Hourglass,title:"Identity verification in progress",subtitle:"We're waiting for Persona to approve your identity verification. This usually takes a few minutes, but may take up to 24 hours.",primaryCta:{label:"Done",onClick:e},watermark:!0,children:(0,r.jsxs)(g.I,{theme:"light",children:["You'll receive an email at ",o," once approved with instructions for completing your deposit."]})}),$=({onClose:e,onAcceptTerms:o,isLoading:t})=>(0,r.jsx)(d.S,{showClose:!0,onClose:e,icon:v,title:"Verify your identity to continue",subtitle:"Finish verification with Persona — it takes just a few minutes and requires a government ID.",helpText:(0,r.jsxs)(r.Fragment,{children:['This app uses Bridge to securely connect accounts and move funds. By clicking "Accept," you agree to Bridge\'s'," ",(0,r.jsx)("a",{href:"https://www.bridge.xyz/legal",target:"_blank",rel:"noopener noreferrer",children:"Terms of Service"})," ","and"," ",(0,r.jsx)("a",{href:"https://www.bridge.xyz/legal/row-privacy-policy/bridge-building-limited",target:"_blank",rel:"noopener noreferrer",children:"Privacy Policy"}),"."]}),primaryCta:{label:"Accept and continue",onClick:o,loading:t},watermark:!0}),S=({onClose:e})=>(0,r.jsx)(d.S,{showClose:!0,onClose:e,icon:h.Check,iconVariant:"success",title:"Identity verified successfully",subtitle:"We've successfully verified your identity. Now initiate a bank transfer to view instructions.",primaryCta:{label:"Initiate bank transfer",onClick:()=>{},loading:!0},watermark:!0}),z=({opts:e,onClose:o,onBack:t,onEditSourceAsset:i,onSelectAmount:a,isLoading:l})=>(0,r.jsxs)(d.S,{showClose:!0,onClose:o,showBack:!!t,onBack:t,headerTitle:`Buy ${e.destination.asset.toLocaleUpperCase()}`,primaryCta:{label:"Continue",onClick:a,loading:l},watermark:!0,children:[(0,r.jsx)(y.A,{currency:e.source.selectedAsset,inputMode:"decimal",autoFocus:!0}),(0,r.jsx)(y.C,{selectedAsset:e.source.selectedAsset,onEditSourceAsset:i})]}),A=({onClose:e,onBack:o,onAcceptTerms:t,onSelectAmount:i,onSelectSource:a,onEditSourceAsset:l,opts:s,state:n,email:c,isLoading:d})=>"select-amount"===n.status?(0,r.jsx)(z,{onClose:e,onBack:o,onSelectAmount:i,onEditSourceAsset:l,opts:s,isLoading:d}):"select-source-asset"===n.status?(0,r.jsx)(y.S,{onSelectSource:a,opts:s,isLoading:d}):"kyc-prompt"===n.status?(0,r.jsx)($,{onClose:e,onAcceptTerms:t,opts:s,isLoading:d}):"kyc-incomplete"===n.status?(0,r.jsx)(C,{onClose:e,email:c}):"kyc-success"===n.status?(0,r.jsx)(S,{onClose:e}):"kyc-error"===n.status?(0,r.jsx)(j,{onClose:e,reason:n.reason}):"account-details"===n.status?(0,r.jsx)(f,{onClose:e,data:n.data}):"create-customer-error"===n.status||"get-customer-error"===n.status?(0,r.jsx)(w,{onClose:e}):null,B={component:()=>{let{user:e}=(0,a.a)(),l=(0,a.b)().data;if(!l?.FundWithBankDepositScreen)throw Error("Missing data");let{onSuccess:s,onFailure:n,onBack:c,opts:d,createOrUpdateCustomer:u,getCustomer:p,getOrCreateVirtualAccount:v}=l.FundWithBankDepositScreen,[h,g]=(0,o.useState)(d),[y,f]=(0,o.useState)({status:"select-amount"}),[b,m]=(0,o.useState)(null),[x,k]=(0,o.useState)(!1),w=(0,o.useRef)(null),j=(0,o.useCallback)(async()=>{let e;k(!0),m(null);try{e=await p({kycRedirectUrl:window.location.origin})}catch(e){if(!e||"object"!=typeof e||!("status"in e)||404!==e.status)return f({status:"get-customer-error"}),m(e),void k(!1)}if(!e)try{e=await u({hasAcceptedTerms:!1,kycRedirectUrl:window.location.origin})}catch(e){return f({status:"create-customer-error"}),m(e),void k(!1)}if(!e)return f({status:"create-customer-error"}),m(Error("Unable to create customer")),void k(!1);if("not_started"===e.status&&e.kyc_url)return f({status:"kyc-prompt",kycUrl:e.kyc_url}),void k(!1);if("not_started"===e.status)return f({status:"get-customer-error"}),m(Error("Unexpected user state")),void k(!1);if("rejected"===e.status)return f({status:"kyc-error",reason:e.rejection_reasons?.[0]?.reason}),m(Error("User KYC rejected.")),void k(!1);if("incomplete"===e.status)return f({status:"kyc-incomplete"}),void k(!1);if("active"!==e.status)return f({status:"get-customer-error"}),m(Error("Unexpected user state")),void k(!1);e.status;try{let e=await v({destination:h.destination,provider:h.provider,source:{asset:h.source.selectedAsset}});f({status:"account-details",data:e})}catch(e){return f({status:"create-customer-error"}),m(e),void k(!1)}},[h]),C=(0,o.useCallback)(async()=>{if(m(null),k(!0),"kyc-prompt"!==y.status)return m(Error("Unexpected state")),void k(!1);let e=(0,i.trigger)({location:y.kycUrl});try{await u({hasAcceptedTerms:!0})}catch(r){return e&&!e.closed&&e.close(),f({status:"create-customer-error"}),m(r),void k(!1)}if(!e)return m(Error("Unable to begin kyc flow.")),k(!1),void f({status:"create-customer-error"});w.current=new AbortController;let r=await (async(e,r)=>{let o=await (0,t.poll)({operation:async()=>({done:(e=>{try{return e.location.origin}catch{return}})(e)===window.location.origin,closed:e.closed}),until:({done:e,closed:r})=>e||r,delay:0,interval:500,attempts:360,signal:r});return"aborted"===o.status?(e.close(),{status:"aborted"}):"max_attempts"===o.status?{status:"timeout"}:o.result.done?(e.close(),{status:"redirected"}):{status:"closed"}})(e,w.current.signal);if("aborted"===r.status)return;if("closed"===r.status)return void k(!1);r.status;let o=await (0,t.poll)({operation:()=>p({}),until:e=>"active"===e.status||"rejected"===e.status,delay:0,interval:2e3,attempts:60,signal:w.current.signal});if("aborted"!==o.status){if("max_attempts"===o.status)return f({status:"kyc-incomplete"}),void k(!1);if(o.status,"rejected"===o.result.status)return f({status:"kyc-error",reason:o.result.rejection_reasons?.[0]?.reason}),m(Error("User KYC rejected.")),void k(!1);if("active"!==o.result.status)return f({status:"kyc-incomplete"}),void k(!1);e.closed||e.close(),o.result.status;try{f({status:"kyc-success"});let e=await v({destination:h.destination,provider:h.provider,source:{asset:h.source.selectedAsset}});f({status:"account-details",data:e})}catch(e){f({status:"create-customer-error"}),m(e)}finally{k(!1)}}},[f,m,k,u,v,y,h,w]),$=(0,o.useCallback)(e=>{f({status:"select-amount"}),g({...h,source:{...h.source,selectedAsset:e}})},[f,g]),S=(0,o.useCallback)(()=>{f({status:"select-source-asset"})},[f]);return(0,r.jsx)(A,{onClose:(0,o.useCallback)(async()=>{w.current?.abort(),h.showBackButton&&("select-amount"===y.status||"select-source-asset"===y.status)?n(Error("User cancelled funding")):b?n(b):await s()},[b,w,n,s,h.showBackButton,y.status]),onBack:c,opts:h,state:y,isLoading:x,email:e.email.address,onAcceptTerms:C,onSelectAmount:j,onSelectSource:$,onEditSourceAsset:S})}};e.s(["FundWithBankDepositScreen",0,B,"default",0,B],834775)}]);