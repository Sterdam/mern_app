#!/bin/bash

# Script de déploiement pour le VPS (192.168.20.10)
# Ce script doit être exécuté sur le VPS qui a accès à Internet

# Créer le fichier .env
cat > .env << EOF
# Application
PORT=5000
NODE_ENV=production
JWT_SECRET=replace_with_secure_key_in_production

# MongoDB
MONGODB_URI=mongodb://\${MONGO_USERNAME}:\${MONGO_PASSWORD}@mongodb:27017/imageapp?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=password

# Architecture
VPS_IP=192.168.20.10
WAF_IP=192.168.20.13
FIREWALL_IP=192.168.100.90
DOMAIN_NAME=192.168.100.90
EOF

# Exporter les variables
export $(grep -v '^#' .env | xargs)

# Télécharger les dernières mises à jour (ce VPS a accès Internet)
git pull

# Construire et démarrer les conteneurs
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo "Application déployée avec succès sur le VPS (192.168.20.10)"
echo "Les utilisateurs peuvent y accéder via le firewall: http://192.168.100.90"
echo "Architecture: User -> Firewall (192.168.100.90) -> WAF (192.168.20.13) -> VPS (192.168.20.10)"