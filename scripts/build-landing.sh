#!/bin/sh
set -eu
cd "$(dirname "$0")/../frontend"
NEXT_TELEMETRY_DISABLED=1 pnpm install --frozen-lockfile
NEXT_TELEMETRY_DISABLED=1 pnpm build
cd ..
rm -rf static/landing-export
mkdir -p static/landing-export
cp -R frontend/out/. static/landing-export/
