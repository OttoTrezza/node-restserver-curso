const jwt = require('jsonwebtoken');

// =====================================
// Verificar Token
// =====================================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); // leo el token del header 

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: `Token no valido ${token}`
                }
            });
        }

        // req.usuario = decoded.usuario;
        TokenUser = decoded.usuario;
        next();
    });

};
// =====================================
// Verifica AdminRole
// =====================================
let verificaAdmin_Role = (req, res, next) => {

    //  let usuario = req.usuario;
    // console.log(usuario.role, 'inicio');
    if (TokenUser.role === 'USER_ROLE') {

        // console.log(TokenUser.nombre, 'es User');
        return res.status(401).json({
            ok: false,
            err: {
                message: `El usuario ${TokenUser.nombre} no tiene permisos para realizar esta operacion`
            }
        });

    } else {
        // console.log(TokenUser.nombre, 'es Admin');
        next();
    }
};


module.exports = {
    verificaToken,
    verificaAdmin_Role
};