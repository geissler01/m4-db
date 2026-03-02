// src/queries.js

const queries = {
    // --- NIVEL 1: BÁSICAS ---
    1: `SELECT u.name, u.email, o.order_number FROM users u JOIN orders o ON u.id = o.user_id WHERE u.id = 3`,
    2: `SELECT u.name, o.order_number, o.order_date FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email = 'cristian36@yahoo.es'`,
    3: `SELECT p.name AS name_product, c.name AS category FROM products p JOIN categories c ON p.category_id = c.id`,
    4: `SELECT u.* FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL`,
    5: `SELECT u.name AS name_user, SUM(o.total) AS total_spent FROM users u JOIN orders o ON u.id = o.user_id WHERE u.id = 18`,
    6: `SELECT status, COUNT(*) AS total_pedidos FROM orders GROUP BY status`,
    7: `SELECT p.name, p.sale_price, c.name AS category FROM products p JOIN categories c ON p.category_id = c.id WHERE c.name = 'Electrónica' ORDER BY p.sale_price DESC`,
    8: `SELECT o.id AS order_id, p.id AS product_id, p.name, op.quantity FROM orders o JOIN order_product op ON op.order_id = o.id JOIN products p ON op.product_id = p.id WHERE o.id = 10`,
    9: `SELECT u.name, u.city, COUNT(DISTINCT o.id) AS total_orders FROM users u JOIN orders o ON u.id = o.user_id WHERE u.city = 'El Quintana' GROUP BY u.id`,
    10: `SELECT u.id, u.name, AVG(o.total) AS avg_ticket FROM users u JOIN orders o ON o.user_id = u.id GROUP BY u.id`,

    // --- NIVEL 2: INTERMEDIAS ---
    11: `SELECT o.order_number, o.order_date, p.name, op.price_at_purchase FROM orders o JOIN order_product op ON o.id = op.order_id JOIN products p ON op.product_id = p.id`,
    12: `SELECT c.name AS category, SUM(op.quantity * op.price_at_purchase) AS total_sales FROM categories c JOIN products p ON c.id = p.category_id JOIN order_product op ON p.id = op.product_id JOIN orders o ON o.id = op.order_id WHERE o.status IN ('shipped', 'paid') GROUP BY c.name ORDER BY total_sales DESC`,
    13: `SELECT DISTINCT p.name FROM users u JOIN orders o ON o.user_id = u.id JOIN order_product op ON op.order_id = o.id JOIN products p ON op.product_id = p.id WHERE u.id = 155`,
    14: `SELECT p.name, SUM(op.quantity) AS units_sold FROM products p JOIN order_product op ON p.product_id = p.id JOIN orders o ON o.id = op.order_id WHERE o.status IN ('shipped', 'paid') GROUP BY p.id ORDER BY units_sold DESC LIMIT 5`,
    15: `SELECT p.name, MAX(o.order_date) AS last_sale FROM products p JOIN order_product op ON p.product_id = op.id JOIN orders o ON op.order_id = o.id GROUP BY p.id ORDER BY last_sale DESC`,
    16: `SELECT DISTINCT u.name FROM users u JOIN orders o ON o.user_id = u.id JOIN order_product op ON op.order_id = o.id JOIN products p ON op.product_id = p.id WHERE p.name LIKE '%ga%'`,
    17: `SELECT DATE(order_date) AS day, SUM(total) AS daily_income FROM orders WHERE status IN ('shipped', 'paid') GROUP BY day ORDER BY day`,
    18: `SELECT c.name FROM categories c JOIN products p ON c.id = p.category_id LEFT JOIN order_product op ON p.id = op.product_id WHERE op.id IS NULL`,
    19: `SELECT u.name, AVG(o.total) AS ticket_promedio FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status IN ('shipped', 'paid') GROUP BY u.id`,
    20: `SELECT DISTINCT p.name FROM products p JOIN order_product op ON p.id = op.product_id JOIN orders o ON op.order_id = o.id WHERE o.status = 'cancelled'`,

    // --- NIVEL 3: COMPLEJAS ---
    21: `SELECT u.name, u.city, o.order_number, p.name, c.name AS cat, op.quantity, (op.quantity * op.price_at_purchase) AS subtotal FROM users u JOIN orders o ON u.id = o.user_id JOIN order_product op ON op.order_id = o.id JOIN products p ON op.product_id = p.id JOIN categories c ON p.category_id = c.id`,
    22: `SELECT SUM(op.quantity * op.price_at_purchase) FROM users u JOIN orders o ON u.id = o.user_id JOIN order_product op ON o.id = op.order_id JOIN products p ON op.product_id = p.id JOIN categories c ON p.category_id = c.id WHERE c.name LIKE '%Ropa%' AND u.city = 'O Lázaro del Penedès'`,
    23: `SELECT u.name, SUM(o.total) AS total_spent FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status IN ('shipped', 'paid') GROUP BY u.id ORDER BY total_spent DESC LIMIT 1`,
    24: `SELECT p.name FROM products p LEFT JOIN order_product op ON p.id = op.product_id WHERE op.id IS NULL`,
    25: `SELECT SUM((op.price_at_purchase - p.purchase_price) * op.quantity) AS real_profit FROM order_product op JOIN products p ON op.product_id = p.id JOIN orders o ON op.order_id = o.id WHERE o.status IN ('shipped', 'paid')`,
    26: `SELECT DISTINCT u.name FROM users u JOIN orders o ON u.id = o.user_id JOIN order_product op ON o.id = op.order_id JOIN products p ON op.product_id = p.id JOIN categories c ON p.category_id = c.id WHERE c.name LIKE '%Videojuegos%' AND u.id NOT IN (SELECT o2.user_id FROM orders o2 JOIN order_product op2 ON o2.id = op2.order_id JOIN products p2 ON op2.product_id = p2.id JOIN categories c2 ON p2.category_id = c2.id WHERE c2.name LIKE '%Hogar%')`,
    27: `SELECT u.city, SUM(o.total) AS income FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.city ORDER BY income DESC LIMIT 3`,
    28: `SELECT o.order_number, COUNT(DISTINCT op.product_id) AS variety FROM orders o JOIN order_product op ON o.id = op.order_id GROUP BY o.id ORDER BY variety DESC LIMIT 1`,
    29: `SELECT p.name, p.sale_price, MIN(op.price_at_purchase) AS lowest_historic FROM products p JOIN order_product op ON p.id = op.product_id GROUP BY p.id HAVING lowest_historic < p.sale_price`,
    30: `SELECT u.name, o.order_date, op.price_at_purchase FROM users u JOIN orders o ON u.id = o.user_id JOIN order_product op ON o.id = op.order_id WHERE op.product_id = 100`,

    // --- NIVEL 4: ANALÍTICA ---
    31: `SELECT u.name, SUM(o.total) AS total FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id HAVING total > (SELECT AVG(total) FROM orders)`,
    32: `SELECT p.name, SUM(op.quantity * op.price_at_purchase) AS total_sales FROM products p JOIN order_product op ON p.id = op.product_id GROUP BY p.id HAVING total_sales > (0.01 * (SELECT SUM(quantity * price_at_purchase) FROM order_product))`,
    33: `SELECT u.name, MAX(o.order_date) AS last_purchase FROM users u JOIN orders o ON u.id = o.user_id WHERE u.id NOT IN (SELECT user_id FROM orders WHERE order_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)) GROUP BY u.id`,
    34: `SELECT u.name, SUM(o.total) AS total, CASE WHEN SUM(o.total) > 5000 THEN 'VIP' WHEN SUM(o.total) BETWEEN 1000 AND 5000 THEN 'Frecuente' ELSE 'Regular' END AS rango FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id`,
    35: `SELECT YEAR(order_date) AS anio, MONTH(order_date) AS mes, SUM(total) AS total FROM orders GROUP BY anio, mes ORDER BY total DESC LIMIT 1`,
    36: `SELECT o.order_number, p.name, p.stock FROM orders o JOIN order_product op ON o.id = op.order_id JOIN products p ON op.product_id = p.id WHERE o.status = 'pending' AND p.stock < 5`,
    37: `SELECT c.name, (SUM(op.quantity * op.price_at_purchase) * 100.0 / (SELECT SUM(quantity * price_at_purchase) FROM order_product)) AS percent FROM categories c JOIN products p ON c.id = p.category_id JOIN order_product op ON p.id = op.product_id GROUP BY c.id`,
    38: `SELECT u.city, SUM(o.total) AS city_total, ROUND(SUM(o.total) * 100.0 / (SELECT SUM(total) FROM orders), 2) AS percent FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.city`,
    39: `SELECT MONTH(order_date) AS mes, COUNT(CASE WHEN status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*) AS cancellation_rate FROM orders GROUP BY mes`,
    40: `SELECT op1.product_id AS A, op2.product_id AS B, COUNT(*) AS frequency FROM order_product op1 JOIN order_product op2 ON op1.order_id = op2.order_id WHERE op1.product_id < op2.product_id GROUP BY A, B ORDER BY frequency DESC LIMIT 10`
};

module.exports = queries;
