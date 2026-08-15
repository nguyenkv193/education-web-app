#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
NPM_CACHE="${TMPDIR:-/tmp}/f8-education-npm-cache"

SKIP_INSTALL=false
SKIP_MONGODB=false

for argument in "$@"; do
  case "$argument" in
    --skip-install)
      SKIP_INSTALL=true
      ;;
    --skip-mongodb)
      SKIP_MONGODB=true
      ;;
    *)
      echo "Unknown option: $argument" >&2
      echo "Usage: ./scripts/setup.sh [--skip-install] [--skip-mongodb]" >&2
      exit 1
      ;;
  esac
done

cd "$REPO_ROOT"

copy_env_if_missing() {
  local example="$1"
  local destination="$2"

  if [[ ! -f "$destination" ]]; then
    cp "$example" "$destination"
    echo "Created $destination"
  else
    echo "Kept existing $destination"
  fi
}

install_dependencies() {
  local directory="$1"
  echo "==> Installing $directory dependencies"
  (
    cd "$REPO_ROOT/$directory"
    npm ci --no-audit --no-fund --cache "$NPM_CACHE"
  )
}

echo "F8 Education Clone local setup"

copy_env_if_missing .env.example backend/.env
copy_env_if_missing .env.example backend/src/api-gateway/.env
copy_env_if_missing .env.example backend/src/services/auth-service/.env
copy_env_if_missing .env.example backend/src/services/user-service/.env
copy_env_if_missing .env.example backend/src/services/course-service/.env
copy_env_if_missing .env.example backend/src/services/blog-service/.env
copy_env_if_missing .env.example backend/src/services/enrollment-service/.env
copy_env_if_missing .env.example backend/src/services/learning-path-service/.env
copy_env_if_missing frontend/.env.example frontend/.env
copy_env_if_missing admin/.env.example admin/.env

if [[ "$SKIP_INSTALL" == false ]]; then
  npm_directories=(
    frontend
    admin
    backend
    backend/src/shared
    backend/src/api-gateway
    backend/src/services/auth-service
    backend/src/services/user-service
    backend/src/services/course-service
    backend/src/services/blog-service
    backend/src/services/enrollment-service
    backend/src/services/learning-path-service
  )

  for directory in "${npm_directories[@]}"; do
    install_dependencies "$directory"
  done
else
  echo "Skipping dependency installation."
fi

if [[ "$SKIP_MONGODB" == false ]]; then
  if command -v docker >/dev/null 2>&1; then
    echo "==> Starting MongoDB"
    docker compose up -d mongodb
  else
    echo "Docker was not found. Start MongoDB manually before running the backend." >&2
  fi
else
  echo "Skipping MongoDB startup."
fi

echo "Setup completed."
echo 'Run "make dev" or start frontend, admin and backend in separate terminals.'
