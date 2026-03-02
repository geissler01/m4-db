Este es uno de los modelos más robustos para bases de datos relacionales, ya que el **Sistema de Rent-A-Car con Facturación** combina la gestión de activos (autos), la logística (sedes) y la contabilidad (facturas y pagos).

Aquí tienes la documentación completa bajo el estándar de alta dificultad que definimos.

### ---

**1\. Diccionario de Datos (Nombres Comprimidos)**

| Tabla | Columna | Significado |
| :---- | :---- | :---- |
| **CLI** | ID\_Cli (PK) | Cliente que renta el auto |
| **SED** | ID\_Sed (PK) | Sede o sucursal (Recojo/Entrega) |
| **CAT** | ID\_Cat (PK) | Categoría (SUV, Económico, Lujo) |
| **VEH** | ID\_Veh (PK) | El auto físico (Placa/VIN) |
| **EMP** | ID\_Emp (PK) | Agente que gestiona la renta |
| **REN** | ID\_Ren (PK) | Contrato de Renta (Cabecera) |
| **SER** | ID\_Ser (PK) | Catálogo de servicios extra (GPS, Seguro, Silla bebé) |
| **D\_S** | ID\_Ren\_FK, ID\_Ser\_FK | Puente N:M entre Renta y Servicios Extra |
| **FAC** | ID\_Fac (PK) | Factura legal emitida |
| **PAG** | ID\_Pag (PK) | Registro del pago (Cuentas por cobrar) |

### ---

**2\. Dataset "Sucio" (20 registros base)**

Nota cómo se repiten los datos de la categoría del auto y los servicios por cada factura.

Fragmento de código

ID\_Ren,Fecha,ID\_Cli,Nom\_Cli,ID\_Veh,Modelo,ID\_Cat,Nom\_Cat,Pre\_Dia,Sede\_Rec,ID\_Ser,Nom\_Ser,Costo\_S,ID\_Fac,Total\_F,Metodo\_P,ID\_Emp,Nom\_Emp  
9001,2026-03-01,C1,Elon,V10,Model S,K1,Lujo,200,Sede-Norte,SR1,GPS,15,F-550,215,TC,E5,Pepper  
9001,2026-03-01,C1,Elon,V10,Model S,K1,Lujo,200,Sede-Norte,SR2,Seguro Pro,50,F-550,215,TC,E5,Pepper  
9002,2026-03-01,C2,Ada,V22,Picanto,K2,Econo,40,Sede-Sur,SR1,GPS,15,F-551,55,Cash,E6,Happy  
9003,2026-03-02,C1,Elon,V30,LandCruiser,K3,SUV,150,Sede-Norte,SR3,Silla Bebe,10,F-552,160,TC,E5,Pepper  
9004,2026-03-02,C3,Bill,V10,Model S,K1,Lujo,200,Sede-Sur,SR2,Seguro Pro,50,F-553,250,TC,E6,Happy  
... (Redundancia de datos contables y técnicos en 20 filas)

### ---

**3\. DER Normalizado (3FN) con Flujo Contable**

Plaintext

 \[ CATEGORIAS \] (1)          \[ SEDES \] (1)          \[ EMPLEADOS \] (1)  
      |                           |                      |  
      | (N)                       | (N)                  | (N)  
 \[ VEHICULOS \] (1) \<------- \[   RENTAS    \] \<------------+  
 \- ID\_Veh (PK)              \- ID\_Ren (PK)  
 \- Modelo                   \- F\_Inicio / F\_Fin  
 \- ID\_Cat\_FK (FK)           \- ID\_Cli\_FK (FK) \>------- \[ CLIENTES \] (1)  
      |                     \- ID\_Veh\_FK (FK)          \- ID\_Cli (PK)  
      |                     \- ID\_Sed\_FK (FK)          \- Nom\_Cli  
      |                     \- ID\_Emp\_FK (FK)          \- Tel\_Cli  
      |                           |  
      |                           | (1)  
      |                           |  
 \[ SERVICIOS \] (1)                | (1)  
 \- ID\_Ser (PK)              \[  FACTURAS   \] (1)  
 \- Nom\_Ser                  \- ID\_Fac (PK)  
 \- Costo\_S                  \- ID\_Ren\_FK (FK)  
      |                     \- Total\_Neto  
      | (N)                       |  
      |                           | (1)  
 \[ DET\_REN\_SER \] (N) \<------------+  
 (Puente N:M)                     | (N)  
 \- ID\_Ren\_FK (FK)           \[    PAGOS    \]  
 \- ID\_Ser\_FK (FK)           \- ID\_Pag (PK)  
                            \- ID\_Fac\_FK (FK)  
                            \- Metodo\_P

### ---

**4\. Consultas SQL Complejas (Comentadas)**

#### **Consulta 1: Ingresos totales por Categoría de Vehículo**

Aquí navegamos desde el dinero (Pagos) hasta la clasificación del auto.

SQL

SELECT C.Nom\_Cat, SUM(P.Monto) AS Total\_Recaudado \-- Selecciona categoría y suma pagos  
FROM PAG P \-- Desde la tabla de pagos  
JOIN FAC F ON P.ID\_Fac\_FK \= F.ID\_Fac \-- Conecta el pago con su factura  
JOIN REN R ON F.ID\_Ren\_FK \= R.ID\_Ren \-- Conecta la factura con el contrato de renta  
JOIN VEH V ON R.ID\_Veh\_FK \= V.ID\_Veh \-- Conecta la renta con el vehículo específico  
JOIN CAT C ON V.ID\_Cat\_FK \= C.ID\_Cat \-- Finalmente llega a la categoría del auto  
GROUP BY C.Nom\_Cat; \-- Agrupa para ver el total por tipo (SUV, Lujo, etc)

#### **Consulta 2: Clientes que han rentado autos de 'Lujo' en una Sede específica**

SQL

SELECT DISTINCT CL.Nom\_Cli \-- Selecciona nombres únicos de clientes  
FROM CLI CL \-- Empieza en clientes  
JOIN REN R ON CL.ID\_Cli \= R.ID\_Cli\_FK \-- Une con sus contratos de renta  
JOIN SED S ON R.ID\_Sed\_FK \= S.ID\_Sed \-- Une con la sede donde recogió el auto  
JOIN VEH V ON R.ID\_Veh\_FK \= V.ID\_Veh \-- Une con el vehículo  
JOIN CAT C ON V.ID\_Cat\_FK \= C.ID\_Cat \-- Une con la categoría  
WHERE C.Nom\_Cat \= 'Lujo' AND S.Nom\_Sede \= 'Sede-Norte'; \-- Filtra por lujo y ubicación

#### **Consulta 3: Ranking de Empleados que más servicios extra (GPS, Seguros) han vendido**

SQL

SELECT E.Nom\_Emp, COUNT(DS.ID\_Ser\_FK) AS Cant\_Servicios \-- Cuenta cuántos extras vendió cada uno  
FROM EMP E \-- Desde empleados  
JOIN REN R ON E.ID\_Emp \= R.ID\_Emp\_FK \-- Une con las rentas que gestionó  
JOIN D\_S DS ON R.ID\_Ren \= DS.ID\_Ren\_FK \-- Une con el puente de servicios adicionales  
GROUP BY E.Nom\_Emp \-- Agrupa por empleado  
ORDER BY Cant\_Servicios DESC; \-- El mejor vendedor primero

#### **Consulta 4: Facturas pendientes de pago (Cuentas por cobrar)**

SQL

SELECT F.ID\_Fac, F.Total\_Neto, CL.Nom\_Cli \-- Datos de la factura y el cliente  
FROM FAC F \-- Desde facturas  
JOIN REN R ON F.ID\_Ren\_FK \= R.ID\_Ren \-- Conecta con la renta  
JOIN CLI CL ON R.ID\_Cli\_FK \= CL.ID\_Cli \-- Conecta con el cliente responsable  
LEFT JOIN PAG P ON F.ID\_Fac \= P.ID\_Fac\_FK \-- Usa Left Join para ver facturas sin registros en pagos  
WHERE P.ID\_Pag IS NULL; \-- Filtra las que no tienen ningún pago asociado

#### **Consulta 5: Historial de servicios consumidos por un vehículo específico (Placa)**

SQL

SELECT V.Modelo, S.Nom\_Ser, R.Fecha \-- Qué auto, qué servicio y cuándo  
FROM VEH V \-- Desde vehículos  
JOIN REN R ON V.ID\_Veh \= R.ID\_Veh\_FK \-- Une con todos sus contratos históricos  
JOIN D\_S DS ON R.ID\_Ren \= DS.ID\_Ren\_FK \-- Salta al puente de servicios  
JOIN SER S ON DS.ID\_Ser\_FK \= S.ID\_Ser \-- Llega al nombre del servicio  
WHERE V.ID\_Veh \= 'V10'; \-- Filtra por el ID o placa del vehículo

### **Por qué este modelo es "Nivel Pro":**

1. **Independencia de Precios:** El precio está en CATEGORIAS, no en VEHICULOS. Si subes el precio de las SUV, se actualiza para todos los autos de esa categoría.  
2. **Relación N:M (Servicios):** Una renta puede tener GPS y Seguro al mismo tiempo sin duplicar filas de la renta principal.  
3. **Trazabilidad Financiera:** La separación de FACTURAS y PAGOS permite que un cliente pague una factura en dos partes (abonos), algo vital en contabilidad.

¿Te gustaría que añadamos una tabla de **Mantenimiento** para ver cómo afecta la disponibilidad de los autos o pasamos a otro sector como **Hotelería**?