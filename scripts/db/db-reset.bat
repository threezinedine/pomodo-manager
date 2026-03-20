@echo off
rem =========================================================
rem DB Reset: Stop all DBs and remove volumes (WIPES DATA)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Wiping all MySQL instances...
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev down -v
docker compose -f docker-compose.db.yml --env-file .env.test --profile test down -v
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod down -v

echo ==^> All DBs reset. Data wiped.
endlocal
