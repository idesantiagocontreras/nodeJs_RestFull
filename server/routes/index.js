const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./category'));
app.use(require('./products'));
app.use(require('./login'));

module.exports = app;