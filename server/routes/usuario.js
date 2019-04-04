//INICIO...ME CONECTO A REQUERIMIENTOS de modulos internos y externos

const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore'); // para el __.pick linea:93 || metodo PUT
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//////PETICIONES///////
//////PETICIONES///////


app.get('/usuario', verificaToken, (req, res) => {

    //========================================
    // RECUPERAR EL PAYLOAD(usuario) DEL TOKEN
    //========================================
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });
    //========================================
    // RECUPERAR EL PAYLOAD(usuario) DEL TOKEN
    //========================================

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'fatal error',
                    err
                });
            }
            let muestro;
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if ((limite - desde) >= conteo) {
                    muestro = conteo;
                } else {
                    muestro = limite - desde;
                }
                res.json({
                    ok: true,
                    usuarios,
                    Mostando: ` ${muestro} de ${conteo} usuarios disponibles`
                });

            });

        });

});


app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            message: `El usuario ${TokenUser.nombre} ha creado a ${usuarioDB.nombre}`
        });


    });

});


app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            message: `El usuario ${TokenUser.nombre} ha actualizado a ${usuarioDB.nombre}`
        });
    });


});


// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }
//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }
//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });

//     });
// });




app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El usuario ${TokenUser} no puede realizar la operacion. No ha sido eliminado`
                }
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado,
            message: `El usuario ${usuarioBorrado.nombre} ha sido eliminado por ${TokenUser.nombre}`
        });

    });

});


module.exports = app;