const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo.'
            }
        });

    }
    let tipo = req.params.tipo;
    let id = req.params.id;
    let archivo = req.files.archivo;

    // moldeo el nombre
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // VALIDACIONES: Extensiones permitidas || Destinos permitidos para guardar archivos
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let tiposValidos = ['usuarios', 'productos'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son' + extensionesValidas.join(','),
                ext: extension
            }
        });
    }
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Debe especificar un lugar de gardado valido' + tiposValidos.join(','),
                ext: tipo
            }
        });
    }

    // Cambio el nombre del archivo
    let nombreArchivo = `${nombreCortado[0]}-${id}-${ new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${ nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: true,
                err
            });
        // Aqui la imagen ya esta cargada!
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: true,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err)
                return res.status(500).json({
                    ok: true,
                    err
                });
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            });

        });
    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: true,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err)
                return res.status(500).json({
                    ok: true,
                    err
                });
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo

            });

        });
    });
}

function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;