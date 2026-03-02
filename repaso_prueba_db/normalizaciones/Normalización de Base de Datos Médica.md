¡Me encanta el reto\! Vamos a subir la apuesta. Imaginemos el sector de **Gestión de Salud y Consultas Médicas**. Es un sector ideal porque las relaciones son cruzadas y los datos de pacientes, médicos y medicamentos son altamente sensibles a errores si no están normalizados.

### **1\. Lógica de Negocio: Centro Médico "SaludTotal"**

* Un **Paciente** pide una **Cita** con un **Médico**.  
* Cada médico tiene una **Especialidad**.  
* Durante la cita, el médico genera una **Consulta**.  
* En la consulta, se emite una **Prescripción** (Receta).  
* Una receta puede tener **muchos Medicamentos** y un medicamento puede estar en **muchas recetas** (Relación **N:M**).  
* Cada consulta se realiza en un **Consultorio** específico.

### ---

**2\. Dataset "Sucio" (CSV Desnormalizado)**

Aquí la información está "achatada". Si un paciente recibe 3 medicamentos en una consulta, repetimos hasta el color de ojos del médico en 3 filas.

Fragmento de código

ID\_Cons,Fecha,ID\_Pac,Nom\_Pac,Tel\_Pac,ID\_Med,Nom\_Med,Especialidad,ID\_Consul,Ubicacion,Cod\_Presc,ID\_Medicam,Nom\_Medicam,Dosis,Laboratorio,Costo\_M  
5001,2026-03-01,P88,Bruce Wayne,555-0192,M07,Dr. Strange,Magia Medica,C-101,Ala Norte,RX-99,MED-01,Ibuprofeno,600mg,Genfar,15  
5001,2026-03-01,P88,Bruce Wayne,555-0192,M07,Dr. Strange,Magia Medica,C-101,Ala Norte,RX-99,MED-05,Omeprazol,20mg,MK,10  
5002,2026-03-01,P99,Diana Prince,555-0777,M07,Dr. Strange,Magia Medica,C-101,Ala Norte,RX-100,MED-01,Ibuprofeno,600mg,Genfar,15  
5003,2026-03-02,P10,Peter Parker,555-0800,M02,Dra. Foster,Astrofisica,C-202,Ala Sur,RX-101,MED-09,Antihistaminico,10mg,Bayer,25  
5003,2026-03-02,P10,Peter Parker,555-0800,M02,Dra. Foster,Astrofisica,C-202,Ala Sur,RX-101,MED-12,Vitamina C,500mg,Redoxon,12  
... (Imagina 30 filas siguiendo este patrón de redundancia extrema)

### ---

**3\. Aplicando Normalización (Hacia las 8 Tablas)**

1. **1FN (Atomicidad):** Separamos los medicamentos de la consulta.  
2. **2FN (Dependencia Parcial):** \* Los datos del paciente (Nombre, Tel) dependen de ID\_Pac. \-\> **Tabla PACIENTES**.  
   * Los datos del médico dependen de ID\_Med. \-\> **Tabla MEDICOS**.  
   * Los datos del medicamento dependen de ID\_Medicam. \-\> **Tabla MEDICAMENTOS**.  
3. **3FN (Dependencia Transitiva y Refinamiento):**  
   * La Especialidad no depende del médico, sino que es una entidad propia. \-\> **Tabla ESPECIALIDADES**.  
   * El Consultorio tiene su propia ubicación. \-\> **Tabla CONSULTORIOS**.  
   * La Prescripción es el encabezado de la receta. \-\> **Tabla PRESCRIPCIONES**.  
   * **Relación N:M:** Una Prescripción tiene muchos Medicamentos. Creamos la tabla de unión. \-\> **Tabla DETALLE\_PRESCRIPCION**.

### ---

**4\. DER en Plaintext (Modelo de 8 Tablas)**

Aquí ves cómo se estructuran las 8 tablas y sus relaciones:

Plaintext

 \[ ESPECIALIDADES \]          \[ CONSULTORIOS \]  
 \- ID\_Esp (PK)               \- ID\_Consul (PK)  
 \- Nom\_Esp                   \- Ubicacion  
      |                            |  
      | (1)                        | (1)  
      |                            |  
      | (N)                        | (N)  
 \[   MEDICOS    \] \<---------- \[  CONSULTAS  \] \----------\> \[ PACIENTES \]  
 \- ID\_Med (PK)    (1)      (N) \- ID\_Cons (PK)   (N)      (1) \- ID\_Pac (PK)  
 \- Nom\_Med                     \- Fecha                       \- Nom\_Pac  
 \- ID\_Esp (FK)                 \- ID\_Med (FK)                 \- Tel\_Pac  
                               \- ID\_Pac (FK)  
                               \- ID\_Consul (FK)  
                                     |  
                                     | (1)  
                                     |  
                                     | (1)  
                              \[ PRESCRIPCIONES \]  
                              \- Cod\_Presc (PK)  
                              \- ID\_Cons (FK)  
                                     |  
                                     | (1)  
                                     |  
                                     | (N)  
 \[ MEDICAMENTOS \] \<------- \[ DETALLE\_PRESCRIPCION \] (Relación N:M)  
 \- ID\_Medicam (PK) (1)  (N) \- Cod\_Presc (FK)  
 \- Nom\_Medicam              \- ID\_Medicam (FK)  
 \- Laboratorio              \- Dosis\_Especifica  
 \- Costo\_M

### **Por qué este modelo es superior:**

1. **Tablas 1 y 2 (Especialidades y Médicos):** Si el Dr. Strange cambia de especialidad, solo cambias un ID.  
2. **Tabla 3 (Consultorios):** Si el consultorio C-101 se mueve al "Ala Este", solo lo editas en una fila.  
3. **Tabla 4 (Consultas):** Es el corazón que une al Médico, Paciente y Consultorio en un momento del tiempo.  
4. **Tabla 5 (Pacientes):** Datos personales aislados para seguridad.  
5. **Tablas 6, 7 y 8 (Prescripciones, Detalle y Medicamentos):** Aquí es donde ocurre la magia **N:M**.  
   * PRESCRIPCIONES es el "título" de la receta.  
   * DETALLE\_PRESCRIPCION permite que una sola receta tenga 10 pastillas diferentes sin repetir la fecha ni el nombre del paciente.

¿Te gustaría que probemos a insertar 5 registros reales distribuidos en estas 8 tablas para ver cómo "viaja" la información a través de los IDs?