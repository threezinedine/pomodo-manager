@echo off
rem =========================================================
rem Stop Test: App + DB
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Stopping test app...
docker compose --env-file .env.test down

echo ==^> Stopping test DB...
docker compose -f docker-compose.db.yml --env-file .env.test --profile test down -v

echo ==^> Test environment stopped.
endlocal
