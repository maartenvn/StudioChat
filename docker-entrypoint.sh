#!/bin/bash
# Docker entrypoint script.
echo "----------------------------------------"
echo "Running database migrations..."
mix ecto.setup
echo "==> Done!"
echo "----------------------------------------"
echo "Attempting to start server..."
MIX_ENV=dev mix phx.server