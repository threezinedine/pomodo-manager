@echo off
rem =========================================================
rem DB Start: Start all MySQL instances (dev, test, prod)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Starting MySQL dev...
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev up -d

echo ==^> Starting MySQL test...
docker compose -f docker-compose.db.yml --env-file .env.test --profile test up -d

echo ==^> Starting MySQL prod...
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod up -d

echo ==^> Done. All DBs running:
docker compose -f docker-compose.db.yml ps

endlocal
