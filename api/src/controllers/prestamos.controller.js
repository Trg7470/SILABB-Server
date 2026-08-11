const PrestamosService = require('../services/prestamos.service');
class PrestamosController {
    static async listar(req, res) {
        try {
            const resultado = await PrestamosService.listar();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener préstamos',
                error: error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await PrestamosService.obtenerPorId(id);

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

    static async obtenerPorAlumno(req, res) {
        const { idAlumno } = req.params;

        try {
            const resultado =
                await PrestamosService.obtenerPorAlumno(idAlumno);

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

    static async obtenerActivosPorAlumno(req, res) {
        const { idAlumno } = req.params;

        try {
            const resultado =
                await PrestamosService.obtenerActivosPorAlumno(
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

    static async obtenerVencidos(req, res) {
        try {
            const resultado =
                await PrestamosService.obtenerVencidos();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener préstamos vencidos',
                error: error.message
            });
        }
    }

    static async crear(req, res) {
        const data = req.body;
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await PrestamosService.crear(
                    data,
                    idUsuario
                );

            res.status(201).json({
                success: true,
                mensaje: 'Préstamo creado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async devolver(req, res) {
        const { id } = req.params;
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await PrestamosService.devolver(
                    id,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Préstamo devuelto correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async actualizarVencidos(req, res) {
        try {
            const resultado =
                await PrestamosService.actualizarVencidos();

            res.json({
                success: true,
                mensaje: 'Préstamos vencidos actualizados correctamente',
                actualizados: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al actualizar préstamos vencidos',
                error: error.message
            });
        }
    }

}

module.exports = PrestamosController;
