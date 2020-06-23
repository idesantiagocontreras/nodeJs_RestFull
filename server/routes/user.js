const express = require('express');
const Usuario = require('../models/user');
const auth = require('../middlewares/auth');

const app = express();
const bcryp = require('bcrypt');
const _ = require('underscore');
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', auth.verifyToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limit = req.query.limit || 5;

    desde = Number(desde);
    limit = Number(limit);


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (errr, count) => {

                res.json({
                    ok: true,
                    usuarios,
                    count
                })
            });

        });
});

app.post('/usuario', auth.verifyToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryp.hashSync(body.password, 10),
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
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, { estado: 0 }, { new: true, runValidators: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;