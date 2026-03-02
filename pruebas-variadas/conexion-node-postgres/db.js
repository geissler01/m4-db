// 1. mestrigo solo la clase 'Pool' de la libreria 'pg'
const { Pool } = require('pg');

// 2. Cargamos dotenv para leer el archivo .env y lo pase a process.env, esto sirve para el process.env
require('dotenv').config();

// 3. creamos una instancia de Pool
const pool = new Pool({
    user: process.env.DB_USER,  // Quién se concecta
    host: process.env.DB_HOST,  // donde esta la base (en este caso mi pc)
    database: process.env.DB_NAME,  // a que base de datos apunta
    password: process.env.DB_PASSWORD   ,      // la llave o contraseña
    port: process.env.DB_PORT,      // el puerto (5432)
})

// 4. "Escuchador de eventos"
pool.on('connect', () => {
    console.log('conectado a postgres')
})

// 5. exportamos
module.exports = pool;
