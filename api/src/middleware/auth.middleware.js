const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: 'Token no proporcionado'
            });
        }

        const [tipo, token] = authHeader.split(' ');

        if (tipo !== 'Bearer' || !token) {
            return res.status(401).json({
                mensaje: 'Formato de token inválido'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}

module.exports = {
    verificarToken
};