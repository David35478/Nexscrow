# Original supplied landing template

These React/Next components and Tailwind styles come directly from the uploaded
Agentic template. Visual structure, class names, images, video and animation logic
are retained; product copy and entry actions are adapted for Nexscrow.

Build from the repository root with `./scripts/build-landing.sh` (pnpm required).
The static Next export is copied to `static/landing-export` so FastAPI/Vercel can
serve it without a second production server. Commit source and generated export
together. `/` serves its index; `/landing-assets/_next/*` serves chunks; `/images/*`
serves template images. `/login` serves the exported Privy/demo portal, `/login?method=near` retains NEAR authentication, and `/app` the
existing marketplace; no React client has access to provider or payment secrets.

The original imported template contained an invalid type reference REVIEW_LINES;
the correction to ALL_REVIEW_LINES changes no runtime visual behavior.

The portal loads the public Privy app ID from `/api/auth/privy/config` at runtime; access tokens are verified by the Python backend before it issues an HTTP-only session. Never place the Privy app secret in a public variable. Solana program packages are pinned through pnpm overrides to match Privy’s supported `@solana/kit` 5 API. See `docs/launch-checklist.md` for production configuration and admin access.
