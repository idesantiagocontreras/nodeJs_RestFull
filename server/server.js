require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();

app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));

mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, resp) => {

    if (err) throw err;

    console.log('Base de datos online');

});

app.listen(process.env.PORT, function() {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});