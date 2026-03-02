¡Aceptado\! Vamos a reconstruir el **Sistema de Biblioteca** con rigor académico. Este es el modelo que suele aparecer en exámenes porque separa perfectamente la **obra** (Libros) del **objeto** (Ejemplares).

### ---

**1\. Diccionario de Datos (Nombres Comprimidos)**

| Tabla | Columna | Significado |
| :---- | :---- | :---- |
| **SOC** | ID\_Soc (PK) | Socio de la biblioteca |
| **STA** | ID\_Sta (PK) | Personal (Staff) que atiende |
| **PRE** | ID\_Pre (PK) | Encabezado del Préstamo (Fecha, Socio) |
| **D\_P** | ID\_Pre\_FK, ID\_Eje\_FK | Detalle del Préstamo (Relación N:M entre Préstamo y Ejemplar) |
| **EJE** | ID\_Eje (PK) | Código de barras de la copia física |
| **LIB** | ISBN (PK) | Identificador único de la obra literaria |
| **A\_L** | ID\_Aut\_FK, ISBN\_FK | Tabla puente Autor-Libro (Relación N:M) |
| **AUT** | ID\_Aut (PK) | Autor de los libros |
| **GEN** | ID\_Gen (PK) | Género (Terror, Ciencia Ficción, etc.) |
| **EDI** | ID\_Edi (PK) | Editorial que publica |

### ---

**2\. Dataset "Sucio" (20 registros base)**

Imagínate esto en un Excel antes de normalizar:

Fragmento de código

ID\_Pre,F\_Sal,ID\_Soc,Nom\_Soc,ISBN,Tit\_Lib,ID\_Aut,Nom\_Aut,ID\_Eje,Est\_Eje,ID\_Sta,Nom\_Sta,ID\_Gen,Nom\_Gen  
101,2026-03-01,S1,Alice,ISBN-A,Good Omens,A1,Neil Gaiman,E-001,Nuevo,ST1,Juan,G1,Fantasia  
101,2026-03-01,S1,Alice,ISBN-A,Good Omens,A2,Terry Pratchett,E-001,Nuevo,ST1,Juan,G1,Fantasia  
102,2026-03-01,S2,Bob,ISBN-B,It,A3,Stephen King,E-002,Usado,ST2,Ana,G2,Terror  
103,2026-03-02,S1,Alice,ISBN-C,Dune,A4,Frank Herbert,E-003,Dañado,ST1,Juan,G3,Sci-Fi  
104,2026-03-02,S3,Charlie,ISBN-B,It,A3,Stephen King,E-004,Nuevo,ST2,Ana,G2,Terror  
... (y así hasta 20 registros con autores y socios repitiéndose)

### ---

**3\. DER Normalizado (3FN) con Cardinalidades**

Plaintext

 \[ AUTORES \] (1)           \[ GEN\_LIB \] (1)         \[ EDITORIALES \] (1)  
      |                         |                       |  
      |                         |                       |  
      | (N)                     | (N)                   | (N)  
 \[ AUT\_LIB \] (N) \<------- \[   LIBROS    \] \<-------------+  
 (Puente N:M)             \- ISBN (PK)  
 \- ID\_Aut\_FK (FK)         \- Tit\_Lib  
 \- ISBN\_FK (FK)           \- ID\_Gen\_FK (FK)  
                          \- ID\_Edi\_FK (FK)  
                                |  
                                | (1)  
                                |  
                                | (N)  
 \[   STAFF   \] (1)         \[ EJEMPLARES \]  
      |                    \- ID\_Eje (PK)  
      |                    \- ISBN\_FK (FK)  
      | (N)                \- Est\_Eje  
      |                         |  
 \[ PRESTAMOS \] (1) \<------------+ (1)  
 \- ID\_Pre (PK)                  |  
 \- F\_Sal                        | (N)  
 \- ID\_Soc\_FK (FK)          \[ DET\_PRE \] (Puente N:M)  
      |                    \- ID\_Pre\_FK (FK)  
      | (N)                \- ID\_Eje\_FK (FK)  
      |                         |  
 \[  SOCIOS   \] (1) \<------------+  
 \- ID\_Soc (PK)  
 \- Nom\_Soc

### ---

**4\. Consultas SQL Complejas (Comentadas)**

Aquí es donde las FKs cobran vida. Observa cómo "saltamos" de tabla en tabla.

#### **Consulta 1: ¿Qué autores ha leído el socio 'Alice'?**

SQL

SELECT DISTINCT A.Nom\_Aut \-- Seleccionamos el nombre del autor  
FROM SOC S \-- Empezamos en Socios  
JOIN PRE P ON S.ID\_Soc \= P.ID\_Soc\_FK \-- Unimos con sus préstamos  
JOIN D\_P DP ON P.ID\_Pre \= DP.ID\_Pre\_FK \-- Saltamos al detalle del préstamo  
JOIN EJE E ON DP.ID\_Eje\_FK \= E.ID\_Eje \-- Buscamos qué ejemplar físico era  
JOIN LIB L ON E.ISBN\_FK \= L.ISBN \-- Conectamos el ejemplar con la obra (ISBN)  
JOIN A\_L AL ON L.ISBN \= AL.ISBN\_FK \-- Entramos al puente de autores  
JOIN AUT A ON AL.ID\_Aut\_FK \= A.ID\_Aut \-- Finalmente llegamos al nombre del autor  
WHERE S.Nom\_Soc \= 'Alice'; \-- Filtramos por el nombre del socio

#### **Consulta 2: Libros que tienen más de un autor (Detección de N:M)**

SQL

SELECT L.Tit\_Lib, COUNT(AL.ID\_Aut\_FK) AS Num\_Autores \-- Título y conteo de autores  
FROM LIB L \-- Desde la tabla Libros  
JOIN A\_L AL ON L.ISBN \= AL.ISBN\_FK \-- Unimos con el puente de autores  
GROUP BY L.Tit\_Lib \-- Agrupamos por libro  
HAVING COUNT(AL.ID\_Aut\_FK) \> 1; \-- Solo libros con más de 1 autor

#### **Consulta 3: El bibliotecario (Staff) que más libros de 'Terror' ha prestado**

SQL

SELECT ST.Nom\_Sta, COUNT(\*) AS Total \-- Nombre del staff y su récord  
FROM STA ST \-- Desde el personal  
JOIN PRE P ON ST.ID\_Sta \= P.ID\_Sta\_FK \-- Unimos con los préstamos que atendió  
JOIN D\_P DP ON P.ID\_Pre \= DP.ID\_Pre\_FK \-- Vamos al detalle  
JOIN EJE E ON DP.ID\_Eje\_FK \= E.ID\_Eje \-- Al ejemplar  
JOIN LIB L ON E.ISBN\_FK \= L.ISBN \-- Al libro  
JOIN GEN G ON L.ID\_Gen\_FK \= G.ID\_Gen \-- Al género  
WHERE G.Nom\_Gen \= 'Terror' \-- Filtramos por género  
GROUP BY ST.Nom\_Sta \-- Agrupamos por bibliotecario  
ORDER BY Total DESC \-- El que más trabajó arriba  
LIMIT 1; \-- Solo el primero

#### **Consulta 4: Listado de libros que NUNCA han sido prestados**

SQL

SELECT L.Tit\_Lib \-- Título del libro  
FROM LIB L \-- Desde libros  
JOIN EJE E ON L.ISBN \= E.ISBN\_FK \-- Pasamos a sus ejemplares  
LEFT JOIN D\_P DP ON E.ID\_Eje \= DP.ID\_Eje\_FK \-- Left Join para incluir ejemplares sin préstamos  
WHERE DP.ID\_Pre\_FK IS NULL; \-- Filtramos los que no tienen registro en el detalle

#### **Consulta 5: Socios que tienen préstamos activos de libros de la editorial 'Sudamericana'**

SQL

SELECT DISTINCT S.Nom\_Soc \-- Nombre del socio  
FROM SOC S \-- Desde socios  
JOIN PRE P ON S.ID\_Soc \= P.ID\_Soc\_FK \-- A sus préstamos  
JOIN D\_P DP ON P.ID\_Pre \= DP.ID\_Pre\_FK \-- Al detalle  
JOIN EJE E ON DP.ID\_Eje\_FK \= E.ID\_Eje \-- Al ejemplar  
JOIN LIB L ON E.ISBN\_FK \= L.ISBN \-- Al libro  
JOIN EDI ED ON L.ID\_Edi\_FK \= ED.ID\_Edi \-- A la editorial  
WHERE ED.Nom\_Edi \= 'Sudamericana'; \-- Filtro por la editorial específica

### **Guía de "Navegación Mental" para la prueba:**

1. **¿Quién?** (Socio) → ID\_Soc  
2. **¿Cuándo?** (Préstamo) → ID\_Pre  
3. **¿Qué objeto?** (Ejemplar) → ID\_Eje  
4. **¿Qué obra?** (Libro) → ISBN  
5. **¿De quién es?** (Autor) → ID\_Aut

¿Te sientes listo para aplicar esto en SQL o prefieres que hagamos un último ejercicio "trampa" sobre un sistema de **Vuelos y Reservas**? (Ahí las relaciones N:M son triplemente divertidas).