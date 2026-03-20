@echo off
rem =========================================================
rem Stop Dev: App only (keeps DB data)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Stopping dev app...
docker compose --env-file .env.dev down

echo ==^> Dev app stopped ^(DB still running^).
endlocal
