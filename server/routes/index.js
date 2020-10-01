const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./category'));
app.use(require('./products'));
app.use(require('./login'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;