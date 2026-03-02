// config/db.js
const mysql = require('mysql2'); // Importamos el driver de MySQL

// Creamos el Pool de conexiones usando las variables del .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // <--- Aquí usamos el 3306 del .env
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Convertimos el pool para usar promesas (necesario para el async/await del server)
const promisePool = pool.promise();

// Exportamos el pool para que server.js pueda usarlo
module.exports = promisePool;