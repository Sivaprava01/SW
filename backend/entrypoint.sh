#!/usr/bin/env bash
set -e

echo "===================================================="
echo "Starting Sakhi Indic Financial Companion Backend..."
echo "===================================================="

# Apply database migrations
echo "Running database schema migrations..."
uv run alembic upgrade head || {
    echo "Warning: Alembic migrations encountered an issue, proceeding with application launch."
}

echo "Executing container command: $@"
exec "$@"
