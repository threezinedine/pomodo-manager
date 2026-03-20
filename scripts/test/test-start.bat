@echo off
rem =========================================================
rem Start Test: DB + App + Cypress
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Starting MySQL ^(test^)...
docker compose -f docker-compose.db.yml --env-file .env.test --profile test up -d

echo ==^> Waiting for MySQL to be healthy...
timeout /t 5 /nobreak >nul

echo ==^> Starting app ^(test^)...
docker compose --env-file .env.test up --build -d

echo ==^> Waiting for app to start...
timeout /t 5 /nobreak >nul

echo ==^> Running Cypress tests...
docker compose --env-file .env.test up --profile test --abort-on-container-exit

endlocal
