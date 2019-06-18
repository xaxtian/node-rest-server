const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            })
    }

    //Validar tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(',')
            }
        });
    }



    let sampleFile = req.files.archivo;
    let nombreArchivo = sampleFile.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    console.log(extension);
    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son ' + extensionesValidas.join(',')
            }
        });
    }

    //Cambiar nombre al archivo
    let nuevoNombreArchivo = `${id}-${new Date().getTime()}.${extension}`;

    sampleFile.mv(`uploads/${tipo}/${nuevoNombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo) {
            case 'usuario':
                imagenUsuario(id, res, nuevoNombreArchivo);
                break;
            case 'producto':
                imagenProducto(id, res, nuevoNombreArchivo);
                break;
            default:
                break;
        }
    })
})

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraImagen(nombreArchivo, 'usuario');
            return resizeBy.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraImagen(nombreArchivo, 'usuario');
            return resizeBy.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }
        borraImagen(usuarioDB.img, 'usuario');
        usuarioDB.img = nombreArchivo;

        console.log(usuarioDB.img);
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraImagen(nombreArchivo, 'producto');
            return resizeBy.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraImagen(nombreArchivo, 'producto');
            return resizeBy.status(500).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            })
        }
        borraImagen(productoDB.img, 'producto');
        productoDB.img = nombreArchivo;

        console.log(productoDB.img);
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

/////////////////////////////////////////
//Utilities
/////////////////////////////////////////
function borraImagen(imagen, tipo) {
    if (imagen !== '') {
        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
        borraArchivo(pathImagen);
    }
}

function borraArchivo(ruta) {
    if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta);
    }
}


module.exports = app;