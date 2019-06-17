const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');
const _ = require('underscore');

///////////////////////////////
// Mostrar productos
///////////////////////////////
app.get('/producto', verificaToken, (req, res) => {

    Producto.find({ disponible: true }, 'nombre descripcion estado')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    conteo
                })

            })
        })
});

///////////////////////////////
// Mostrar una producto or id
///////////////////////////////
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }
            res.json({
                ok: true,
                producto: productoBD
            });
        });
})

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        descripcion: body.descripcion,
        nombre: body.nombre,
        usuario: req.usuario._id,
        categoria: body.categoria,
        precioUni: body.precioUni
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            producto: productoBD
        })
    });

});

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = { nombre: req.body.nombre };

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = { disponible: false };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


module.exports = app;