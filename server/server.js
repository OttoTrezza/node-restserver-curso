// INICIO...conectarme a requerimientos de bibliotecas internas

require('./config/config');


// para conectarme a requerimientos de bibliotecas externas

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');


// BEGIN MIDLEWEARS// interponga en las comunicaciones, 

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

app.use(bodyParser.json()); // parse application/json

app.use(require('./routes/index')); // ...**CONFIGURACION GLOBAL DE RUTAS**/DICE QUE LAS RUTAS ESTAN EN LA CARPETA './ROUTES/INDEX.JS'

app.use(express.static(path.resolve(__dirname, '../public')));

// END MIDLEWEARS



// ME CONECTO A LA BASE DE DATOS

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
});

mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => { // Me quedo escuchando el puerto 80!
    console.log(`Escuchando puerto: ${process.env.PORT}.`);
});