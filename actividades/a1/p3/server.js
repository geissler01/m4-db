// llamando lo que necesito
const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const fs = require('fs');
const { parse } = require('csv-parse')

// aplicaicones intermedias
const app = express();
const upload = multer({
    dest: "uploads/",
});

// conexion a la basede datos
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    databse: "postgres-g1",
    password: "postgres-g1",
    port: 5440,
});

// testeo seguro
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("❌ Error conectando a la DB:", err.stack);
    } else {
        console.log("✅ DB lista y conectada a las:", res.rows[0].now);
    }
});

// // probando la conexion
// async function conectarDB() {
//     try {
//         await pool.connect();
//         console.log("¡Conexión exitosa a Postgres desde Docker!");

//         // Una consulta simple para probar
//         const res = await pool.query("SELECT NOW()");
//         console.log("Hora en la BD:", res.rows[0].now);

//         await pool.end();
//     } catch (err) {
//         console.error("Error de conexión:", err.stack);
//     }
// };
// conectarDB();

// despliegue del servidor
app.listen(3000, () =>{
    console.log('escuchando en el puerto:', 'http://localhost:3000')
})

// creando la tabla si no existe
pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    age INTEGER
    )
    `)

// creando el endpoint
app.post('/upload', upload.single('usuarios'), (req, res) =>{
    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const rows = [];
    
    fs.createReadStream(req.file.path)
    .pipe(parse({
        columns: true,
        trim: true
    }))
    .on('data', row => rows.push(row))
    .on('end', async () =>{
        try {
            if (rows.length){
                const values = rows.map(r => `('${r.nombre}', '${r.email}', '${r.edad}')`).join(',')
                await pool.query(`INSERT INTO usuarios (name, email, age) VALUES ${values}`)
            }
            res.json({
                ok: true,
                total: rows.length
            })
        } catch (error) {
            res.status(500).json({
                error: 'error insertando datos'
            })
        }
    })
});

// app.post('/upload', upload.single('usuarios'), (req, res) => {
//     if (!req.file) return res.status(400).send('No se subió ningún archivo.');

//     const rows = [];
    
//     fs.createReadStream(req.file.path)
//     .pipe(parse({ columns: true, trim: true }))
//     .on('data', row => rows.push(row))
//     .on('end', async () => {
//         try {
//             for (const row of rows) {
//                 // Usamos parámetros ($1, $2, $3) para que sea SEGURO
//                 const query = 'INSERT INTO usuarios (name, email, age) VALUES ($1, $2, $3)';
//                 const values = [row.nombre, row.email, row.edad];
                
//                 await pool.query(query, values);
//             }

//             res.json({
//                 ok: true,
//                 mensaje: "Usuarios insertados con éxito",
//                 total: rows.length
//             });
//         } catch (error) {
//         // IMPORTANTE: Esto te dirá el error real en tu terminal de Linux
//         console.log("--- ERROR EN POSTGRES ---");
//         console.error("Código:", error.code);     // Ejemplo: 23505 (duplicado)
//         console.error("Detalle:", error.detail);   // Ejemplo: La columna 'age' es tipo INT y mandaste string
//         console.error("Mensaje:", error.message);
        
//         res.status(500).json({
//             error: 'Error insertando datos',
//             detalles: error.message
//         });
//     } finally {
//         if (req.file) fs.unlinkSync(req.file.path);
//     }
//     });
// });


//// forma segura de testear
// pool.query('SELECT NOW()')
//   .then(() => console.log("✅ Conectado a Postgres en Docker"))
//   .catch(err => console.error("❌ Error de conexión inicial:", err.message));