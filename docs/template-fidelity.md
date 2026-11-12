# Uploaded template fidelity correction

The marketing landing is now built from the original uploaded Next/React source
in `frontend/`, not a manually recreated Jinja page. Original Tailwind globals,
component markup/classes, inline glass filters, WebGL background, hero media,
intro timings, reveal components, sticky image cards, workflow slides, animated
interface and footer imagery are retained. Copy and entry actions are adjusted
for Nexscrow. Illustrative activity is not real provider/customer telemetry.

Run `./scripts/build-landing.sh` to reproduce the static export. Source and
`static/landing-export` must ship together; FastAPI serves the page at `/` and
chunks at `/landing-assets/_next`. Original public images are served at `/images`.
The frontend has no backend credentials. The Python app still owns authentication,
requests, escrow and credits. Login hands off to `/app`; live billing is unchanged.

Strict TypeScript checking caught an original invalid REVIEW_LINES type reference
and missing three.js types. These were fixed without changing runtime effects.
Images/video URLs are preserved from the upload; remote media availability remains
an external dependency. The Vercel Analytics component is retained from the supplied
template. The shared Jinja app/login theme uses the same original translucent
16px-blur navigation, thin black borders, neutral paper palette and type weights;
it does not replace backend controls with the illustrative landing UI.
