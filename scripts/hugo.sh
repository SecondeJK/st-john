#!/usr/bin/env bash
# Run Hugo for a given environment, loading .env files and checking required variables.
#
#   scripts/hugo.sh development server
#   scripts/hugo.sh production --gc --minify
set -euo pipefail

env="${1:-development}"
shift || true

case "$env" in
  development|staging|production) ;;
  *) echo "Unknown environment '$env' (expected development, staging or production)" >&2; exit 1 ;;
esac

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

# KEY=value lines; blank lines and # comments ignored; surrounding quotes stripped.
# Variables already in the environment (shell, CI, hosting platform) win.
load_env() {
  local file="$1" key value
  [ -f "$file" ] || return 0
  while IFS='=' read -r key value || [ -n "$key" ]; do
    key="$(printf '%s' "${key#export }" | tr -d '[:space:]')"
    [[ -z "$key" || "$key" == \#* ]] && continue
    value="${value%$'\r'}"
    value="${value%\"}"; value="${value#\"}"
    value="${value%\'}"; value="${value#\'}"
    if [ -z "${!key+x}" ]; then
      export "$key=$value"
    fi
  done < "$file"
}

load_env ".env.$env"
load_env ".env"

# HUGO_TEST_SITE=true builds a test site from fixtures whatever environment was asked for,
# so Netlify can host one without Sanity or Google credentials. Netlify sets URL.
if [ "${HUGO_TEST_SITE:-}" = "true" ]; then
  echo "HUGO_TEST_SITE=true: building a test site from fixtures (requested: $env)" >&2
  env=development
  export HUGO_PARAMS_NOINDEX=true
  if [ -z "${HUGO_BASEURL:-}" ] && [ -n "${URL:-}" ]; then
    export HUGO_BASEURL="$URL/"
  fi
fi

if [ "$env" != "development" ]; then
  missing=()
  for var in HUGO_BASEURL HUGO_SANITY_PROJECT_ID HUGO_SANITY_DATASET HUGO_GCAL_ID HUGO_GCAL_API_KEY; do
    [ -n "${!var:-}" ] || missing+=("$var")
  done
  if [ ${#missing[@]} -gt 0 ]; then
    echo "Missing required variables for $env: ${missing[*]}" >&2
    echo "Set them on the hosting platform or in .env.$env (see .env.example)." >&2
    exit 1
  fi
fi

export HUGO_ENVIRONMENT="$env"
exec hugo --environment "$env" "$@"
