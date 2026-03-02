const express = require('express');
const { connectMongo } = require('./config/db');
const salesRoutes = require('./routes/salesRoutes');
require('dotenv').config();

const app = express();

// Middleware para entender JSON
app.use(express.json());

// Conectar a MongoDB
connectMongo();

// Usar las rutas modulares
// Esto significa que todas las rutas dentro de salesRoutes empezarán con /api/sales
app.use('/api/sales', salesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});