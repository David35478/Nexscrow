(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,784095,r=>{"use strict";var e=r.i(177117),i=r.i(708093),o=r.i(375675);let n=o.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-warn-bg);
  border: 1px solid var(--privy-color-border-warning);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,s=o.styled.div`
  color: ${r=>"dark"===r.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;r.s(["W",0,({children:r,theme:o,className:t})=>(0,e.jsxs)(n,{$theme:o,className:t,children:[(0,e.jsx)(i.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-warning)",strokeWidth:2,style:{flexShrink:0}}),(0,e.jsx)(s,{$theme:o,children:r})]})])},898419,r=>{"use strict";var e=r.i(691983);let i=e.forwardRef(function({title:r,titleId:i,...o},n){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":i},o),r?e.createElement("title",{id:i},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});r.s(["default",0,i])},529359,r=>{"use strict";var e=r.i(691983);let i=e.forwardRef(function({title:r,titleId:i,...o},n){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":i},o),r?e.createElement("title",{id:i},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});r.s(["default",0,i])},781929,r=>{"use strict";var e=r.i(177117),i=r.i(375675),o=r.i(691778),n=r.i(898419),s=r.i(529359),t=r.i(691983);let a=t.forwardRef(function({title:r,titleId:e,...i},o){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":e},i),r?t.createElement("title",{id:e},r):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var l=r.i(463475),d=r.i(68297);let c=i.styled.button`
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
`,h=({children:r,loading:i,disabled:n,success:s,size:t="lg",loadingText:a="Loading...",as:l,onClick:d,...c})=>{let h="a"===l,x=!(!i&&!n);return(0,e.jsx)(p,{as:l,disabled:h?void 0:x,"aria-disabled":h?x:void 0,$success:s,$size:t,onClick:r=>{h&&x?r.preventDefault():d?.(r)},...c,children:i?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(o.B,{}),a?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):r})},x=(0,i.styled)(c)`
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
`,p=(0,i.styled)(c)`
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
  ${r=>r.disabled&&i.css`
      &&&,
      &&&:hover,
      &&&:active {
        background-color: var(--privy-color-background-2);
        border: 1px solid var(--privy-color-border-default);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,u=({children:r,loading:i,disabled:n,size:s="lg",loadingText:t="Loading...",as:a,onClick:l,...d})=>{let c="a"===a,h=!(!i&&!n);return(0,e.jsx)(g,{as:a,disabled:c?void 0:h,"aria-disabled":c?h:void 0,$size:s,onClick:r=>{c&&h?r.preventDefault():l?.(r)},...d,children:i?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(o.B,{}),t?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:t}):null]}):r})},v=({children:r,loading:i,disabled:n,size:s="lg",loadingText:t="Loading...",as:a,onClick:l,...d})=>{let c="a"===a,h=!(!i&&!n);return(0,e.jsx)(m,{as:a,disabled:c?void 0:h,"aria-disabled":c?h:void 0,$size:s,onClick:r=>{c&&h?r.preventDefault():l?.(r)},...d,children:i?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(o.B,{}),t?(0,e.jsx)("span",{style:{marginLeft:"8px"},children:t}):null]}):r})},g=(0,i.styled)(c)`
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
  ${r=>r.disabled&&i.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,m=(0,i.styled)(c)`
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
  ${r=>r.disabled&&i.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,j=i.styled.button`
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

    ${r=>r.invisible&&i.css`
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
`;i.styled.div`
  /* Set to match height of SoftCtaButton to avoid reflow if conditionally rendered */
  height: 44px;
`;let f=i.styled.button`
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
`,y=({backFn:r,disabled:i=!1,"aria-label":o})=>(0,e.jsx)("div",{children:(0,e.jsx)(w,{type:"button","aria-label":o,disabled:i,onClick:i?void 0:r,children:(0,e.jsx)(n.default,{height:"16px",width:"16px",strokeWidth:2})})}),b=({infoFn:r})=>(0,e.jsx)("div",{children:(0,e.jsx)(L,{"aria-label":"info",onClick:r,children:(0,e.jsx)(s.default,{height:"22px",width:"22px",strokeWidth:2})})}),k=r=>(0,e.jsx)("div",{children:(0,e.jsx)(w,{type:"button","aria-label":r["aria-label"]??"close modal",onClick:r.onClose,children:(0,e.jsx)(a,{height:"16px",width:"16px",strokeWidth:2})})}),w=i.styled.button`
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
`,L=(0,i.styled)(w)`
  && {
    background-color: transparent;
  }
`,C=i.styled.div`
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
`,A=i.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,$=i.styled.div`
  display: flex;
  justify-content: flex-end;
`,T=i.styled.div`
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
`,S=i.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;r.s(["B",0,({variant:r="primary",size:i="lg",children:o,success:n,...s})=>{switch(r){case"secondary":return(0,e.jsx)(u,{size:i,...s,children:o});case"error":return(0,e.jsx)(u,{$warn:!0,size:i,...s,children:o});case"muted":return(0,e.jsx)(v,{size:i,...s,children:o});default:return(0,e.jsx)(h,{size:i,success:n,...s,children:o})}},"E",0,({children:r,onClick:i,disabled:n,isSubmitting:s,...t})=>(0,e.jsxs)(f,{$isSubmitting:s,onClick:i,disabled:n,...t,children:[(0,e.jsx)("span",{children:r}),(0,e.jsx)("span",{children:(0,e.jsx)(o.B,{})})]}),"M",0,({backFn:r,infoFn:i,onClose:o,title:n,eyebrow:s,closeable:t=!0,className:a})=>{let{closePrivyModal:c}=(0,d.u)(),h=(0,l.u)();return(0,e.jsxs)(C,{className:a,children:[(0,e.jsxs)(A,{children:[r&&(0,e.jsx)(y,{backFn:r}),s&&(0,e.jsx)(S,{children:s}),!s&&n&&(0,e.jsx)(T,{id:"privy-dialog-title",children:n}),(0,e.jsx)("div",{style:{height:24}}),i&&(0,e.jsx)(b,{infoFn:i})]}),(0,e.jsx)($,{children:!h.render.standalone&&t&&(0,e.jsx)(k,{onClose:o||(()=>c())})})]})},"P",0,h,"S",0,u,"a",0,j,"b",0,({children:r,loading:i,disabled:n,...s})=>(0,e.jsx)(x,{disabled:n,...s,children:i?(0,e.jsx)(o.B,{color:"var(--privy-color-foreground-accent)"}):r}),"d",0,v],781929)},657545,r=>{"use strict";var e=r.i(177117),i=r.i(375675),o=r.i(463475);function n(r){return(0,e.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...r,children:(0,e.jsx)("g",{fill:r.color||"var(--privy-color-foreground)",children:(0,e.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let s=i.styled.span`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);
  display: block;

  && > a {
    color: var(--privy-color-accent);
  }
`,t=i.styled.a`
  && {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,a=i.styled.div`
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
`;r.s(["B",0,({className:r})=>{let{appearance:i}=(0,o.u)();return(0,e.jsx)(a,{className:r,children:i.footerLogo??(0,e.jsx)(t,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,e.jsx)(n,{color:"currentColor",height:13,width:150})})})},"M",0,a,"T",0,function({app:{legal:{privacyPolicyUrl:r,termsAndConditionsUrl:i,requireUsersAcceptTerms:o}},alwaysShowImplicitConsent:n}){let t=!(!r||!i);return(!o||n)&&(i||r)?(0,e.jsxs)(s,{children:["By logging in I agree to the"," ",i&&(0,e.jsx)("a",{href:i,target:"_blank",children:t?"Terms":"Terms of Service"}),t&&" & ",r&&(0,e.jsx)("a",{href:r,target:"_blank",children:"Privacy Policy"})]}):(0,e.jsx)(s,{})}])},436896,r=>{"use strict";var e=r.i(177117),i=r.i(375675);let o=i.styled.div`
  --spinner-size: ${r=>r.$size?r.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,n=i.styled.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,s=i.styled.div`
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
`,t=i.styled.div`
  position: absolute;
  inset: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,a=i.styled.div`
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
`;r.s(["N",0,({size:r,centerIcon:i})=>(0,e.jsx)(o,{$size:r,children:(0,e.jsxs)(n,{children:[(0,e.jsx)(t,{}),(0,e.jsx)(a,{}),i?(0,e.jsx)(s,{children:i}):null]})})])},566305,r=>{"use strict";var e=r.i(177117),i=r.i(691983),o=r.i(375675),n=r.i(691778),s=r.i(657545),t=r.i(781929),a=r.i(436896);let l=o.styled.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,d=o.styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,c=o.styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,h=(0,o.styled)(t.M)`
  margin: 0 -8px;
`,x=o.styled.div`
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
`,p=o.styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,u=o.styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,v=o.styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,g=o.styled.h3`
  && {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: var(--privy-color-foreground);
    margin: 0;
  }
`,m=o.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,j=o.styled.div`
  background: ${({$variant:r})=>{switch(r){case"success":return"var(--privy-color-success-bg)";case"warning":return"var(--privy-color-warn)";case"error":return"var(--privy-color-error-bg)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,f=o.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,y=o.styled.div`
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
`,b=({children:r,...i})=>(0,e.jsx)(l,{children:(0,e.jsx)(d,{...i,children:r})}),k=o.styled.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,w=(0,o.styled)(s.B)`
  padding: 0;
  && a {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,L=o.styled.div`
  height: 100%;
  width: ${({pct:r})=>r}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,C=({step:r})=>r?(0,e.jsx)(k,{children:(0,e.jsx)(L,{pct:Math.min(100,r.current/r.total*100)})}):null;b.Header=({title:r,subtitle:i,icon:o,iconVariant:n,iconLoadingStatus:s,showBack:t,onBack:a,showInfo:l,onInfo:d,showClose:x,onClose:p,step:j,headerTitle:f,eyebrow:y,...k})=>(0,e.jsxs)(c,{...k,children:[(0,e.jsx)(h,{backFn:t?a:void 0,infoFn:l?d:void 0,onClose:x?p:void 0,title:f,eyebrow:y,closeable:x}),(o||n||r||i)&&(0,e.jsxs)(u,{children:[o||n?(0,e.jsx)(b.Icon,{icon:o,variant:n,loadingStatus:s}):null,!(!r&&!i)&&(0,e.jsxs)(v,{children:[r&&(0,e.jsx)(g,{children:r}),i&&(0,e.jsx)(m,{children:i})]})]}),j&&(0,e.jsx)(C,{step:j})]}),(b.Body=i.default.forwardRef(({children:r,...i},o)=>(0,e.jsx)(x,{ref:o,...i,children:r}))).displayName="Screen.Body",b.Footer=({children:r,...i})=>(0,e.jsx)(p,{id:"privy-content-footer-container",...i,children:r}),b.Actions=({children:r,...i})=>(0,e.jsx)(A,{...i,children:r}),b.HelpText=({children:r,...i})=>(0,e.jsx)($,{...i,children:r}),b.FooterText=({children:r,...i})=>(0,e.jsx)(T,{...i,children:r}),b.Watermark=()=>(0,e.jsx)(w,{}),b.Icon=({icon:r,variant:o="subtle",loadingStatus:s})=>"logo"===o&&r?(0,e.jsx)(f,"string"==typeof r?{children:(0,e.jsx)("img",{src:r,alt:""})}:i.default.isValidElement(r)?{children:r}:{children:i.default.createElement(r)}):"loading"===o?r?(0,e.jsx)(y,{children:(0,e.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,e.jsx)(n.C,{success:s?.success,fail:s?.fail}),"string"==typeof r?(0,e.jsx)("span",{style:{background:`url('${r}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):i.default.isValidElement(r)?i.default.cloneElement(r,{style:{width:"38px",height:"38px"}}):i.default.createElement(r,{style:{width:"38px",height:"38px"}})]})}):(0,e.jsx)(j,{$variant:o,children:(0,e.jsx)(a.N,{size:"64px"})}):(0,e.jsx)(j,{$variant:o,children:r&&("string"==typeof r?(0,e.jsx)("img",{src:r,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):i.default.isValidElement(r)?r:i.default.createElement(r,{width:32,height:32,stroke:(()=>{switch(o){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let A=o.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,$=o.styled.div`
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
`,T=o.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; /* 11px */
    line-height: 1rem; /* 16px */
  }
`;r.s(["S",0,b])},962537,r=>{"use strict";var e=r.i(177117),i=r.i(781929),o=r.i(566305);r.s(["S",0,({primaryCta:r,secondaryCta:n,helpText:s,footerText:t,watermark:a=!0,children:l,...d})=>{let c=r||n?(0,e.jsxs)(e.Fragment,{children:[r&&(()=>{let{label:o,...n}=r,s=n.variant||"primary";return(0,e.jsx)(i.B,{...n,variant:s,style:{width:"100%",...n.style},children:o})})(),n&&(()=>{let{label:r,...o}=n,s=o.variant||"secondary";return(0,e.jsx)(i.B,{...o,variant:s,style:{width:"100%",...o.style},children:r})})()]}):null;return(0,e.jsxs)(o.S,{id:d.id,className:d.className,children:[(0,e.jsx)(o.S.Header,{...d}),l?(0,e.jsx)(o.S.Body,{children:l}):null,s||c||a?(0,e.jsxs)(o.S.Footer,{children:[s?(0,e.jsx)(o.S.HelpText,{children:s}):null,c?(0,e.jsx)(o.S.Actions,{children:c}):null,a?(0,e.jsx)(o.S.Watermark,{}):null]}):null,t?(0,e.jsx)(o.S.FooterText,{children:t}):null]})}])},319546,r=>{"use strict";var e=r.i(691983);let i=r=>{let e=r.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,e,i)=>i?i.toUpperCase():e.toLowerCase());return e.charAt(0).toUpperCase()+e.slice(1)},o=(...r)=>r.filter((r,e,i)=>!!r&&""!==r.trim()&&i.indexOf(r)===e).join(" ").trim();var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,e.forwardRef)(({color:r="currentColor",size:i=24,strokeWidth:s=2,absoluteStrokeWidth:t,className:a="",children:l,iconNode:d,...c},h)=>(0,e.createElement)("svg",{ref:h,...n,width:i,height:i,stroke:r,strokeWidth:t?24*Number(s)/Number(i):s,className:o("lucide",a),...!l&&!(r=>{for(let e in r)if(e.startsWith("aria-")||"role"===e||"title"===e)return!0})(c)&&{"aria-hidden":"true"},...c},[...d.map(([r,i])=>(0,e.createElement)(r,i)),...Array.isArray(l)?l:[l]]));r.s(["default",0,(r,n)=>{let t=(0,e.forwardRef)(({className:t,...a},l)=>(0,e.createElement)(s,{ref:l,iconNode:n,className:o(`lucide-${i(r).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${r}`,t),...a}));return t.displayName=i(r),t}],319546)},635267,r=>{"use strict";let e=(0,r.i(319546).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);r.s(["Check",0,e],635267)},483535,r=>{"use strict";let e=(0,r.i(319546).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);r.s(["Copy",0,e],483535)},423669,r=>{"use strict";var e=r.i(375675);let i=e.styled.span`
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */

  color: var(--privy-color-error);
`;r.s(["E",0,i])},682275,r=>{"use strict";var e=r.i(177117),i=r.i(635267),o=r.i(483535),n=r.i(691983),s=r.i(375675),t=r.i(312075),a=r.i(781929);let l=s.styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`,d=s.styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,c=s.styled.a`
  font-size: 14px;
  color: var(--privy-color-foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;r.s(["A",0,({address:r,showCopyIcon:s,url:h,className:x})=>{let[p,u]=(0,n.useState)(!1);function v(e){e.stopPropagation(),navigator.clipboard.writeText(r).then(()=>u(!0)).catch(console.error)}return(0,n.useEffect)(()=>{if(p){let r=setTimeout(()=>u(!1),3e3);return()=>clearTimeout(r)}},[p]),(0,e.jsxs)(l,h?{children:[(0,e.jsx)(c,{title:r,className:x,href:`${h}/address/${r}`,target:"_blank",children:(0,t.f)(r)}),s&&(0,e.jsx)(a.S,{onClick:v,size:"sm",style:{gap:"0.375rem"},children:(0,e.jsxs)(e.Fragment,p?{children:["Copied",(0,e.jsx)(i.Check,{size:16})]}:{children:["Copy",(0,e.jsx)(o.Copy,{size:16})]})})]}:{children:[(0,e.jsx)(d,{title:r,className:x,children:(0,t.f)(r)}),s&&(0,e.jsx)(a.S,{onClick:v,size:"sm",style:{gap:"0.375rem",fontSize:"14px"},children:(0,e.jsxs)(e.Fragment,p?{children:["Copied",(0,e.jsx)(i.Check,{size:14})]}:{children:["Copy",(0,e.jsx)(o.Copy,{size:14})]})})]})}])},492337,r=>{"use strict";var e=r.i(375675);let i=e.css`
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

  ${r=>"error"===r.$state?"\n        border-color: var(--privy-color-error);\n        background: var(--privy-color-error-bg);\n      ":""}
`,o=e.styled.div`
  ${i}
`;r.s(["B",0,o,"a",0,i])},185984,r=>{"use strict";var e=r.i(375675);let i=e.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
`;r.s(["L",0,i])},864445,r=>{"use strict";var e=r.i(177117),i=r.i(635267),o=r.i(483535),n=r.i(691983),s=r.i(375675),t=r.i(781929),a=r.i(423669),l=r.i(185984),d=r.i(682275),c=r.i(492337);let h=(0,s.styled)(c.B)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,x=s.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,p=s.styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,u=s.styled.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,v=(0,s.styled)(l.L)`
  text-align: left;
  margin-bottom: 0.5rem;
`,g=(0,s.styled)(a.E)`
  margin-top: 0.25rem;
`,m=(0,s.styled)(t.S)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;r.s(["W",0,({errMsg:r,balance:s,address:t,className:a,title:l,showCopyButton:c=!1})=>{let[j,f]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{if(j){let r=setTimeout(()=>f(!1),3e3);return()=>clearTimeout(r)}},[j]),(0,e.jsxs)("div",{children:[l&&(0,e.jsx)(v,{children:l}),(0,e.jsx)(h,{className:a,$state:r?"error":void 0,children:(0,e.jsxs)(x,{children:[(0,e.jsxs)(p,{children:[(0,e.jsx)(d.A,{address:t,showCopyIcon:!1}),void 0!==s&&(0,e.jsx)(u,{children:s})]}),c&&(0,e.jsx)(m,{onClick:function(r){r.stopPropagation(),navigator.clipboard.writeText(t).then(()=>f(!0)).catch(console.error)},size:"sm",children:(0,e.jsxs)(e.Fragment,j?{children:["Copied",(0,e.jsx)(i.Check,{size:14})]}:{children:["Copy",(0,e.jsx)(o.Copy,{size:14})]})})]})}),r&&(0,e.jsx)(g,{children:r})]})}])},712722,r=>{"use strict";var e=r.i(691983);let i=e.forwardRef(function({title:r,titleId:i,...o},n){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":i},o),r?e.createElement("title",{id:i},r):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"}))});r.s(["default",0,i])},115965,r=>{"use strict";var e=r.i(177117),i=r.i(712722),o=r.i(375675);let n=o.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-error-bg);
  border: 1px solid var(--privy-color-border-error);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,s=o.styled.div`
  color: ${r=>"dark"===r.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;r.s(["E",0,({children:r,theme:o,className:t})=>(0,e.jsxs)(n,{$theme:o,className:t,children:[(0,e.jsx)(i.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-error)",strokeWidth:2,style:{flexShrink:0}}),(0,e.jsx)(s,{$theme:o,children:r})]})])},981608,r=>{"use strict";var e=r.i(177117),i=r.i(691983);let o=i.forwardRef(function({title:r,titleId:e,...o},n){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":e},o),r?i.createElement("title",{id:e},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"}))}),n=i.forwardRef(function({title:r,titleId:e,...o},n){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":e},o),r?i.createElement("title",{id:e},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"}))});var s=r.i(257701),s=s,t=r.i(375675),a=r.i(795086),l=r.i(781929),d=r.i(657545),c=r.i(529609);let h=(0,t.styled)(c.L)`
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--privy-color-accent);
  svg {
    fill: var(--privy-color-accent);
  }
`;var x=r.i(715097),p=r.i(423669),u=r.i(185984),v=r.i(960256),g=r.i(815119),m=r.i(682275),j=r.i(864445),f=r.i(463475),y=r.i(612780),b=r.i(67820),k=r.i(992805),w=r.i(492337),L=r.i(938467),C=r.i(115965),A=r.i(784095),$=r.i(346242);let T=i.forwardRef(function({title:r,titleId:e,...o},n){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":e},o),r?i.createElement("title",{id:e},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"}))});var S=r.i(712722),V=r.i(342843),M=r.i(68297),E=({iconUrl:r,value:i,symbol:o,usdValue:n,nftName:s,nftCount:t,decimals:a,$isLoading:l})=>{if(l)return(0,e.jsx)(I,{$isLoading:l});let d=i&&n&&a?function(r,e,i){let o=parseFloat(r),n=parseFloat(i);if(0===o||0===n||Number.isNaN(o)||Number.isNaN(n))return r;let s=Math.ceil(-Math.log10(.01/(n/o))),t=Math.pow(10,s=Math.max(s=Math.min(s,e),1)),a=+(Math.floor(o*t)/t).toFixed(s).replace(/\.?0+$/,"");return Intl.NumberFormat(void 0,{maximumFractionDigits:e}).format(a)}(i,a,n):i;return(0,e.jsxs)("div",{children:[(0,e.jsxs)(I,{$isLoading:l,children:[r&&(0,e.jsx)(F,{src:r,alt:"Token icon"}),t&&t>1?t+"x":void 0," ",s,d," ",o]}),n&&(0,e.jsxs)(z,{$isLoading:l,children:["$",n]})]})};let I=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  /**
   * @NOTE This is a code smell anti-pattern for styling components.
   * We are mixing JSX definitions with styled-components CSS definitions.
   * This is not ideal and should be refactored in the future to separate concerns.
   * This is also hard to read, as it makes it difficult to understand the structure
   * of the component and its styles by viewing the JSX.
   */

  ${b.L}
`,z=t.styled.span`
  color: var(--privy-color-foreground-2);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  ${b.L}
`,F=t.styled.img`
  height: 14px;
  width: 14px;
  margin-right: 4px;
  object-fit: contain;
`,N=r=>{let{chain:i,transactionDetails:o,isTokenContractInfoLoading:n,symbol:s}=r,{action:t,functionName:a}=o;return(0,e.jsx)(w.B,{children:(0,e.jsxs)(x.R,{children:["transaction"!==t&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Action"}),(0,e.jsx)(c.V,{children:a})]}),"mint"===a&&"args"in o&&o.args.filter(r=>r).map((r,o)=>(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:`Param ${o}`}),(0,e.jsx)(c.V,{children:"string"==typeof r&&(0,k.isAddress)(r)?(0,e.jsx)(m.A,{address:r,url:i?.blockExplorers?.default?.url,showCopyIcon:!1}):r?.toString()})]},o)),"setApprovalForAll"===a&&o.operator&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Operator"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:o.operator,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),"setApprovalForAll"===a&&void 0!==o.approved&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Set approval to"}),(0,e.jsx)(c.V,{children:o.approved?"true":"false"})]}),"transfer"===a||"transferWithMemo"===a||"transferFrom"===a||"safeTransferFrom"===a||"approve"===a?(0,e.jsxs)(e.Fragment,{children:["formattedAmount"in o&&o.formattedAmount&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount"}),(0,e.jsxs)(c.V,{$isLoading:n,children:[o.formattedAmount," ",s]})]}),"tokenId"in o&&o.tokenId&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token ID"}),(0,e.jsx)(c.V,{children:o.tokenId.toString()})]})]}):null,"safeBatchTransferFrom"===a&&(0,e.jsxs)(e.Fragment,{children:["amounts"in o&&o.amounts&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amounts"}),(0,e.jsx)(c.V,{children:o.amounts.join(", ")})]}),"tokenIds"in o&&o.tokenIds&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token IDs"}),(0,e.jsx)(c.V,{children:o.tokenIds.join(", ")})]})]}),"approve"===a&&o.spender&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Spender"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:o.spender,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),("transferFrom"===a||"safeTransferFrom"===a||"safeBatchTransferFrom"===a)&&o.transferFrom&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Transferring from"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:o.transferFrom,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),("transferFrom"===a||"safeTransferFrom"===a||"safeBatchTransferFrom"===a)&&o.transferTo&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Transferring to"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:o.transferTo,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]})]})})},B=({variant:r,setPreventMaliciousTransaction:i,colorScheme:o="light",preventMaliciousTransaction:n})=>"warn"===r?(0,e.jsx)(O,{children:(0,e.jsxs)(A.W,{theme:o,children:[(0,e.jsx)("span",{style:{fontWeight:"500"},children:"Warning: Suspicious transaction"}),(0,e.jsx)("br",{}),"This has been flagged as a potentially deceptive request. Approving could put your assets or funds at risk."]})}):"error"===r?(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)(O,{children:[(0,e.jsx)(C.E,{theme:o,children:(0,e.jsxs)("div",{children:[(0,e.jsx)("strong",{children:"This is a malicious transaction"}),(0,e.jsx)("br",{}),"This transaction transfers tokens to a known malicious address. Proceeding may result in the loss of valuable assets."]})}),(0,e.jsxs)(Z,{children:[(0,e.jsx)(L.C,{color:"var(--privy-color-error)",checked:!n,readOnly:!0,onClick:()=>i(!n)}),(0,e.jsx)("span",{children:"I understand and want to proceed anyways."})]})]})}):null,O=t.styled.div`
  margin-top: 1.5rem;
`,Z=t.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`,W=({transactionIndex:r,maxIndex:e})=>"number"!=typeof r||0===e?"":` (${r+1} / ${e+1})`,P=(0,t.styled)(j.W)`
  ${r=>r.$useSmallMargins?"margin-top: 0.5rem;":"margin-top: 2rem;"}
`,D=(0,t.styled)(x.R)`
  margin-top: 0.5rem;
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-sm);
  padding: 0.5rem;
`,R="There was an error preparing your transaction. Your transaction request will likely fail.",H=t.styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  max-height: 40px;

  > img {
    object-fit: contain;
    border-radius: var(--privy-border-radius-sm);
  }
`,U=t.styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`,_=t.styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,q=r=>r?.code===V.PrivyErrorCode.COMPLIANCE_BLOCKED,G=()=>(0,e.jsxs)(X,{children:[(0,e.jsx)(rr,{}),(0,e.jsx)(Y,{})]}),J=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,K=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25rem; /* 111.111% */
  text-align: center;
  margin: 10px;
`,Q=t.styled.span`
  margin-top: 4px;
  margin-bottom: 10px;
  color: var(--privy-color-foreground-3);
  text-align: center;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.008px;
`,X=t.styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`,Y=(0,t.styled)(S.default)`
  position: absolute;
  width: 35px;
  height: 35px;
  color: var(--privy-color-error);
`,rr=t.styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--privy-color-error);
  opacity: 0.1;
`,re=(0,t.styled)(l.P)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`,ri=t.styled.span`
  width: 100%;
  text-align: left;
  font-size: 0.825rem;
  color: var(--privy-color-foreground);
  padding: 4px;
`,ro=t.styled.div`
  width: 100%;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`,rn=t.styled.text`
  position: relative;
  width: 100%;
  padding: 5px;
  font-size: 0.8rem;
  color: var(--privy-color-foreground-3);
  text-align: left;
  overflow-wrap: break-word;
`,rs=t.styled.span`
  position: relative;
  width: 100%;
  background-color: var(--privy-color-background-2);
  padding: 8px 12px;
  border-radius: 10px;
  margin-top: 5px;
  font-size: 14px;
  color: var(--privy-color-foreground-3);
  text-align: left;
  overflow-wrap: break-word;
  ${r=>r.$clickable&&"cursor: pointer;\n  transition: background-color 0.3s;\n  padding-right: 45px;\n\n  &:hover {\n    background-color: var(--privy-color-foreground-4);\n  }"}
`,rt=(0,t.styled)(T)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,ra=(0,t.styled)($.default)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,rl=({clicked:r})=>(0,e.jsx)(r?ra:rt,{});r.s(["S",0,({img:r,title:n,subtitle:t,cta:j,instructions:b,network:k,blockExplorerUrl:w,isMissingFunds:L,submitError:C,parseError:A,total:$,swap:T,transactingWalletAddress:S,fee:V,balance:M,disabled:E,isSubmitting:I,isPreparing:z,isTokenPriceLoading:F,onClick:N,onClose:B,onBack:O,isSponsored:Z})=>{let W=z||F,[q,G]=(0,i.useState)(!1),J=(0,f.u)();return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(l.M,{onClose:B,backFn:O}),r&&(0,e.jsx)(H,{children:r}),(0,e.jsx)(g.T,{style:{marginTop:r?"1.5rem":0},children:n}),(0,e.jsx)(v.S,{children:t}),(0,e.jsxs)(x.R,{style:{marginTop:"2rem",marginBottom:".5rem"},children:[($||W)&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount"}),(0,e.jsx)(c.V,{$isLoading:W,children:$})]}),T&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Swap"}),(0,e.jsx)(c.V,{children:T})]}),k&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Network"}),(0,e.jsx)(c.V,{children:k})]}),(V||W||void 0!==Z)&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Estimated fee"}),(0,e.jsx)(c.V,{$isLoading:W,children:Z&&!W?(0,e.jsxs)(U,{children:[(0,e.jsxs)(_,{children:["Sponsored by ",J.name]}),(0,e.jsx)(o,{height:16,width:16})]}):V})]})]}),(0,e.jsx)(x.a,{children:(0,e.jsxs)(h,{onClick:()=>G(r=>!r),children:[(0,e.jsx)("span",{children:"Advanced"}),(0,e.jsx)(s.default,{height:"16px",width:"16px",strokeWidth:"2",style:{transition:"all 300ms",transform:q?"rotate(180deg)":void 0}})]})}),q&&(0,e.jsx)(e.Fragment,{children:b.map((r,i)=>"sol-transfer"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Transfer ",r.withSeed?"with seed":""]})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount"}),(0,e.jsxs)(c.V,{children:[(0,a.formatTokenAmount)({amount:r.value,decimals:r.token.decimals})," ",r.token.symbol]})]}),!!r.toAccount&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Destination"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.toAccount,url:w})})]})]},i):"spl-transfer"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Transfer ",r.token.symbol]})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount"}),(0,e.jsx)(c.V,{children:r.value.toString()})]}),!!r.fromAta&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Source"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.fromAta,url:w})})]}),!!r.toAta&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Destination"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.toAta,url:w})})]}),!!r.token.address&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.token.address,url:w})})]})]},i):"ata-creation"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsx)(u.L,{children:"Create token account"})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Program ID"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.program,url:w})})]}),!!r.owner&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Owner"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.owner,url:w})})]})]},i):"create-account"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Create account ",r.withSeed?"with seed":""]})}),!!r.account&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Account"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.account,url:w})})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount"}),(0,e.jsxs)(c.V,{children:[(0,a.formatTokenAmount)({amount:r.value,decimals:9})," SOL"]})]})]},i):"spl-init-account"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsx)(u.L,{children:"Initialize token account"})}),!!r.account&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Account"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.account,url:w})})]}),!!r.mint&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Mint"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mint,url:w})})]}),!!r.owner&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Owner"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.owner,url:w})})]})]},i):"spl-close-account"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsx)(u.L,{children:"Close token account"})}),!!r.source&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Source"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.source,url:w})})]}),!!r.destination&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Destination"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.destination,url:w})})]}),!!r.owner&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Owner"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.owner,url:w})})]})]},i):"spl-sync-native"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsx)(u.L,{children:"Sync native"})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Program ID"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.program,url:w})})]})]},i):"raydium-swap-base-input"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Raydium swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount in"}),(0,e.jsx)(c.V,{children:r.amountIn.toString()})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Minimum amount out"}),(0,e.jsx)(c.V,{children:r.minimumAmountOut.toString()})]}),r.mintIn&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token in"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintIn,url:w})})]}),r.mintOut&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token out"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintOut,url:w})})]})]},i):"raydium-swap-base-output"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Raydium swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Max amount in"}),(0,e.jsx)(c.V,{children:r.maxAmountIn.toString()})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount out"}),(0,e.jsx)(c.V,{children:r.amountOut.toString()})]}),r.mintIn&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token in"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintIn,url:w})})]}),r.mintOut&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token out"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintOut,url:w})})]})]},i):"jupiter-swap-shared-accounts-route"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Jupiter swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"In amount"}),(0,e.jsx)(c.V,{children:r.inAmount.toString()})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Quoted out amount"}),(0,e.jsx)(c.V,{children:r.quotedOutAmount.toString()})]}),r.mintIn&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token in"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintIn,url:w})})]}),r.mintOut&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token out"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintOut,url:w})})]})]},i):"jupiter-swap-exact-out-route"===r.type?(0,e.jsxs)(D,{children:[(0,e.jsx)(x.a,{children:(0,e.jsxs)(u.L,{children:["Jupiter swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Quoted in amount"}),(0,e.jsx)(c.V,{children:r.quotedInAmount.toString()})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Amount out"}),(0,e.jsx)(c.V,{children:r.outAmount.toString()})]}),r.mintIn&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token in"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintIn,url:w})})]}),r.mintOut&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token out"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.mintOut,url:w})})]})]},i):(0,e.jsxs)(D,{children:[(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Program ID"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:r.program,url:w})})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Data"}),(0,e.jsx)(c.V,{children:r.discriminator})]})]},i))}),(0,e.jsx)(y.G,{}),C?(0,e.jsx)(p.E,{style:{marginTop:"2rem"},children:C.message}):A?(0,e.jsx)(p.E,{style:{marginTop:"2rem"},children:R}):null,(0,e.jsx)(P,{$useSmallMargins:!(!A&&!C),title:"",address:S,balance:M,errMsg:z||A||C||!L?void 0:"Add funds on Solana to complete transaction."}),(0,e.jsx)(l.P,{style:{marginTop:"1rem"},loading:I,disabled:E||z,onClick:N,children:j}),(0,e.jsx)(d.B,{})]})},"T",0,({transactionError:r,chainId:o,onClose:n,onRetry:s,chainType:t,transactionHash:c})=>{let{chains:h}=(0,M.u)(),[x,p]=(0,i.useState)(!1),{errorCode:u,errorMessage:v}=((r,e)=>{if(r instanceof a.PrivyApiError&&r.code===V.PrivyErrorCode.MISSING_MFA_ENROLLMENT)return{errorCode:"MFA enrollment required",errorMessage:r.message};if("ethereum"===e)return q(r)?{errorCode:"Transaction blocked",errorMessage:r.message}:{errorCode:r.details??r.message,errorMessage:r.shortMessage};let i=r.txSignature,o=r?.transactionMessage||"Something went wrong.";if(Array.isArray(r.logs)){let e=r.logs.find(r=>/insufficient (lamports|funds)/gi.test(r));e&&(o=e)}return{transactionHash:i,errorMessage:o}})(r,t),g=q(r),m=(({chains:r,chainId:e,chainType:i,transactionHash:o})=>{var n;return"ethereum"===i?r.find(r=>r.id===e)?.blockExplorers?.default.url??"https://etherscan.io":(n=o||"",`https://explorer.solana.com/tx/${n}?chain=${e}`)})({chains:h,chainId:o,chainType:t,transactionHash:c});return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(l.M,{onClose:n}),(0,e.jsxs)(J,{children:[(0,e.jsx)(G,{}),(0,e.jsx)(K,{children:u}),(0,e.jsx)(Q,{children:g?"This transaction cannot be completed.":"Please try again."}),(0,e.jsxs)(ro,{children:[(0,e.jsx)(ri,{children:"Error message"}),(0,e.jsx)(rs,{$clickable:!1,children:v})]}),c&&(0,e.jsxs)(ro,{children:[(0,e.jsx)(ri,{children:"Transaction hash"}),(0,e.jsxs)(rn,{children:["Copy this hash to view details about the transaction on a"," ",(0,e.jsx)("u",{children:(0,e.jsx)("a",{href:m,children:"block explorer"})}),"."]}),(0,e.jsxs)(rs,{$clickable:!0,onClick:async()=>{await navigator.clipboard.writeText(c),p(!0)},children:[c,(0,e.jsx)(rl,{clicked:x})]})]}),!g&&(0,e.jsx)(re,{onClick:()=>s({resetNonce:!!c}),children:"Retry transaction"})]}),(0,e.jsx)(d.M,{})]})},"a",0,({img:r,submitError:t,prepareError:a,onClose:u,action:j,title:b,subtitle:k,to:w,tokenAddress:L,network:C,missingFunds:A,fee:$,from:T,cta:S,disabled:V,chain:M,isSubmitting:I,isPreparing:z,isTokenPriceLoading:F,isTokenContractInfoLoading:O,isSponsored:Z,symbol:D,balance:q,onClick:G,transactionDetails:J,transactionIndex:K,maxIndex:Q,onBack:X,chainName:Y,validation:rr,hasScanDetails:re,setIsScanDetailsOpen:ri,preventMaliciousTransaction:ro,setPreventMaliciousTransaction:rn,tokensSent:rs,tokensReceived:rt,isScanning:ra,isCancellable:rl,functionName:rd})=>{let{showTransactionDetails:rc,setShowTransactionDetails:rh,hasMoreDetails:rx,isErc20Ish:rp}=(r=>{let[e,o]=(0,i.useState)(!1),n=!0,s=!1;return(!r||r.isErc20Ish||"transaction"===r.action)&&(n=!1),n&&(s=Object.entries(r||{}).some(([r,e])=>e&&!["action","isErc20Ish","isNFTIsh"].includes(r))),{showTransactionDetails:e,setShowTransactionDetails:o,hasMoreDetails:n&&s,isErc20Ish:r?.isErc20Ish}})(J),ru=(0,f.u)(),rv=rp&&O||z||F||ra;return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(l.M,{onClose:u,backFn:X}),r&&(0,e.jsx)(H,{children:r}),(0,e.jsxs)(g.T,{style:{marginTop:r?"1.5rem":0},children:[b,(0,e.jsx)(W,{maxIndex:Q,transactionIndex:K})]}),(0,e.jsx)(v.S,{children:k}),(0,e.jsxs)(x.R,{style:{marginTop:"2rem"},children:[(!!rs[0]||rv)&&(0,e.jsxs)(x.a,{children:[rt.length>0?(0,e.jsx)(c.L,{children:"Send"}):(0,e.jsx)(c.L,{children:"approve"===j?"Approval amount":"Amount"}),(0,e.jsx)("div",{className:"flex flex-col",children:rs.map((r,i)=>(0,e.jsx)(E,{iconUrl:r.iconUrl,value:"setApprovalForAll"===rd?"All":r.value,usdValue:r.usdValue,symbol:r.symbol,nftName:r.nftName,nftCount:r.nftCount,decimals:r.decimals},i))})]}),rt.length>0&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Receive"}),(0,e.jsx)("div",{className:"flex flex-col",children:rt.map((r,i)=>(0,e.jsx)(E,{iconUrl:r.iconUrl,value:r.value,usdValue:r.usdValue,symbol:r.symbol,nftName:r.nftName,nftCount:r.nftCount,decimals:r.decimals},i))})]}),J&&"spender"in J&&J?.spender?(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Spender"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:J.spender,url:M?.blockExplorers?.default?.url})})]}):null,w&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"To"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:w,url:M?.blockExplorers?.default?.url,showCopyIcon:!0})})]}),L&&(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Token address"}),(0,e.jsx)(c.V,{children:(0,e.jsx)(m.A,{address:L,url:M?.blockExplorers?.default?.url})})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Network"}),(0,e.jsx)(c.V,{children:C})]}),(0,e.jsxs)(x.a,{children:[(0,e.jsx)(c.L,{children:"Estimated fee"}),(0,e.jsx)(c.V,{$isLoading:z||F||void 0===Z,children:Z?(0,e.jsxs)(U,{children:[(0,e.jsxs)(_,{children:["Sponsored by ",ru.name]}),(0,e.jsx)(o,{height:16,width:16})]}):$})]}),rx&&!re&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(x.a,{className:"cursor-pointer",onClick:()=>rh(!rc),children:(0,e.jsxs)(c.a,{className:"flex items-center gap-x-1",children:["Details"," ",(0,e.jsx)(s.default,{style:{width:"0.75rem",marginLeft:"0.25rem",transform:rc?"rotate(180deg)":void 0}})]})}),rc&&J&&(0,e.jsx)(N,{action:j,chain:M,transactionDetails:J,isTokenContractInfoLoading:O,symbol:D})]}),re&&(0,e.jsx)(x.a,{children:(0,e.jsxs)(h,{onClick:()=>ri(!0),children:[(0,e.jsx)("span",{className:"text-color-primary",children:"Details"}),(0,e.jsx)(n,{height:"14px",width:"14px",strokeWidth:"2"})]})})]}),(0,e.jsx)(y.G,{}),t?(0,e.jsx)(p.E,{style:{marginTop:"2rem"},children:t.message}):a&&0===K?(0,e.jsx)(p.E,{style:{marginTop:"2rem"},children:a.shortMessage??R}):null,(0,e.jsx)(B,{variant:rr,preventMaliciousTransaction:ro,setPreventMaliciousTransaction:rn}),(0,e.jsx)(P,{$useSmallMargins:!(!a&&!t&&"warn"!==rr&&"error"!==rr),address:T,balance:q,errMsg:z||a||t||!A?void 0:`Add funds on ${M?.name??Y} to complete transaction.`}),(0,e.jsx)(l.P,{style:{marginTop:"1rem"},loading:I,disabled:V||z,onClick:G,children:S}),rl&&(0,e.jsx)(l.E,{style:{marginTop:"1rem"},onClick:u,isSubmitting:!1,children:"Not now"}),(0,e.jsx)(d.B,{})]})}],981608)}]);