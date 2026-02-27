# 🚀 Guía Rápida de Despliegue

**Tu Dominio:** `material.miagentepersional.me`

## Pasos Rápidos

### 1. En tu máquina local

```bash
cd material-comparator
chmod +x deploy.sh
./deploy.sh usuario tu-vps-ip
```

### 2. O manual en VPS

```bash
# En tu VPS
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo usermod -aG docker $USER
newgrp docker

# SSL
sudo apt install -y certbot
sudo certbot certonly --standalone -d material.miagentepersonal.me

# Subir código
# Copia material-comparator/ a tu VPS

# Ejecutar
cd material-comparator
docker-compose -f docker-compose.nginx.yml up -d
```

## ✅ Listo

Accede a: **<https://material.miagentepersonal.me>** 🎉

## Comandos Día a Día

```bash
# Ver estado
docker-compose -f docker-compose.nginx.yml ps

# Ver logs
docker-compose -f docker-compose.nginx.yml logs -f

# Reiniciar
docker-compose -f docker-compose.nginx.yml restart

# Actualizar código
git pull origin main
docker-compose -f docker-compose.nginx.yml up -d --build

# Parar
docker-compose -f docker-compose.nginx.yml down
```

## 🔐 Certificado SSL

El certificado se renueva automáticamente. Si necesitas renovar manualmente:

```bash
sudo certbot renew -d material.miagentepersonal.me
docker-compose -f docker-compose.nginx.yml restart nginx
```

## 📊 Ver estadísticas

```bash
docker stats
```

---

¡Tu aplicación está en producción! 🚀
