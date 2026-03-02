# SISTEMA DE REPORTES DINÁMICO - TALLER SQL

Este proyecto implementa una API REST utilizando Node.js y Express para gestionar y ejecutar un taller de 40 consultas SQL de manera eficiente y organizada.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

El proyecto sigue un patrón de separación de responsabilidades para mantener el código limpio y escalable:

1. **Capa de Servidor (server.js):** Gestiona las peticiones HTTP y las rutas.
2. **Capa de Configuración (config/db.js):** Administra el Pool de conexiones a MySQL.
3. **Capa de Datos (src/queries.js):** Diccionario centralizado que almacena todas las sentencias SQL.
4. **Variables de Entorno (.env):** Protección de credenciales sensibles.

---

## 🚀 CONFIGURACIÓN INICIAL

### 1. Requisitos
Instalar las dependencias necesarias en la terminal:
npm install express mysql2 dotenv
npm install -D nodemon

### 2. Archivo de Entorno (.env)
Configurar las siguientes variables:
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_de_tu_bd
DB_PORT=3306

---

## 📂 ESTRUCTURA DE ARCHIVOS

tu-proyecto/
├── config/
│   └── db.js          # Conexión Pool con Promesas
├── src/
│   └── queries.js     # Diccionario de las 40 consultas
├── .env               # Credenciales
├── server.js          # Lógica del servidor y rutas
└── package.json       # Scripts (npm run dev)

---

## 📡 ENDPOINTS Y USO

El servidor utiliza un solo endpoint dinámico para todas las consultas. Esto evita la repetición de código y facilita el mantenimiento.

URL Base: http://localhost:3000/consultas/:id

### Cómo ejecutar:
- Para ejecutar la consulta 1: GET http://localhost:3000/consultas/1
- Para ejecutar la consulta 32: GET http://localhost:3000/consultas/32
- Para ejecutar la consulta 40: GET http://localhost:3000/consultas/40

---

## 🔌 VALIDACIÓN DE CONEXIÓN

El sistema incluye un "Heartbeat" (Latido) automático al iniciar. Ejecuta un `SELECT 1` para confirmar que el servidor de Express tiene comunicación total con MySQL antes de recibir peticiones. Si las credenciales en el .env son incorrectas, el sistema notificará el error inmediatamente en la consola.

---

## 📝 NOTAS DE MANTENIMIENTO

- Las consultas en `queries.js` están escritas con Backticks (``), lo que permite formatear el SQL en múltiples líneas para mayor legibilidad, tal como se visualiza en DBeaver.
- El servidor se reinicia automáticamente al detectar cambios gracias a Nodemon.

# OTRA OPCION
# GUÍA TÉCNICA: MOTOR DE CONSULTAS SQL CON EXPRESS.JS

Este documento contiene los pasos detallados para la construcción, configuración y despliegue del servidor de reportes dinámico.

---

## 1. COMANDOS DE INICIALIZACIÓN (TERMINAL)

Ejecutar en orden dentro de la carpeta del proyecto:

1. `npm init -y`
   - Inicializa el proyecto y crea el package.json.

2. `npm install express mysql2 dotenv`
   - express: Servidor web y manejo de rutas (Endpoints).
   - mysql2: Driver para conectar con MySQL (soporta Promesas/Async-Await).
   - dotenv: Gestión de variables de entorno para seguridad de credenciales.

3. `npm install -D nodemon`
   - Instala nodemon como dependencia de desarrollo.
   - Función: Reiniciar el servidor automáticamente al detectar cambios en el código.

---

## 2. ESTRUCTURA DE ARCHIVOS

tu-proyecto/
├── .env                # Archivo con credenciales (NO subir a GitHub)
├── server.js           # Lógica principal, rutas y arranque
├── config/
│   └── db.js           # Configuración del Pool de conexiones
├── src/
│   └── queries.js      # Diccionario de las 40 consultas SQL
└── package.json        # Configuración de scripts (npm run dev)

---

## 3. NOTAS IMPORTANTES EN LOS ARCHIVOS JS

### Archivo: config/db.js
- Se utiliza 'mysql.createPool' en lugar de 'createConnection'. 
- El Pool gestiona múltiples conexiones simultáneas, evitando que el servidor se bloquee si hay varios usuarios.
- IMPORTANTE: Se exporta 'pool.promise()' para poder usar 'await' en el server.js.

### Archivo: src/queries.js
- Todas las consultas se guardan en un objeto JSON.
- Se usan backticks (``) para permitir SQL multilínea.
- Nota: Las consultas deben estar "quemadas" (valores fijos) para evitar la complejidad de parámetros en la URL durante la prueba.

### Archivo: server.js
- 'app.use(express.json())': Middleware obligatorio para que el servidor procese datos.
- 'req.params.id': Método para obtener el número de consulta desde la URL.
- 'db.query(sql)': Ejecuta el string SQL obtenido del diccionario mediante el ID.

---

## 4. PROCEDIMIENTO DE PRUEBA (POSTMAN)

1. Iniciar el servidor:
   `npm run dev`

2. Validar conexión:
   Revisar la consola. El comando 'SELECT 1' debe imprimir: "✅ Conexión establecida".

3. Ejecutar Reportes:
   - URL: http://localhost:3000/consultas/1
   - URL: http://localhost:3000/consultas/22
   - URL: http://localhost:3000/consultas/40

---

## 5. SOLUCIÓN DE PROBLEMAS (DEBUGGING)

- ERROR 'ECONNREFUSED': MySQL está apagado. Iniciar XAMPP o MySQL Service.
- ERROR 'ER_BAD_DB_ERROR': El nombre de la base de datos en el .env no coincide con el de MySQL.
- ERROR '404': El ID solicitado en la URL no existe como llave en el objeto de queries.js.
- RESULTADO NULL O VACÍO: La consulta es correcta pero el valor quemado (ej. ID=3) no existe en la base de datos actual.