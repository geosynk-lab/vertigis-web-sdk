@echo off
setlocal enabledelayedexpansion
echo ========================================================
echo   VertiGIS Studio Web SDK Development Server
echo   Serving: https://localtest.me:3001 & https://localhost:3000
echo ========================================================
for %%P in (3001 3000) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%P " ^| findstr "LISTENING"') do (
        echo Terminating PID %%a on port %%P...
        taskkill /F /PID %%a >nul 2>&1
    )
)
if exist "certs\generate-cert.bat" (
    call "certs\generate-cert.bat"
)
echo Starting development server (npm start)...
npm start
