const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');
const _ = require('underscore');

///////////////////////////////
// Mostrar categorias
///////////////////////////////
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({ estado: true }, 'nombre descripcion estado')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }
            Categoria.count({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: err
                    });
                }
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })

            })
        })
});

///////////////////////////////
// Mostrar una categoria or id
///////////////////////////////
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
})

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            categoaria: categoriaBD
        })
    });

});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let body = { nombre: req.body.nombre };

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = { estado: false };

    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


module.exports = app;