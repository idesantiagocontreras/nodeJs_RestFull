const express = require('express');
const auth = require('../middlewares/auth');
const app = express();

let Category = require('../models/category');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// =============================
// MOSTRAR TODAS LAS CATEGORIAS
// =============================
app.get('/categoria', auth.verifyToken, (req, res) => {
    Category.find({ estado: true })
        .sort('descripcion')
        .populate('usuario')
        .exec((err, categoryDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoryDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No hy categorias disponibles'
                    }
                });
            }

            res.json({
                ok: true,
                category: categoryDB
            });

        });

});

// =============================
// MOSTRAR UNA CATEGORIA POR ID
// =============================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria'
                }
            });
        }

        return res.json({
            ok: true,
            category: categoryDB
        });

    });
});

// =============================
// CREAR NUEVA CATEGORIA
// =============================
app.post('/categoria', auth.verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Error al generar la categoira'
                }
            });
        }

        return res.json({
            ok: true,
            category: categoryDB
        });
    });
    //regresa nueva categoria
});

// =============================
// ACTUALIZA CATEGORIA
// =============================
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no valida'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoryDB
        });
    });
});

// =============================
// ELIMINAR CATEGORIA
// =============================
app.delete('/categoria/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndDelete(id, (err, categoryBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoryBorrada
        });
    });
});

module.exports = app;