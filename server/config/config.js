// =====================================
// PORT
// =====================================

process.env.PORT = process.env.PORT || 3000;

// =====================================
// ENVIROMENT
// =====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =====================================
// VENCIMIENTO DEL TOKEN
// 60 SECONDS
// 60 MINUTES
// 24 HOURS
// 30 DAYS
// =====================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =====================================
// AUTH_SEED
// =====================================

process.env.AUTH_SEED = process.env.AUTH_SEED || 'este-es-el-seed-desarrollo';

// =====================================
// Google Client ID
// =====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '460288518987-c8gqvjtlf2vg6dtk1v5cu2uueq9ohgei.apps.googleusercontent.com';

// =====================================
// DATABASE
// =====================================
let urlDB

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;