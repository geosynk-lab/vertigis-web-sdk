@echo off
setlocal enabledelayedexpansion
rem Usage: start.bat                 normal dev server
rem        start.bat remote          pull first, then re-check the remote while the server runs
rem        start.bat remote <branch>
rem
rem Values that you do not give on the command line come from project.config:
rem   REMOTE_SYNC, REMOTE_BRANCH, REMOTE_INTERVAL. See project.config for the description of each value.
cd /d "%~dp0"
call scripts\load-config.bat
set "REMOTE_MODE="
if /i "%~1"=="remote" set "REMOTE_MODE=1"
if /i "!CFG_REMOTE_SYNC!"=="true" set "REMOTE_MODE=1"
set "SYNC_INTERVAL=!CFG_REMOTE_INTERVAL!"
if "!SYNC_INTERVAL!"=="" set "SYNC_INTERVAL=5"
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
if defined REMOTE_MODE (
    set "SYNC_BRANCH="
    if /i "%~1"=="remote" set "SYNC_BRANCH=%~2"
    if "!SYNC_BRANCH!"=="" set "SYNC_BRANCH=!CFG_REMOTE_BRANCH!"
    if "!SYNC_BRANCH!"=="" for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set SYNC_BRANCH=%%b
    echo Remote mode: pulling origin/!SYNC_BRANCH! and re-checking every !SYNC_INTERVAL!s...
    git pull --ff-only origin !SYNC_BRANCH!
    start "git-sync" /min cmd /c "scripts\remote-sync.bat !SYNC_BRANCH! !SYNC_INTERVAL!"
)
echo Starting development server (npm start)...
call npm start
if defined REMOTE_MODE taskkill /FI "WINDOWTITLE eq git-sync*" /F >nul 2>&1
