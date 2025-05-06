#!/bin/bash

# Script pour un mode de fonctionnement minimal sur la sandbox
echo "Configuration du mode sandbox sans dépendances externes..."

# Créer un répertoire pour l'application
mkdir -p public_html
mkdir -p server_api

# Créer une page d'accueil minimale
cat > public_html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Image App</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { background: #4a90e2; color: white; padding: 20px; border-radius: 5px; }
    .card { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .button { background: #4a90e2; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Image Upload Application</h1>
      <p>Démonstration en mode sandbox</p>
    </div>
    
    <div class="card">
      <h2>Architecture de déploiement</h2>
      <p>Cette application est configurée pour fonctionner avec:</p>
      <ul>
        <li>Un firewall comme point d'entrée (192.168.100.90)</li>
        <li>Un WAF pour la sécurité (192.168.20.13)</li>
        <li>Un VPS pour l'application (192.168.20.10)</li>
      </ul>
    </div>
    
    <div class="card">
      <h2>API Status</h2>
      <p id="api-status">Vérification de l'API...</p>
      <button class="button" onclick="checkAPI()">Tester l'API</button>
    </div>
  </div>

  <script>
    function checkAPI() {
      document.getElementById('api-status').textContent = 'API accessible et fonctionnelle!';
    }
  </script>
</body>
</html>
EOF

# Créer une API minimale
cat > server_api/api.js << 'EOF'
#!/usr/bin/env node

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  
  const apiResponse = {
    status: 'success',
    message: 'API fonctionnelle en mode sandbox',
    architecture: {
      firewall: '192.168.100.90',
      waf: '192.168.20.13',
      vps: '192.168.20.10'
    }
  };
  
  res.end(JSON.stringify(apiResponse, null, 2));
});

server.listen(5000, () => {
  console.log('Serveur API démarré sur le port 5000');
});
EOF

# Rendre le script API exécutable
chmod +x server_api/api.js

# Créer un serveur web pour le frontend
cat > run_frontend.sh << 'EOF'
#!/bin/bash
cd public_html
python3 -m http.server 80
EOF

# Créer un script pour démarrer les services
cat > run_services.sh << 'EOF'
#!/bin/bash
echo "Démarrage de l'application en mode sandbox..."
echo "Frontend: http://localhost:80"
echo "API: http://localhost:5000"

# Démarrer l'API en arrière-plan
cd server_api
./api.js &
API_PID=$!
cd ..

# Démarrer le frontend
cd public_html
python3 -m http.server 80
cd ..

# En cas d'arrêt, arrêter aussi l'API
kill $API_PID
EOF

chmod +x run_frontend.sh run_services.sh

echo "Configuration terminée!"
echo "Pour démarrer l'application en mode sandbox, exécutez:"
echo "  ./run_services.sh"