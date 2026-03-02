¡Entendido perfectamente\! El "mapa de navegación" es lo que te permite no perderte en el bosque de tablas. Para este ejercicio, vamos a usar el sector de **Concesionarios y Seguros Automotrices**.

Es un modelo excelente porque tiene una "cadena" larga: desde la venta del auto hasta las coberturas específicas del seguro que contrató el cliente.

### ---

**1\. El Dataset "Sucio" (20 Columnas x 20 Filas)**

Aquí verás que si un auto tiene 3 coberturas de seguro, repetimos hasta el color de ojos del vendedor.

Fragmento de código

ID\_Vta,Fecha,ID\_Cli,Nom\_Cli,Tel\_Cli,VIN,Marca,Modelo,Anio,Precio\_V,ID\_Emp,Nom\_Emp,ID\_Pol,Aseguradora,F\_Venc,ID\_Cob,Nom\_Cob,Monto\_Max,ID\_Sede,Nom\_Sede  
V001,2026-03-01,C10,Tony Stark,555-01,VIN123,Audi,R8,2026,150000,E5,Nat Romanoff,P99,StarkInd,2027-03,CB1,Choque,100000,S1,Malibu  
V001,2026-03-01,C10,Tony Stark,555-01,VIN123,Audi,R8,2026,150000,E5,Nat Romanoff,P99,StarkInd,2027-03,CB2,Robo,150000,S1,Malibu  
V002,2026-03-01,C20,Steve Rogers,555-02,VIN456,Chevy,Silverado,1940,45000,E6,Sam Wilson,P88,ShieldIns,2027-03,CB1,Choque,50000,S2,Brooklyn  
V003,2026-03-02,C30,Wanda M,555-03,VIN789,VW,Beetle,2024,25000,E5,Nat Romanoff,P77,ChaosIns,2027-03,CB3,Terceros,200000,S1,Malibu  
V004,2026-03-02,C40,Bruce Banner,555-04,VIN000,Gamma,Hulkster,2025,80000,E7,Clint Barton,P66,GreenIns,2027-03,CB1,Choque,80000,S3,India  
V004,2026-03-02,C40,Bruce Banner,555-04,VIN000,Gamma,Hulkster,2025,80000,E7,Clint Barton,P66,GreenIns,2027-03,CB2,Robo,80000,S3,India  
V005,2026-03-03,C10,Tony Stark,555-01,VIN111,Iron,Suit-Mark5,2026,999999,E5,Nat Romanoff,P55,StarkInd,2028-03,CB1,Choque,999999,S1,Malibu  
V006,2026-03-03,C50,Thor O,555-05,VIN222,Asgard,Hammer,2024,50000,E6,Sam Wilson,P44,OdinIns,2027-03,CB3,Terceros,500000,S2,Brooklyn  
V007,2026-03-04,C60,Peter P,555-06,VIN333,Stark,SpideyCar,2025,30000,E7,Clint Barton,P33,StarkInd,2027-03,CB1,Choque,20000,S3,India  
V008,2026-03-04,C20,Steve Rogers,555-02,VIN456,Chevy,Silverado,1940,45000,E5,Nat Romanoff,P22,ShieldIns,2027-03,CB4,Incendio,40000,S1,Malibu  
V009,2026-03-05,C70,Stephen S,555-07,VIN444,Lambo,Strange,2026,200000,E6,Sam Wilson,P11,MagicIns,2027-03,CB1,Choque,150000,S2,Brooklyn  
V010,2026-03-05,C80,T'Challa,555-08,VIN555,Vibra,Panther,2026,500000,E7,Clint Barton,P00,WakandaIns,2027-03,CB2,Robo,500000,S3,India  
V011,2026-03-06,C10,Tony Stark,555-01,VIN123,Audi,R8,2026,150000,E5,Nat Romanoff,P99,StarkInd,2027-03,CB4,Incendio,150000,S1,Malibu  
V012,2026-03-06,C90,Scott Lang,555-09,VIN666,Pym,AntVan,1970,5000,E6,Sam Wilson,P12,QuantumIns,2027-03,CB3,Terceros,10000,S2,Brooklyn  
V013,2026-03-07,C100,Hope V,555-10,VIN777,Pym,WaspJet,2025,120000,E7,Clint Barton,P13,QuantumIns,2027-03,CB1,Choque,100000,S3,India  
V014,2026-03-07,C30,Wanda M,555-03,VIN789,VW,Beetle,2024,25000,E5,Nat Romanoff,P77,ChaosIns,2027-03,CB4,Incendio,25000,S1,Malibu  
V015,2026-03-08,C40,Bruce Banner,555-04,VIN000,Gamma,Hulkster,2025,80000,E6,Sam Wilson,P66,GreenIns,2027-03,CB3,Terceros,80000,S2,Brooklyn  
V016,2026-03-08,C50,Thor O,555-05,VIN222,Asgard,Hammer,2024,50000,E7,Clint Barton,P44,OdinIns,2027-03,CB2,Robo,50000,S3,India  
V017,2026-03-09,C60,Peter P,555-06,VIN333,Stark,SpideyCar,2025,30000,E5,Nat Romanoff,P33,StarkInd,2027-03,CB2,Robo,30000,S1,Malibu  
V018,2026-03-09,C20,Steve Rogers,555-02,VIN456,Chevy,Silverado,1940,45000,E6,Sam Wilson,P22,ShieldIns,2027-03,CB3,Terceros,45000,S2,Brooklyn  
V019,2026-03-10,C10,Tony Stark,555-01,VIN123,Audi,R8,2026,150000,E7,Clint Barton,P99,StarkInd,2027-03,CB5,Inundacion,150000,S3,India  
V020,2026-03-10,C70,Stephen S,555-07,VIN444,Lambo,Strange,2026,200000,E5,Nat Romanoff,P11,MagicIns,2027-03,CB2,Robo,200000,S1,Malibu

### ---

**2\. Diccionario de Columnas (Nombres Comprimidos)**

| Columna | Significado | Tabla Destino |
| :---- | :---- | :---- |
| **ID\_Vta (PK)** | ID de la Venta | VENTAS |
| **VIN (PK)** | Número de Chasis (Vehicle ID) | VEHICULOS |
| **ID\_Cli (PK)** | ID del Cliente | CLIENTES |
| **ID\_Emp (PK)** | ID del Empleado (Vendedor) | EMPLEADOS |
| **ID\_Pol (PK)** | ID de la Póliza de Seguro | POLIZAS |
| **ID\_Cob (PK)** | ID de la Cobertura (Robo, Choque, etc.) | COBERTURAS |
| **ID\_Sed (PK)** | ID de la Sede física del concesionario | SEDES |
| **ID\_Pol\_Cob (PK)** | Tabla Puente (Relación N:M) | POLIZA\_COBERTURA |

### ---

**3\. Proceso de Normalización (3FN)**

* **1FN:** Los autos con múltiples coberturas (como el Audi de Tony Stark) se separan. La PK inicial es (ID\_Vta, ID\_Cob).  
* **2FN:** Separamos los datos del **Vehículo** (Marca, Modelo) que dependen solo del VIN, y los datos del **Cliente** que dependen solo del ID\_Cli.  
* **3FN:** Eliminamos dependencias transitivas. La aseguradora depende de la póliza, pero la póliza depende de la venta. Las coberturas son un catálogo independiente (N:M).

### ---

**4\. El DER Definitivo (Con relaciones y flujo)**

Aquí tienes el diagrama con las cardinalidades (1:N, N:N) y las claves para que no te pierdas.

Plaintext

 \[ SEDES \]                   \[ EMPLEADOS \]  
 \- ID\_Sed (PK)               \- ID\_Emp (PK)  
 \- Nom\_Sede                  \- Nom\_Emp  
      |                            |  
      | (1)                        | (1)  
      |                            |  
      | (N)                        | (N)  
 \[  VENTAS   \] \<-------------------+ (Registro de quién vendió)  
 \- ID\_Vta (PK)   
 \- Fecha  
 \- ID\_Cli\_FK (FK) \>----------+ \[ CLIENTES \]  
 \- ID\_Emp\_FK (FK)            \- ID\_Cli (PK)  
 \- ID\_Sed\_FK (FK)            \- Nom\_Cli  
 \- VIN\_FK (FK) \>-------+     \- Tel\_Cli  
      |                |  
      | (1)            | (1)         \[ MODELOS \]  
      |                |             \- ID\_Mod (PK)  
      | (1)            | (N)         \- Marca, Modelo  
 \[ POLIZAS \]      \[ VEHICULOS \]            | (1)  
 \- ID\_Pol (PK)    \- VIN (PK)               |  
 \- Aseguradora    \- Anio                   | (N)  
 \- ID\_Vta\_FK (FK) \- ID\_Mod\_FK (FK) \>-------+  
      |  
      | (1)  
      |  
      | (N)  
 \[ POLIZA\_COBERTURA \] (N:M)          \[ COBERTURAS \]  
 \- ID\_Pol\_FK (FK) \-----------------\> \- ID\_Cob (PK)  
 \- ID\_Cob\_FK (FK)          (N)  (1)  \- Nom\_Cob  
 \- Monto\_Max                         \- Descripcion

### ---

**5\. Guía de Navegación (¿Cómo llego de X a Y?)**

Si en la prueba te preguntan: **"¿Qué coberturas tiene el auto que vendió Nat Romanoff el 01 de marzo?"**, el camino es:

1. **EMPLEADOS**: Buscas a Nat Romanoff para obtener su ID\_Emp (E5).  
2. **VENTAS**: Haces un JOIN con EMPLEADOS por ID\_Emp\_FK y filtras por la fecha. Obtienes el ID\_Vta (V001).  
3. **POLIZAS**: Haces JOIN con VENTAS usando el ID\_Vta\_FK. Así obtienes el ID\_Pol (P99).  
4. **POLIZA\_COBERTURA**: Usas el ID\_Pol para entrar a la tabla puente. Aquí verás varios registros (CB1, CB2, CB5).  
5. **COBERTURAS**: Finalmente, haces JOIN con los ID\_Cob para saber que Nat vendió un auto protegido contra *Choque, Robo e Inundación*.

¿Ves como la tabla **POLIZA\_COBERTURA** es el puente necesario para que la póliza no se repita por cada riesgo?

¿Te gustaría que simulemos una consulta SQL real sobre este modelo o prefieres que intentemos normalizar un caso de **Producción Industrial** (donde entran materias primas y salen productos terminados)?