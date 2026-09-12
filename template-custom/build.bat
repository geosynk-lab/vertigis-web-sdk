@echo off
echo Building production package (npm run build)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed with exit code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Build output located in dist/
