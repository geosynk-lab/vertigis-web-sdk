#!/usr/bin/env bash
set -euo pipefail

# Usage: ./start.sh            normal dev server
#        ./start.sh remote     pull first, then re-check the remote every 5s while the server runs
#        ./start.sh remote <branch> [seconds]
REMOTE_MODE=""
if [ "${1:-}" = "remote" ]; then
    REMOTE_MODE=1
    SYNC_BRANCH="${2:-$(git rev-parse --abbrev-ref HEAD)}"
    SYNC_INTERVAL="${3:-5}"
fi

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

if [ -n "$REMOTE_MODE" ]; then
    echo "Remote mode: syncing with origin/$SYNC_BRANCH every ${SYNC_INTERVAL}s..."
    bash ./scripts/remote-sync.sh "$SYNC_BRANCH" "$SYNC_INTERVAL" --once
    bash ./scripts/remote-sync.sh "$SYNC_BRANCH" "$SYNC_INTERVAL" &
    SYNC_PID=$!
    trap 'kill $SYNC_PID 2>/dev/null || true' EXIT INT TERM
fi

echo "Starting development server (npm start)..."
npm start
