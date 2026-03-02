/* * ARCHIVO: queries/reports.js
 * DESCRIPCIÓN: Consultas de Inteligencia de Negocios (BI).
 * Transforma datos crudos en reportes legibles.
 */

const { pool } = require('../config/db');

const reportQueries = {
    /**
     * REPORTE 1: Ranking de Ventas por Empleado
     * Objetivo: Saber quién ha generado más ingresos monetarios.
     */
    getEmployeeRanking: async () => {
        const sql = `
            SELECT 
                e.name AS empleado,
                c.name AS empresa,
                SUM(s.quantity) AS total_unidades,
                SUM(s.quantity * ser.price) AS total_facturado
            FROM sales s
            JOIN employees e ON s.employee_id = e.id
            JOIN companies c ON e.company_id = c.id
            JOIN services ser ON s.service_id = ser.id
            GROUP BY e.id
            ORDER BY total_facturado DESC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * REPORTE 2: Análisis de Servicios por Categoría
     * Objetivo: Identificar qué áreas del negocio son las más rentables.
     */
    getCategoryAnalysis: async () => {
        const sql = `
            SELECT 
                cat.name AS categoria,
                COUNT(s.id) AS numero_ventas,
                SUM(s.quantity * ser.price) AS ingresos_totales
            FROM sales s
            JOIN services ser ON s.service_id = ser.id
            JOIN categories cat ON ser.category_id = cat.id
            GROUP BY cat.id
            ORDER BY ingresos_totales DESC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * REPORTE 3: Histórico de Ventas Detallado
     * Objetivo: Ver el detalle de cada factura con nombres de clientes y servicios.
     */
    getDetailedSales: async () => {
        const sql = `
            SELECT 
                s.id AS venta_id,
                s.sale_date AS fecha,
                cust.name AS cliente,
                ser.name AS servicio,
                s.quantity AS cantidad,
                (s.quantity * ser.price) AS subtotal,
                s.invoice_num AS factura
            FROM sales s
            JOIN customers cust ON s.customer_id = cust.id
            JOIN services ser ON s.service_id = ser.id
            ORDER BY s.sale_date DESC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }
};

module.exports = reportQueries;