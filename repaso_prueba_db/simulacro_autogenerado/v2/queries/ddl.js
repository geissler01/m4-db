/* * ARCHIVO: queries/ddl.js
 * DESCRIPCIÓN: Definición de la estructura de tablas para MySQL.
 */

const { pool } = require('../config/db');

const ddlQueries = {
    // Esta función encapsula la creación de toda la base de datos
    initializeDatabase: async () => {
        try {
            // Tabla: categories
            await pool.query(`
                CREATE TABLE IF NOT EXISTS categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) NOT NULL UNIQUE
                ) ENGINE=InnoDB;
            `);

            // Tabla: companies
            await pool.query(`
                CREATE TABLE IF NOT EXISTS companies (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nit VARCHAR(20) NOT NULL UNIQUE,
                    name VARCHAR(100) NOT NULL
                ) ENGINE=InnoDB;
            `);

            // Tabla: customers
            await pool.query(`
                CREATE TABLE IF NOT EXISTS customers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE
                ) ENGINE=InnoDB;
            `);

            // Tabla: employees (Relacionada con companies)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS employees (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    company_id INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    CONSTRAINT fk_employee_company 
                        FOREIGN KEY (company_id) REFERENCES companies(id) 
                        ON DELETE CASCADE
                ) ENGINE=InnoDB;
            `);

            // Tabla: services (Relacionada con categories)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS services (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    category_id INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    CONSTRAINT fk_service_category 
                        FOREIGN KEY (category_id) REFERENCES categories(id)
                ) ENGINE=InnoDB;
            `);

            // Tabla: sales (Relacionada con employees, customers y services)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS sales (
                    id VARCHAR(10) PRIMARY KEY,
                    sale_date DATE NOT NULL,
                    employee_id INT NOT NULL,
                    customer_id INT NOT NULL,
                    service_id INT NOT NULL,
                    quantity INT NOT NULL DEFAULT 1,
                    invoice_num VARCHAR(20) NOT NULL UNIQUE,
                    CONSTRAINT fk_sale_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
                    CONSTRAINT fk_sale_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
                    CONSTRAINT fk_sale_service FOREIGN KEY (service_id) REFERENCES services(id)
                ) ENGINE=InnoDB;
            `);

            console.log("Estructura DDL verificada en MySQL");
            return true;
        } catch (error) {
            console.error("Error en inicialización DDL:", error.message);
            throw error;
        }
    }
};

module.exports = ddlQueries;