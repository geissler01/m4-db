/* * ARCHIVO: queries/seeder.js
 * DESCRIPCIÓN: Funciones para insertar datos maestros y transaccionales.
 */

const { pool } = require('../config/db');

const seederQueries = {
    // 1. Cargar Categorías
    seedCategories: async (dataArray) => {
        const sql = 'INSERT INTO categories (id, name) VALUES (?, ?)';
        for (let item of dataArray) {
            await pool.query(sql, [item.id, item.ServiceCategory]);
        }
    },

    // 2. Cargar Empresas
    seedCompanies: async (dataArray) => {
        const sql = 'INSERT INTO companies (nit, name) VALUES (?, ?)';
        for (let item of dataArray) {
            await pool.query(sql, [item.CompanyNIT, item.CompanyName]);
        }
    },

    // 3. Cargar Clientes
    seedCustomers: async (dataArray) => {
        const sql = 'INSERT INTO customers (id, name, email) VALUES (?, ?, ?)';
        for (let item of dataArray) {
            await pool.query(sql, [item.id, item.CustomerName, item.CustomerEmail]);
        }
    },

    // 4. Cargar Empleados (Requiere que existan las empresas)
    seedEmployees: async (dataArray) => {
        const sql = 'INSERT INTO employees (id, name, email, company_id) VALUES (?, ?, ?, (SELECT id FROM companies WHERE nit = ?))';
        for (let item of dataArray) {
            await pool.query(sql, [item.id, item.EmployeeName, item.EmployeeEmail, item.company_id]);
        }
    },

    // 5. Cargar Servicios (Requiere que existan las categorías)
    seedServices: async (dataArray) => {
        const sql = 'INSERT INTO services (id, name, category_id, price) VALUES (?, ?, ?, ?)';
        for (let item of dataArray) {
            await pool.query(sql, [item.id, item.ServiceName, item.category_id, item.Price]);
        }
    },

    // --- 6. NUEVA FUNCIÓN: Cargar Ventas ---
    // Asegúrate de que los nombres coincidan con tu archivo (SaleID, Date, etc.)
    seedSales: async (dataArray) => {
        const sql = `INSERT INTO sales (id, sale_date, employee_id, customer_id, service_id, quantity, invoice_num) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        for (let item of dataArray) {
            await pool.query(sql, [
                item.SaleID,       // Mapea con el ID de la venta (ej: S001)
                item.Date,         // Mapea con la fecha
                item.employee_id,  // ID del empleado (Foreign Key)
                item.customer_id,  // ID del cliente (Foreign Key)
                item.service_id,   // ID del servicio (Foreign Key)
                item.Quantity,     // Cantidad vendida
                item.Invoice       // Número de factura
            ]);
        }
    }
};

module.exports = seederQueries;