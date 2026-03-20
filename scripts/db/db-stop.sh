#!/usr/bin/env bash
# =========================================================
# DB Stop: Stop all MySQL instances (keeps data)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Stopping all DB containers..."
docker compose -f docker-compose.db.yml --env-file .env.dev down
docker compose -f docker-compose.db.yml --env-file .env.test down
docker compose -f docker-compose.db.yml --env-file .env.prod down

echo "==> All DBs stopped (data preserved)."
