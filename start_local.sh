#!/bin/bash

echo "Starting application in local mode with minimal containers..."

# Build and restart containers
if command -v docker-compose &> /dev/null; then
  docker-compose -f docker-compose.local.yml down
  docker-compose -f docker-compose.local.yml build
  docker-compose -f docker-compose.local.yml up -d
else
  echo "Using docker compose v2..."
  docker compose -f docker-compose.local.yml down
  docker compose -f docker-compose.local.yml build
  docker compose -f docker-compose.local.yml up -d
fi

echo "Application démarrée en mode local!"
echo "Accessible sur http://localhost"