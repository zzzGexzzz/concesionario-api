const express = require('express');
const path = require('path');
require('dotenv').config();

const vehiculosRoutes = require('./routes/vehiculos');
const clientesRoutes = require('./routes/clientes');
const reservasRoutes = require('./routes/reservas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Truco para que el HTML encuentre el JS en la ruta exacta que pide el docente
app.use('/concesionario-api', express.static(path.join(__dirname, 'public')));
// Servir el resto de archivos estáticos (HTML y CSS) en la raíz
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/vehiculos', vehiculosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/reservas', reservasRoutes);

// Agrega '0.0.0.0' para que Railway acepte conexiones externas de internet
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});