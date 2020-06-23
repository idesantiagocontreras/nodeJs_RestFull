const express = require('express');
const Usuario = require('../models/user');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const app = express();

app.use(require('./user'));

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }

        if (!bcryp.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioBD,
        }, process.env.AUTH_SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });

});

module.exports = app;