const express = require('express');
const app = express();


app.use(require('./usuario')); // ... A CARPETA ROUTES!/DICE QUE LAS RUTAS ESTAN EN LA CARPETA './ROUTES'

app.use(require('./login')); // ... A CARPETA ROUTES!/DICE QUE LAS RUTAS ESTAN EN LA CARPETA './ROUTES'



module.exports = app;