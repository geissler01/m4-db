const mysql = require('mysql2/promise'); // Usamos promise para manejar async/await
const mongoose = require('mongoose');
require('dotenv').config();

// Configuración de MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Configuración de MongoDB
const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Conectado (Auditoría)');
    } catch (error) {
        console.error('❌ Error en Mongo:', error);
    }
};

module.exports = { pool, connectMongo };