
#!/bin/bash
# Docker entrypoint script.
echo "----------------------------------------"
echo "Running database migrations..."
mix ecto.setup
echo "Done!"
echo ""
echo "----------------------------------------"
echo "Attempting to start server..."
mix phx.server