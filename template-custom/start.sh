#!/usr/bin/env bash
set -euo pipefail

# Usage: ./start.sh            normal dev server
#        ./start.sh remote     pull first, then re-check the remote every 5s while the server runs
#        ./start.sh remote <branch> [seconds]
#
# Values that you do not give on the command line come from project.config:
#   REMOTE_SYNC, REMOTE_BRANCH, REMOTE_INTERVAL. See project.config for the description of each value.
cd "$(dirname "${BASH_SOURCE[0]}")"
# shellcheck source=scripts/load-config.sh
source ./scripts/load-config.sh

REMOTE_MODE=""
if [ "${1:-}" = "remote" ] || [ "${CFG_REMOTE_SYNC:-false}" = "true" ]; then
    REMOTE_MODE=1
    [ "${1:-}" = "remote" ] && shift
    SYNC_BRANCH="${1:-${CFG_REMOTE_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}}"
    SYNC_INTERVAL="${2:-${CFG_REMOTE_INTERVAL:-5}}"
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
