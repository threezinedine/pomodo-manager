@echo off
rem =========================================================
rem Reset Dev: Stop + remove DB volumes (clean slate)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Stopping dev app...
docker compose --env-file .env.dev down

echo ==^> Stopping and removing dev DB...
docker compose -f docker-compose.db.yml --env-file .env.dev --profile dev down -v

echo ==^> Dev reset complete.
endlocal
