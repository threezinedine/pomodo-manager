@echo off
rem =========================================================
rem Prod Status: Show running container status
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo === App containers ===
docker compose --env-file .env.prod ps

echo.
echo === DB containers ===
docker compose -f docker-compose.db.yml --env-file .env.prod ps

endlocal
