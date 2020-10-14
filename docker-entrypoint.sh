#!/bin/bash
# Docker entrypoint script.
exec mix ecto.setup
exec mix phx.server