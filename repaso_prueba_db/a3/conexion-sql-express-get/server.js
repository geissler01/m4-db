// 1. IMPORTACIÓN DE MÓDULOS
const express = require('express'); // El framework para crear el servidor y manejar rutas
require('dotenv').config(); // Carga las variables del archivo .env en process.env
const db = require('./config/db'); // Importa la conexión a la base de datos que configuraste, que hay en ese archivo, este el el pool de conexion
const queries = require('./src/queries'); // Importa el objeto que contiene tus 40 consultas SQL

// 2. CONFIGURACIÓN DE LA APP
const app = express(); // Instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Define el puerto (usa el del .env o el 3000 por defecto)

// 3. MIDDLEWARES
app.use(express.json()); // Permite que el servidor entienda y procese datos en formato JSON

// Test de conexión "ligero"
db.query('SELECT 1')
    .then(() => {
        console.log("✅ Conexión establecida con éxito.");
    })
    .catch(err => {
        console.error("❌ Error de conexión:", err.message);
    });

// 4. RUTA DINÁMICA DE CONSULTAS
// Usamos un parámetro ":id" para saber qué número de consulta del taller se quiere ejecutar
app.get('/consultas/:id', async (req, res) => {
    const queryId = req.params.id; // Captura el número enviado en la URL (ej: /consultas/32)
    console.log(queryId)
    const sql = queries[queryId]; // Busca en tu objeto queries el string SQL correspondiente

    // posibilidad en caso de que un dato en la consulta sea dinamico
    // localhost: 3000 / consultas / 1 ? param = 3
    // const valor = req.query.param; // Captura el 3
    // const [rows] = await db.query(sql, [valor]); // Envía el 3 al signo ?
    // Capturamos un parámetro opcional de la URL (ej: ?p=3)
    // const parametroExterno = req.query.p;

    // Validación: Si el ID no existe en nuestro archivo de consultas
    if (!sql) {
        return res.status(404).json({
            success: false,
            message: `La consulta número ${queryId} no existe en el taller.`
        });
    }

    try {
        // Ejecución: db.query devuelve un array donde el primer elemento [rows] son los datos
        const [rows] = await db.query(sql);
        // const [rows] = await db.query(sql, [parametroExterno]); por si llegase a plantear

        // Respuesta exitosa al cliente
        res.status(200).json({
            success: true,
            total_results: rows.length,
            data: rows
        });
    } catch (error) {
        // Manejo de errores de base de datos (sintaxis SQL, conexión, etc.)
        console.error("Error en la consulta:", error.message);
        res.status(500).json({
            success: false,
            message: "Error al ejecutar la consulta en la base de datos.",
            error: error.message
        });
    }
});

// 5. INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Presiona Ctrl+C para detenerlo`);
});