#!/bin/bash

echo "Checking deployment status..."

# Check Docker containers
echo "Checking Docker containers..."
docker ps

# Check Nginx status
echo -e "\nChecking Nginx configuration..."
docker exec nginx-proxy nginx -t

# Check server logs
echo -e "\nChecking server logs..."
docker logs --tail 50 node-server

# Check client logs
echo -e "\nChecking client logs..."
docker logs --tail 50 react-client

# Check MongoDB connection
echo -e "\nChecking MongoDB connection..."
docker exec node-server curl -s http://mongodb:27017 || echo "MongoDB connection issue"

# Check network
echo -e "\nChecking network..."
docker network inspect mern-network

echo -e "\nTesting API endpoint..."
curl -s -i http://localhost/api/ || echo "API endpoint issue"

echo -e "\nDeployment check completed."
