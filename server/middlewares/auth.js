// ====================
// VERIFY TOKEN
// ====================

const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports.verifyAdminRole = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;

        console.log(req.usuario);

        if (req.usuario.role !== 'ADMIN_ROLE') {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No tiene permisos para realizar esta actividad'
                }
            })
        }

        next();
    });
};