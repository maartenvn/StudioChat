# Use an official Elixir runtime as a parent image
FROM elixir:latest

# Create app directory and copy the Elixir projects into it
WORKDIR /usr/src/app

# Install Postgres Client
RUN apt-get update && \
    apt-get install -y postgresql-client

# Install Node.JS
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs fswatch

# Install Open SSL
RUN apt-get install -y openssl

# Declare environment variables
ENV MIX_ENV="prod" \
    DATABASE_URL="ecto://postgres:postgres@localhost/chat_api" \
    SECRET_KEY_BASE="" \
    FROM_ADDRESS="" \ 
    MAILGUN_API_KEY=""

# Install hex package manager
RUN mix local.hex --force
RUN mix local.rebar --force

# Install Elixir dependencies
COPY mix.exs mix.lock ./
COPY config config
RUN mix do deps.get, deps.compile

# Install NPM dependencies
COPY assets/package.json assets/package-lock.json ./assets/
RUN npm install --prefix=assets

# Compile Elixir
COPY lib lib
RUN mix do compile

# Temporary fix because of https://github.com/facebook/create-react-app/issues/8413
ENV GENERATE_SOURCEMAP=false

# Compile NPM
COPY priv priv
COPY assets assets
RUN npm run build --prefix=assets

# Copy the entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Start the entrypoint
ENTRYPOINT ["sh", "docker-entrypoint.sh"]