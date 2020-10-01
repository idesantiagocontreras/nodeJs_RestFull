const express = require('express');
const auth = require('../middlewares/auth');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/imagen/:tipo/:img', auth.verifyTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);

    let file;
    if (fs.existsSync(pathImagen)) {
        file = pathImagen;
    } else {
        file = noImagePath;
    }

    res.sendFile(file);
});

module.exports = app;