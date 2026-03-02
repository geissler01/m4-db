/* * ARCHIVO: router.js
 * DESCRIPCIÓN: Punto de entrada del servidor Express. 
 * Conecta las bases de datos e inicializa la estructura DDL.
 */

// 1. Importación de módulos principales
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer'); // Para manejar la subida de archivos
const fs = require('fs'); // Para leer archivos del sistema

// 2. Importación de nuestras configuraciones y consultas
const { pool, connectMongo } = require('./config/db');
const ddlQueries = require('./queries/ddl');
const auditLogger = require('./queries/audit'); // <-- Nuevo: Importamos el logger de Mongo
const reportQueries = require('./queries/reports');
const seederQueries = require('./queries/seeder');
const crudSales = require('./queries/crudSales');

// Cargamos las variables de entorno del archivo .env
dotenv.config();

// Inicializamos la aplicación Express
const app = express();

// Middleware para que el servidor pueda leer archivos JSON en el cuerpo de las peticiones (req.body)
app.use(express.json());

// CONFIGURACIÓN DE MULTER: Guardará los archivos temporalmente en la carpeta /uploads
    const upload = multer({ dest: 'uploads/' });

/**
 * FUNCIÓN DE ARRANQUE (Bootstrap)
 * Esta función asíncrona asegura que las bases de datos estén listas 
 * antes de que el servidor empiece a escuchar peticiones.
 */
const startServer = async () => {
    try {
        // Conectamos a MongoDB para el módulo de auditoría
        await connectMongo();

        // Ejecutamos la creación de tablas en MySQL (DDL)
        // Esto llama a la función que definimos en queries/ddl.js
        await ddlQueries.initializeDatabase();

        // Si todo lo anterior sale bien, el servidor se activa
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
            console.log('Presiona Ctrl+C para detener el servidor');
        });

    } catch (error) {
        // Si hay un fallo crítico en la conexión o el DDL, el servidor no arranca
        console.error('Fallo crítico al iniciar el servidor:', error.message);
        process.exit(1); // Detiene el proceso de Node.js
    }
};

// --- SECCIÓN DE RUTAS (ENDPOINTS) --- PROBANDO A MONGO

/**
 * ENDPOINT: GET /test-log
 * PROPÓSITO: Probar manualmente que Mongo está guardando datos.
 */
app.get('/test-log', async (req, res) => {
    try {
        // Llamamos a la función de auditoría
        await auditLogger.registerLog('MANUAL_TEST', 'Se activó la ruta de prueba desde el navegador/Postman');
        
        res.json({ message: "Log registrado en MongoDB exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de prueba para verificar que el servidor responde
app.get('/status', (req, res) => {
    res.json({
        message: "Servidor operativo",
        database: "MySQL & MongoDB conectadas"
    });
});

// --- ENDPOINT DE IMPORTACIÓN (POSTMAN FORM-DATA) ---

/**
 * IMPORTANTE: En Postman usa: Body > form-data
 * Key: "archivo" (tipo File)
 * Endpoint: /import/categories, /import/companies, etc.
 */
app.post('/import/:table', upload.single('archivo'), async (req, res) => {
    const { table } = req.params;
    console.log(table, ', tabla intentada')

    // 1. Validar que el archivo fue subido
    if (!req.file) {
        return res.status(400).json({ error: "No se seleccionó ningún archivo en Postman" });
    }

    const tempPath = req.file.path; // Ruta temporal donde Multer guardó el archivo

    try {
        const rawData = fs.readFileSync(tempPath, 'utf8');
        
        // --- NUEVA LÓGICA PARA CSV ---
        const lines = rawData.split('\n');
        const headers = lines[0].split(','); // Sacamos los títulos: id, ServiceCategory...
        const dataArray = [];

        // Recorremos desde la línea 1 (omitimos encabezado)
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Ignorar líneas vacías
            
            const values = lines[i].split(',');
            const row = {};
            
            // Creamos un objeto dinámico vinculando Header con Valor
            headers.forEach((header, index) => {
                row[header.trim()] = values[index].trim();
            });
            dataArray.push(row);
        }

        // 3. Switch para ejecutar la carga según la tabla
        switch (table) {
            case 'categories': await seederQueries.seedCategories(dataArray); break;
            case 'companies':  await seederQueries.seedCompanies(dataArray); break;
            case 'customers':  await seederQueries.seedCustomers(dataArray); break;
            case 'services':   await seederQueries.seedServices(dataArray); break;
            case 'employees':  await seederQueries.seedEmployees(dataArray); break;
            case 'sales':      await seederQueries.seedSales(dataArray); break;
            default: 
                fs.unlinkSync(tempPath); // Borrar archivo si la tabla no existe
                return res.status(404).send("Tabla no reconocida");
        }

        // 4. Borrar el archivo temporal de la carpeta /uploads para no llenar el disco
        fs.unlinkSync(tempPath);

        // 5. Auditoría en MongoDB
        await auditLogger.registerLog('IMPORT_DATA', `Carga exitosa en tabla ${table} via Postman`);
        
        res.json({ message: `¡Éxito! Datos cargados en ${table}` });

    } catch (err) {
        // Si hay error, borrar el archivo temporal también
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        console.error(`--- ERROR SQL EN TABLA ${table} ---`);
        console.error("Mensaje:", err.sqlMessage || err.message);

        res.status(500).json({
            error: "Fallo en la base de datos o en el formato del JSON",
            sqlCode: err.code,
            details: err.sqlMessage
        });
    }
});

/**
 * ENDPOINT: GET /reports/:type
 * PROPÓSITO: Obtener diferentes reportes de analítica.
 * Tipos disponibles: ranking, categories, detailed
 */
app.get('/reports/:type', async (req, res) => {
    const { type } = req.params;

    try {
        let data;
        
        // Selección del reporte basado en el parámetro de la URL
        switch (type) {
            case 'ranking':
                data = await reportQueries.getEmployeeRanking();
                break;
            case 'categories':
                data = await reportQueries.getCategoryAnalysis();
                break;
            case 'detailed':
                data = await reportQueries.getDetailedSales();
                break;
            default:
                return res.status(404).json({ error: "Reporte no encontrado" });
        }

        // Auditoría en MongoDB (Docker)
        // Registramos qué reporte se consultó y cuántos resultados devolvió
        await auditLogger.registerLog('REPORT_QUERY', `Consulta generada: ${type}. Registros: ${data.length}`);

        res.json({
            status: "success",
            report_type: type,
            count: data.length,
            data: data
        });

    } catch (err) {
        console.error(`Error en reporte ${type}:`, err.message);
        res.status(500).json({ error: "Error al generar el reporte", details: err.message });
    }
});


// --- SECCIÓN CRUD INDIVIDUAL DE VENTAS ---

// Obtener, Actualizar o Eliminar una venta por su ID
app.route('/sales/:id')
    .get(async (req, res) => {
        try {
            const data = await crudSales.getOne(req.params.id);
            if (!data) return res.status(404).send("Venta no encontrada");
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .put(async (req, res) => {
        try {
            const result = await crudSales.update(req.params.id, req.body);
            
            // Auditoría en MongoDB
            await auditLogger.registerLog('UPDATE_SALE', `Venta editada: ${req.params.id}`);
            
            res.json({ message: "Venta actualizada correctamente", rows: result.affectedRows });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const result = await crudSales.delete(req.params.id);
            
            // Auditoría en MongoDB
            await auditLogger.registerLog('DELETE_SALE', `Venta eliminada: ${req.params.id}`);
            
            res.json({ message: "Venta eliminada con éxito", rows: result.affectedRows });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

/**
 * ENDPOINT: POST /sales/single
 * solo para INSERT INTO
 */
app.post('/sales/insert', async (req, res) => {
    try {
        // LLAMADA 1: Insertamos en MySQL usando la nueva función de crudSales
        const result = await crudSales.create(req.body);

        // LLAMADA 2: Auditamos en MongoDB (Docker) usando el logger que ya tenías
        await auditLogger.registerLog('SINGLE_INSERT', `Venta creada manualmente: ${req.body.id}`);

        res.status(201).json({
            message: "¡Venta creada y registrada en auditoría!",
            id: req.body.id
        });

    } catch (err) {
        // Si MySQL falla (ej: ID duplicado), capturamos el error aquí
        console.error("Error en MySQL:", err.sqlMessage);
        res.status(500).json({ error: "Fallo al insertar", detail: err.sqlMessage });
    }
});

// Iniciamos el proceso de arranque
startServer();