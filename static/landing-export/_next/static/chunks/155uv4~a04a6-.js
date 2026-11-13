(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,708093,e=>{"use strict";var r=e.i(691983);let o=r.forwardRef(function({title:e,titleId:o,...i},t){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":o},i),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))});e.s(["default",0,o])},784095,e=>{"use strict";var r=e.i(177117),o=e.i(708093),i=e.i(375675);let t=i.styled.div`
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
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["W",0,({children:e,theme:i,className:a})=>(0,r.jsxs)(t,{$theme:i,className:a,children:[(0,r.jsx)(o.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-warning)",strokeWidth:2,style:{flexShrink:0}}),(0,r.jsx)(l,{$theme:i,children:e})]})])},898419,e=>{"use strict";var r=e.i(691983);let o=r.forwardRef(function({title:e,titleId:o,...i},t){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":o},i),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});e.s(["default",0,o])},529359,e=>{"use strict";var r=e.i(691983);let o=r.forwardRef(function({title:e,titleId:o,...i},t){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":o},i),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});e.s(["default",0,o])},781929,e=>{"use strict";var r=e.i(177117),o=e.i(375675),i=e.i(691778),t=e.i(898419),l=e.i(529359),a=e.i(691983);let n=a.forwardRef(function({title:e,titleId:r,...o},i){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":r},o),e?a.createElement("title",{id:r},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var s=e.i(463475),d=e.i(68297);let c=o.styled.button`
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
`,p=({children:e,loading:o,disabled:t,success:l,size:a="lg",loadingText:n="Loading...",as:s,onClick:d,...c})=>{let p="a"===s,v=!(!o&&!t);return(0,r.jsx)(h,{as:s,disabled:p?void 0:v,"aria-disabled":p?v:void 0,$success:l,$size:a,onClick:e=>{p&&v?e.preventDefault():d?.(e)},...c,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.B,{}),n?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:n}):null]}):e})},v=(0,o.styled)(c)`
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
`,h=(0,o.styled)(c)`
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
`,u=({children:e,loading:o,disabled:t,size:l="lg",loadingText:a="Loading...",as:n,onClick:s,...d})=>{let c="a"===n,p=!(!o&&!t);return(0,r.jsx)(y,{as:n,disabled:c?void 0:p,"aria-disabled":c?p:void 0,$size:l,onClick:e=>{c&&p?e.preventDefault():s?.(e)},...d,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.B,{}),a?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):e})},g=({children:e,loading:o,disabled:t,size:l="lg",loadingText:a="Loading...",as:n,onClick:s,...d})=>{let c="a"===n,p=!(!o&&!t);return(0,r.jsx)(x,{as:n,disabled:c?void 0:p,"aria-disabled":c?p:void 0,$size:l,onClick:e=>{c&&p?e.preventDefault():s?.(e)},...d,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.B,{}),a?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):e})},y=(0,o.styled)(c)`
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
`,x=(0,o.styled)(c)`
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
`,f=o.styled.button`
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
`,m=({backFn:e,disabled:o=!1,"aria-label":i})=>(0,r.jsx)("div",{children:(0,r.jsx)(j,{type:"button","aria-label":i,disabled:o,onClick:o?void 0:e,children:(0,r.jsx)(t.default,{height:"16px",width:"16px",strokeWidth:2})})}),w=({infoFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(C,{"aria-label":"info",onClick:e,children:(0,r.jsx)(l.default,{height:"22px",width:"22px",strokeWidth:2})})}),k=e=>(0,r.jsx)("div",{children:(0,r.jsx)(j,{type:"button","aria-label":e["aria-label"]??"close modal",onClick:e.onClose,children:(0,r.jsx)(n,{height:"16px",width:"16px",strokeWidth:2})})}),j=o.styled.button`
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
`,z=o.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,S=o.styled.div`
  display: flex;
  justify-content: flex-end;
`,I=o.styled.div`
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
`;e.s(["B",0,({variant:e="primary",size:o="lg",children:i,success:t,...l})=>{switch(e){case"secondary":return(0,r.jsx)(u,{size:o,...l,children:i});case"error":return(0,r.jsx)(u,{$warn:!0,size:o,...l,children:i});case"muted":return(0,r.jsx)(g,{size:o,...l,children:i});default:return(0,r.jsx)(p,{size:o,success:t,...l,children:i})}},"E",0,({children:e,onClick:o,disabled:t,isSubmitting:l,...a})=>(0,r.jsxs)(b,{$isSubmitting:l,onClick:o,disabled:t,...a,children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("span",{children:(0,r.jsx)(i.B,{})})]}),"M",0,({backFn:e,infoFn:o,onClose:i,title:t,eyebrow:l,closeable:a=!0,className:n})=>{let{closePrivyModal:c}=(0,d.u)(),p=(0,s.u)();return(0,r.jsxs)($,{className:n,children:[(0,r.jsxs)(z,{children:[e&&(0,r.jsx)(m,{backFn:e}),l&&(0,r.jsx)(E,{children:l}),!l&&t&&(0,r.jsx)(I,{id:"privy-dialog-title",children:t}),(0,r.jsx)("div",{style:{height:24}}),o&&(0,r.jsx)(w,{infoFn:o})]}),(0,r.jsx)(S,{children:!p.render.standalone&&a&&(0,r.jsx)(k,{onClose:i||(()=>c())})})]})},"P",0,p,"S",0,u,"a",0,f,"b",0,({children:e,loading:o,disabled:t,...l})=>(0,r.jsx)(v,{disabled:t,...l,children:o?(0,r.jsx)(i.B,{color:"var(--privy-color-foreground-accent)"}):e}),"d",0,g],781929)},657545,e=>{"use strict";var r=e.i(177117),o=e.i(375675),i=e.i(463475);function t(e){return(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...e,children:(0,r.jsx)("g",{fill:e.color||"var(--privy-color-foreground)",children:(0,r.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let l=o.styled.span`
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
`;e.s(["B",0,({className:e})=>{let{appearance:o}=(0,i.u)();return(0,r.jsx)(n,{className:e,children:o.footerLogo??(0,r.jsx)(a,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,r.jsx)(t,{color:"currentColor",height:13,width:150})})})},"M",0,n,"T",0,function({app:{legal:{privacyPolicyUrl:e,termsAndConditionsUrl:o,requireUsersAcceptTerms:i}},alwaysShowImplicitConsent:t}){let a=!(!e||!o);return(!i||t)&&(o||e)?(0,r.jsxs)(l,{children:["By logging in I agree to the"," ",o&&(0,r.jsx)("a",{href:o,target:"_blank",children:a?"Terms":"Terms of Service"}),a&&" & ",e&&(0,r.jsx)("a",{href:e,target:"_blank",children:"Privacy Policy"})]}):(0,r.jsx)(l,{})}])},436896,e=>{"use strict";var r=e.i(177117),o=e.i(375675);let i=o.styled.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

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
`;e.s(["N",0,({size:e,centerIcon:o})=>(0,r.jsx)(i,{$size:e,children:(0,r.jsxs)(t,{children:[(0,r.jsx)(a,{}),(0,r.jsx)(n,{}),o?(0,r.jsx)(l,{children:o}):null]})})])},566305,e=>{"use strict";var r=e.i(177117),o=e.i(691983),i=e.i(375675),t=e.i(691778),l=e.i(657545),a=e.i(781929),n=e.i(436896);let s=i.styled.div`
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
`,c=i.styled.div`
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
  ${({$colorScheme:e})=>"light"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

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
  background: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg)";case"warning":return"var(--privy-color-warn)";case"error":return"var(--privy-color-error-bg)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

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
`,w=({children:e,...o})=>(0,r.jsx)(s,{children:(0,r.jsx)(d,{...o,children:e})}),k=i.styled.div`
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
`,C=i.styled.div`
  height: 100%;
  width: ${({pct:e})=>e}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,$=({step:e})=>e?(0,r.jsx)(k,{children:(0,r.jsx)(C,{pct:Math.min(100,e.current/e.total*100)})}):null;w.Header=({title:e,subtitle:o,icon:i,iconVariant:t,iconLoadingStatus:l,showBack:a,onBack:n,showInfo:s,onInfo:d,showClose:v,onClose:h,step:f,headerTitle:b,eyebrow:m,...k})=>(0,r.jsxs)(c,{...k,children:[(0,r.jsx)(p,{backFn:a?n:void 0,infoFn:s?d:void 0,onClose:v?h:void 0,title:b,eyebrow:m,closeable:v}),(i||t||e||o)&&(0,r.jsxs)(u,{children:[i||t?(0,r.jsx)(w.Icon,{icon:i,variant:t,loadingStatus:l}):null,!(!e&&!o)&&(0,r.jsxs)(g,{children:[e&&(0,r.jsx)(y,{children:e}),o&&(0,r.jsx)(x,{children:o})]})]}),f&&(0,r.jsx)($,{step:f})]}),(w.Body=o.default.forwardRef(({children:e,...o},i)=>(0,r.jsx)(v,{ref:i,...o,children:e}))).displayName="Screen.Body",w.Footer=({children:e,...o})=>(0,r.jsx)(h,{id:"privy-content-footer-container",...o,children:e}),w.Actions=({children:e,...o})=>(0,r.jsx)(z,{...o,children:e}),w.HelpText=({children:e,...o})=>(0,r.jsx)(S,{...o,children:e}),w.FooterText=({children:e,...o})=>(0,r.jsx)(I,{...o,children:e}),w.Watermark=()=>(0,r.jsx)(j,{}),w.Icon=({icon:e,variant:i="subtle",loadingStatus:l})=>"logo"===i&&e?(0,r.jsx)(b,"string"==typeof e?{children:(0,r.jsx)("img",{src:e,alt:""})}:o.default.isValidElement(e)?{children:e}:{children:o.default.createElement(e)}):"loading"===i?e?(0,r.jsx)(m,{children:(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,r.jsx)(t.C,{success:l?.success,fail:l?.fail}),"string"==typeof e?(0,r.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):o.default.isValidElement(e)?o.default.cloneElement(e,{style:{width:"38px",height:"38px"}}):o.default.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,r.jsx)(f,{$variant:i,children:(0,r.jsx)(n.N,{size:"64px"})}):(0,r.jsx)(f,{$variant:i,children:e&&("string"==typeof e?(0,r.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):o.default.isValidElement(e)?e:o.default.createElement(e,{width:32,height:32,stroke:(()=>{switch(i){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let z=i.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,S=i.styled.div`
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
`,I=i.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`;e.s(["S",0,w])},962537,e=>{"use strict";var r=e.i(177117),o=e.i(781929),i=e.i(566305);e.s(["S",0,({primaryCta:e,secondaryCta:t,helpText:l,footerText:a,watermark:n=!0,children:s,...d})=>{let c=e||t?(0,r.jsxs)(r.Fragment,{children:[e&&(()=>{let{label:i,...t}=e,l=t.variant||"primary";return(0,r.jsx)(o.B,{...t,variant:l,style:{width:"100%",...t.style},children:i})})(),t&&(()=>{let{label:e,...i}=t,l=i.variant||"secondary";return(0,r.jsx)(o.B,{...i,variant:l,style:{width:"100%",...i.style},children:e})})()]}):null;return(0,r.jsxs)(i.S,{id:d.id,className:d.className,children:[(0,r.jsx)(i.S.Header,{...d}),s?(0,r.jsx)(i.S.Body,{children:s}):null,l||c||n?(0,r.jsxs)(i.S.Footer,{children:[l?(0,r.jsx)(i.S.HelpText,{children:l}):null,c?(0,r.jsx)(i.S.Actions,{children:c}):null,n?(0,r.jsx)(i.S.Watermark,{}):null]}):null,a?(0,r.jsx)(i.S.FooterText,{children:a}):null]})}])},319546,e=>{"use strict";var r=e.i(691983);let o=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,o)=>o?o.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},i=(...e)=>e.filter((e,r,o)=>!!e&&""!==e.trim()&&o.indexOf(e)===r).join(" ").trim();var t={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let l=(0,r.forwardRef)(({color:e="currentColor",size:o=24,strokeWidth:l=2,absoluteStrokeWidth:a,className:n="",children:s,iconNode:d,...c},p)=>(0,r.createElement)("svg",{ref:p,...t,width:o,height:o,stroke:e,strokeWidth:a?24*Number(l)/Number(o):l,className:i("lucide",n),...!s&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(c)&&{"aria-hidden":"true"},...c},[...d.map(([e,o])=>(0,r.createElement)(e,o)),...Array.isArray(s)?s:[s]]));e.s(["default",0,(e,t)=>{let a=(0,r.forwardRef)(({className:a,...n},s)=>(0,r.createElement)(l,{ref:s,iconNode:t,className:i(`lucide-${o(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...n}));return a.displayName=o(e),a}],319546)},635267,e=>{"use strict";let r=(0,e.i(319546).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",0,r],635267)},483535,e=>{"use strict";let r=(0,e.i(319546).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",0,r],483535)},423669,e=>{"use strict";var r=e.i(375675);let o=r.styled.span`
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */

  color: var(--privy-color-error);
`;e.s(["E",0,o])},682275,e=>{"use strict";var r=e.i(177117),o=e.i(635267),i=e.i(483535),t=e.i(691983),l=e.i(375675),a=e.i(312075),n=e.i(781929);let s=l.styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`,d=l.styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,c=l.styled.a`
  font-size: 14px;
  color: var(--privy-color-foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;e.s(["A",0,({address:e,showCopyIcon:l,url:p,className:v})=>{let[h,u]=(0,t.useState)(!1);function g(r){r.stopPropagation(),navigator.clipboard.writeText(e).then(()=>u(!0)).catch(console.error)}return(0,t.useEffect)(()=>{if(h){let e=setTimeout(()=>u(!1),3e3);return()=>clearTimeout(e)}},[h]),(0,r.jsxs)(s,p?{children:[(0,r.jsx)(c,{title:e,className:v,href:`${p}/address/${e}`,target:"_blank",children:(0,a.f)(e)}),l&&(0,r.jsx)(n.S,{onClick:g,size:"sm",style:{gap:"0.375rem"},children:(0,r.jsxs)(r.Fragment,h?{children:["Copied",(0,r.jsx)(o.Check,{size:16})]}:{children:["Copy",(0,r.jsx)(i.Copy,{size:16})]})})]}:{children:[(0,r.jsx)(d,{title:e,className:v,children:(0,a.f)(e)}),l&&(0,r.jsx)(n.S,{onClick:g,size:"sm",style:{gap:"0.375rem",fontSize:"14px"},children:(0,r.jsxs)(r.Fragment,h?{children:["Copied",(0,r.jsx)(o.Check,{size:14})]}:{children:["Copy",(0,r.jsx)(i.Copy,{size:14})]})})]})}])},492337,e=>{"use strict";var r=e.i(375675);let o=r.css`
  && {
    border-width: 1px;
    padding: 0.5rem 1rem;
  }

  width: 100%;
  text-align: left;
  border: solid 1px var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${e=>"error"===e.$state?"\n        border-color: var(--privy-color-error);\n        background: var(--privy-color-error-bg);\n      ":""}
`,i=r.styled.div`
  ${o}
`;e.s(["B",0,i,"a",0,o])},185984,e=>{"use strict";var r=e.i(375675);let o=r.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
`;e.s(["L",0,o])},864445,e=>{"use strict";var r=e.i(177117),o=e.i(635267),i=e.i(483535),t=e.i(691983),l=e.i(375675),a=e.i(781929),n=e.i(423669),s=e.i(185984),d=e.i(682275),c=e.i(492337);let p=(0,l.styled)(c.B)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,v=l.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,h=l.styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,u=l.styled.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,g=(0,l.styled)(s.L)`
  text-align: left;
  margin-bottom: 0.5rem;
`,y=(0,l.styled)(n.E)`
  margin-top: 0.25rem;
`,x=(0,l.styled)(a.S)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;e.s(["W",0,({errMsg:e,balance:l,address:a,className:n,title:s,showCopyButton:c=!1})=>{let[f,b]=(0,t.useState)(!1);return(0,t.useEffect)(()=>{if(f){let e=setTimeout(()=>b(!1),3e3);return()=>clearTimeout(e)}},[f]),(0,r.jsxs)("div",{children:[s&&(0,r.jsx)(g,{children:s}),(0,r.jsx)(p,{className:n,$state:e?"error":void 0,children:(0,r.jsxs)(v,{children:[(0,r.jsxs)(h,{children:[(0,r.jsx)(d.A,{address:a,showCopyIcon:!1}),void 0!==l&&(0,r.jsx)(u,{children:l})]}),c&&(0,r.jsx)(x,{onClick:function(e){e.stopPropagation(),navigator.clipboard.writeText(a).then(()=>b(!0)).catch(console.error)},size:"sm",children:(0,r.jsxs)(r.Fragment,f?{children:["Copied",(0,r.jsx)(o.Check,{size:14})]}:{children:["Copy",(0,r.jsx)(i.Copy,{size:14})]})})]})}),e&&(0,r.jsx)(y,{children:e})]})}])},23484,e=>{"use strict";var r=e.i(177117),o=e.i(691983),i=e.i(375675),t=e.i(830964),l=e.i(784095),a=e.i(864445),n=e.i(463475),s=e.i(68297),d=e.i(962537);let c=({address:e,hideWalletAddress:o,accessToken:i,appConfigTheme:t,onClose:n,exportButtonProps:s,onBack:c})=>(0,r.jsx)(d.S,{title:"Export wallet",subtitle:(0,r.jsxs)(r.Fragment,{children:["Copy either your private key or seed phrase to export your wallet."," ",(0,r.jsx)("a",{href:"https://docs.privy.io/recipes/account-export-transfer",target:"blank",rel:"noopener noreferrer",children:"Learn more"})]}),onClose:n,onBack:c,showBack:!!c,watermark:!0,children:(0,r.jsxs)(p,{children:[(0,r.jsx)(l.W,{theme:t,children:"Never share your private key or seed phrase with anyone."}),!o&&(0,r.jsx)(a.W,{title:"Your wallet",address:e,showCopyButton:!0}),(0,r.jsx)("div",{style:{width:"100%"},children:i&&s&&(0,r.jsx)(h,{accessToken:i,dimensions:{height:"44px"},...s})})]})}),p=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
`;function v({chainType:e,imported:r,isUnifiedWallet:o}){return!r&&(o?"ethereum"===e||"bitcoin-taproot"===e||"pearl"===e:"ethereum"===e)}function h(e){let[i,t]=(0,o.useState)(e.dimensions.width),[l,a]=(0,o.useState)(!1),[n,s]=(0,o.useState)(void 0),d=(0,o.useRef)(null);(0,o.useEffect)(()=>{if(d.current&&void 0===i){let{width:e}=d.current.getBoundingClientRect();t(e)}let e=getComputedStyle(document.documentElement);s({background:e.getPropertyValue("--privy-color-background"),background2:e.getPropertyValue("--privy-color-background-2"),foreground3:e.getPropertyValue("--privy-color-foreground-3"),foregroundAccent:e.getPropertyValue("--privy-color-foreground-accent"),accent:e.getPropertyValue("--privy-color-accent"),accentDark:e.getPropertyValue("--privy-color-accent-dark"),success:e.getPropertyValue("--privy-color-success"),colorScheme:e.getPropertyValue("color-scheme")})},[]);let c=v({chainType:e.chainType,imported:e.imported,isUnifiedWallet:e.isUnifiedWallet});return(0,r.jsx)("div",{ref:d,children:i&&(0,r.jsxs)(y,{children:[(0,r.jsx)("iframe",{style:{position:"absolute",zIndex:1,opacity:+!!l,transition:"opacity 50ms ease-in-out",pointerEvents:l?"auto":"none"},onLoad:()=>setTimeout(()=>a(!0),1500),width:i,height:e.dimensions.height,allow:"clipboard-write self *",src:g({origin:e.origin,appId:e.appId,appClientId:e.appClientId,walletId:e.walletId,entropyId:e.entropyId,entropyIdVerifier:e.entropyIdVerifier,hdWalletIndex:e.hdWalletIndex,chainType:e.chainType,accessToken:e.accessToken,clientAnalyticsId:e.clientAnalyticsId,width:i,palette:n,isUnifiedWallet:e.isUnifiedWallet,exportSeedPhrase:c})}),(0,r.jsx)(x,{children:"Loading..."}),c&&(0,r.jsx)(x,{children:"Loading..."})]})})}let u={component:()=>{let[e,i]=(0,o.useState)(null),{authenticated:t,user:l}=(0,n.a)(),{closePrivyModal:a,createAnalyticsEvent:d,clientAnalyticsId:p,client:v}=(0,s.u)(),h=(0,n.u)(),{data:u,onUserCloseViaDialogOrKeybindRef:g}=(0,n.b)(),{onFailure:y,onSuccess:x,origin:f,appId:b,appClientId:m,entropyId:w,entropyIdVerifier:k,walletId:j,hdWalletIndex:C,chainType:$,address:z,uiOptions:S,isUnifiedWallet:I,imported:E,showBackButton:T}=u.keyExport,B=e=>{a({shouldCallAuthOnSuccess:!1}),y("string"==typeof e?Error(e):e)},V=()=>{a({shouldCallAuthOnSuccess:!1}),x(),d({eventName:"embedded_wallet_key_export_completed",payload:{walletAddress:z}})};return(0,o.useEffect)(()=>{if(!t)return B("User must be authenticated before exporting their wallet");v.getAccessToken().then(i).catch(B)},[t,l]),g.current=V,(0,r.jsx)(c,{address:z,hideWalletAddress:S?.hideWalletAddress,accessToken:e,appConfigTheme:h.appearance.palette.colorScheme,onClose:V,isLoading:!e,onBack:T?V:void 0,exportButtonProps:e?{origin:f,appId:b,appClientId:m,clientAnalyticsId:p,entropyId:w,entropyIdVerifier:k,walletId:j,hdWalletIndex:C,isUnifiedWallet:I,imported:E,chainType:$}:void 0})}};function g({origin:e,appId:r,appClientId:o,walletId:i,entropyId:l,entropyIdVerifier:a,hdWalletIndex:n,chainType:s,accessToken:d,clientAnalyticsId:c,width:p,palette:v,isUnifiedWallet:h,exportSeedPhrase:u}){return(0,t.constructURL)({origin:e,path:`/apps/${r}/embedded-wallets/export`,query:h?{v:"1-unified",wallet_id:i,chain_type:s,client_id:o,width:`${p}px`,caid:c,phrase_export:u,...v}:{v:"1",entropy_id:l,entropy_id_verifier:a,hd_wallet_index:n,chain_type:s,client_id:o,width:`${p}px`,caid:c,phrase_export:u,...v},hash:{token:d}})}let y=i.styled.div`
  overflow: visible;
  position: relative;
  height: 44px;
  display: flex;
  gap: 12px;
`,x=i.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 500;
  border-radius: var(--privy-border-radius-md);
  background-color: var(--privy-color-background-2);
  color: var(--privy-color-foreground-3);
`;e.s(["EmbeddedWalletKeyExportScreen",0,u,"EmbeddedWalletKeyExportView",0,c,"constructWalletExportIframeUrl",0,g,"default",0,u,"supportsSeedPhraseExport",0,v])}]);