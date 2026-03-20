@echo off
rem =========================================================
rem DB Stop: Stop all MySQL instances (keeps data)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Stopping all DB containers...
docker compose -f docker-compose.db.yml --env-file .env.dev down
docker compose -f docker-compose.db.yml --env-file .env.test down
docker compose -f docker-compose.db.yml --env-file .env.prod down

echo ==^> All DBs stopped ^(data preserved^).
endlocal
