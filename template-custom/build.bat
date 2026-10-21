@echo off
set "NAME=%~1"
if "%NAME%"=="" set "NAME=__PROJECT_NAME__"
call npm run build || exit /b 1
if not exist build\main.js (
    echo Error: build\main.js not found!
    exit /b 1
)
findstr /C:"localtest.me" build\main.js >nul
if %ERRORLEVEL% equ 0 (
    echo Error: localtest.me detected in build\main.js! Dev OAuth hijacked production bundle.
    exit /b 1
)
copy /y build\main.js "build\%NAME%.js" >nul
copy /y build\main.js "build\%NAME%.js.txt" >nul
echo Created build\%NAME%.js and build\%NAME%.js.txt (verified zero dev URLs)
