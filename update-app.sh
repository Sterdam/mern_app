#!/bin/bash

# Pull latest changes
git pull

# Build and restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Renew SSL certificates if needed
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Restart nginx to apply potential new certificates
docker-compose -f docker-compose.prod.yml restart nginx

echo "Update completed!"