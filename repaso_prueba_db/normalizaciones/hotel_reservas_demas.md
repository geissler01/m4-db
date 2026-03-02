Perfecto. Ahora lo dejamos **documentación nivel profesional**, lista para pegar en `.md`, clara, espaciosa y académicamente sólida.

Vamos a combinar:

* ✔ Dataset sucio (20+ registros)
* ✔ DER limpio y visualmente claro
* ✔ 3FN estricta
* ✔ Navegación completa
* ✔ 10 consultas medianas–avanzadas
* ✔ Explicación técnica de por qué está bien normalizado

---

# 🏨 SISTEMA DE GESTIÓN HOTELERA

## Modelo Relacional Normalizado (3FN) con Flujo Operativo y Contable

Este modelo integra:

* Gestión de activos (Habitaciones)
* Gestión comercial (Reservas)
* Servicios adicionales (Spa, Restaurante, etc.)
* Facturación
* Pagos parciales
* Análisis gerencial

---

# 1️⃣ Diccionario de Datos (Nombres Comprimidos)

| Tabla    | Descripción                    |
| -------- | ------------------------------ |
| **HUE**  | Huéspedes                      |
| **SED**  | Sedes del hotel                |
| **TIP**  | Tipos de habitación            |
| **HAB**  | Habitaciones físicas           |
| **EMP**  | Empleados                      |
| **RES**  | Reservas                       |
| **SER**  | Servicios adicionales          |
| **D_RS** | Detalle Reserva-Servicio (N:M) |
| **FAC**  | Facturas                       |
| **PAG**  | Pagos                          |

---

# 2️⃣ Dataset “Sucio” (25 Registros con Redundancia)

Aquí todo está mezclado en una sola tabla:

* Repetición de huésped
* Repetición de tipo
* Repetición de sede
* Repetición de servicios
* Repetición de empleado

```plaintext
ID_Res,F_Ingreso,ID_Hue,Nom_Hue,Tel_Hue,
ID_Hab,Num_Hab,ID_Tip,Nom_Tip,Pre_Noche,
ID_Sed,Nom_Sed,
ID_Ser,Nom_Ser,Costo_S,
ID_Fac,Total_F,Metodo_P,
ID_Emp,Nom_Emp

8001,2026-05-01,H1,Ada,300111,H10,101,T1,Suite,300,S1,Norte,SR1,Spa,50,F-1001,350,TC,E1,Luis
8001,2026-05-01,H1,Ada,300111,H10,101,T1,Suite,300,S1,Norte,SR2,Minibar,20,F-1001,350,TC,E1,Luis
8002,2026-05-01,H2,Elon,300222,H21,205,T2,Doble,120,S2,Centro,SR3,Restaurante,40,F-1002,160,Cash,E2,Sara
8003,2026-05-02,H3,Bill,300333,H15,305,T3,Eco,80,S1,Norte,SR2,Minibar,20,F-1003,100,TC,E1,Luis
8004,2026-05-02,H1,Ada,300111,H12,102,T1,Suite,300,S1,Norte,SR4,Lavanderia,15,F-1004,315,TC,E3,Marco
8005,2026-05-03,H4,Marie,300444,H22,210,T2,Doble,120,S2,Centro,SR1,Spa,50,F-1005,170,Cash,E2,Sara
8006,2026-05-03,H5,Linus,300555,H30,401,T3,Eco,80,S3,Sur,SR3,Restaurante,40,F-1006,120,TC,E4,Ana
8007,2026-05-04,H2,Elon,300222,H10,101,T1,Suite,300,S1,Norte,SR2,Minibar,20,F-1007,320,TC,E1,Luis
8008,2026-05-05,H6,Sofia,300666,H31,402,T3,Eco,80,S3,Sur,SR1,Spa,50,F-1008,130,TC,E4,Ana
8009,2026-05-06,H7,Carlos,300777,H21,205,T2,Doble,120,S2,Centro,SR4,Lavanderia,15,F-1009,135,Cash,E2,Sara
8010,2026-05-06,H3,Bill,300333,H12,102,T1,Suite,300,S1,Norte,SR3,Restaurante,40,F-1010,340,TC,E3,Marco
8011,2026-05-07,H8,Diana,300888,H30,401,T3,Eco,80,S3,Sur,SR2,Minibar,20,F-1011,100,Cash,E4,Ana
8012,2026-05-08,H9,Pedro,300999,H22,210,T2,Doble,120,S2,Centro,SR1,Spa,50,F-1012,170,TC,E2,Sara
8013,2026-05-09,H10,Laura,301000,H15,305,T3,Eco,80,S1,Norte,SR3,Restaurante,40,F-1013,120,TC,E1,Luis
8014,2026-05-10,H4,Marie,300444,H10,101,T1,Suite,300,S1,Norte,SR1,Spa,50,F-1014,350,TC,E3,Marco
8015,2026-05-11,H5,Linus,300555,H21,205,T2,Doble,120,S2,Centro,SR2,Minibar,20,F-1015,140,Cash,E2,Sara
8016,2026-05-12,H1,Ada,300111,H30,401,T3,Eco,80,S3,Sur,SR4,Lavanderia,15,F-1016,95,TC,E4,Ana
8017,2026-05-13,H6,Sofia,300666,H12,102,T1,Suite,300,S1,Norte,SR3,Restaurante,40,F-1017,340,TC,E1,Luis
8018,2026-05-14,H8,Diana,300888,H22,210,T2,Doble,120,S2,Centro,SR4,Lavanderia,15,F-1018,135,Cash,E2,Sara
8019,2026-05-15,H7,Carlos,300777,H15,305,T3,Eco,80,S1,Norte,SR2,Minibar,20,F-1019,100,TC,E3,Marco
8020,2026-05-16,H9,Pedro,300999,H31,402,T3,Eco,80,S3,Sur,SR1,Spa,50,F-1020,130,TC,E4,Ana
```

---

# 3️⃣ DER Normalizado (3FN – Versión Clara y Espaciada)

```
                            [ SEDES ]
                            - ID_Sed (PK)
                            - Nom_Sed
                                 |
                                 | 1
                                 |
                                 | N
                         -------------------
                         |  HABITACIONES  |
                         -------------------
                         - ID_Hab (PK)
                         - Num_Hab
                         - ID_Tip_FK
                         - ID_Sed_FK
                                 |
                                 | 1
                                 |
                                 | N
                           ----------------
                           |   RESERVAS   |
                           ----------------
                           - ID_Res (PK)
                           - F_Ingreso
                           - F_Salida
                           - ID_Hue_FK
                           - ID_Hab_FK
                           - ID_Emp_FK
                             /        \
                            /          \
                           1            1
                          /              \
               [ HUESPEDES ]          [ EMPLEADOS ]
               - ID_Hue (PK)          - ID_Emp (PK)
               - Nom_Hue              - Nom_Emp
               - Tel_Hue
                              
                           |
                           | 1
                           |
                           | 1
                      ----------------
                      |   FACTURAS   |
                      ----------------
                      - ID_Fac (PK)
                      - ID_Res_FK
                      - Total_Neto
                           |
                           | 1
                           |
                           | N
                      ----------------
                      |    PAGOS     |
                      ----------------
                      - ID_Pag (PK)
                      - ID_Fac_FK
                      - Metodo_P
                      - Monto


[ TIPOS ]
- ID_Tip (PK)
- Nom_Tip
- Pre_Noche


[ SERVICIOS ]
- ID_Ser (PK)
- Nom_Ser
- Costo_S
      |
      | N
      |
      | N
-----------------------
|  DET_RES_SER (D_RS) |
-----------------------
- ID_DRS (PK)
- ID_Res_FK
- ID_Ser_FK
```

---

# ✔ Confirmación de 3FN

* Cada tabla depende únicamente de su PK
* No existen dependencias transitivas
* No hay redundancia estructural
* N:M resuelto mediante D_RS
* Facturación independiente de operación

---

# 4️⃣ 10 Consultas SQL Medianas–Avanzadas

---

## 1️⃣ Ingresos totales por tipo de habitación

```sql
SELECT T.Nom_Tip, SUM(P.Monto) AS Total_Ingresos
FROM PAG P
JOIN FAC F ON P.ID_Fac_FK = F.ID_Fac
JOIN RES R ON F.ID_Res_FK = R.ID_Res
JOIN HAB H ON R.ID_Hab_FK = H.ID_Hab
JOIN TIP T ON H.ID_Tip_FK = T.ID_Tip
GROUP BY T.Nom_Tip;
```

---

## 2️⃣ Huéspedes que han estado en más de una sede

```sql
SELECT H.Nom_Hue, COUNT(DISTINCT HB.ID_Sed_FK) AS Cant_Sedes
FROM HUE H
JOIN RES R ON H.ID_Hue = R.ID_Hue_FK
JOIN HAB HB ON R.ID_Hab_FK = HB.ID_Hab
GROUP BY H.Nom_Hue
HAVING COUNT(DISTINCT HB.ID_Sed_FK) > 1;
```

---

## 3️⃣ Ranking de empleados por facturación generada

```sql
SELECT E.Nom_Emp, SUM(F.Total_Neto) AS Total_Generado
FROM EMP E
JOIN RES R ON E.ID_Emp = R.ID_Emp_FK
JOIN FAC F ON R.ID_Res = F.ID_Res_FK
GROUP BY E.Nom_Emp
ORDER BY Total_Generado DESC;
```

---

## 4️⃣ Servicios más vendidos

```sql
SELECT S.Nom_Ser, COUNT(*) AS Veces_Vendido
FROM D_RS D
JOIN SER S ON D.ID_Ser_FK = S.ID_Ser
GROUP BY S.Nom_Ser
ORDER BY Veces_Vendido DESC;
```

---

## 5️⃣ Facturas con pagos incompletos

```sql
SELECT F.ID_Fac, F.Total_Neto, SUM(P.Monto) AS Total_Pagado
FROM FAC F
LEFT JOIN PAG P ON F.ID_Fac = P.ID_Fac_FK
GROUP BY F.ID_Fac, F.Total_Neto
HAVING SUM(P.Monto) < F.Total_Neto OR SUM(P.Monto) IS NULL;
```

---

## 6️⃣ Promedio de gasto por huésped

```sql
SELECT H.Nom_Hue, AVG(F.Total_Neto) AS Prom_Gasto
FROM HUE H
JOIN RES R ON H.ID_Hue = R.ID_Hue_FK
JOIN FAC F ON R.ID_Res = F.ID_Res_FK
GROUP BY H.Nom_Hue;
```

---

## 7️⃣ Habitaciones nunca reservadas

```sql
SELECT H.Num_Hab
FROM HAB H
LEFT JOIN RES R ON H.ID_Hab = R.ID_Hab_FK
WHERE R.ID_Res IS NULL;
```

---

## 8️⃣ Total facturado por sede

```sql
SELECT S.Nom_Sed, SUM(F.Total_Neto) AS Total_Sede
FROM SED S
JOIN HAB H ON S.ID_Sed = H.ID_Sed_FK
JOIN RES R ON H.ID_Hab = R.ID_Hab_FK
JOIN FAC F ON R.ID_Res = F.ID_Res_FK
GROUP BY S.Nom_Sed;
```

---

## 9️⃣ Huéspedes que han consumido TODOS los servicios

```sql
SELECT H.Nom_Hue
FROM HUE H
WHERE NOT EXISTS (
    SELECT S.ID_Ser
    FROM SER S
    WHERE NOT EXISTS (
        SELECT D.ID_Ser_FK
        FROM RES R
        JOIN D_RS D ON R.ID_Res = D.ID_Res_FK
        WHERE R.ID_Hue_FK = H.ID_Hue
        AND D.ID_Ser_FK = S.ID_Ser
    )
);
```

---

## 🔟 Reserva con mayor número de servicios

```sql
SELECT R.ID_Res, COUNT(D.ID_Ser_FK) AS Total_Servicios
FROM RES R
JOIN D_RS D ON R.ID_Res = D.ID_Res_FK
GROUP BY R.ID_Res
ORDER BY Total_Servicios DESC
LIMIT 1;
```

---

# 🎓 Nivel Académico del Modelo

Este modelo permite:

* Auditoría contable real
* Pagos parciales
* Análisis comercial
* Reportes por sede
* Análisis de consumo
* Ranking de empleados
* Evaluación de ocupación
* Escalabilidad futura (mantenimiento, housekeeping, fidelización)

---

Si quieres subir aún más el nivel, el siguiente puede ser:

* 🏥 Hospital con aseguradoras y copagos
* 🏦 Banco con créditos y amortización
* 📦 Logística multi-bodega con transferencias
* 🎓 Universidad con matrículas y prerrequisitos

Tú decides el siguiente reto.



# MEJORA DEL DER

Excelente 👏 ahora sí vamos a hacerlo **rigurosamente bien**.

Tienes razón en algo importante:

👉 En ese DER anterior **TIPOS y SERVICIOS quedaron visualmente aislados**, aunque estructuralmente sí estaban conectados por FK.
Pero en modelado profesional, **si visualmente parece aislado, está mal presentado**.

Vamos a corregirlo de forma académicamente correcta.

---

# 🎯 Primero: ¿Está mal normalizado?

No.
El modelo estaba en 3FN.

Pero:

* La representación gráfica no mostraba claramente las relaciones.
* TIPOS debía verse conectado a HABITACIONES.
* SERVICIOS debía verse claramente conectado a RESERVAS vía D_RS.
* Visualmente debe poder recorrerse todo el modelo sin saltos mentales.

Ahora lo dejamos **formal, limpio y completamente navegable**.

---

# 🏨 DER CORREGIDO — Versión Formal y Rigurosa (3FN Real)

```plaintext
                                      [ SEDES ]
                                      ---------
                                      PK ID_Sed
                                      Nom_Sed
                                          |
                                          | 1
                                          |
                                          | N
                                 -------------------
                                 |  HABITACIONES  |
                                 -------------------
                                 PK ID_Hab
                                 Num_Hab
                                 FK ID_Tip_FK  ------
                                 FK ID_Sed_FK        |
                                          |           |
                                          |           |
                                          |           |
                                          |           |
                                          |           |
                                     [ TIPOS ]       |
                                     ---------       |
                                     PK ID_Tip       |
                                     Nom_Tip         |
                                     Pre_Noche <-----


                                          |
                                          | 1
                                          |
                                          | N
                                   ----------------
                                   |   RESERVAS   |
                                   ----------------
                                   PK ID_Res
                                   F_Ingreso
                                   F_Salida
                                   FK ID_Hue_FK
                                   FK ID_Hab_FK
                                   FK ID_Emp_FK
                                     /        \
                                    /          \
                                   1            1
                                  /              \
                        ----------------    ----------------
                        |  HUESPEDES  |    |  EMPLEADOS  |
                        ----------------    ----------------
                        PK ID_Hue            PK ID_Emp
                        Nom_Hue              Nom_Emp
                        Tel_Hue


                                   |
                                   | 1
                                   |
                                   | 1
                              ----------------
                              |   FACTURAS   |
                              ----------------
                              PK ID_Fac
                              FK ID_Res_FK
                              Total_Neto
                                   |
                                   | 1
                                   |
                                   | N
                              ----------------
                              |    PAGOS     |
                              ----------------
                              PK ID_Pag
                              FK ID_Fac_FK
                              Metodo_P
                              Monto



                      (Relación N:M correctamente modelada)


                                   RESERVAS
                                       |
                                       | 1
                                       |
                                       | N
                              -------------------
                              |   DET_RES_SER   |
                              -------------------
                              PK ID_DRS
                              FK ID_Res_FK
                              FK ID_Ser_FK
                                       |
                                       | N
                                       |
                                       | 1
                                ----------------
                                |  SERVICIOS  |
                                ----------------
                                PK ID_Ser
                                Nom_Ser
                                Costo_S
```

---

# ✅ Ahora TODO está conectado

Recorridos posibles (esto es lo que importa académicamente):

---

### Desde SEDE hasta SERVICIOS

```
SEDES
 → HABITACIONES
   → RESERVAS
     → DET_RES_SER
       → SERVICIOS
```

---

### Desde TIPO hasta PAGOS

```
TIPOS
 → HABITACIONES
   → RESERVAS
     → FACTURAS
       → PAGOS
```

---

### Desde HUESPED hasta SERVICIOS

```
HUESPEDES
 → RESERVAS
   → DET_RES_SER
     → SERVICIOS
```

---

### Desde SERVICIOS hasta SEDE

```
SERVICIOS
 → DET_RES_SER
   → RESERVAS
     → HABITACIONES
       → SEDES
```

---

# 🔎 Verificación Formal de 3FN (Rigurosa)

### 1️⃣ Primera Forma Normal (1FN)

✔ No hay atributos multivaluados
✔ No hay grupos repetitivos
✔ Cada celda contiene un solo valor

---

### 2️⃣ Segunda Forma Normal (2FN)

✔ Todas las tablas tienen PK simple
✔ No existen dependencias parciales

---

### 3️⃣ Tercera Forma Normal (3FN)

✔ No hay dependencias transitivas
✔ Ninguna columna depende de algo que no sea su PK

Ejemplos correctos:

* Pre_Noche depende de ID_Tip → correcto
* Num_Hab depende de ID_Hab → correcto
* Nom_Sed depende de ID_Sed → correcto
* Nom_Ser depende de ID_Ser → correcto

Nada depende de otra tabla indirectamente.

---

# 🎓 Por qué antes parecía aislado

Porque visualmente:

* TIPOS no estaba dibujado debajo de HAB
* SERVICIOS no estaba dibujado conectado explícitamente a RESERVAS

Eso es un problema de presentación, no de normalización.

En modelado profesional:

> Si el recorrido no es evidente, el DER está mal presentado.

Y tú hiciste bien en cuestionarlo.

---

# 🧠 Punto clave que debes recordar

En un DER correcto:

* Toda tabla debe poder alcanzarse desde cualquier otra.
* Si una entidad no tiene camino lógico hacia el núcleo operativo (RESERVAS aquí), probablemente está mal diseñada.
* Las relaciones N:M SIEMPRE deben resolverse con tabla puente.

---

# 🚀 Conclusión

Ahora el modelo está:

✔ Rigurosamente en 3FN
✔ Totalmente navegable
✔ Visualmente coherente
✔ Académicamente defendible
✔ Listo para sustentación

---

Si quieres, en el siguiente mensaje podemos hacer algo todavía más estricto:

* Modelo en BCNF
* Modelo con restricciones CHECK y reglas de negocio
* Modelo con control de disponibilidad por fechas (nivel real)
* O uno todavía más complejo (Banco con amortización real)

Tú decides cuánto quieres subir el nivel 😈
