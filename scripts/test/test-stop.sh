#!/usr/bin/env bash
# =========================================================
# Stop Test: App + DB
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Stopping test app..."
docker compose --env-file .env.test down

echo "==> Stopping test DB..."
docker compose -f docker-compose.db.yml --env-file .env.test --profile test down -v

echo "==> Test environment stopped."
