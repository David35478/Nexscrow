(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,898419,r=>{"use strict";var e=r.i(691983);let o=e.forwardRef(function({title:r,titleId:o,...i},t){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":o},i),r?e.createElement("title",{id:o},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});r.s(["default",0,o])},529359,r=>{"use strict";var e=r.i(691983);let o=e.forwardRef(function({title:r,titleId:o,...i},t){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":o},i),r?e.createElement("title",{id:o},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});r.s(["default",0,o])},781929,r=>{"use strict";var e=r.i(177117),o=r.i(375675),i=r.i(691778),t=r.i(898419),l=r.i(529359),a=r.i(691983);let n=a.forwardRef(function({title:r,titleId:e,...o},i){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":e},o),r?a.createElement("title",{id:e},r):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var c=r.i(463475),d=r.i(68297);let s=o.styled.button`
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
`,p=({children:r,loading:o,disabled:t,success:l,size:a="lg",loadingText:n="Loading...",as:c,onClick:d,...s})=>{let p="a"===c,v=!(!o&&!t);return(0,e.jsx)(u,{as:c,disabled:p?void 0:v,"aria-disabled":p?v:void 0,$success:l,$size:a,onClick:r=>{p&&v?r.preventDefault():d?.(r)},...s,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(i.B,{}),n?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:n}):null]}):r})},v=(0,o.styled)(s)`
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
`,u=(0,o.styled)(s)`
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
`,h=({children:r,loading:o,disabled:t,size:l="lg",loadingText:a="Loading...",as:n,onClick:c,...d})=>{let s="a"===n,p=!(!o&&!t);return(0,e.jsx)(y,{as:n,disabled:s?void 0:p,"aria-disabled":s?p:void 0,$size:l,onClick:r=>{s&&p?r.preventDefault():c?.(r)},...d,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(i.B,{}),a?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):r})},g=({children:r,loading:o,disabled:t,size:l="lg",loadingText:a="Loading...",as:n,onClick:c,...d})=>{let s="a"===n,p=!(!o&&!t);return(0,e.jsx)(f,{as:n,disabled:s?void 0:p,"aria-disabled":s?p:void 0,$size:l,onClick:r=>{s&&p?r.preventDefault():c?.(r)},...d,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(i.B,{}),a?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):r})},y=(0,o.styled)(s)`
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
`,f=(0,o.styled)(s)`
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
`,m=o.styled.button`
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
`,x=({backFn:r,disabled:o=!1,"aria-label":i})=>(0,e.jsx)("div",{children:(0,e.jsx)(j,{type:"button","aria-label":i,disabled:o,onClick:o?void 0:r,children:(0,e.jsx)(t.default,{height:"16px",width:"16px",strokeWidth:2})})}),w=({infoFn:r})=>(0,e.jsx)("div",{children:(0,e.jsx)($,{"aria-label":"info",onClick:r,children:(0,e.jsx)(l.default,{height:"22px",width:"22px",strokeWidth:2})})}),k=r=>(0,e.jsx)("div",{children:(0,e.jsx)(j,{type:"button","aria-label":r["aria-label"]??"close modal",onClick:r.onClose,children:(0,e.jsx)(n,{height:"16px",width:"16px",strokeWidth:2})})}),j=o.styled.button`
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
`,L=o.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;r.s(["B",0,({variant:r="primary",size:o="lg",children:i,success:t,...l})=>{switch(r){case"secondary":return(0,e.jsx)(h,{size:o,...l,children:i});case"error":return(0,e.jsx)(h,{$warn:!0,size:o,...l,children:i});case"muted":return(0,e.jsx)(g,{size:o,...l,children:i});default:return(0,e.jsx)(p,{size:o,success:t,...l,children:i})}},"E",0,({children:r,onClick:o,disabled:t,isSubmitting:l,...a})=>(0,e.jsxs)(b,{$isSubmitting:l,onClick:o,disabled:t,...a,children:[(0,e.jsx)("span",{children:r}),(0,e.jsx)("span",{children:(0,e.jsx)(i.B,{})})]}),"M",0,({backFn:r,infoFn:o,onClose:i,title:t,eyebrow:l,closeable:a=!0,className:n})=>{let{closePrivyModal:s}=(0,d.u)(),p=(0,c.u)();return(0,e.jsxs)(C,{className:n,children:[(0,e.jsxs)(z,{children:[r&&(0,e.jsx)(x,{backFn:r}),l&&(0,e.jsx)(L,{children:l}),!l&&t&&(0,e.jsx)(S,{id:"privy-dialog-title",children:t}),(0,e.jsx)("div",{style:{height:24}}),o&&(0,e.jsx)(w,{infoFn:o})]}),(0,e.jsx)(M,{children:!p.render.standalone&&a&&(0,e.jsx)(k,{onClose:i||(()=>s())})})]})},"P",0,p,"S",0,h,"a",0,m,"b",0,({children:r,loading:o,disabled:t,...l})=>(0,e.jsx)(v,{disabled:t,...l,children:o?(0,e.jsx)(i.B,{color:"var(--privy-color-foreground-accent)"}):r}),"d",0,g],781929)},657545,r=>{"use strict";var e=r.i(177117),o=r.i(375675),i=r.i(463475);function t(r){return(0,e.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...r,children:(0,e.jsx)("g",{fill:r.color||"var(--privy-color-foreground)",children:(0,e.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let l=o.styled.span`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);
  display: block;

  && > a {
    color: var(--privy-color-accent);
  }
`,a=o.styled.a`
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
`;r.s(["B",0,({className:r})=>{let{appearance:o}=(0,i.u)();return(0,e.jsx)(n,{className:r,children:o.footerLogo??(0,e.jsx)(a,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,e.jsx)(t,{color:"currentColor",height:13,width:150})})})},"M",0,n,"T",0,function({app:{legal:{privacyPolicyUrl:r,termsAndConditionsUrl:o,requireUsersAcceptTerms:i}},alwaysShowImplicitConsent:t}){let a=!(!r||!o);return(!i||t)&&(o||r)?(0,e.jsxs)(l,{children:["By logging in I agree to the"," ",o&&(0,e.jsx)("a",{href:o,target:"_blank",children:a?"Terms":"Terms of Service"}),a&&" & ",r&&(0,e.jsx)("a",{href:r,target:"_blank",children:"Privacy Policy"})]}):(0,e.jsx)(l,{})}])},436896,r=>{"use strict";var e=r.i(177117),o=r.i(375675);let i=o.styled.div`
  --spinner-size: ${r=>r.$size?r.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,t=o.styled.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,l=o.styled.div`
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
`,a=o.styled.div`
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
`;r.s(["N",0,({size:r,centerIcon:o})=>(0,e.jsx)(i,{$size:r,children:(0,e.jsxs)(t,{children:[(0,e.jsx)(a,{}),(0,e.jsx)(n,{}),o?(0,e.jsx)(l,{children:o}):null]})})])},566305,r=>{"use strict";var e=r.i(177117),o=r.i(691983),i=r.i(375675),t=r.i(691778),l=r.i(657545),a=r.i(781929),n=r.i(436896);let c=i.styled.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,d=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,s=i.styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,p=(0,i.styled)(a.M)`
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
`,u=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,h=i.styled.div`
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
`,f=i.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,m=i.styled.div`
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
`,x=i.styled.div`
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
`,w=({children:r,...o})=>(0,e.jsx)(c,{children:(0,e.jsx)(d,{...o,children:r})}),k=i.styled.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,j=(0,i.styled)(l.B)`
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
`,C=({step:r})=>r?(0,e.jsx)(k,{children:(0,e.jsx)($,{pct:Math.min(100,r.current/r.total*100)})}):null;w.Header=({title:r,subtitle:o,icon:i,iconVariant:t,iconLoadingStatus:l,showBack:a,onBack:n,showInfo:c,onInfo:d,showClose:v,onClose:u,step:m,headerTitle:b,eyebrow:x,...k})=>(0,e.jsxs)(s,{...k,children:[(0,e.jsx)(p,{backFn:a?n:void 0,infoFn:c?d:void 0,onClose:v?u:void 0,title:b,eyebrow:x,closeable:v}),(i||t||r||o)&&(0,e.jsxs)(h,{children:[i||t?(0,e.jsx)(w.Icon,{icon:i,variant:t,loadingStatus:l}):null,!(!r&&!o)&&(0,e.jsxs)(g,{children:[r&&(0,e.jsx)(y,{children:r}),o&&(0,e.jsx)(f,{children:o})]})]}),m&&(0,e.jsx)(C,{step:m})]}),(w.Body=o.default.forwardRef(({children:r,...o},i)=>(0,e.jsx)(v,{ref:i,...o,children:r}))).displayName="Screen.Body",w.Footer=({children:r,...o})=>(0,e.jsx)(u,{id:"privy-content-footer-container",...o,children:r}),w.Actions=({children:r,...o})=>(0,e.jsx)(z,{...o,children:r}),w.HelpText=({children:r,...o})=>(0,e.jsx)(M,{...o,children:r}),w.FooterText=({children:r,...o})=>(0,e.jsx)(S,{...o,children:r}),w.Watermark=()=>(0,e.jsx)(j,{}),w.Icon=({icon:r,variant:i="subtle",loadingStatus:l})=>"logo"===i&&r?(0,e.jsx)(b,"string"==typeof r?{children:(0,e.jsx)("img",{src:r,alt:""})}:o.default.isValidElement(r)?{children:r}:{children:o.default.createElement(r)}):"loading"===i?r?(0,e.jsx)(x,{children:(0,e.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,e.jsx)(t.C,{success:l?.success,fail:l?.fail}),"string"==typeof r?(0,e.jsx)("span",{style:{background:`url('${r}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):o.default.isValidElement(r)?o.default.cloneElement(r,{style:{width:"38px",height:"38px"}}):o.default.createElement(r,{style:{width:"38px",height:"38px"}})]})}):(0,e.jsx)(m,{$variant:i,children:(0,e.jsx)(n.N,{size:"64px"})}):(0,e.jsx)(m,{$variant:i,children:r&&("string"==typeof r?(0,e.jsx)("img",{src:r,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):o.default.isValidElement(r)?r:o.default.createElement(r,{width:32,height:32,stroke:(()=>{switch(i){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let z=i.styled.div`
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
`;r.s(["S",0,w])},962537,r=>{"use strict";var e=r.i(177117),o=r.i(781929),i=r.i(566305);r.s(["S",0,({primaryCta:r,secondaryCta:t,helpText:l,footerText:a,watermark:n=!0,children:c,...d})=>{let s=r||t?(0,e.jsxs)(e.Fragment,{children:[r&&(()=>{let{label:i,...t}=r,l=t.variant||"primary";return(0,e.jsx)(o.B,{...t,variant:l,style:{width:"100%",...t.style},children:i})})(),t&&(()=>{let{label:r,...i}=t,l=i.variant||"secondary";return(0,e.jsx)(o.B,{...i,variant:l,style:{width:"100%",...i.style},children:r})})()]}):null;return(0,e.jsxs)(i.S,{id:d.id,className:d.className,children:[(0,e.jsx)(i.S.Header,{...d}),c?(0,e.jsx)(i.S.Body,{children:c}):null,l||s||n?(0,e.jsxs)(i.S.Footer,{children:[l?(0,e.jsx)(i.S.HelpText,{children:l}):null,s?(0,e.jsx)(i.S.Actions,{children:s}):null,n?(0,e.jsx)(i.S.Watermark,{}):null]}):null,a?(0,e.jsx)(i.S.FooterText,{children:a}):null]})}])},319546,r=>{"use strict";var e=r.i(691983);let o=r=>{let e=r.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,e,o)=>o?o.toUpperCase():e.toLowerCase());return e.charAt(0).toUpperCase()+e.slice(1)},i=(...r)=>r.filter((r,e,o)=>!!r&&""!==r.trim()&&o.indexOf(r)===e).join(" ").trim();var t={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let l=(0,e.forwardRef)(({color:r="currentColor",size:o=24,strokeWidth:l=2,absoluteStrokeWidth:a,className:n="",children:c,iconNode:d,...s},p)=>(0,e.createElement)("svg",{ref:p,...t,width:o,height:o,stroke:r,strokeWidth:a?24*Number(l)/Number(o):l,className:i("lucide",n),...!c&&!(r=>{for(let e in r)if(e.startsWith("aria-")||"role"===e||"title"===e)return!0})(s)&&{"aria-hidden":"true"},...s},[...d.map(([r,o])=>(0,e.createElement)(r,o)),...Array.isArray(c)?c:[c]]));r.s(["default",0,(r,t)=>{let a=(0,e.forwardRef)(({className:a,...n},c)=>(0,e.createElement)(l,{ref:c,iconNode:t,className:i(`lucide-${o(r).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${r}`,a),...n}));return a.displayName=o(r),a}],319546)},635267,r=>{"use strict";let e=(0,r.i(319546).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);r.s(["Check",0,e],635267)},483535,r=>{"use strict";let e=(0,r.i(319546).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);r.s(["Copy",0,e],483535)},635665,r=>{"use strict";let e=(0,r.i(319546).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);r.s(["X",0,e],635665)},708093,r=>{"use strict";var e=r.i(691983);let o=e.forwardRef(function({title:r,titleId:o,...i},t){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":o},i),r?e.createElement("title",{id:o},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))});r.s(["default",0,o])},969002,r=>{"use strict";let e=(0,r.i(319546).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);r.s(["Lock",0,e],969002)},995015,r=>{"use strict";let e=(0,r.i(319546).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);r.s(["XCircle",0,e],995015)},784095,r=>{"use strict";var e=r.i(177117),o=r.i(708093),i=r.i(375675);let t=i.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-warn-bg);
  border: 1px solid var(--privy-color-border-warning);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,l=i.styled.div`
  color: ${r=>"dark"===r.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;r.s(["W",0,({children:r,theme:i,className:a})=>(0,e.jsxs)(t,{$theme:i,className:a,children:[(0,e.jsx)(o.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-warning)",strokeWidth:2,style:{flexShrink:0}}),(0,e.jsx)(l,{$theme:i,children:r})]})])},431924,r=>{"use strict";var e=r.i(177117),o=r.i(691983);let i=o.forwardRef(function({title:r,titleId:e,...i},t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":e},i),r?o.createElement("title",{id:e},r):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"}))});var t=r.i(375675);let l=t.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-info-bg);
  border: 1px solid var(--privy-color-border-info);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,a=t.styled.div`
  color: ${r=>"dark"===r.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  flex: 1;
  text-align: left;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;r.s(["I",0,({children:r,theme:o,className:t})=>(0,e.jsxs)(l,{$theme:o,className:t,children:[(0,e.jsx)(i,{width:"16px",height:"16px",color:"var(--privy-color-foreground-2)",strokeWidth:2,style:{flexShrink:0}}),(0,e.jsx)(a,{$theme:o,children:r})]})],431924)},105223,r=>{"use strict";var e=r.i(177117),o=r.i(635267),i=r.i(483535),t=r.i(691983),l=r.i(375675);let a=l.styled.button`
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
`,n=l.styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--privy-color-foreground-2);
`,c=(0,l.styled)(o.Check)`
  color: var(--privy-color-icon-success);
  flex-shrink: 0;
`,d=(0,l.styled)(i.Copy)`
  color: var(--privy-color-icon-muted);
  flex-shrink: 0;
`;r.s(["C",0,function({children:r,iconOnly:o,value:i,hideCopyIcon:l,onCopy:s,iconSize:p=14,...v}){let[u,h]=(0,t.useState)(!1);return(0,e.jsxs)(a,{...v,onClick:()=>{navigator.clipboard.writeText(i||("string"==typeof r?r:"")).then(()=>s?.()).catch(console.error),h(!0),setTimeout(()=>h(!1),1500)},children:[r," ",u?(0,e.jsxs)(n,{children:[(0,e.jsx)(c,{size:p})," ",!o&&"Copied"]}):!l&&(0,e.jsx)(d,{size:p})]})},"a",0,({value:r,includeChildren:o,children:i,...l})=>{let[s,p]=(0,t.useState)(!1),v=()=>{navigator.clipboard.writeText(r).catch(console.error),p(!0),setTimeout(()=>p(!1),1500)};return(0,e.jsxs)(e.Fragment,{children:[o?(0,e.jsx)(a,{...l,onClick:v,children:i}):(0,e.jsx)(e.Fragment,{children:i}),(0,e.jsx)(a,{...l,onClick:v,children:s?(0,e.jsx)(n,{children:(0,e.jsx)(c,{})}):(0,e.jsx)(d,{})})]})}])},799738,r=>{"use strict";let e=(0,r.i(319546).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);r.s(["ChevronDown",0,e],799738)},417973,r=>{"use strict";var e=r.i(375675),o=r.i(691778),i=r.i(962537);let t=(0,e.styled)(i.S)`
  #privy-content-footer-container {
    margin-top: 0;
  }
`,l=e.styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: var(--privy-color-foreground-3);
  margin: 0.25rem 0 0;
`,a=e.styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: var(--privy-border-radius-full);
  object-fit: cover;
  flex-shrink: 0;
`,n=e.styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`,c=e.styled.span`
  font-weight: 500;
`,d=e.styled.span`
  font-size: 0.875rem;
  color: var(--privy-color-foreground-3);
  margin-left: auto;
`,s=e.styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-2);
  color: var(--privy-color-icon-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`,p=e.styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`,v=e.styled.span`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--privy-color-foreground-3);
`;e.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  min-height: 2.25rem;
  border-radius: 6.25rem;
  border: none;
  background-color: var(--privy-color-background-2);

  input {
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: transparent;
    color: var(--privy-color-foreground);

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &::placeholder {
      color: var(--privy-color-foreground-3);
    }
  }
`;let u=e.styled.button`
  && {
    position: relative;
    width: 100%;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.625rem 0.75rem;
    min-height: 3.5rem;
    border: 1px solid
      ${r=>r.$selected?"var(--privy-color-icon-interactive)":"var(--privy-color-foreground-4)"};
    border-radius: var(--privy-border-radius-md);
    background-color: ${r=>r.$selected?"var(--privy-color-info-bg)":"transparent"};
    color: var(--privy-color-foreground);
    font-size: 0.875rem;
    line-height: 1.5rem;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    transition:
      background-color 200ms ease,
      border-color 200ms ease;

    &:hover {
      background-color: var(--privy-color-background-2);
    }

    &:disabled {
      opacity: ${r=>r.$selected?1:.5};
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:focus-visible {
      box-shadow: var(--privy-shadow-focus-ring);
    }
  }
`,h=e.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 0;
`,g=e.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem 0;
`,y=e.styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,f=e.styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${r=>"done"===r.$status?"var(--privy-color-success-light)":"var(--privy-color-background-2)"};
`,m=e.styled.div`
  width: 2px;
  height: 1rem;
  background-color: var(--privy-color-background-2);
  margin-left: 0.6875rem;
`,b=e.styled.span`
  font-size: 0.875rem;
  color: var(--privy-color-foreground);
`;e.styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--privy-border-radius-md);
  background-color: var(--privy-color-background-2);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-foreground-3);
`;let x=e.styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  line-height: 1.25rem;
`,w=e.styled.span`
  color: var(--privy-color-foreground);
  font-weight: 400;
`,k=e.styled.span`
  color: var(--privy-color-foreground);
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,j=(0,e.styled)(o.L)`
  && {
    margin-left: auto;
    height: 1.5rem;
    width: 1.5rem;
    border-width: 2px;
    flex-shrink: 0;
  }
`;r.s(["C",0,t,"L",0,h,"M",0,s,"N",0,n,"O",0,u,"S",0,l,"T",0,g,"a",0,p,"b",0,c,"c",0,v,"d",0,y,"e",0,f,"f",0,b,"g",0,m,"h",0,a,"i",0,x,"j",0,w,"k",0,k,"l",0,j,"m",0,d])},67820,r=>{"use strict";var e=r.i(375675);let o=e.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,i=e.css`
  ${r=>r.$isLoading?e.css`
          width: 35%;
          animation: ${o} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;r.s(["L",0,i])},266799,r=>{"use strict";var e=r.i(177117),o=r.i(375675),i=r.i(67820);let t=o.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${r=>{let e,i;"green"===r.$color&&(e="var(--privy-color-success-dark)",i="var(--privy-color-success-light)"),"red"===r.$color&&(e="var(--privy-color-error)",i="var(--privy-color-error-light)"),"gray"===r.$color&&(e="var(--privy-color-foreground-2)",i="var(--privy-color-background-2)");let t=o.keyframes`
      from, to {
        background-color: ${i};
      }

      50% {
        background-color: rgba(${i}, 0.8);
      }
    `;return o.css`
      color: ${e};
      background-color: ${i};
      ${r.$isPulsing&&o.css`
        animation: ${t} 3s linear infinite;
      `};
    `}}

  ${i.L}
`;r.s(["C",0,({children:r,color:o,isLoading:i,isPulsing:l,...a})=>(0,e.jsx)(t,{$color:o,$isLoading:i,$isPulsing:l,...a,children:r})])},10596,r=>{"use strict";var e=r.i(177117),o=r.i(691983),i=r.i(375675),t=r.i(795086),l=r.i(930531),a=r.i(463475),n=r.i(612780),c=r.i(781929),d=r.i(266799);let s=({value:r,onChange:o})=>(0,e.jsx)("select",{value:r,onChange:o,children:t.countryCodesAndNumbers.map(r=>(0,e.jsxs)("option",{value:r.code,children:[r.code," +",r.callCode]},r.code))}),p=(0,o.forwardRef)((r,i)=>{let p=(0,a.u)(),[h,g]=(0,o.useState)(!1),{accountType:y}=(0,n.b)(),[f,m]=(0,o.useState)(""),[b,x]=(0,o.useState)(r.defaultCountry??p?.intl.defaultCountry??"US"),w=(0,t.validatePhoneNumber)(f,b),k=(0,t.phoneNumberTypingFormatter)(b),j=(0,t.getPlaceholderPhoneNumber)(b),$=(0,l.getCountryCallingCode)(b),C=!w,[z,M]=(0,o.useState)(!1),S=$.length,L=e=>{let o=e.target.value;x(o),m(""),r.onChange&&r.onChange({rawPhoneNumber:f,qualifiedPhoneNumber:(0,t.formatPhoneNumber)(f,o),countryCode:o,isValid:(0,t.validatePhoneNumber)(f,b)})},E=(e,o)=>{try{let i=e.replace(/\D/g,"")===f.replace(/\D/g,"")?e:k.input(e);m(i),r.onChange&&r.onChange({rawPhoneNumber:i,qualifiedPhoneNumber:(0,t.formatPhoneNumber)(e,o),countryCode:o,isValid:(0,t.validatePhoneNumber)(e,o)})}catch(r){console.error("Error processing phone number:",r)}},N=()=>{M(!0);let e=(0,t.formatPhoneNumber)(f,b);r.onSubmit({rawPhoneNumber:f,qualifiedPhoneNumber:e,countryCode:b,isValid:(0,t.validatePhoneNumber)(f,b)}).finally(()=>M(!1))};return(0,o.useEffect)(()=>{if(r.defaultValue){let e=(0,t.getPhoneCountryCodeAndNumber)(r.defaultValue);k.reset(),L({target:{value:e.countryCode}}),E(e.phone,e.countryCode)}},[r.defaultValue]),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(v,{children:(0,e.jsxs)(u,{$callingCodeLength:S,$stacked:r.stacked,children:[(0,e.jsx)(s,{value:b,onChange:L}),(0,e.jsx)("input",{ref:i,id:"phone-number-input",className:"login-method-button",type:"tel",placeholder:j,onFocus:()=>g(!0),onChange:r=>{E(r.target.value,b)},onKeyUp:r=>{"Enter"===r.key&&N()},value:f,autoComplete:"tel"}),"phone"!==y||h||r.hideRecent?r.stacked||r.noIncludeSubmitButton?(0,e.jsx)("span",{}):(0,e.jsx)(c.E,{isSubmitting:z,onClick:N,disabled:C,children:"Submit"}):(0,e.jsx)(d.C,{color:"gray",children:"Recent"})]})}),r.stacked&&!r.noIncludeSubmitButton?(0,e.jsx)(c.P,{loading:z,loadingText:null,onClick:N,disabled:C,children:"Submit"}):null]})}),v=i.styled.div`
  width: 100%;
`,u=i.styled.label`
  --country-code-dropdown-width: calc(54px + calc(12 * ${r=>r.$callingCodeLength}px));
  --phone-input-extra-padding-left: calc(12px + calc(3 * ${r=>r.$callingCodeLength}px));
  display: block;
  position: relative;
  width: 100%;

  /* Tablet and Up */
  @media (min-width: 441px) {
    --country-code-dropdown-width: calc(52px + calc(10 * ${r=>r.$callingCodeLength}px));
  }

  && > select {
    font-size: 16px;
    height: 24px;
    position: absolute;
    margin: 13px calc(var(--country-code-dropdown-width) / 4);
    line-height: 24px;
    width: var(--country-code-dropdown-width);
    background-color: var(--privy-color-background);
    background-size: auto;
    background-position-x: right;
    cursor: pointer;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      width: var(--country-code-dropdown-width);
    }

    :focus {
      outline: none;
      box-shadow: none;
    }
  }

  && > input {
    font-size: 16px;
    line-height: 24px;
    color: var(--privy-color-foreground);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    padding: 12px 88px 12px
      calc(var(--country-code-dropdown-width) + var(--phone-input-extra-padding-left));
    padding-right: ${r=>r.$stacked?"16px":"88px"};
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
    width: 100%;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }
  }

  && > :last-child {
    right: 16px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  && > button:last-child {
    right: 0;
    line-height: 24px;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`;r.s(["C",0,p])},209086,r=>{"use strict";let e=(0,r.i(319546).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);r.s(["Wallet",0,e],209086)},742513,r=>{"use strict";let e=(0,r.i(319546).default)("smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);r.s(["Smartphone",0,e],742513)},2620,442629,r=>{"use strict";var e=r.i(177117);r.s(["A",0,r=>(0,e.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 210.2",xmlSpace:"preserve",...r,children:(0,e.jsx)("path",{d:"M93.6,27.1C87.6,34.2,78,39.8,68.4,39c-1.2-9.6,3.5-19.8,9-26.1c6-7.3,16.5-12.5,25-12.9  C103.4,10,99.5,19.8,93.6,27.1 M102.3,40.9c-13.9-0.8-25.8,7.9-32.4,7.9c-6.7,0-16.8-7.5-27.8-7.3c-14.3,0.2-27.6,8.3-34.9,21.2  c-15,25.8-3.9,64,10.6,85c7.1,10.4,15.6,21.8,26.8,21.4c10.6-0.4,14.8-6.9,27.6-6.9c12.9,0,16.6,6.9,27.8,6.7  c11.6-0.2,18.9-10.4,26-20.8c8.1-11.8,11.4-23.3,11.6-23.9c-0.2-0.2-22.4-8.7-22.6-34.3c-0.2-21.4,17.5-31.6,18.3-32.2  C123.3,42.9,107.7,41.3,102.3,40.9 M182.6,11.9v155.9h24.2v-53.3h33.5c30.6,0,52.1-21,52.1-51.4c0-30.4-21.1-51.2-51.3-51.2H182.6z   M206.8,32.3h27.9c21,0,33,11.2,33,30.9c0,19.7-12,31-33.1,31h-27.8V32.3z M336.6,169c15.2,0,29.3-7.7,35.7-19.9h0.5v18.7h22.4V90.2  c0-22.5-18-37-45.7-37c-25.7,0-44.7,14.7-45.4,34.9h21.8c1.8-9.6,10.7-15.9,22.9-15.9c14.8,0,23.1,6.9,23.1,19.6v8.6l-30.2,1.8  c-28.1,1.7-43.3,13.2-43.3,33.2C298.4,155.6,314.1,169,336.6,169z M343.1,150.5c-12.9,0-21.1-6.2-21.1-15.7c0-9.8,7.9-15.5,23-16.4  l26.9-1.7v8.8C371.9,140.1,359.5,150.5,343.1,150.5z M425.1,210.2c23.6,0,34.7-9,44.4-36.3L512,54.7h-24.6l-28.5,92.1h-0.5  l-28.5-92.1h-25.3l41,113.5l-2.2,6.9c-3.7,11.7-9.7,16.2-20.4,16.2c-1.9,0-5.6-0.2-7.1-0.4v18.7C417.3,210,423.3,210.2,425.1,210.2z"})})],2620),r.s(["G",0,r=>(0,e.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 80 38.1",xmlSpace:"preserve",...r,children:[(0,e.jsx)("path",{style:{fill:"#5F6368"},d:"M37.8,19.7V29h-3V6h7.8c1.9,0,3.7,0.7,5.1,2c1.4,1.2,2.1,3,2.1,4.9c0,1.9-0.7,3.6-2.1,4.9c-1.4,1.3-3.1,2-5.1,2  L37.8,19.7L37.8,19.7z M37.8,8.8v8h5c1.1,0,2.2-0.4,2.9-1.2c1.6-1.5,1.6-4,0.1-5.5c0,0-0.1-0.1-0.1-0.1c-0.8-0.8-1.8-1.3-2.9-1.2  L37.8,8.8L37.8,8.8z"}),(0,e.jsx)("path",{style:{fill:"#5F6368"},d:"M56.7,12.8c2.2,0,3.9,0.6,5.2,1.8s1.9,2.8,1.9,4.8V29H61v-2.2h-0.1c-1.2,1.8-2.9,2.7-4.9,2.7  c-1.7,0-3.2-0.5-4.4-1.5c-1.1-1-1.8-2.4-1.8-3.9c0-1.6,0.6-2.9,1.8-3.9c1.2-1,2.9-1.4,4.9-1.4c1.8,0,3.2,0.3,4.3,1v-0.7  c0-1-0.4-2-1.2-2.6c-0.8-0.7-1.8-1.1-2.9-1.1c-1.7,0-3,0.7-3.9,2.1l-2.6-1.6C51.8,13.8,53.9,12.8,56.7,12.8z M52.9,24.2  c0,0.8,0.4,1.5,1,1.9c0.7,0.5,1.5,0.8,2.3,0.8c1.2,0,2.4-0.5,3.3-1.4c1-0.9,1.5-2,1.5-3.2c-0.9-0.7-2.2-1.1-3.9-1.1  c-1.2,0-2.2,0.3-3,0.9C53.3,22.6,52.9,23.3,52.9,24.2z"}),(0,e.jsx)("path",{style:{fill:"#5F6368"},d:"M80,13.3l-9.9,22.7h-3l3.7-7.9l-6.5-14.7h3.2l4.7,11.3h0.1l4.6-11.3H80z"}),(0,e.jsx)("path",{style:{fill:"#4285F4"},d:"M25.9,17.7c0-0.9-0.1-1.8-0.2-2.7H13.2v5.1h7.1c-0.3,1.6-1.2,3.1-2.6,4v3.3H22C24.5,25.1,25.9,21.7,25.9,17.7z"}),(0,e.jsx)("path",{style:{fill:"#34A853"},d:"M13.2,30.6c3.6,0,6.6-1.2,8.8-3.2l-4.3-3.3c-1.2,0.8-2.7,1.3-4.5,1.3c-3.4,0-6.4-2.3-7.4-5.5H1.4v3.4  C3.7,27.8,8.2,30.6,13.2,30.6z"}),(0,e.jsx)("path",{style:{fill:"#FBBC04"},d:"M5.8,19.9c-0.6-1.6-0.6-3.4,0-5.1v-3.4H1.4c-1.9,3.7-1.9,8.1,0,11.9L5.8,19.9z"}),(0,e.jsx)("path",{style:{fill:"#EA4335"},d:"M13.2,9.4c1.9,0,3.7,0.7,5.1,2l0,0l3.8-3.8c-2.4-2.2-5.6-3.5-8.8-3.4c-5,0-9.6,2.8-11.8,7.3l4.4,3.4  C6.8,11.7,9.8,9.4,13.2,9.4z"})]})],442629)},855042,711144,r=>{"use strict";var e=r.i(319546);let o=(0,e.default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);r.s(["CreditCard",0,o],855042);let i=(0,e.default)("landmark",[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",key:"1m329m"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]]);r.s(["Landmark",0,i],711144)},261316,r=>{"use strict";var e=r.i(177117),o=r.i(799738),i=r.i(691983),t=r.i(375675),l=r.i(659366),a=r.i(962537);let n=t.styled.span`
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
    font-size: ${({$size:r})=>"small"===r?"2.25rem":"compact"===r?"3rem":"3.75rem"};
    font-style: normal;
    font-weight: 600;
    line-height: 5.375rem;
  }
`,c=t.styled.input`
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
`,d=t.styled.span`
  position: absolute;
  visibility: hidden;
  white-space: pre;
  pointer-events: none;
`,s=t.styled.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: ${({$size:r})=>"small"===r?"0.75rem":"compact"===r?"0.875rem":"1rem"};
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  margin-top: 0.75rem;
`,p=t.styled.button`
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
`,v=t.styled.div`
  svg {
    width: 1rem;
    height: 1rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
    border: solid 0.1px var(--privy-color-border-default);
  }
`,u=t.styled.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
`,h=t.styled.div`
  color: var(--privy-color-foreground);

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`,g=t.styled.div`
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
`,y=t.styled.button`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-mdlg);
  border-style: solid;
  display: flex;

  && {
    padding: 0.75rem 1rem;
  }
`,f=t.styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`,m=t.styled.div`
  svg {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
    border: solid 0.1px var(--privy-color-border-default);
  }
`,b=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
`,x=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
`,w=t.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
`;r.s(["A",0,({currency:r="usd",value:o,onChange:t,inputMode:a="decimal",autoFocus:p})=>{let[v,u]=(0,i.useState)("0"),[h,g]=(0,i.useState)(null),y=(0,i.useRef)(null),f=(0,i.useRef)(null),m=o??v,b=l.S[r]?.symbol??"$",x=m.length>9?"small":m.length>6?"compact":"default";(0,i.useLayoutEffect)(()=>{let r=f.current?.offsetWidth;g(r?Math.ceil(r)+2:null)},[x,m]);let w=(0,i.useCallback)(r=>{let e=r.target.value,o=(e=e.replace(/[^\d.]/g,"")).split(".");o.length>2&&(e=o[0]+"."+o.slice(1).join(""));let[i="",l]=e.split("."),a=i.replace(/^0+(?=\d)/,"");(""===(e=void 0!==l?`${a||"0"}.${l}`:a||"0")||"."===e)&&(e="0"),t?t(e):u(e)},[t]),k=(0,i.useCallback)(r=>{!(["Delete","Backspace","Tab","Escape","Enter",".","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(r.key)||(r.ctrlKey||r.metaKey)&&["a","c","v","x"].includes(r.key.toLowerCase()))&&(r.key>="0"&&r.key<="9"||r.preventDefault())},[]);return(0,e.jsxs)(n,{$size:x,onClick:()=>y.current?.focus(),children:[(0,e.jsx)(s,{$size:x,children:b}),(0,e.jsx)(c,{ref:y,type:"text",inputMode:a,value:m,onChange:w,onKeyDown:k,autoFocus:p,placeholder:"0","aria-label":"Amount",style:h?{width:`${h}px`}:void 0}),(0,e.jsx)(d,{ref:f,"aria-hidden":"true",children:m}),(0,e.jsx)(s,{$size:x,style:{opacity:0},children:b})]})},"C",0,({selectedAsset:r,onEditSourceAsset:i})=>{let{icon:t}=l.S[r];return(0,e.jsxs)(p,{onClick:i,children:[(0,e.jsx)(v,{children:t}),(0,e.jsx)(u,{children:r.toLocaleUpperCase()}),(0,e.jsx)(h,{children:(0,e.jsx)(o.ChevronDown,{})})]})},"S",0,({opts:r,isLoading:o,onSelectSource:i})=>(0,e.jsx)(a.S,{showClose:!1,showBack:!0,onBack:()=>i(r.source.selectedAsset),title:"Select currency",children:(0,e.jsx)(g,{children:r.source.assets.map(r=>{let{icon:t,name:a}=l.S[r];return(0,e.jsx)(y,{onClick:()=>i(r),disabled:o,children:(0,e.jsxs)(f,{children:[(0,e.jsx)(m,{children:t}),(0,e.jsxs)(b,{children:[(0,e.jsx)(x,{children:a}),(0,e.jsx)(w,{children:r.toLocaleUpperCase()})]})]})},r)})})})])},15330,r=>{r.v(e=>Promise.all(["static/chunks/0zt2.hmj_b9xh.js"].map(e=>r.l(e))).then(()=>e(513587)))}]);