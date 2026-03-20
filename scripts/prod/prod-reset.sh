#!/usr/bin/env bash
# =========================================================
# Reset Prod: Stop + remove DB volumes (clean slate)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Stopping prod app..."
docker compose --env-file .env.prod down

echo "==> Stopping and removing prod DB..."
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod down -v

echo "==> Prod reset complete."
