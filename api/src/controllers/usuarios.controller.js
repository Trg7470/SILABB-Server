const UsuariosService = require('../services/usuarios.service');
class UsuariosController {
    static async listar(req, res) {
        try {
            const resultado = await UsuariosService.listar();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener usuarios',
                error: error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await UsuariosService.obtenerPorId(id);

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(404).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async resumen(req, res) {
        try {
            const resultado =
                await UsuariosService.resumen();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener resumen de usuarios',
                error: error.message
            });
        }
    }

    static async verificarUsuario(req, res) {
        const { email } = req.body;

        try {
            const resultado =
                await UsuariosService.verificarUsuario(email);

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async restablecerPassword(req, res) {
        const { email, newPassword } = req.body;

        try {
            await UsuariosService.restablecerPassword(
                email,
                newPassword
            );

            res.json({
                success: true,
                mensaje: 'Contraseña actualizada correctamente'
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async crear(req, res) {
        const data = req.body;
        const idUsuario =
            req.usuario?.Id_Usuario;

        try {
            const resultado =
                await UsuariosService.crear(
                    data,
                    idUsuario
                );

            res.status(201).json({
                success: true,
                mensaje: 'Usuario creado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async actualizar(req, res) {
        const { id } = req.params;
        const data = req.body;
        const idUsuario =
            req.usuario?.Id_Usuario;

        try {
            const resultado =
                await UsuariosService.actualizar(
                    id,
                    data,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Usuario actualizado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async cambiarEstado(req, res) {
        const { id } = req.params;
        const { Activo } = req.body;
        const idUsuario =
            req.usuario?.Id_Usuario;

        try {
            const resultado =
                await UsuariosService.cambiarEstado(
                    id,
                    Activo,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Estado del usuario actualizado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async generarPassword(req, res) {
        try {
            const password =
                UsuariosService.generarPassword();

            res.json({
                success: true,
                password
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al generar contraseña',
                error: error.message
            });
        }
    }
}

module.exports = UsuariosController;
