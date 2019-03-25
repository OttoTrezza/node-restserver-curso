//INICIO ... ME CONECTO A LIBRERIAS!

const mongoose = require('mongoose'); // A BASE DE DATOS
const uniqueValidator = require('mongoose-unique-validator'); // A MODULO VALIDADOR

// ME COMUNICO A REQUERIMIENTOS DE ESTA HOJA

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

// IMPORTO EL ESQUEMA DE MONGOOSE Y LE DOY NOMBRE A LA CLASE
let Schema = mongoose.Schema;

//AHORA usuarioSchema es un esquema de mongoose, defino todas las cajas que hay un usuario esquema!
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// PASO A JSON TODO LO CREADO, LE DOY FORMA DE OBJETO. Y ELIMINO EL PASSWORD DEL OBJETO QUE RETORNO.
// ..de este modo nunca doy la contraseña pero si la tengo guardada!

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};


//me conecto al plugin uniqueValidator

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} DEBE DE SER UNICO' });



// MODULO EXPORTADO

module.exports = mongoose.model('Usuario', usuarioSchema);