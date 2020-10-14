#!/bin/bash
# Docker entrypoint script.
exec mix ecto.migrate
exec mix phx.server