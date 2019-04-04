const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
// let Categoria = require('../models/categoria');

// ================
// Obtener producto
// ================

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario cateoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            let muestro;
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                if ((limite - desde) >= conteo) {
                    muestro = conteo;
                } else {
                    muestro = limite - desde;
                }
                res.json({
                    ok: true,
                    producto,
                    Mostando: ` ${muestro} de ${conteo} productos disponibles`
                });

            });
        });
});

// ================
// Obtener producto
// ================

app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario cateoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `ID no existe. `
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB

            });

        });
});

// =======================
// Buscar productos
// =======================  
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');



    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto

            });

        });


});



// =======================
// Crear un nuevo producto
// =======================    
app.post('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;
    let cate = req.params.id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: cate,
        usuario: TokenUser
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se creo el producto. `
                }
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoDB,
            message: `El usuario ${TokenUser.nombre} ha creado el producto ${producto.nombre}.`
        });

    });

});

// =======================
// Actualizar un producto
// =======================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se actualizo el producto. `
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: `El usuario ${TokenUser.nombre} actulizo el producto ` // ${producto._nombre}
        });

    });

    // grabar el usuario
    // grabar una categoria del listado

});

// =======================
// Borrar un producto
// =======================

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // disponible: false a un usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, productoBORRADO) => {

        if (!productoBORRADO) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El usuario ${TokenUser.nombre} no puede realizar la operacion. No ha sido eliminado`
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBORRADO,
            message: `El producto ${productoBORRADO.nombre} ha sido eliminado por ${TokenUser.nombre}`
        });

    });



});



module.exports = app;