#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Check if domain name is provided
if [ -z "$DOMAIN_NAME" ]; then
  echo "Error: DOMAIN_NAME is not set in the .env file."
  exit 1
fi

domains=($DOMAIN_NAME www.$DOMAIN_NAME)
rsa_key_size=4096
data_path="./nginx/data/certbot"
email="" # Add a valid email here for Let's Encrypt notifications

# Create required directories
mkdir -p "$data_path/conf/live/$DOMAIN_NAME"
mkdir -p "$data_path/www"

# Generate nginx config file from template
echo "Generating nginx configuration..."
sed "s/\${DOMAIN_NAME}/$DOMAIN_NAME/g" ./nginx/conf.d/app.conf.template > ./nginx/conf.d/app.conf

# Setup dummy certificates for the initial nginx startup
echo "Creating dummy certificates for $DOMAIN_NAME..."
openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
  -keyout "$data_path/conf/live/$DOMAIN_NAME/privkey.pem" \
  -out "$data_path/conf/live/$DOMAIN_NAME/fullchain.pem" \
  -subj "/CN=localhost"

echo "Starting nginx to verify configuration..."
docker-compose -f docker-compose.prod.yml up -d nginx
echo "Nginx started. Waiting 5 seconds..."
sleep 5

# Request Let's Encrypt certificate
echo "Requesting Let's Encrypt certificates for $DOMAIN_NAME..."
docker-compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $email \
    -d $DOMAIN_NAME -d www.$DOMAIN_NAME \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot

echo "Restarting nginx to apply new certificates..."
docker-compose -f docker-compose.prod.yml restart nginx

echo "Setup completed successfully!"