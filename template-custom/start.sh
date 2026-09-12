#!/usr/bin/env bash
set -euo pipefail

echo "========================================================"
echo "  VertiGIS Studio Web SDK Development Server"
echo "  Serving: https://localtest.me:3001 & https://localhost:3000"
echo "========================================================"

# Free both port 3001 and port 3000 if occupied
for p in 3001 3000; do
    PID=$(lsof -ti :$p 2>/dev/null || true)
    if [ -n "$PID" ]; then
        echo "Killing stale process on port $p (PID $PID)..."
        kill -9 $PID 2>/dev/null || true
    fi
done

if [ -f "./certs/generate-cert.sh" ]; then
    bash ./certs/generate-cert.sh
fi

echo "Starting development server (npm start)..."
npm start
