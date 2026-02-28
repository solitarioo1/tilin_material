// Servidor básico para servir archivos estáticos de la carpeta dist
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir todas las rutas al index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
