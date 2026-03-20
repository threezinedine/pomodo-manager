#!/usr/bin/env bash
# =========================================================
# DB Reset: Stop all DBs and remove volumes (WIPES DATA)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Wiping all MySQL instances..."
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev down -v
docker compose -f docker-compose.db.yml --env-file .env.test --profile test down -v
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod down -v

echo "==> All DBs reset. Data wiped."
