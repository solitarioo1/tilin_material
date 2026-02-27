# 📦 Guía de Despliegue con Docker

## Requisitos Previos

- Docker instalado en tu VPS
- Docker Compose (opcional, pero recomendado)

## Opción 1: Despliegue con Docker Compose (Recomendado)

### 1. Preparar tu VPS

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Subir archivos al VPS

```bash
# Desde tu máquina local
scp -r ./material-comparator/ usuario@tu-vps:/home/usuario/
```

### 3. Ejecutar en el VPS

```bash
cd /home/usuario/material-comparator
docker-compose up -d
```

La aplicación estará disponible en `http://tu-vps-ip:3000`

---

## Opción 2: Despliegue Manual con Docker

### 1. Construir la imagen

```bash
docker build -t material-comparator:latest .
```

### 2. Ejecutar el contenedor

```bash
docker run -d \
  --name material-comparator \
  -p 3000:3000 \
  --restart unless-stopped \
  material-comparator:latest
```

---

## Opción 3: Con Nginx como Proxy Inverso (Producción)

### 1. Crear docker-compose.yml avanzado con Nginx

```bash
# Consulta el archivo docker-compose.nginx.yml
```

### 2. Ejecutar

```bash
docker-compose -f docker-compose.nginx.yml up -d
```

---

## Comandos Útiles

### Ver logs

```bash
docker-compose logs -f material-comparator
```

### Detener la aplicación

```bash
docker-compose down
```

### Reiniciar

```bash
docker-compose restart
```

### Limpiar volúmenes (cuidado)

```bash
docker-compose down -v
```

### Ver estado

```bash
docker-compose ps
```

---

## Configuración con SSL (HTTPS)

Para producción, configura un dominio con Let's Encrypt usando Nginx o Traefik.

### Con Traefik (Recomendado)

Consulta la documentación en el archivo `docker-compose.traefik.yml` si existe.

---

## Troubleshooting

### Puerto 3000 en uso

```bash
docker-compose down
docker-compose up -d
```

### Ver errores del contenedor

```bash
docker logs material-comparator
```

### Acceso denegado a Docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Variables de Entorno

Crea un archivo `.env` para configuración:

```
NODE_ENV=production
PORT=3000
```

Luego actualiza `docker-compose.yml` para usarlo:

```yaml
env_file: .env
```

---

## Backups y Actualizaciones

### Hacer backup

```bash
docker-compose exec material-comparator tar -czf backup.tar.gz dist/
```

### Actualizar código

```bash
cd /path/to/material-comparator
git pull origin main
docker-compose up -d --build
```

---

## Monitoreo

### Ver estadísticas

```bash
docker stats material-comparator
```

### Health check

El contenedor incluye un health check automático que verifica cada 30 segundos.

---

¡Tu aplicación está lista para producción! 🚀
