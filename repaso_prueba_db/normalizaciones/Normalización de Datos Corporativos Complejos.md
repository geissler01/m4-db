¡Acepto el reto\! Vamos a entrar en las grandes ligas: **Gestión de Proyectos Corporativos Multi-Sede**.

Este escenario es complejo porque un proyecto ocurre en una sede, pero involucra empleados de distintos departamentos, con diferentes cargos, y requiere el uso de activos (hardware/software) que tienen sus propios costos y números de serie.

### ---

**1\. El Dataset "Sucio" (20 Columnas x 20 Registros)**

Aquí la redundancia es un crimen. Si un empleado usa 2 activos en un proyecto, repetimos hasta el país de la sede.

Fragmento de código

ID\_Proy,Nom\_Proy,Presupuesto,F\_Inicio,ID\_Emp,Nom\_Emp,Email\_Emp,ID\_Cargo,Nom\_Cargo,ID\_Depto,Nom\_Depto,ID\_Sede,Ciudad,Pais,ID\_Act,Nom\_Act,Serie\_Act,Costo\_Act,Hrs,Rol  
101,Apollo-X,50000,2026-01-10,E1,Elon,e@x.com,C1,Director,D1,I+D,S1,Austin,USA,A9,Laptop M3,SN-001,3500,40,Lider  
101,Apollo-X,50000,2026-01-10,E1,Elon,e@x.com,C1,Director,D1,I+D,S1,Austin,USA,A4,Monitor 4K,SN-999,800,40,Lider  
101,Apollo-X,50000,2026-01-10,E2,Gwynne,g@x.com,C2,Manager,D1,I+D,S1,Austin,USA,A9,Laptop M3,SN-002,3500,35,Analista  
102,Zenith,25000,2026-02-15,E3,Satya,s@m.com,C1,Director,D2,Cloud,S2,Seattle,USA,A1,Server R7,SN-500,12000,20,Arquitecto  
102,Zenith,25000,2026-02-15,E3,Satya,s@m.com,C1,Director,D2,Cloud,S2,Seattle,USA,A2,Licencia Azure,LIC-12,5000,20,Arquitecto  
101,Apollo-X,50000,2026-01-10,E4,Jensen,j@n.com,C3,Engineer,D3,Hardware,S3,Santa Clara,USA,A7,GPU H100,SN-888,25000,50,Dev  
103,DeepMind,80000,2026-03-01,E5,Demis,d@g.com,C1,Director,D4,AI Lab,S4,London,UK,A9,Laptop M3,SN-003,3500,45,Lider  
103,DeepMind,80000,2026-03-01,E5,Demis,d@g.com,C1,Director,D4,AI Lab,S4,London,UK,A5,TPU V5,SN-111,15000,45,Lider  
101,Apollo-X,50000,2026-01-10,E6,Lisa,l@a.com,C2,Manager,D3,Hardware,S3,Santa Clara,USA,A9,Laptop M3,SN-004,3500,30,Soporte  
104,Starlink,15000,2026-04-01,E1,Elon,e@x.com,C1,Director,D1,I+D,S1,Austin,USA,A3,Antena Phased,SN-333,2000,10,Consultor  
102,Zenith,25000,2026-02-15,E7,Sam,s@o.com,C3,Engineer,D2,Cloud,S2,Seattle,USA,A9,Laptop M3,SN-005,3500,40,Dev  
103,DeepMind,80000,2026-03-01,E8,Ilya,i@o.com,C3,Engineer,D4,AI Lab,S4,London,UK,A9,Laptop M3,SN-006,3500,50,Researcher  
105,Quantum,99000,2026-05-20,E9,Sundar,s@g.com,C1,Director,D4,AI Lab,S4,London,UK,A6,Quantum Proc,SN-Q1,100000,15,Lider  
105,Quantum,99000,2026-05-20,E9,Sundar,s@g.com,C1,Director,D4,AI Lab,S4,London,UK,A9,Laptop M3,SN-007,3500,15,Lider  
101,Apollo-X,50000,2026-01-10,E10,Tim,t@a.com,C2,Manager,D3,Hardware,S1,Austin,USA,A9,Laptop M3,SN-008,3500,20,Finanzas  
104,Starlink,15000,2026-04-01,E11,Parag,p@t.com,C3,Engineer,D1,I+D,S1,Austin,USA,A9,Laptop M3,SN-009,3500,30,Dev  
102,Zenith,25000,2026-02-15,E12,Ruth,r@g.com,C2,Manager,D2,Cloud,S2,Seattle,USA,A9,Laptop M3,SN-010,3500,25,CFO  
103,DeepMind,80000,2026-03-01,E13,Yann,y@m.com,C3,Engineer,D4,AI Lab,S4,London,UK,A7,GPU H100,SN-889,25000,40,Scientist  
105,Quantum,99000,2026-05-20,E14,Jeff,j@a.com,C1,Director,D3,Hardware,S3,Santa Clara,USA,A9,Laptop M3,SN-011,3500,10,Advisor  
104,Starlink,15000,2026-04-01,E15,Mira,m@o.com,C2,Manager,D1,I+D,S1,Austin,USA,A9,Laptop M3,SN-012,3500,20,Analista

### ---

**2\. Lógica de Normalización (Hacia las 8+ Tablas)**

#### **1FN (Atomicidad)**

Eliminamos grupos repetidos. La PK es compuesta: (ID\_Proy, ID\_Emp, ID\_Act).

#### **2FN (Dependencia Funcional)**

* Los datos del **Proyecto** (Nom\_Proy, Presupuesto, F\_Inicio) dependen solo de ID\_Proy. \-\> **Tabla PROYECTOS**.  
* Los datos del **Empleado** (Nom\_Emp, Email\_Emp) dependen solo de ID\_Emp. \-\> **Tabla EMPLEADOS**.  
* Los datos del **Activo** (Nom\_Act, Serie\_Act, Costo\_Act) dependen solo de ID\_Act. \-\> **Tabla ACTIVOS**.

#### **3FN (Dependencias Transitivas e Integridad)**

* **Cargos:** Nom\_Cargo depende de ID\_Cargo, no del empleado. \-\> **Tabla CARGOS**.  
* **Departamentos:** Nom\_Depto depende de ID\_Depto. \-\> **Tabla DEPARTAMENTOS**.  
* **Sedes:** Ciudad y Pais dependen de ID\_Sede. \-\> **Tabla SEDES**.  
* **Relaciones N:M:** \* Un empleado puede estar en varios proyectos y un proyecto tiene varios empleados. \-\> **Tabla ASIGNACION\_PERSONAL**.  
  * Un proyecto usa varios activos y un activo puede ser asignado a varios proyectos (en tiempos distintos). \-\> **Tabla RECURSOS\_PROYECTO**.

### ---

**3\. El DER "Hermoso" en Plaintext**

Plaintext

 \[ SEDES \]                   \[ CARGOS \]  
 \- ID\_Sede (PK)              \- ID\_Cargo (PK)  
 \- Ciudad                    \- Nom\_Cargo  
 \- Pais                           |  
      |                           |  
      | (1)                       | (1)  
      |                           |  
      | (N)                       | (N)  
 \[ DEPARTAMENTOS \]           \[ EMPLEADOS \]  
 \- ID\_Depto (PK)             \- ID\_Emp (PK)  
 \- Nom\_Depto                 \- Nom\_Emp  
 \- ID\_Sede (FK)              \- Email\_Emp  
      |                      \- ID\_Cargo (FK)  
      | (1)                  \- ID\_Depto (FK)  
      |                            |  
      | (N)                        | (1)  
 \[  PROYECTOS  \]                   |  
 \- ID\_Proy (PK)                    | (N)  
 \- Nom\_Proy            \[ ASIGNACION\_PERSONAL \] (N:M)  
 \- Presupuesto         \- ID\_Proy (FK)  
 \- F\_Inicio            \- ID\_Emp (FK)  
      |                \- Horas\_Asignadas  
      |                \- Rol\_En\_Proy  
      | (1)                        |  
      |                            |  
      | (N)                        | (1)  
 \[ RECURSOS\_PROYECTO \] \<-----------+ (N:M)  
 \- ID\_Proy (FK)  
 \- ID\_Act (FK)  
 \- Fecha\_Asignacion  
      |  
      | (N)  
      |  
      | (1)  
 \[   ACTIVOS   \]  
 \- ID\_Act (PK)  
 \- Nom\_Act  
 \- Serie\_Act  
 \- Costo\_Act

### ---

**¿Por qué esta estructura es una "obra de arte" de datos?**

1. **Aislamiento de Costos:** Si el Costo\_Act de las "Laptop M3" sube, solo lo cambias en la tabla ACTIVOS.  
2. **Movilidad Geográfica:** Si el departamento de "I+D" se muda de Austin a Miami, solo cambias la ID\_Sede en la tabla DEPARTAMENTOS.  
3. **Historial de Roles:** En ASIGNACION\_PERSONAL, Elon puede ser "Lider" en el proyecto Apollo-X pero solo "Consultor" en Starlink, sin conflicto de datos.  
4. **Escalabilidad:** Puedes añadir 100 empleados al mismo proyecto sin repetir nunca más el presupuesto del proyecto ni la ubicación de la oficina.

¿Te gustaría que generemos el **Diccionario de Datos** (tipos de datos, longitudes y restricciones) para este modelo o pasamos a otro sector aún más complejo?