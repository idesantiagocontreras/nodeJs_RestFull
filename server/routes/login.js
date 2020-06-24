const express = require('express');
const Usuario = require('../models/user');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const app = express();

//API GOOGLE AUTHENTICATION
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
//verify()

app.post('/google', async(req, res) => {
    token = req.body.idtoken;

    let userGoogle = await verify(token)
        .catch((e) => {
            res.status(401).json({
                ok: false,
                err: e
            })
        });

    Usuario.findOne({ email: userGoogle.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usa su usuario normal'
                    }
                });
            } else {

                let token = jwt.sign({
                    usuario: usuarioBD,
                }, process.env.AUTH_SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    token
                });
            }

        } else { //Si el usuario no ha sido creado en nuestra base de datos
            let usuario = new Usuario({
                nombre: userGoogle.nombre,
                email: userGoogle.email,
                img: userGoogle.img,
                google: true,
                password: ';)'
            });

            usuario.save((err, usuarioBD) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioBD,
                }, process.env.AUTH_SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    token
                });
            });
        }
    });

});

module.exports = app;