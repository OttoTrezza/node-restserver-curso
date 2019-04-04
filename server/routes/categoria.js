// USAR LOS TOKENS(VERIF..)


const express = require('express');

const _ = require('underscore'); // para el __.pick EN linea:93 || metodo PUT

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'fatal error',
                    err
                });
            }
            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            });

        });
});

//=============================
// Mostrar una categoria por ID
//=============================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                message: 'No existe la categoria que busca'
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error severo de base de datos'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria ubicada'

        });
    });
});

//=============================
// Crear una categoria 
//=============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    // let ID = TokenUser.id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: TokenUser
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No fue bien!'
                }
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se creo la categoria. `
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            message: `El usuario ${categoria.usuario} ha creado la categoria `
        });

    });

});



//=============================
// Actualizar una categoria por ID
//=============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let { descripcion } = req.body; // mediante destructuracion del objeto body!!! well done TITO!

    Categoria.findByIdAndUpdate(id, { 'descripcion': descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error severo de base de datos'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: `El usuario ${TokenUser.nombre}, ha actualizado la descripcion a: "${descripcion}"  `
        });

    });


});

//=============================
// Borrar una categoria por ID
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo una ADMIN_ROLE puede ELIMINARLA
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: `No existe la categoria que intenta ELIMINAR, con el id: ${id} `
                }
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error severo de base de datos'
                }
            });
        }

        res.json({
            ok: true,
            categoriaELIMINADA: categoriaDB,
            message: `El usuario ${TokenUser.nombre}, ha ELIMINADO a: "${categoriaDB.id}"  `
        });


    });
});




module.exports = app;