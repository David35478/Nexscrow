# Original supplied landing template

These React/Next components and Tailwind styles come directly from the uploaded
Agentic template. Visual structure, class names, images, video and animation logic
are retained; product copy and entry actions are adapted for Nexscrow.

Build from the repository root with `./scripts/build-landing.sh` (pnpm required).
The static Next export is copied to `static/landing-export` so FastAPI/Vercel can
serve it without a second production server. Commit source and generated export
together. `/` serves its index; `/landing-assets/_next/*` serves chunks; `/images/*`
serves template images. `/login` retains backend authentication and `/app` the
existing marketplace; no React client has access to provider or payment secrets.

The original imported template contained an invalid type reference REVIEW_LINES;
the correction to ALL_REVIEW_LINES changes no runtime visual behavior.
