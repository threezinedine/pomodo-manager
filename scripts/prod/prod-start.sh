#!/usr/bin/env bash
# =========================================================
# Start Prod: DB + App (nginx, server, client)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Starting MySQL (prod)..."
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod up -d

echo "==> Waiting for MySQL to be healthy..."
sleep 5

echo "==> Starting app (prod)..."
docker compose --env-file .env.prod up --build -d

echo "==> Done. App available at http://localhost"
