@echo off
rem =========================================================
rem Stop Prod: App only (keeps DB data)
rem =========================================================
setlocal

cd /d "%~dp0../.."

echo ==^> Stopping prod app...
docker compose --env-file .env.prod down

echo ==^> Prod app stopped ^(DB still running^).
endlocal
