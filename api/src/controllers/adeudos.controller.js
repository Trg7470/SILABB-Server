
const AdeudosService = require('../services/adeudos.service');

class AdeudosController {

    static async listar(req, res) {
        try {
            const resultado =
                await AdeudosService.listar();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener adeudos',
                error: error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await AdeudosService.obtenerPorId(id);

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

    static async obtenerPorPrestamo(req, res) {
        const { idPrestamo } = req.params;

        try {
            const resultado =
                await AdeudosService.obtenerPorPrestamo(
                    idPrestamo
                );

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

    static async obtenerPendientesPorAlumno(req, res) {
        const { idAlumno } = req.params;

        try {
            const resultado =
                await AdeudosService.obtenerPendientesPorAlumno(
                    idAlumno
                );

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

    static async crear(req, res) {
        const data = req.body;
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await AdeudosService.crear(
                    data,
                    idUsuario
                );

            res.status(201).json({
                success: true,
                mensaje: 'Adeudo creado correctamente',
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
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await AdeudosService.actualizar(
                    id,
                    data,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Adeudo actualizado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async resolver(req, res) {
        const { id } = req.params;
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await AdeudosService.resolver(
                    id,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Adeudo resuelto correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async eliminar(req, res) {
        const { id } = req.params;
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await AdeudosService.eliminar(
                    id,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Adeudo eliminado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }
}

module.exports = AdeudosController;
