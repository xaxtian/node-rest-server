require('./config/config.js')

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('Get usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'nombre obligatorio'
        });
    } else {
        res.json(body);
    }

});

app.put('/usuario/:id', (req, res) => {
    res.json('Put usuario ' + req.params.id);
});

app.delete('/usuario', (req, res) => {
    res.json('Delete usuario');
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});