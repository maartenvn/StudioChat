# Use an official Elixir runtime as a parent image
FROM elixir:latest

# Install Postgres Client
RUN apt-get update && \
  apt-get install -y postgresql-client

# Install Node.JS
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs fswatch

# Create app directory and copy the Elixir projects into it
RUN mkdir /app
COPY . /app
WORKDIR /app

# Install hex package manager
RUN mix local.hex --force
RUN mix local.rebar --force

# Install Elixir dependencies
RUN mix do deps.get, deps.compile

# Install NPM dependencies
RUN npm install --prefix=assets

# Compile Elixir
RUN mix do compile

# Compile NPM
RUN npm run build --prefix=assets

CMD ["/app/docker-entrypoint.sh"]