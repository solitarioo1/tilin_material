#!/bin/bash

# 🚀 Script de Despliegue - Material Comparator
# Dominio: material.miagentepersonal.me

set -e

DOMAIN="material.miagentepersonal.me"
USER=${1:-usuario}
VPS_IP=${2:-tu-vps-ip}
PROJECT_DIR="/home/$USER/material-comparator"

echo "=========================================="
echo "📦 Material Comparator - Deploy"
echo "=========================================="
echo "Dominio: $DOMAIN"
echo "VPS: $VPS_IP"
echo "Usuario: $USER"
echo "=========================================="

# Paso 1: Actualizar sistema en VPS
echo ""
echo "1️⃣ Actualizando sistema..."
ssh $USER@$VPS_IP << 'EOF'
sudo apt update && sudo apt upgrade -y
EOF

# Paso 2: Instalar Docker y Compose
echo ""
echo "2️⃣ Instalando Docker y Docker Compose..."
ssh $USER@$VPS_IP << 'EOF'
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Permisos
sudo usermod -aG docker $USER
newgrp docker

# Certbot
sudo apt install -y certbot python3-certbot-nginx
EOF

# Paso 3: Subir archivos
echo ""
echo "3️⃣ Subiendo archivos del proyecto..."
scp -r ./material-comparator/ $USER@$VPS_IP:~/ || echo "Ya existe, actualizando..."

# Paso 4: Obtener certificado SSL
echo ""
echo "4️⃣ Obteniendo certificado SSL para $DOMAIN..."
ssh $USER@$VPS_IP << EOF
sudo certbot certonly --standalone -d $DOMAIN
EOF

# Paso 5: Ejecutar Docker Compose
echo ""
echo "5️⃣ Iniciando Docker Compose..."
ssh $USER@$VPS_IP << EOF
cd $PROJECT_DIR
docker-compose -f docker-compose.nginx.yml up -d
EOF

# Paso 6: Verificar
echo ""
echo "6️⃣ Verificando despliegue..."
ssh $USER@$VPS_IP << EOF
cd $PROJECT_DIR
docker-compose -f docker-compose.nginx.yml ps
EOF

echo ""
echo "=========================================="
echo "✅ ¡Despliegue completado!"
echo "=========================================="
echo ""
echo "🌍 Acceso a tu aplicación:"
echo "   🔒 HTTPS: https://$DOMAIN"
echo "   🌐 HTTP:  http://$DOMAIN (redirige a HTTPS)"
echo ""
echo "📋 Comandos útiles:"
echo ""
echo "   Ver logs:"
echo "   ssh $USER@$VPS_IP 'cd $PROJECT_DIR && docker-compose -f docker-compose.nginx.yml logs -f'"
echo ""
echo "   Reiniciar:"
echo "   ssh $USER@$VPS_IP 'cd $PROJECT_DIR && docker-compose -f docker-compose.nginx.yml restart'"
echo ""
echo "   Detener:"
echo "   ssh $USER@$VPS_IP 'cd $PROJECT_DIR && docker-compose -f docker-compose.nginx.yml down'"
echo ""
echo "=========================================="
