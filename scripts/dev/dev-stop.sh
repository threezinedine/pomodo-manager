#!/usr/bin/env bash
# =========================================================
# Stop Dev: App only (keeps DB data)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Stopping dev app..."
docker compose --env-file .env.dev down

echo "==> Dev app stopped (DB still running)."
