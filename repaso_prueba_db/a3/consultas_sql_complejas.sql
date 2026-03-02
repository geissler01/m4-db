-- TALLER DE CONSULTAS SQL POR NIVELES

-- NIVEL 1: CONSULTAS BÁSICAS Y RELACIONES DIRECTAS (2 TABLAS)
-- 1. Listar el nombre de un usuario (el que tu quieras), su correo electrónico y el código (order_number) de todos los pedidos que han realizado.
SELECT u.name, u.email, o.order_number
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id = 3;
-- 2. Obtener todos los pedidos (código y fecha) realizados por un usuario con un correo electrónico específico (ej: isamel@pedrito.es).
SELECT u.name, o.order_number, o.order_date
FROM orders o 
JOIN users u ON o.user_id = u.id
WHERE u.email = 'cristian36@yahoo.es';
-- 3. Mostrar el nombre de cada producto junto con el nombre de la categoría a la que pertenece.
SELECT p.name AS name_product, c.name AS category
FROM products p 
JOIN categories c ON p.category_id = c.id;
-- 4. Obtener una lista de los usuarios que se han registrado en el sistema pero que nunca han realizado una compra.
SELECT u.*, o.id AS id_order
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
-- 5. Calcular el monto total gastado de un usuario (el que ustedes elijan) en toda su historia, mostrando el nombre del usuario y el total.
SELECT u.name AS name_user, SUM(o.total) AS total_expensed
FROM users u 
JOIN orders o ON u.id = o.user_id
WHERE u.id = 18;
-- 6. Contar cuántos pedidos existen actualmente clasificados por cada estado (status).
SELECT o.status AS oder_status, SUM(op.quantity) AS quantity_by_status
FROM orders o 
JOIN order_product op ON op.order_id = o.id
GROUP BY o.status;
-- correccion (mas simple)
SELECT status, COUNT(*) AS total_pedidos
FROM orders
GROUP BY status;
-- 7. Listar todos los productos de la categoría Electrónica ordenados por precio de venta, del más caro al más barato.
SELECT p.name AS name_product, p.purchase_price, c.name AS category
FROM products p 
JOIN categories c ON p.category_id  = c.id
WHERE c.id IN (1,2,3,4,5,7)
GROUP BY p.id, p.purchase_price, c.name
ORDER BY p.purchase_price DESC;
-- 8. Dado un número de orden específico, mostrar los IDs de los productos y la cantidad comprada de cada uno en esa orden.
SELECT o.id AS order_id, p.id AS product_id, p.name AS name_product, op.quantity
FROM orders o 
JOIN order_product op ON op.order_id = o.id
JOIN products p ON op.product_id = p.id
WHERE o.id = '10';
-- 9. Listar los nombres de los usuarios de una ciudad específica (ej: Monterrey) que tengan al menos un pedido registrado.
SELECT u.name AS user_name, u.city, COUNT(op.quantity) AS total_orders
FROM users u 
JOIN orders o ON u.id = o.user_id
JOIN order_product op ON op.order_id = o.id
WHERE u.city = 'El Quintana'
GROUP BY u.name;
-- correcion:
SELECT u.name, u.city, COUNT(DISTINCT o.id) AS total_pedidos_unicos
FROM users u 
JOIN orders o ON u.id = o.user_id
WHERE u.city = 'El Quintana'
GROUP BY u.id; -- Siempre es mejor agrupar por ID por si hay dos "Juan"
-- 10. Calcular el valor promedio de los pedidos realizados por cada usuario.
SELECT u.id AS id_user, u.name, COUNT(op.quantity) AS total_orders, AVG(op.price_at_purchase) AS AVG_user
FROM users u 
JOIN orders o ON o.user_id = u.id
JOIN order_product op ON op.order_id = o.id
GROUP BY u.id;

-- NIVEL 2: CONSULTAS INTERMEDIAS (3 TABLAS)
-- 11. Generar un recibo detallado que muestre:Código de orden, Fecha, Nombre del producto comprado, Precio al que se vendió
SELECT o.order_number, o.order_date, p.name AS product_name, p.sale_price
FROM orders o 
JOIN order_product op ON o.id = op.order_id 
JOIN products p ON op.product_id = p.id;
-- 12. Calcular el ingreso total generado por cada categoría de productos.
SELECT c.name AS category_name, SUM(op.quantity * op.price_at_purchase) AS total_sales
FROM products p
JOIN order_product op ON p.id = op.product_id 
JOIN orders o ON o.id = op.order_id
JOIN categories c ON c.id = p.category_id
WHERE o.status IN ('shipped', 'paid')
GROUP BY category_name
ORDER BY total_sales DESC;
-- correcion:
SELECT c.name AS category_name, SUM(op.quantity * op.price_at_purchase) AS total_sales
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_product op ON p.id = op.product_id 
JOIN orders o ON o.id = op.order_id -- La orden se une al detalle, no al producto directo
WHERE o.status IN ('shipped', 'paid')
GROUP BY category_name;
-- 13. Listar los nombres únicos de todos los productos que ha comprado un cliente específico (buscar por nombre del cliente).
SELECT u.id, u.name AS user_name, p.name AS product_name, count(op.quantity)
FROM users u
JOIN orders o ON o.user_id = u.id
JOIN order_product op ON op.order_id = o.id
JOIN products p ON op.product_id = p.id
WHERE u.id = 155
GROUP BY product_name;
-- 14. Identificar los 5 productos más vendidos históricamente (basado en la cantidad total de unidades).
SELECT p.id, p.name, SUM(op.quantity) AS total_sales
FROM products p 
JOIN order_product op ON op.product_id = p.id
JOIN orders o ON o.id = op.order_id
WHERE o.status IN ('shipped', 'paid')
GROUP BY p.id
ORDER BY total_sales DESC 
LIMIT 5;
-- 15. Obtener la fecha de la última vez que se vendió cada producto, mostrando el nombre del producto y la fecha.
SELECT p.id, p.name AS product_name, MAX(op.updated_at) AS last_date_sale
FROM products p 
JOIN order_product op ON op.product_id = p.id
JOIN orders o ON op.order_id = o.id
WHERE o.status IN ('shipped', 'paid')
GROUP BY p.id, p.name
ORDER BY last_date_sale DESC;
-- 16. Listar los nombres de los usuarios que han comprado al menos un producto que contenga la palabra Gamer en su nombre.
SELECT u.id, u.name AS user_name, p.name AS product_name, COUNT(op.quantity) AS total_user_shop
FROM users u 
JOIN orders o ON o.user_id = u.id 
JOIN order_product op ON op.order_id = o.id 
JOIN products p ON op.product_id = p.id
WHERE p.name LIKE '%ga%'
GROUP BY u.id, u.name, p.name;
-- 17. Calcular los ingresos totales de la tienda agrupados por día.
SELECT SUM(op.quantity * op.price_at_purchase) AS income_daily, DATE(o.order_date) AS day
FROM order_product op
JOIN orders o ON o.id = op.order_id
GROUP BY day
ORDER BY day;
-- 18. Identificar las categorías que tienen productos registrados pero que nunca han generado una venta.
SELECT c.name AS catery_name
FROM categories c 
JOIN products p ON c.id = p.category_id 
LEFT  JOIN order_product op ON op.product_id = p.id
WHERE p.id IS NULL;
-- correcion:
SELECT c.name
FROM categories c
JOIN products p ON c.id = p.category_id -- Categorías con productos
LEFT JOIN order_product op ON p.id = op.product_id -- Intentamos unir con ventas
WHERE op.id IS NULL; -- Solo nos quedamos con los que NO tuvieron unión (ventas)
-- 19. Mostrar el ticket promedio de compra (gasto promedio por orden) de cada usuario.
SELECT u.id, u.name AS user_name, AVG(op.quantity * op.price_at_purchase) AS AVG_shop
FROM users u 
JOIN orders o ON u.id = o.user_id
JOIN order_product op ON o.id = op.order_id
WHERE o.status IN ('shipped', 'paid')
GROUP BY u.id, u.name
ORDER BY AVG_shop DESC;
-- correcion:
SELECT u.name, AVG(o.total) AS ticket_promedio
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status IN ('shipped', 'paid')
GROUP BY u.id, u.name
ORDER BY ticket_promedio DESC;
-- 20. Listar los nombres de los productos que formaban parte de órdenes que terminaron siendo canceladas.
SELECT DISTINCT(p.name) AS product_name_cancelled
FROM products p
JOIN order_product op ON p.id = op.product_id 
JOIN orders o ON op.order_id = o.id 
WHERE o.status = 'cancelled';

-- NIVEL 3: CONSULTAS COMPLEJAS Y REPORTES (4+ TABLAS)
-- 21. Reporte Global. Mostrar una tabla con: Nombre del Usuario, Ciudad, Número de Orden, Nombre del Producto, Categoría, Cantidad, Subtotal del ítem
SELECT
u.name AS user_name,
u.city,
o.order_number,
p.name AS product_name,
c.name AS categories,
op.quantity,
(op.quantity * op.price_at_purchase) AS subtotal
FROM users u 
JOIN orders o ON u.id = o.user_id 
JOIN order_product op ON op.order_id = o.id 
JOIN products p ON op.product_id = p.id 
JOIN categories c ON p.category_id = c.id;
-- 22. Calcular cuánto dinero han generado las ventas de la categoría Ropa exclusivamente en una ciudad específica.
SELECT
SUM(op.quantity * op.price_at_purchase)
FROM users u 
JOIN orders o ON u.id = o.user_id 
JOIN order_product op ON op.order_id = o.id 
JOIN products p ON op.product_id = p.id 
JOIN categories c ON p.category_id = c.id
WHERE c.name LIKE '%Ropa%' 
AND u.city = 'O Lázaro del Penedès'
AND o.status IN ('shipped', 'paid');
-- 23. Identificar al Cliente del Año: El usuario que ha gastado más dinero en total dentro de la plataforma.
SELECT
u.name AS name_user,
SUM(op.quantity * op.price_at_purchase) as total_expensed
FROM users u 
JOIN orders o ON u.id = o.user_id 
JOIN order_product op ON o.id = op.order_id
WHERE o.status IN ('shipped', 'paid')
GROUP BY name_user
ORDER BY total_expensed DESC
LIMIT 1;
-- 24. Listar los productos que no han tenido ninguna venta registrada.
SELECT
count(*)
FROM products p 
LEFT JOIN order_product op ON p.id = op.product_id
WHERE op.product_id IS NULL;
-- 25. Calcular la Ganancia Real (Profit) de la empresa:  ESTE EJERCICIO ES MUY SUBJETIVO
SELECT
SUM((o.subtotal - p.purchase_price) * op.quantity) AS profit_company
FROM products p
JOIN order_product op ON p.id = op.product_id
JOIN orders o ON op.order_id = o.id 
WHERE o.status IN ('shipped', 'paid');
-- correcion:
SELECT
    SUM((op.price_at_purchase - p.purchase_price) * op.quantity) AS profit_total
FROM order_product op
JOIN products p ON op.product_id = p.id
JOIN orders o ON op.order_id = o.id
WHERE o.status IN ('shipped', 'paid');
-- 26. Mostrar los usuarios que han comprado productos de la categoría Videojuegos pero no han comprado productos de Hogar.
-- esta consulta requiere memoria para poder filtrar bien
SELECT
u.name AS user_name,
c.name AS category,
COUNT(*) AS total_shop
FROM users u 
JOIN orders o ON u.id = o.user_id 
JOIN order_product op ON op.order_id = o.id 
JOIN products p ON op.product_id = p.id 
JOIN categories c ON p.category_id = c.id
WHERE c.name LIKE '%Videojuegos%'
AND u.id NOT IN (
	SELECT o2.user_id
	FROM orders o2
	JOIN order_product op2 ON o2.id = op2.order_id
	JOIN products p2 ON op2.product_id = p2.id 
	JOIN categories c2 ON p2.category_id = c2.id 
	WHERE c2.name LIKE '%Hogar%'
	)
GROUP BY user_name, category
ORDER BY total_shop DESC; 
-- 27. Generar un ranking de las 3 ciudades que más ingresos han generado a la tienda.
SELECT
u.city,
SUM(op.quantity * op.price_at_purchase) AS total_income
FROM users u
JOIN orders o ON u.id = o.user_id 
JOIN order_product op ON o.id = op.order_id
GROUP BY u.city
ORDER BY total_income DESC
LIMIT 3;
-- 28. Encontrar la orden que contiene la mayor variedad de productos distintos (mayor cantidad de ítems únicos).
SELECT
o.id as id_order,
o.order_number,
COUNT(o.id) AS total_orders
FROM orders o
JOIN order_product op ON o.id = op.order_id 
JOIN products p ON op.product_id = p.id
GROUP BY o.id, o.order_number 
ORDER BY total_orders DESC
LIMIT 5;
-- correcion
SELECT
    o.order_number,
    COUNT(DISTINCT op.product_id) AS variedad_productos
FROM orders o
JOIN order_product op ON o.id = op.order_id 
GROUP BY o.id, o.order_number 
ORDER BY variedad_productos DESC
LIMIT 5;
-- 29. Listar los productos que se vendieron en el pasado a un precio menor que su precio de venta actual en catálogo.
SELECT
p.*
FROM products p 
JOIN order_product op ON p.id = op.product_id
WHERE p.sale_price > op.price_at_purchase;
-- opcion mas precisa
SELECT 
    p.name AS producto,
    p.sale_price AS precio_actual,
    MIN(op.price_at_purchase) AS precio_mas_bajo_historico
FROM products p
JOIN order_product op ON p.id = op.product_id
GROUP BY p.name, p.sale_price
HAVING MIN(op.price_at_purchase) < p.sale_price;
-- 30. Mostrar el historial de compras de un producto específico: Quién lo compró, Cuándo, A qué precio
SELECT
u.name AS user_name,
o.order_date ,
o.total,
COUNT(u.id) AS total_compras
FROM users u 
JOIN orders o ON u.id = o.user_id
JOIN order_product op ON o.id = op.order_id
JOIN products p ON p.id = op.product_id
WHERE o.status IN ('shipped', 'paid')
AND p.id = 100
GROUP BY user_name, o.order_date, o.total;

-- NIVEL 4: LÓGICA DE NEGOCIO Y ANALÍTICA AVANZADA
-- 31. Listar a los usuarios cuyo gasto total acumulado es superior al promedio de gasto de todos los clientes de la tienda.
SELECT
u.name,
SUM(op.quantity * op.price_at_purchase) AS AVG_user
FROM users u 
JOIN orders o ON u.id = o.user_id 
JOIN order_product op ON op.order_id = o.id
WHERE o.status IN ('shipped', 'paid')
GROUP BY u.id 
HAVING AVG_user > (
	SELECT AVG(quantity * price_at_purchase)
	FROM orders o2 
	JOIN order_product op2 ON o2.id = op2.order_id
	WHERE o2.status IN ('shipped', 'paid')
	)
ORDER BY AVG_user;
-- 32. Identificar los productos Estrella: Aquellos que representan individualmente más del 2% del total de ingresos de la empresa.
-- no hay productos con el 2% del total, asi que use un 1%
SELECT
p.name AS product_name,
SUM(op.quantity * op.price_at_purchase) AS total_sales
FROM products p 
JOIN order_product op ON op.product_id = p.id
JOIN orders o ON o.id = op.order_id
WHERE o.status IN ('shipped', 'paid')
GROUP BY p.id HAVING total_sales > (0.01 * (
	SELECT SUM(quantity * price_at_purchase)
	FROM orders o2 
	JOIN order_product op2 ON o2.id = op2.order_id
	WHERE o2.status IN ('shipped', 'paid')
	));
-- 33. Churn Rate: Listar los usuarios que hicieron compras en el pasado, pero que no han realizado ningún pedido en los últimos 6 meses. 
-- forma correcta
SELECT DISTINCT 
    u.name,
    MAX(o.order_date) AS ultima_compra -- Para saber cuándo fue lo último que compró
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id NOT IN (
    -- Esta subconsulta busca a los usuarios "activos" (compraron hace menos de 6 meses)
    SELECT user_id 
    FROM orders 
    WHERE order_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH) -- O DATE_SUB(NOW(), INTERVAL 6 MONTH) en MySQL
)
GROUP BY u.name;
-- 34. Clasificar a los clientes en tres niveles según su gasto total: VIP → gasto > 5000, Frecuente → entre 1000 y 5000, Regular → < 1000
SELECT
u.name,
SUM(op.quantity * op.price_at_purchase) AS total_expesed,
CASE 
	WHEN SUM(op.quantity * op.price_at_purchase) > 5000 THEN 'VIP'
	WHEN SUM(op.quantity * op.price_at_purchase) < 1000 THEN 'Regular'
	ELSE 'Frecuente'
END AS client_ranking
FROM users u 
JOIN orders o ON o.user_id = u.id 
JOIN order_product op ON op.order_id = o.id
GROUP BY u.id;
-- 35. Determinar cuál ha sido el mes (y año) con mayor facturación en la historia de la tienda.
SELECT 
    YEAR(o.order_date) AS anio,
    MONTH(o.order_date) AS mes,
    SUM(op.quantity * op.price_at_purchase) AS facturacion_total
FROM orders o 
JOIN order_product op ON o.id = op.order_id
-- Opcional: Filtramos solo órdenes válidas (pagadas o enviadas)
WHERE o.status IN ('shipped', 'paid') 
GROUP BY anio, mes
ORDER BY facturacion_total DESC
LIMIT 1;
-- 36. Alerta de Inventario: Listar las órdenes pendientes que incluyen productos cuyo stock actual es menor a 5 unidades.
-- opcion si el inventario se actualiza solo
SELECT 
o.order_number,
p.stock
FROM orders o 
JOIN order_product op ON op.order_id = o.id
JOIN products p ON p.id = op.product_id
WHERE o.status = 'pending'
HAVING p.stock <= 5;
-- en caso de no tener actualizacion sola
SELECT 
o.order_number,
p.stock,
SUM(op.quantity) AS total_seles
FROM orders o 
JOIN order_product op ON op.order_id = o.id
JOIN products p ON p.id = op.product_id
WHERE o.status = 'pending'
GROUP BY o.order_number, p.stock
HAVING p.stock -total_seles <= 5;
-- 37. Calcular qué porcentaje de las ventas totales representa cada categoría. (ej: Electrónica 40%, Ropa 20%, etc.).
SELECT 
c.name AS category_name,
(SUM(op.quantity * op.price_at_purchase) / (
	SELECT SUM(op2.quantity * op2.price_at_purchase) FROM order_product op2
	)) * 100 AS percent_sales_category
FROM categories c
JOIN products p ON p.category_id = c.id 
JOIN order_product op ON op.product_id = p.id
-- JOIN orders o ON o.id = op.order_id
-- WHERE o.status IN ('shipped', 'paid') 
GROUP BY c.id;
-- 38. Comparar las ventas totales de cada ciudad contra el promedio de ventas de todas las ciudades.
SELECT
u.city,
ROUND((SUM(op.quantity * op.price_at_purchase) / (
	SELECT SUM(op2.quantity * op2.price_at_purchase) FROM order_product op2
	)) * 100, 2) AS percent_sales_city_total
FROM users u 
JOIN orders o ON u.id = o.user_id
JOIN order_product op ON op.order_id = o.id 
GROUP BY u.city
ORDER BY percent_sales_city_total DESC;
-- 39. Calcular la tasa de cancelación: Porcentaje de órdenes con estado cancelled respecto al total de órdenes por mes.
SELECT 
MONTH(o.order_date) AS month,
(SELECT COUNT(*)
FROM orders o2
JOIN order_product op2 ON o2.id = op2.order_id
WHERE o2.status = 'cancelled')
/
COUNT(*)
FROM orders o 
JOIN order_product op ON o.id = op.order_id
GROUP BY month;
-- correcion:
SELECT 
    MONTH(o.order_date) AS mes,
    YEAR(o.order_date) AS anio,
    COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*) AS tasa_cancelacion
FROM orders o
GROUP BY anio, mes;
-- 40. Análisis de Canasta: Identificar qué pares de productos se venden juntos con mayor frecuencia en la misma orden.
SELECT 
    op1.product_id AS producto_A, 
    op2.product_id AS producto_B, 
    COUNT(*) AS veces_juntos
FROM order_product op1
JOIN order_product op2 ON op1.order_id = op2.order_id -- Unimos la tabla consigo misma por la misma orden
WHERE op1.product_id < op2.product_id -- El truco de "oro" para no repetir pares
GROUP BY producto_A, producto_B
ORDER BY veces_juntos DESC
LIMIT 10; -- Para ver solo el Top 5 de "Combos"


-- tablas
-- users
SELECT * FROM users;
SELECT COUNT(*) AS total_users FROM users;
-- products
SELECT * FROM products;
SELECT COUNT(*) AS total_products FROM products;
-- orders
SELECT * FROM orders;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT COUNT(DISTINCT order_number) FROM orders;
-- order_product
SELECT * FROM order_product;
SELECT COUNT(*) AS total_order_product FROM order_product;
-- categories
SELECT * FROM categories;
SELECT COUNT(*) AS total_categories FROM categories;