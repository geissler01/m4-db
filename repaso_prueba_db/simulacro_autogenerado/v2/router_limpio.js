/* * ARCHIVO: router.js
 * DESCRIPCIÓN: Punto de entrada del servidor Express. 
 * Conecta DBs, gestiona rutas y captura errores globales.
 */

const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');

// Importaciones de configuración y lógica
const { pool, connectMongo } = require('./config/db');
const ddlQueries = require('./queries/ddl');
const auditLogger = require('./queries/audit');
const seederQueries = require('./queries/seeder');
const reportQueries = require('./queries/reports');
const crudSales = require('./queries/crudSales');

dotenv.config();
const app = express();

// --- MIDDLEWARES DE CONFIGURACIÓN ---
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// --- FUNCIÓN DE ARRANQUE ---
const startServer = async () => {
    try {
        await connectMongo();
        await ddlQueries.initializeDatabase();
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor en: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error crítico:', error.message);
        process.exit(1);
    }
};

// --- RUTAS DE IMPORTACIÓN (POSTMAN FILES) ---
app.post('/import/:table', upload.single('archivo'), async (req, res, next) => {
    const { table } = req.params;
    if (!req.file) return res.status(400).json({ error: "Archivo no encontrado" });
    const tempPath = req.file.path;

    try {
        const rawData = fs.readFileSync(tempPath, 'utf8');
        const dataArray = JSON.parse(rawData);

        switch (table) {
            case 'categories': await seederQueries.seedCategories(dataArray); break;
            case 'companies':  await seederQueries.seedCompanies(dataArray); break;
            case 'customers':  await seederQueries.seedCustomers(dataArray); break;
            case 'services':   await seederQueries.seedServices(dataArray); break;
            case 'employees':  await seederQueries.seedEmployees(dataArray); break;
            case 'sales':      await seederQueries.seedSales(dataArray); break;
            default: throw new Error("Tabla no reconocida");
        }

        fs.unlinkSync(tempPath);
        await auditLogger.registerLog('SEED_DATA', `Carga masiva: ${table}`);
        res.json({ message: `Éxito: Datos cargados en ${table}` });

    } catch (err) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        next(err); // Pasamos el error al manejador global
    }
});

// --- RUTAS DE VENTAS (CRUD & SINGLE) ---

// Registro individual
app.post('/sales/single', async (req, res, next) => {
    try {
        await crudSales.create(req.body);
        await auditLogger.registerLog('SINGLE_INSERT', `Venta: ${req.body.id}`);
        res.status(201).json({ message: "Venta registrada" });
    } catch (err) {
        next(err);
    }
});

// Operaciones por ID (GET, PUT, DELETE)
app.route('/sales/:id')
    .get(async (req, res, next) => {
        try {
            const data = await crudSales.getOne(req.params.id);
            data ? res.json(data) : res.status(404).json({ error: "No encontrado" });
        } catch (err) { next(err); }
    })
    .put(async (req, res, next) => {
        try {
            await crudSales.update(req.params.id, req.body);
            await auditLogger.registerLog('UPDATE_SALE', `Editada: ${req.params.id}`);
            res.json({ message: "Venta actualizada" });
        } catch (err) { next(err); }
    })
    .delete(async (req, res, next) => {
        try {
            await crudSales.delete(req.params.id);
            await auditLogger.registerLog('DELETE_SALE', `Borrada: ${req.params.id}`);
            res.json({ message: "Venta eliminada" });
        } catch (err) { next(err); }
    });

// --- RUTAS DE REPORTES (BI) ---
app.get('/reports/:type', async (req, res, next) => {
    try {
        let data;
        if (req.params.type === 'ranking') data = await reportQueries.getEmployeeRanking();
        else if (req.params.type === 'categories') data = await reportQueries.getCategoryAnalysis();
        else return res.status(404).json({ error: "Reporte no válido" });

        res.json(data);
    } catch (err) { next(err); }
});

// --- MANEJO DE ERRORES Y 404 ---

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware Global de Errores (El "Colchón" de seguridad)
app.use((err, req, res, next) => {
    console.error("💥 Error interno:", err.stack);
    res.status(500).json({
        error: "Hubo un fallo en el servidor",
        message: err.message,
        sqlCode: err.code // Si es un error de MySQL, aquí vendrá el código
    });
});

startServer();