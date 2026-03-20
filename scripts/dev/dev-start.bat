@echo off
rem =========================================================
rem Start Dev: DB + App (nginx, server, client)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Starting MySQL ^(dev^)...
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev up -d

echo ==^> Waiting for MySQL to be healthy...
timeout /t 5 /nobreak >nul

echo ==^> Starting app ^(dev^)...
docker compose --env-file .env.dev up --build -d

echo ==^> Done. App available at http://localhost
endlocal
