const BitacoraService = require('../services/bitacora.service');

class BitacoraController {

    static async listar(req, res) {
        try {
            const resultado = await BitacoraService.listar();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener la bitácora',
                error: error.message
            });
        }
    }

    static async obtenerPorUsuario(req, res) {
        const { idUsuario } = req.params;

        try {
            const resultado =
                await BitacoraService.obtenerPorUsuario(idUsuario);

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

    static async obtenerPorRegistro(req, res) {
        const { tabla, idRegistro } = req.params;

        try {
            const resultado =
                await BitacoraService.obtenerPorRegistro(
                    tabla,
                    idRegistro
                );

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

    static async obtenerPorFechas(req, res) {
        const {
            fechaInicio,
            fechaFin
        } = req.query;

        try {
            const resultado =
                await BitacoraService.obtenerPorFechas(
                    fechaInicio,
                    fechaFin
                );

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
}

module.exports = BitacoraController;