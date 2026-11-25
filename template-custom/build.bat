@echo off
setlocal enabledelayedexpansion
rem Usage: build.bat [name]
rem            Build build\<name>.js and build\<name>.js.txt.
rem        build.bat upload-gc <public-url> [name]
rem            Build, then upload build\<name>.js to Google Cloud Storage with gcloud.
rem
rem <public-url> is https://storage.googleapis.com/<bucket>/<path> or gs://<bucket>/<path>.
rem If the URL ends with ".js", it is the object name. Otherwise it is a folder and the file is <name>.js in it.
rem The bucket must already allow public read (allUsers: Storage Object Viewer). This script does not change access.

set "UPLOAD_URL="
set "NAME=%~1"
if /i not "%~1"=="upload-gc" goto :name
set "UPLOAD_URL=%~2"
set "NAME=%~3"
if "!UPLOAD_URL!"=="" (
    echo Usage: build.bat upload-gc ^<public-url^> [name]
    exit /b 1
)

:name
if "!NAME!"=="" set "NAME=__PROJECT_NAME__"

rem Check the upload settings before the build, so that a bad URL fails fast.
set "GS_OBJECT="
if "!UPLOAD_URL!"=="" goto :build
set "GS_PATH="
if /i "!UPLOAD_URL:~0,5!"=="gs://" set "GS_PATH=!UPLOAD_URL:~5!"
if /i "!UPLOAD_URL:~0,31!"=="https://storage.googleapis.com/" set "GS_PATH=!UPLOAD_URL:~31!"
if "!GS_PATH!"=="" (
    echo Error: the URL must start with https://storage.googleapis.com/ or gs:// and contain a bucket name
    exit /b 1
)
if "!GS_PATH:~0,1!"=="/" (
    echo Error: no bucket name in !UPLOAD_URL!
    exit /b 1
)
if /i "!GS_PATH:~-3!"==".js" (
    set "GS_OBJECT=!GS_PATH!"
) else if "!GS_PATH:~-1!"=="/" (
    set "GS_OBJECT=!GS_PATH!!NAME!.js"
) else (
    set "GS_OBJECT=!GS_PATH!/!NAME!.js"
)
where gcloud >nul 2>&1
if errorlevel 1 (
    echo Error: gcloud not found. Install the Google Cloud CLI and run: gcloud auth login
    exit /b 1
)

:build
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
copy /y build\main.js "build\!NAME!.js" >nul
copy /y build\main.js "build\!NAME!.js.txt" >nul
echo Created build\!NAME!.js and build\!NAME!.js.txt (verified zero dev URLs)

if "!GS_OBJECT!"=="" exit /b 0
echo Uploading build\!NAME!.js to gs://!GS_OBJECT!...
rem no-cache: VertiGIS Studio Web loads the new version at the next app load.
call gcloud storage cp "build\!NAME!.js" "gs://!GS_OBJECT!" --content-type=application/javascript --cache-control=no-cache || exit /b 1
echo Uploaded. Public URL (add it in Designer ^> App Settings ^> Custom Libraries):
echo   https://storage.googleapis.com/!GS_OBJECT!
