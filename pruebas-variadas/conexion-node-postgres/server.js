// importaciones
const express = require('express');
const pool = require('./db');  // este es nuestro archivo de connexion
require('dotenv').config();

// 2. configuracion
const app = express();  // esto se convierte en el express en si mismo
const PORT = process.env.PORT || 3000;  // tengo que afinar esto

// 3. middleware (software intermedio)
app.use(express.json());

// 5. arranque del servidor
app.listen(PORT, () => {
    console.log(`servidor escuchando en localhost: ${PORT}`)
})


// ## METODOS ##
// metodo GET
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users')
        res.json(result.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al realizar la consulta' })
    }
}),
// en postman solo debemos seleccionar el metodo, copiar la ruta mas el endpoint y listo


// METODO POST
// ruta para crear un usuario
app.post('/users', async (req, res) => {
    // tomanos todos los campos que vienen del bofy (postman en este caso)
    const {
        document, name, last_name, email, age, monthly_income, date_birth, gender, biography, country_code, preferences
    } = req.body;  // requerimos estos campos del body

    try {
        // nuestra consulta sql
        const queryText = `
        INSERT INTO users (
            document, name, last_name, email, age, monthly_income, date_birth, gender, biography, country_code, preferences    
        )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        //RETURNING devuelve el registro completo que acabamos de hacer, es decir, me trae los datos que se generan por defecto, como id y otros

        // pasamos los valores en un array para evitar que se vean los datos
        const values = [document, name, last_name, email, age, monthly_income, date_birth, gender, biography, country_code, preferences || {}]; // por si no trae preferenceia

        const result = await pool.query(queryText, values)  //aqui se ejecuta realmente en comando sql en postgresq

        // respondemos al isuario ()
        res.status(201).json({
            mensaje: "usuario creado exitosamente",
            usuario: result.rows[0]
        });

    } catch (err) {
        console.log("error al insertat", err.message);

        // manejo de errores especificos
        if (err.code === '23505') {
            return res.status(400).json({
                error: "el documento o email ya existen"
            }) // el error '23505' viene de postgres y significa que se violo valores unicos
        }

        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})
// en postman seleccionamos nuestra ruta mas el endpoint y vamos al body, seleccionamos row: escribimos nuestro json completo con los datos que estamos colocando en la consulta y listo


// DELETE
app.delete('/users/:id', async (req, res) => {
    // :id es un valor variable, por eso tiene esta notacion, lo escogemos desde el postman mediante la url
    // obteniendo el id
    const { id } = req.params;  // se obtiene de params, que es de express, toma lo que despues de los dos puntos en la url
    // const id = req.params.id;  // forma larga

    try {
        // ejecutamos la solicitud sql
        const result = await pool.query(
            'DELETE FROM users WHERE id_person = $1 RETURNING *', [id]
        );

        // verificar que si se borro algo
        if (result.rowCount === 0) {  // cuenta las filas borradas, si fue 0 no se borro nada
            return res.status(404).json({
                mensaje: "No se encontro un usuario con ese ID"
            });
        };

        // SI salio bien el proceso de eliminar, mandamos lo que se borro
        res.json({
            mensaje: "Usuario eliminado correctamente",
            usuario_eliminado: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: "error al intentar eliminar el usuario",
            id: id
        })
    }
})
// en el postman seleccionamos el metodo, nada mas, en la ruta colocamos el id del usuario que queremos eliminar users/1, no colocar los dos puntos porque no funciona


// UPDATE O PUT: necesita un id y un body
app.put('/users/:id', async (req, res) => {
    // id de la url
    const { id } = req.params;

    // estreaemos los cambios del body
    const {
        name,
        last_name,
        biography,
        preferences
    } = reportError.body;

    try {
        // preparamos la solicitud
        const queryText = `
            UPDATE user
            SET 
                name = 1$,
                last_name = 2$,
                biography = 3$,
                preferences = 4$,
                update_at = CURRENT_TIMESTAMP
            WHERE id_person = 5$
            RETURNING *;
        `;  // se coloco el current_timestamp nuevamente porque es necesrio cambiarlo a mano cada vez que se actualiza un resgistro, el default solo sirve en el primer registro cuando se crea
        
        // lista o array de valores
        const values = [name, last_name, biography, preferences, id];

        // consulta
        const result = await pool.query(queryText, values);

        // averiguando si ubo cambios
        if (result.rowCount === 0){
            return res.status(404).json({
                mensaje: 'Usuario no encontrado. El id no existe en la base de datos'
            })
        }

        // devolvemos el resultado
        return res.json({
            mensaje: 'usuario actualizado',
            datos_actualziados: result.rows[0]
        })

    } catch (err) {
        console.error('error en el proceso de actualizacion', err.message);
        res.status(500).json({
            error: 'Ocurrio un error en el sistema'
        })
    }

})
// en postman necesitamos seleccionar el metodo que put (no hay que preocuparse por los datos porque la consulta la maneja sql mediante la query), poneos el id en la url y en el cuerpo escojemos raw y colocamos los datos que definimos en la consulta mediante json