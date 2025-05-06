#!/bin/bash

# Créer un fichier .env si nécessaire
if [ ! -f .env ]; then
  cat > .env << EOF
# Application
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_key_change_this

# MongoDB
MONGODB_URI=mongodb://\${MONGO_USERNAME}:\${MONGO_PASSWORD}@mongodb:27017/imageapp?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=password

# Domain
DOMAIN_NAME=192.168.100.90
EOF
  echo "Fichier .env créé"
fi

# Exporter les variables d'environnement
export $(grep -v '^#' .env | xargs)

# Skip git pull if there's a network issue
git pull || echo "Git pull failed, continuing with local files"

# Build and restart containers
echo "Trying to use docker-compose..."
if command -v docker-compose &> /dev/null; then
  docker-compose -f docker-compose.prod.yml down
  docker-compose -f docker-compose.prod.yml build --no-cache
  docker-compose -f docker-compose.prod.yml up -d
else
  echo "Using docker compose v2..."
  docker compose -f docker-compose.prod.yml down
  docker compose -f docker-compose.prod.yml build --no-cache
  docker compose -f docker-compose.prod.yml up -d
fi

echo "Application démarrée avec succès !"
echo "Accessible sur http://192.168.100.90"