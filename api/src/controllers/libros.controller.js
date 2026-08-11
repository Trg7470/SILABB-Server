const LibrosService = require('../services/libros.service');

class LibrosController {

    static async listar(req, res) {
        try {
            const resultado = await LibrosService.listar();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener libros',
                error: error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await LibrosService.obtenerPorId(id);

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

    static async buscar(req, res) {
        const { termino } = req.query;

        try {
            const resultado =
                await LibrosService.buscar(termino);

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

    static async obtenerDisponibles(req, res) {
        try {
            const resultado =
                await LibrosService.obtenerDisponibles();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener libros disponibles',
                error: error.message
            });
        }
    }

    static async obtenerPrestados(req, res) {
        try {
            const resultado =
                await LibrosService.obtenerPrestados();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener libros prestados',
                error: error.message
            });
        }
    }

    static async verificarDisponible(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await LibrosService.verificarDisponible(id);

            res.json({
                success: true,
                disponible: resultado
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
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await LibrosService.crear(
                    data,
                    idUsuario
                );

            res.status(201).json({
                success: true,
                mensaje: 'Libro creado correctamente',
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
                await LibrosService.actualizar(
                    id,
                    data,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Libro actualizado correctamente',
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
                await LibrosService.eliminar(
                    id,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Libro eliminado correctamente',
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

module.exports = LibrosController;