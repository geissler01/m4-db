# paso 1: la extructura

# paso 2: las depentencias
## 1. Crea el archivo package.json con valores por defecto de forma rápida
npm init -y

## 2. Instala las dependencias necesarias para que el código funcione
### express: El framework para las rutas
### mysql2: Para conectar con MySQL (soporta promesas/async-await)
### mongoose: Para la auditoría en MongoDB
### dotenv: Para leer las variables del archivo .env
npm install express mysql2 mongoose dotenv multer

## 3. Instala nodemon como "dependencia de desarrollo" (-D)
### Esto significa que solo se usará mientras programas, no cuando el sitio esté en producción
npm install -D nodemon

### resumen
Paquete,Función Principal
Express,"Gestiona las peticiones HTTP (GET, POST, etc.) que enviaremos desde Postman."
MySQL2,Permite ejecutar nuestras sentencias SQL (DDL y DML) desde JavaScript.
Mongoose,Facilita la creación de documentos en MongoDB para el log de auditoría.
Dotenv,Mantiene seguras nuestras contraseñas cargándolas desde el archivo .env.
Nodemon,Monitorea los archivos y reinicia el proceso de Node.js automáticamente.

// -------------------------------------------------------------------------------
# paso 3: configuracion de credenciales

mongo:
# Explicación del comando:
# -d: Corre en segundo plano (detached)
# --name: Nombre del contenedor
# -p 27017:27017: Mapea el puerto de Mongo al de tu PC
# mongo: Nombre de la imagen oficial
docker run -d --name mongo-nexus -p 27017:27017 mongo