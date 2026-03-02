Perfecto 🔥
Vamos a hacer uno **más numérico**, pero:

* ✔ Más sencillo estructuralmente
* ✔ DER fácil de leer
* ✔ 3FN estricta
* ✔ 20+ registros sucios
* ✔ Muchas consultas con cálculos (SUM, AVG, COUNT, HAVING, márgenes, etc.)
* ✔ Ideal para practicar agregaciones

---

# 🛒 SISTEMA DE GESTIÓN DE VENTAS

## (Tienda Minorista con Inventario y Facturación)

Este modelo incluye:

* Productos
* Categorías
* Clientes
* Ventas
* Detalle de venta
* Facturación
* Pagos
* Control de precios y costos

Muchos cálculos financieros reales.

---

# 1️⃣ Diccionario de Datos (Nombres Comprimidos)

| Tabla       | Descripción            |
| ----------- | ---------------------- |
| **CLI**     | Clientes               |
| **CAT**     | Categorías de producto |
| **PROD**    | Productos              |
| **VEN**     | Venta (Cabecera)       |
| **DET_VEN** | Detalle de venta       |
| **FAC**     | Factura                |
| **PAG**     | Pagos                  |

---

# 2️⃣ Dataset “Sucio” (25 Registros con Redundancia)

Aquí repetimos:

* Cliente
* Categoría
* Precio
* Costo
* Producto
* Datos contables

```plaintext
ID_Ven,Fecha,ID_Cli,Nom_Cli,
ID_Prod,Nom_Prod,ID_Cat,Nom_Cat,
Precio_U,Costo_U,Cantidad,
ID_Fac,Total_F,Metodo_P

5001,2026-06-01,C1,Ada,P1,Laptop,C1,Tecnologia,3000,2500,1,F-2001,3000,TC
5001,2026-06-01,C1,Ada,P2,Mouse,C1,Tecnologia,50,20,2,F-2001,3000,TC
5002,2026-06-01,C2,Elon,P3,Silla,C2,Hogar,200,120,4,F-2002,800,Cash
5003,2026-06-02,C3,Bill,P4,Teclado,C1,Tecnologia,120,60,3,F-2003,360,TC
5004,2026-06-02,C1,Ada,P5,Escritorio,C2,Hogar,500,300,1,F-2004,500,TC
5005,2026-06-03,C4,Marie,P1,Laptop,C1,Tecnologia,3000,2500,2,F-2005,6000,Cash
5006,2026-06-03,C5,Linus,P2,Mouse,C1,Tecnologia,50,20,10,F-2006,500,TC
5007,2026-06-04,C2,Elon,P3,Silla,C2,Hogar,200,120,2,F-2007,400,TC
5008,2026-06-04,C6,Sofia,P6,Monitor,C1,Tecnologia,800,600,1,F-2008,800,Cash
5009,2026-06-05,C7,Carlos,P4,Teclado,C1,Tecnologia,120,60,5,F-2009,600,TC
5010,2026-06-06,C8,Diana,P5,Escritorio,C2,Hogar,500,300,2,F-2010,1000,Cash
5011,2026-06-06,C9,Pedro,P2,Mouse,C1,Tecnologia,50,20,4,F-2011,200,TC
5012,2026-06-07,C10,Laura,P6,Monitor,C1,Tecnologia,800,600,3,F-2012,2400,TC
5013,2026-06-07,C1,Ada,P3,Silla,C2,Hogar,200,120,1,F-2013,200,TC
5014,2026-06-08,C4,Marie,P4,Teclado,C1,Tecnologia,120,60,2,F-2014,240,Cash
5015,2026-06-08,C5,Linus,P1,Laptop,C1,Tecnologia,3000,2500,1,F-2015,3000,TC
5016,2026-06-09,C6,Sofia,P5,Escritorio,C2,Hogar,500,300,1,F-2016,500,TC
5017,2026-06-09,C7,Carlos,P2,Mouse,C1,Tecnologia,50,20,6,F-2017,300,Cash
5018,2026-06-10,C8,Diana,P6,Monitor,C1,Tecnologia,800,600,2,F-2018,1600,TC
5019,2026-06-10,C9,Pedro,P3,Silla,C2,Hogar,200,120,3,F-2019,600,TC
5020,2026-06-11,C10,Laura,P4,Teclado,C1,Tecnologia,120,60,4,F-2020,480,Cash
```

---

# 3️⃣ DER Normalizado (3FN – Claro y Simple)

```plaintext
                        [ CLIENTES ]
                        -------------
                        PK ID_Cli
                        Nom_Cli
                              |
                              | 1
                              |
                              | N
                          [ VENTAS ]
                          ----------
                          PK ID_Ven
                          Fecha
                          FK ID_Cli_FK
                              |
                              | 1
                              |
                              | 1
                          [ FACTURAS ]
                          ------------
                          PK ID_Fac
                          FK ID_Ven_FK
                          Total_Neto
                              |
                              | 1
                              |
                              | N
                          [ PAGOS ]
                          ---------
                          PK ID_Pag
                          FK ID_Fac_FK
                          Metodo_P
                          Monto



[ CATEGORIAS ]
--------------
PK ID_Cat
Nom_Cat
      |
      | 1
      |
      | N
[ PRODUCTOS ]
--------------
PK ID_Prod
Nom_Prod
Precio_U
Costo_U
FK ID_Cat_FK
      |
      | 1
      |
      | N
[ DET_VEN ]
--------------
PK ID_Det
FK ID_Ven_FK
FK ID_Prod_FK
Cantidad
```

---

# ✔ Confirmación 3FN

* Precio y Costo dependen de PRODUCTO
* Cantidad depende de DET_VEN
* Total depende de FACTURA
* No hay atributos redundantes
* N:M resuelto correctamente

---

# 4️⃣ 10 Consultas con Cálculos Numéricos

---

## 1️⃣ Total vendido por categoría

```sql
SELECT C.Nom_Cat,
       SUM(D.Cantidad * P.Precio_U) AS Total_Vendido
FROM DET_VEN D
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod
JOIN CATEGORIAS C ON P.ID_Cat_FK = C.ID_Cat
GROUP BY C.Nom_Cat;
```

---

## 2️⃣ Margen bruto por producto

```sql
SELECT P.Nom_Prod,
       SUM(D.Cantidad * (P.Precio_U - P.Costo_U)) AS Margen_Total
FROM DET_VEN D
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod
GROUP BY P.Nom_Prod;
```

---

## 3️⃣ Cliente que más ha comprado (en dinero)

```sql
SELECT C.Nom_Cli,
       SUM(D.Cantidad * P.Precio_U) AS Total_Comprado
FROM CLIENTES C
JOIN VENTAS V ON C.ID_Cli = V.ID_Cli_FK
JOIN DET_VEN D ON V.ID_Ven = D.ID_Ven_FK
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod
GROUP BY C.Nom_Cli
ORDER BY Total_Comprado DESC;
```

---

## 4️⃣ Producto más vendido (en cantidad)

```sql
SELECT P.Nom_Prod,
       SUM(D.Cantidad) AS Total_Unidades
FROM DET_VEN D
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod
GROUP BY P.Nom_Prod
ORDER BY Total_Unidades DESC;
```

---

## 5️⃣ Promedio de valor por venta

```sql
SELECT AVG(Total_Neto) AS Promedio_Venta
FROM FACTURAS;
```

---

## 6️⃣ Facturas con pagos incompletos

```sql
SELECT F.ID_Fac,
       F.Total_Neto,
       SUM(P.Monto) AS Total_Pagado
FROM FACTURAS F
LEFT JOIN PAGOS P ON F.ID_Fac = P.ID_Fac_FK
GROUP BY F.ID_Fac, F.Total_Neto
HAVING SUM(P.Monto) < F.Total_Neto OR SUM(P.Monto) IS NULL;
```

---

## 7️⃣ Margen total del negocio

```sql
SELECT SUM(D.Cantidad * (P.Precio_U - P.Costo_U)) AS Margen_Global
FROM DET_VEN D
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod;
```

---

## 8️⃣ Ticket promedio por cliente

```sql
SELECT C.Nom_Cli,
       AVG(F.Total_Neto) AS Ticket_Promedio
FROM CLIENTES C
JOIN VENTAS V ON C.ID_Cli = V.ID_Cli_FK
JOIN FACTURAS F ON V.ID_Ven = F.ID_Ven_FK
GROUP BY C.Nom_Cli;
```

---

## 9️⃣ Categorías con ventas mayores a 5000

```sql
SELECT C.Nom_Cat,
       SUM(D.Cantidad * P.Precio_U) AS Total
FROM DET_VEN D
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod
JOIN CATEGORIAS C ON P.ID_Cat_FK = C.ID_Cat
GROUP BY C.Nom_Cat
HAVING SUM(D.Cantidad * P.Precio_U) > 5000;
```

---

## 🔟 Porcentaje de margen por producto

```sql
SELECT P.Nom_Prod,
       ROUND(
         (SUM(D.Cantidad * (P.Precio_U - P.Costo_U)) /
          SUM(D.Cantidad * P.Precio_U)) * 100, 2
       ) AS Porcentaje_Margen
FROM DET_VEN D
JOIN PRODUCTOS P ON D.ID_Prod_FK = P.ID_Prod
GROUP BY P.Nom_Prod;
```

---

# 🎯 Este modelo es ideal para practicar:

* SUM()
* AVG()
* HAVING
* Margen bruto
* Rentabilidad
* Análisis por categoría
* Ranking
* Métricas financieras

---

Si quieres subir un poco el nivel numérico, el siguiente puede ser:

* 📊 Sistema de nómina con impuestos y deducciones
* 🏦 Banco con préstamos y tabla de amortización
* 🏗️ Constructora con costos directos e indirectos
* 🏥 Clínica con facturación por procedimiento

¿Cuál te interesa ahora?
