# Material Comparator 🏭

Comparador avanzado de materiales industriales con bases de datos completas de propiedades mecánicas, térmicas y de resistencia a la corrosión.

## ✨ Características

- 📊 Análisis visual comparativo con gráficos interactivos (Radar, Barras, Líneas)
- 🔬 Base de datos de 25+ materiales industriales
- 📈 Propiedades mecánicas, térmicas y de corrosión
- 🌡️ Análisis de rango de temperatura
- 💪 Resistencia a diferentes medios corrosivos
- 📋 Filtrados avanzados por grupo, estándar y propiedades
- 🎨 Interfaz moderna con Tailwind CSS
- 📱 Totalmente responsiva
- 🚀 Optimizada para producción

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Gráficos**: Recharts
- **Estilos**: Tailwind CSS
- **Contenedorización**: Docker
- **Orquestación**: Docker Compose

## 📦 Instalación

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de build
npm run preview
```

### Docker

```bash
# Construcción
docker build -t material-comparator:latest .

# Ejecución
docker run -p 3000:3000 material-comparator:latest

# Con Docker Compose
docker-compose up -d
```

## 📚 Materiales Incluidos

- ASTM A53 Gr.B
- ASTM A106 Gr.B/C
- ASTM A333 Gr.6
- ASTM A334
- ASTM A335
- ASTM A369
- ASTM B111
- API 5L
- Y muchos más...

## 🌍 Despliegue a VPS

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones completas de despliegue.

### Rápido

```bash
# En tu VPS
git clone <tu-repo>
cd material-comparator
docker-compose up -d
```

Acceso: `http://tu-vps-ip:3000`

## 📊 Estructura del Proyecto

```
material-comparator/
├── src/
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── material-comparator.jsx # Componente principal
├── index.html            # HTML base
├── vite.config.js        # Configuración Vite
├── package.json          # Dependencias
├── Dockerfile            # Imagen Docker
├── docker-compose.yml    # Orquestación Docker
├── DEPLOYMENT.md         # Guía de despliegue
└── README.md             # Este archivo
```

## 🔧 Configuración

### Variables de Entorno

```env
NODE_ENV=production
PORT=3000
```

### Docker Compose

Personaliza `docker-compose.yml`:

```yaml
ports:
  - "3000:3000"  # Puerto personalizado
restart: unless-stopped
```

## 🐛 Troubleshooting

### Error de puertos

```bash
docker-compose down
docker-compose up -d
```

### Limpiar volúmenes

```bash
docker-compose down -v
```

### Ver logs

```bash
docker-compose logs -f
```

## 📈 Monitoreo

```bash
# Estadísticas en tiempo real
docker stats material-comparator

# Health check
curl http://localhost:3000
```

## 🔐 Seguridad

Para producción:

- ✅ Implementa SSL/HTTPS (ver DEPLOYMENT.md)
- ✅ Usa variables de entorno para secretos
- ✅ Mantén imágenes Docker actualizadas
- ✅ Configurar límites de recursos

## 📝 Licencia

MIT

## 👤 Autor

Desarrollado para análisis industrial de materiales.

---

**¡Listo para producción! 🚀**
