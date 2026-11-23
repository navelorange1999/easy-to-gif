#!/usr/bin/env bash
set -euo pipefail

if [[ ${DEMO_SLUG:-} != "easy2gif" || ! ${DEMO_RELEASE:-} =~ ^[a-f0-9]{40}$ ]]; then
  echo "Expected the easy2gif slug and a full Git commit SHA." >&2
  exit 1
fi

corepack pnpm@10.7.1 install --frozen-lockfile
corepack pnpm@10.7.1 run build
