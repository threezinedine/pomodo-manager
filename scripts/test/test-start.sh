#!/usr/bin/env bash
# =========================================================
# Start Test: DB + App (waits for app, then runs Cypress)
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "==> Starting MySQL (test)..."
docker compose -f docker-compose.db.yml --env-file .env.test --profile test up -d

echo "==> Waiting for MySQL to be healthy..."
sleep 5

echo "==> Starting app (test)..."
docker compose --env-file .env.test up --build -d

echo "==> Waiting for app to start..."
sleep 5

echo "==> Running Cypress tests..."
docker compose --env-file .env.test up --profile test --abort-on-container-exit
