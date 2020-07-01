const express = require('express');
const auth = require('../middlewares/auth');
const app = express();

let Producto = require('../models/producto');

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// =================================
// OBTENER PRODUCTOS
// =================================

app.get('/productos', auth.verifyToken, (req, res) => {
    //populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    let limit = req.query.limit || 5;

    desde = Number(desde);
    limit = Number(limit);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Se produjo un error al momento de obtener el listado"
                    }
                });
            }

            res.json({
                ok: true,
                productos: productoDB
            })
        });
});

// =================================
// OBTENER PRODUCTO POR ID
// =================================

app.get('/productos/:id', auth.verifyToken, (req, res) => {
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion usuario')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "El producto no existe"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

// =================================
// BUSCAR PRODUCTO
// =================================

app.get('/productos/buscar/:termino', auth.verifyToken, (req, res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                productos
            })
        });
});
// =================================
// CREAR PRODUCTO NUEVO
// =================================

app.post('/productos', auth.verifyToken, (req, res) => {
    //grabar en el listado de productos
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUnitario,
        categoria: body.idCategoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Se produjo un error al momento de guardar el producto"
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });

    });
});

// =================================
// ACTUALIZAR PRODUCTO
// =================================

app.put('/productos/:id', auth.verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Se produjo un error al momento de guardar el producto"
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});

// =================================
// BORRAR UN PRODUCTO
// =================================

app.delete('/productos/:id', [auth.verifyToken, auth.verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Producto no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            productoBorrado
        });
    });

});

module.exports = app;