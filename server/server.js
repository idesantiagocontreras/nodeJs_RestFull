require('./config/config.js');

const express = require('express');

const mongoose = require('mongoose');

const app = express();

app.use(require('./routes/usuario'));

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