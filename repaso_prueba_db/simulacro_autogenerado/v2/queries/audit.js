/* * ARCHIVO: queries/audit.js
 * DESCRIPCIÓN: Gestión de logs de auditoría en MongoDB (NoSQL).
 */

const mongoose = require('mongoose');

/**
 * DEFINICIÓN DEL ESQUEMA (Schema)
 * Aunque Mongo es flexible, definimos qué campos queremos obligatorios.
 */
const auditSchema = new mongoose.Schema({
    // Acción realizada (ej: 'INSERT_SALE', 'DELETE_SALE')
    action: { type: String, required: true },
    
    // Descripción o ID del registro afectado
    details: { type: String, required: true },
    
    // Fecha y hora automática
    timestamp: { type: Date, default: Date.now }
});

// Creamos el modelo basado en el esquema. 
// 'Audit' será el nombre de la colección en Mongo.
const Audit = mongoose.model('Audit', auditSchema);

const auditLogger = {
    /**
     * Función para guardar un log.
     * @param {string} action - Nombre de la operación.
     * @param {string} details - Información extra.
     */
    registerLog: async (action, details) => {
        try {
            // Creamos un nuevo documento en la colección
            await Audit.create({ action, details });
            console.log(`Log registrado en Mongo: ${action}`);
        } catch (error) {
            console.error('Error al registrar auditoría en Mongo:', error.message);
        }
    }
};

module.exports = auditLogger;