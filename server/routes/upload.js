const express = require('express');
const fileUpload = require('express-fileupload');

const Usuario = require('../models/user');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload({
    useTempFiles: true,
}));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: true,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        });
    }

    let file = req.files.archivo;

    let extencionesValidad = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreCortado = file.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];

    if (extencionesValidad.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extencionesValidad.join(', ')
            }
        });
    }

    let nombreArchivo = `${ id }-${file.name}`;

    file.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {

        if (err) {

            borrarImagen(`${nombreArchivo}`, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Imagen cargada

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
        }
    });
});

function imagenUsuario(id, res, NombreArchivo) {

    Usuario.findById(id, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!UsuarioDB) {

            borrarImagen(NombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            });
        }

        borrarImagen(UsuarioDB.img, 'usuarios');

        UsuarioDB.img = NombreArchivo;
        UsuarioDB.save((err, UsuarioGuardado) => {
            res.json({
                ok: true,
                usuario: UsuarioGuardado,
                img: NombreArchivo
            });
        });
    });

}

function imagenProducto(id, res, NombreArchivo) {
    Producto.findById(id, (err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoDB) {

            borrarImagen(NombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            });
        }

        borrarImagen(ProductoDB.img, 'productos');

        ProductoDB.img = NombreArchivo;
        ProductoDB.save((err, ProductoGuardado) => {
            res.json({
                ok: true,
                producto: ProductoGuardado,
                img: NombreArchivo
            });
        });
    });
}

function borrarImagen(NombreArchivo, tipo) {
    let pathUrlImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${NombreArchivo}`);

    if (fs.existsSync(pathUrlImagen)) {
        fs.unlinkSync(pathUrlImagen);
    }
}

module.exports = app;