############################
# Build stage
############################
FROM elixir:1.10.4-alpine as build-stage

# Create app directory and copy the Elixir projects into it
RUN mkdir /app
WORKDIR /app

# Install Dependencies
RUN apk add --no-cache git nodejs yarn python npm ca-certificates wget gnupg make erlang gcc libc-dev && \
    npm install npm@latest -g 

# Declare environment variables
ENV MIX_ENV=prod \
    DATABASE_URL="ecto://postgres:postgres@localhost/chat_api" \
    SECRET_KEY_BASE="" \
    FROM_ADDRESS="" \ 
    MAILGUN_API_KEY=""

# Temporary fix because of https://github.com/facebook/create-react-app/issues/8413
ENV GENERATE_SOURCEMAP=false

# Copy frontend files
COPY priv priv
COPY assets assets
RUN npm run build --prefix=assets

# Copy backend files
COPY mix.exs mix.lock ./
COPY config config

# Install hex package manager
RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix deps.get --only prod

# Install Elixir dependencies
COPY lib lib
RUN mix deps.compile
RUN mix phx.digest priv/static

# Install NPM dependencies
COPY assets/package.json assets/package-lock.json ./assets/
RUN npm install --prefix=assets

# Compile Elixir
WORKDIR /app
COPY rel rel
RUN mix release papercups

############################
# Production stage
############################
FROM alpine:3.9 AS production-stage

# Add OpenSSL dependency
RUN apk add --no-cache openssl ncurses-libs

# Configure text-encoding
ENV LANG=C.UTF-8

# Expose port 4000
EXPOSE 4000

# Configure workdirectory
ENV HOME=/app
WORKDIR /app

# Add user
RUN adduser -h /app -u 1000 -s /bin/sh -D papercupsuser

# Copy necessary files
COPY --from=build-stage --chown=papercupsuser:papercupsuser /app/_build/prod/rel/papercups /app
COPY --from=build-stage --chown=papercupsuser:papercupsuser /app/priv /app/priv
RUN chown -R papercupsuser:papercupsuser /app

# Copy docker entrypoint
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh

# Use user
USER papercupsuser

# Start
WORKDIR /app
ENTRYPOINT ["/entrypoint.sh"]
CMD ["run"]