#!/usr/bin/env bash
# =========================================================
# Dev Status: Show running container status
# =========================================================
set -e

cd "$(dirname "$0")/../.."

echo "=== App containers ==="
docker compose --env-file .env.dev ps

echo ""
echo "=== DB containers ==="
docker compose -f docker-compose.db.yml --env-file .env.dev ps
