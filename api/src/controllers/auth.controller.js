const AuthService = require('../services/auth.service');

class AuthController {

    static async login(req, res) {
        const { Usuario, Password } = req.body;

        if (!Usuario || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son obligatorios.'
            });
        }

        try {
            const resultado = await AuthService.login(
                Usuario,
                Password
            );

            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                token: resultado.token,
                usuario: resultado.usuario
            });

        } catch (error) {

            if (
                error.message === 'Credenciales inválidas.' ||
                error.message === 'El usuario se encuentra inactivo.'
            ) {
                return res.status(401).json({
                    success: false,
                    message: error.message
                });
            }

            console.error('Error en login:', error);

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
}

module.exports = AuthController;