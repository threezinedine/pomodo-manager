#!/usr/bin/env bash
# =========================================================
# Start Dev: DB + App (nginx, server, client)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Starting MySQL (dev)..."
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev up -d

echo "==> Waiting for MySQL to be healthy..."
sleep 5

echo "==> Starting app (dev)..."
docker compose --env-file .env.dev up --build -d

echo "==> Done. App available at http://localhost"
