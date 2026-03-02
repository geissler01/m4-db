/**
 * ARCHIVO DE CONFIGURACIÓN DE BASES DE DATOS
 * Propósito: Centralizar las conexiones a MySQL y MongoDB.
 */

// Importamos mysql2 con soporte para Promesas (async/await)
const mysql = require('mysql2/promise');

// Importamos mongoose para manejar la base de datos NoSQL (Auditoría)
const mongoose = require('mongoose');

// Cargamos las variables del archivo .env a la memoria del proceso
require('dotenv').config();

/**
 * CONFIGURACIÓN DE MYSQL (Pool de Conexiones)
 * Usamos un 'Pool' porque es más eficiente: mantiene varias conexiones abiertas
 * y las reutiliza, evitando que el servidor se caiga por exceso de peticiones.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Lee el host del .env
    user: process.env.DB_USER,         // Lee el usuario del .env
    password: process.env.DB_PASS,     // Lee la contraseña del .env
    database: process.env.DB_NAME,     // Lee el nombre de la DB del .env
    waitForConnections: true,          // Si no hay conexiones libres, espera una
    connectionLimit: 10,               // Máximo de conexiones simultáneas
    queueLimit: 0                      // Sin límite de espera en cola
});

/**
 * CONFIGURACIÓN DE MONGODB (Conexión Asíncrona)
 * Creamos una función para intentar conectar a Mongo y avisar por consola.
 */
const connectMongo = async () => {
    try {
        // Intentamos la conexión usando la URI del .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conexión exitosa a MongoDB (Módulo de Auditoría)');
    } catch (error) {
        // Si hay un error (ej: Mongo está apagado), lo mostramos claramente
        console.error('❌ Error de conexión en MongoDB:', error.message);
        // Opcional: Podrías detener el proceso si Mongo es vital
        // process.exit(1);
    }
};

// Exportamos el 'pool' de MySQL y la función de conexión de Mongo
// para que puedan ser usados en el router.js o en las queries.
module.exports = {
    pool,
    connectMongo
};