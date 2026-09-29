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

# Check Linux inotify limits to prevent EMFILE watcher crashes with chokidar
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CURR_INSTANCES=$(sysctl -n fs.inotify.max_user_instances 2>/dev/null || echo 1024)
    if [ "$CURR_INSTANCES" -lt 512 ]; then
        echo "[WARN] fs.inotify.max_user_instances is low ($CURR_INSTANCES). You may encounter EMFILE errors."
        echo "       Recommended fix: sudo sysctl -w fs.inotify.max_user_instances=8192 fs.inotify.max_user_watches=524288"
    fi
fi

echo "Starting development server (npm start)..."
npm start
