const { pool } = require('../config/db'); // Importamos la conexión de MySQL

// Función para obtener todas las ventas
const getAllSales = async (req, res) => {
    try {
        // Hacemos la query directamente aquí como pediste (sin models por ahora)
        const [rows] = await pool.query('SELECT * FROM sales');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
    }
};

// Función para crear una venta
const createSale = async (req, res) => {
    const { id, date, employee_id, customer_id, service_id, quantity, invoice } = req.body;
    try {
        const query = `INSERT INTO sales (id, sale_date, employee_id, customer_id, service_id, quantity, invoice_num) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.query(query, [id, date, employee_id, customer_id, service_id, quantity, invoice]);

        // Aquí es donde luego llamaremos a la auditoría de Mongo
        res.status(201).json({ message: 'Venta creada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear venta', error: error.message });
    }
};

module.exports = {
    getAllSales,
    createSale
};