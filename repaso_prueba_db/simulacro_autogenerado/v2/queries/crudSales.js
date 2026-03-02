/* * ARCHIVO: queries/crudSales.js
 * DESCRIPCIÓN: Operaciones CRUD individuales para la tabla 'sales'.
 */

const { pool } = require('../config/db');

const crudSales = {
    // 1. Obtener una sola venta por su ID (S001, etc.)
    getOne: async (id) => {
        const sql = 'SELECT * FROM sales WHERE id = ?';
        const [rows] = await pool.query(sql, [id]);
        return rows[0]; // Retorna solo el objeto de la venta
    },

    // 2. Actualizar una venta (Ejemplo: cambiar cantidad o fecha)
    update: async (id, data) => {
        const sql = `
            UPDATE sales 
            SET sale_date = ?, quantity = ?, invoice_num = ? 
            WHERE id = ?`;
        const params = [data.sale_date, data.quantity, data.invoice_num, id];
        const [result] = await pool.query(sql, params);
        return result;
    },

    // 3. Eliminar una venta por ID
    delete: async (id) => {
        const sql = 'DELETE FROM sales WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result;
    },

    // 4. INSERTAR una venta nueva individual (La joya de la corona)
    create: async (data) => {
        const sql = `
            INSERT INTO sales (id, sale_date, employee_id, customer_id, service_id, quantity, invoice_num) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            data.id, 
            data.sale_date, 
            data.employee_id, 
            data.customer_id, 
            data.service_id, 
            data.quantity, 
            data.invoice_num
        ];
        const [result] = await pool.query(sql, params);
        return result;
    }
};

module.exports = crudSales;