#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-__PROJECT_NAME__}"

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
