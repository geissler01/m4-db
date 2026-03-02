const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const { Pool } = require('pg');
const fs = require('fs');
// conection mongo
const { MongoClient } = require('mongodb');
const { create } = require('domain');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const app = express();
const upload = multer({ dest: 'uploads/' });

const pool = new Pool({
    user: 'user_andrescortes',
    host: '157.180.40.190',
    database: 'db_ejemplo',
    password: 'scORHWprCvp26Gz1zwPQgSsokHyPC2',
    port: 5432,
});

// conection mongo a DB
let logsCollection;
async function connectDB() {
    try {
        // Coneción
        await client.connect();
        console.log('Conectado');

        //DB
        const db = client.db('app');

        // colección en Mongo
        logsCollection = db.collection('logs');
        console.log('logs creado');

    } catch (error) {
        console.log(error);
    }
}
connectDB();

// mongo function
async function saveLog(action) {
    try {
        await logsCollection.insertOne({
            action,
            created_at: new Date()
        });
        console.log(`log ${action} agregado`)
        
    } catch (error) {
        console.log('error en saveLog');
        
    }
}

app.post('/api/upload/cargos', upload.single('archivo'), (req, res) => {
    const rows = [];
    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {
                if (rows.length) {
                    const values = rows.map(r => `('${r.id}','${r.nombre}')`).join(',');

                    await pool.query(`INSERT INTO cargos (id, nombre) VALUES ${values}`);
                    saveLog('INSERT');
                }
                res.json({ ok: true, total: rows.length });
            } catch (error) {
                res.status(500).json({ error: 'internal server error' });
            }
        });
});


app.post('/api/upload/autores', upload.single('archivo'), (req, res) => {
    const rows = [];
    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {
                if (rows.length) {
                    const values = rows.map(r => `('${r.id}','${r.nombre}')`).join(',');

                    await pool.query(`INSERT INTO autores (id, nombre) VALUES ${values}`);
                    saveLog('INSERT');
                }
                res.json({ ok: true, total: rows.length });
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: 'internal server error' });

            }
        });
});

// endpoint logs mongo
app.get('/logs', async (req,res) =>{
    try {
        const logs = await logsCollection
            .find()
            .sort({ created_at : -1})
            .toArray();
        
        res.json(logs)
    } catch (error) {
        res.status(500).json({ error: 'internal server error mongoDB' });
    }
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
})