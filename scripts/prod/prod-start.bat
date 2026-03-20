@echo off
rem =========================================================
rem Start Prod: DB + App (nginx, server, client)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Starting MySQL ^(prod^)...
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod up -d

echo ==^> Waiting for MySQL to be healthy...
timeout /t 5 /nobreak >nul

echo ==^> Starting app ^(prod^)...
docker compose --env-file .env.prod up --build -d

echo ==^> Done. App available at http://localhost
endlocal
