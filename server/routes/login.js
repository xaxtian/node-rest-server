const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    console.log(body);
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })
});


//Google
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let user = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
    Usuario.findOne({ email: user.email }, (err, usuarioDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Ya existe un usuario con este email'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });
                return res.json({
                    ok: true,
                    usuarioDB,
                    token
                })
            }
        } else {
            let usuario = new Usuario({
                nombre: user.nombre,
                email: user.email,
                img: user.img,
                google: true,
                password: ':)'
            });
            usuario.save((err, usu) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } else {
                    return res.json({
                        ok: true,
                        usuario: usu,
                        token
                    })
                }
            })
        }
    });
})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const nombre = payload.name;
    const email = payload.email;
    const img = payload.picture;
    return {
        nombre,
        email,
        img,
        gooole: true
    }
}

module.exports = app;