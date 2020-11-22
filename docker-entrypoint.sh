#!/bin/bash
# Docker entrypoint script.
set -e

echo "----------------------------------------"
echo "Running database migrations..."
mix ecto.setup
echo "==> Done!"
echo "----------------------------------------"
echo "Attempting to start server..."
mix phx.server