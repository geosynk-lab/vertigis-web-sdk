#!/usr/bin/env bash
set -euo pipefail

# Usage: ./build.sh [name]
#            Build build/<name>.js and build/<name>.js.txt.
#        ./build.sh upload-gc [public-url] [name]
#            Build, then upload build/<name>.js to Google Cloud Storage with gcloud.
#
# Values that you do not give on the command line come from project.config:
#   BUILD_NAME, GC_UPLOAD_URL, GC_CACHE_CONTROL. See project.config for the description of each value.
#
# <public-url> is https://storage.googleapis.com/<bucket>/<path> or gs://<bucket>/<path>.
# If the URL ends with ".js", it is the object name. Otherwise it is a folder and the file is <name>.js in it.
# The bucket must already allow public read (allUsers: Storage Object Viewer). This script does not change access.

cd "$(dirname "${BASH_SOURCE[0]}")"
# shellcheck source=scripts/load-config.sh
source ./scripts/load-config.sh

UPLOAD=""
UPLOAD_URL=""
if [ "${1:-}" = "upload-gc" ]; then
    UPLOAD=1
    shift
    if [ $# -gt 0 ]; then
        UPLOAD_URL="$1"
        shift
    fi
    UPLOAD_URL="${UPLOAD_URL:-${CFG_GC_UPLOAD_URL:-}}"
    if [ -z "$UPLOAD_URL" ]; then
        echo "Usage: ./build.sh upload-gc <public-url> [name]" >&2
        echo "       Or set GC_UPLOAD_URL in project.config and run: ./build.sh upload-gc" >&2
        exit 1
    fi
fi

NAME="${1:-${CFG_BUILD_NAME:-__PROJECT_NAME__}}"
CACHE_CONTROL="${CFG_GC_CACHE_CONTROL:-no-cache}"

# Check the upload settings before the build, so that a bad URL fails fast.
GS_OBJECT=""
if [ -n "$UPLOAD" ]; then
    case "$UPLOAD_URL" in
        gs://*) GS_PATH="${UPLOAD_URL#gs://}" ;;
        https://storage.googleapis.com/*) GS_PATH="${UPLOAD_URL#https://storage.googleapis.com/}" ;;
        *)
            echo "Error: the URL must start with https://storage.googleapis.com/ or gs://" >&2
            exit 1
            ;;
    esac
    if [ -z "${GS_PATH%%/*}" ]; then
        echo "Error: no bucket name in $UPLOAD_URL" >&2
        exit 1
    fi
    case "$GS_PATH" in
        *.js) GS_OBJECT="$GS_PATH" ;;
        */) GS_OBJECT="${GS_PATH}${NAME}.js" ;;
        *) GS_OBJECT="${GS_PATH}/${NAME}.js" ;;
    esac
    if ! command -v gcloud >/dev/null 2>&1; then
        echo "Error: gcloud not found. Install the Google Cloud CLI and run: gcloud auth login" >&2
        exit 1
    fi
fi

npm run build

if [ ! -f "build/main.js" ]; then
    echo "Error: build/main.js not found!"
    exit 1
fi

if grep -Fq "localtest.me" "build/main.js"; then
    echo "Error: localtest.me detected in build/main.js! Dev OAuth hijacked production bundle." >&2
    exit 1
fi

cp -f "build/main.js" "build/${NAME}.js"
cp -f "build/main.js" "build/${NAME}.js.txt"
echo "Created build/${NAME}.js and build/${NAME}.js.txt (verified zero dev URLs)"

if [ -n "$GS_OBJECT" ]; then
    echo "Uploading build/${NAME}.js to gs://${GS_OBJECT} (Cache-Control: ${CACHE_CONTROL})..."
    gcloud storage cp "build/${NAME}.js" "gs://${GS_OBJECT}" \
        --content-type="application/javascript" \
        --cache-control="${CACHE_CONTROL}"
    echo "Uploaded. Public URL (add it in Designer > App Settings > Custom Libraries):"
    echo "  https://storage.googleapis.com/${GS_OBJECT}"
fi
