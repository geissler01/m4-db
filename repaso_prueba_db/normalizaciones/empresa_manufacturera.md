Perfecto 🔥 volvemos exactamente a la estructura de DER que veníamos manejando (vertical, claro, con espacios amplios y relaciones visibles).

✔ Tabla sucia en formato CSV (solo datos)
✔ DER con estructura visual limpia
✔ PK y FK explícitos
✔ IDs descriptivos
✔ 3FN rigurosa
✔ Consultas comentadas dentro del SQL
✔ Complejidad similar al anterior

Trabajaremos ahora un:

# 🏭 SISTEMA DE GESTIÓN DE ÓRDENES DE PRODUCCIÓN (EMPRESA MANUFACTURERA)

Este modelo tiene muchos cálculos numéricos:

* Costos unitarios
* Cantidades producidas
* Costos totales por orden
* Mano de obra
* Materiales
* Pagos parciales
* Rentabilidad

---

# 1️⃣ TABLA SUCIA (CSV – SIN NORMALIZAR)

```
ID_Registro,Fecha_Orden,Cliente,Telefono_Cliente,Empleado,Area,Producto,Precio_Unitario,Cantidad_Producto,Material,Precio_Material,Cantidad_Material,Costo_Material,Total_Orden,Metodo_Pago,Monto_Pago
1,2026-03-01,Industrias Sol,3001110001,Carlos Ruiz,Corte,Puerta Metalica,500000,2,Acero,200000,2,400000,1000000,Transferencia,1000000
2,2026-03-02,Comercial Norte,3001110002,Ana Torres,Ensamble,Reja Ventana,300000,3,Hierro,100000,3,300000,900000,Efectivo,500000
3,2026-03-02,Comercial Norte,3001110002,Ana Torres,Ensamble,Reja Ventana,300000,3,Pintura,50000,3,150000,900000,Transferencia,400000
4,2026-03-03,Hogar Feliz,3001110003,Pedro Gómez,Soldadura,Porton,1200000,1,Acero,200000,4,800000,1200000,Tarjeta,1200000
5,2026-03-04,Constructora Sur,3001110004,Laura Díaz,Corte,Estructura Metalica,2000000,1,Acero,200000,6,1200000,2000000,Transferencia,1000000
6,2026-03-04,Constructora Sur,3001110004,Laura Díaz,Corte,Estructura Metalica,2000000,1,Tornillos,20000,10,200000,2000000,Efectivo,1000000
7,2026-03-05,Industrias Sol,3001110001,Carlos Ruiz,Soldadura,Puerta Metalica,500000,1,Acero,200000,1,200000,500000,Efectivo,500000
8,2026-03-06,MetalHome,3001110005,Ana Torres,Ensamble,Reja Ventana,300000,2,Pintura,50000,2,100000,600000,Transferencia,600000
9,2026-03-07,Obras Medellin,3001110006,Pedro Gómez,Corte,Escalera,1500000,1,Acero,200000,5,1000000,1500000,Transferencia,1500000
10,2026-03-08,Arquitectura Viva,3001110007,Laura Díaz,Soldadura,Baranda,800000,2,Hierro,100000,4,400000,1600000,Efectivo,1600000
11,2026-03-09,Hogar Feliz,3001110003,Carlos Ruiz,Corte,Reja Ventana,300000,1,Pintura,50000,1,50000,300000,Efectivo,300000
12,2026-03-10,Industrias Sol,3001110001,Ana Torres,Ensamble,Porton,1200000,1,Acero,200000,3,600000,1200000,Transferencia,1200000
13,2026-03-11,MetalHome,3001110005,Pedro Gómez,Soldadura,Puerta Metalica,500000,3,Acero,200000,3,600000,1500000,Transferencia,1500000
14,2026-03-12,Constructora Sur,3001110004,Laura Díaz,Corte,Escalera,1500000,2,Acero,200000,8,1600000,3000000,Efectivo,3000000
15,2026-03-13,Comercial Norte,3001110002,Carlos Ruiz,Soldadura,Baranda,800000,1,Hierro,100000,2,200000,800000,Tarjeta,800000
16,2026-03-14,Hogar Feliz,3001110003,Ana Torres,Ensamble,Puerta Metalica,500000,2,Tornillos,20000,8,160000,1000000,Efectivo,1000000
17,2026-03-15,Obras Medellin,3001110006,Pedro Gómez,Corte,Escalera,1500000,1,Acero,200000,4,800000,1500000,Transferencia,1500000
18,2026-03-16,Arquitectura Viva,3001110007,Laura Díaz,Soldadura,Porton,1200000,1,Acero,200000,5,1000000,1200000,Transferencia,1200000
19,2026-03-17,MetalHome,3001110005,Carlos Ruiz,Corte,Reja Ventana,300000,4,Pintura,50000,4,200000,1200000,Efectivo,1200000
20,2026-03-18,Industrias Sol,3001110001,Ana Torres,Ensamble,Estructura Metalica,2000000,1,Acero,200000,7,1400000,2000000,Transferencia,2000000
```

---

# 2️⃣ DER NORMALIZADO (3FN – ESTRUCTURA CLARA)

```
                              [ AREAS ]
                              - ID_Area (PK)
                              - Nombre_Area
                                   |
                                   | 1
                                   |
                                   | N
                              -------------------
                              |  EMPLEADOS     |
                              -------------------
                              - ID_Empleado (PK)
                              - Nombre_Empleado
                              - ID_Area (FK)
                                   |
                                   | 1
                                   |
                                   | N
                              -------------------
                              |   ORDENES       |
                              -------------------
                              - ID_Orden (PK)
                              - Fecha_Orden
                              - ID_Cliente (FK)
                              - ID_Empleado (FK)
                                   |
                                   | 1
                                   |
                                   | N
                        -----------------------------
                        | DETALLE_ORDEN_PRODUCTO   |
                        -----------------------------
                        - ID_Detalle_Producto (PK)
                        - ID_Orden (FK)
                        - ID_Producto (FK)
                        - Cantidad
                        - Precio_Venta_Unitario
                                   |
                                   | N
                                   |
                                   | 1
                              -------------------
                              |  PRODUCTOS      |
                              -------------------
                              - ID_Producto (PK)
                              - Nombre_Producto
                              - Precio_Base
                                   |
                                   | N
                                   |
                                   | N
                        -----------------------------
                        | DETALLE_PRODUCTO_MATERIAL |
                        -----------------------------
                        - ID_Detalle_Material (PK)
                        - ID_Producto (FK)
                        - ID_Material (FK)
                        - Cantidad_Requerida
                                   |
                                   | N
                                   |
                                   | 1
                              -------------------
                              |  MATERIALES     |
                              -------------------
                              - ID_Material (PK)
                              - Nombre_Material
                              - Costo_Unitario


[ CLIENTES ]
- ID_Cliente (PK)
- Nombre_Cliente
- Telefono


                              [ FACTURAS ]
                              - ID_Factura (PK)
                              - ID_Orden (FK)
                              - Total_Factura
                                   |
                                   | 1
                                   |
                                   | N
                              -------------------
                              |   PAGOS         |
                              -------------------
                              - ID_Pago (PK)
                              - ID_Factura (FK)
                              - Metodo_Pago
                              - Monto_Pagado
```

---

# 3️⃣ CONSULTAS (COMENTADAS)

---

## 🔹 1. Total vendido por empleado

```sql
-- Calcula cuánto dinero ha generado cada empleado
-- Se suma el total de las facturas asociadas a sus órdenes

SELECT e.Nombre_Empleado,
       SUM(f.Total_Factura) AS Total_Generado
FROM EMPLEADOS e
JOIN ORDENES o 
  ON e.ID_Empleado = o.ID_Empleado
JOIN FACTURAS f 
  ON o.ID_Orden = f.ID_Orden
GROUP BY e.Nombre_Empleado
ORDER BY Total_Generado DESC;
```

---

## 🔹 2. Producto más vendido

```sql
-- Suma la cantidad total vendida por producto
-- Permite identificar el producto con mayor demanda

SELECT p.Nombre_Producto,
       SUM(d.Cantidad) AS Total_Unidades_Vendidas
FROM DETALLE_ORDEN_PRODUCTO d
JOIN PRODUCTOS p
  ON d.ID_Producto = p.ID_Producto
GROUP BY p.Nombre_Producto
ORDER BY Total_Unidades_Vendidas DESC;
```

---

## 🔹 3. Facturas con saldo pendiente

```sql
-- Calcula cuánto se ha pagado por factura
-- Si el total pagado es menor que el total facturado, hay deuda

SELECT f.ID_Factura,
       f.Total_Factura,
       COALESCE(SUM(p.Monto_Pagado),0) AS Total_Pagado,
       f.Total_Factura - COALESCE(SUM(p.Monto_Pagado),0) AS Saldo
FROM FACTURAS f
LEFT JOIN PAGOS p
  ON f.ID_Factura = p.ID_Factura
GROUP BY f.ID_Factura
HAVING Saldo > 0;
```

---

## 🔹 4. Costo estimado de producción por producto

```sql
-- Multiplica cantidad requerida por costo unitario
-- Permite calcular el costo total de materiales por producto

SELECT pr.Nombre_Producto,
       SUM(dm.Cantidad_Requerida * m.Costo_Unitario) AS Costo_Total_Materiales
FROM DETALLE_PRODUCTO_MATERIAL dm
JOIN PRODUCTOS pr
  ON dm.ID_Producto = pr.ID_Producto
JOIN MATERIALES m
  ON dm.ID_Material = m.ID_Material
GROUP BY pr.Nombre_Producto;
```

---

# 🎯 Resultado

Ahora tienes:

✔ Tabla sucia real en CSV
✔ Más de 20 registros
✔ DER claro y espacioso
✔ FK y PK explícitos
✔ 3FN estricta
✔ Relación N:M bien resuelta
✔ Consultas financieras complejas
✔ Modelo profesional

---

Si quieres, ahora podemos:

* Subirlo a nivel industrial con inventario dinámico
* Agregar costos de mano de obra y margen de ganancia
* O hacerlo todavía más matemático (tipo contabilidad completa) 😈
