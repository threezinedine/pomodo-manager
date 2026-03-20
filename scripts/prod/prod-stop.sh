#!/usr/bin/env bash
# =========================================================
# Stop Prod: App only (keeps DB data)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Stopping prod app..."
docker compose --env-file .env.prod down

echo "==> Prod app stopped (DB still running)."
