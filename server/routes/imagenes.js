const express = require('express');
const fs = require('fs');
const path = require('path');
let { verificaTokenImg, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, '../assets/no-image.jpg');

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        pathImg = pathImagen;
    }

    res.sendFile(pathImg);
})



module.exports = app;