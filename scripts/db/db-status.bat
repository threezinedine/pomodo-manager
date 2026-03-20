@echo off
rem =========================================================
rem DB Status: Show all DB container status
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo === Dev DB ===
docker compose -f docker-compose.db.yml --env-file .env.dev ps

echo.
echo === Test DB ===
docker compose -f docker-compose.db.yml --env-file .env.test ps

echo.
echo === Prod DB ===
docker compose -f docker-compose.db.yml --env-file .env.prod ps

endlocal
