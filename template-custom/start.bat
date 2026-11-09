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
if /i "%~1"=="remote" (
    set SYNC_BRANCH=%~2
    if "!SYNC_BRANCH!"=="" for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set SYNC_BRANCH=%%b
    echo Remote mode: pulling origin/!SYNC_BRANCH! and re-checking every 5s...
    git pull --ff-only origin !SYNC_BRANCH!
    start "git-sync" /min cmd /c "scripts\remote-sync.bat !SYNC_BRANCH! 5"
)
echo Starting development server (npm start)...
npm start
if /i "%~1"=="remote" taskkill /FI "WINDOWTITLE eq git-sync*" /F >nul 2>&1
