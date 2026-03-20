@echo off
rem =========================================================
rem Reset Prod: Stop + remove DB volumes (clean slate)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Stopping prod app...
docker compose --env-file .env.prod down

echo ==^> Stopping and removing prod DB...
docker compose -f docker-compose.db.yml --env-file .env.prod --profile prod down -v

echo ==^> Prod reset complete.
endlocal
