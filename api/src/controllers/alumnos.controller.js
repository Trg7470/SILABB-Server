const AlumnosService = require('../services/alumnos.service');

class AlumnosController {

    static async listar(req, res) {
        try {
            const resultado = await AlumnosService.listar();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener alumnos',
                error: error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await AlumnosService.obtenerPorId(id);

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

    static async obtenerPorNumeroControl(req, res) {
        const { numeroControl } = req.params;

        try {
            const resultado =
                await AlumnosService.obtenerPorNumeroControl(
                    numeroControl
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

    static async listarActivos(req, res) {
        try {
            const resultado =
                await AlumnosService.listarActivos();

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener alumnos activos',
                error: error.message
            });
        }
    }

    static async buscar(req, res) {
        const { termino } = req.query;

        try {
            const resultado =
                await AlumnosService.buscar(termino);

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

    static async crear(req, res) {
        const data = req.body;
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await AlumnosService.crear(
                    data,
                    idUsuario
                );

            res.status(201).json({
                success: true,
                mensaje: 'Alumno creado correctamente',
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
                await AlumnosService.actualizar(
                    id,
                    data,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Alumno actualizado correctamente',
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
        const idUsuario = req.usuario.Id_Usuario;

        try {
            const resultado =
                await AlumnosService.cambiarEstado(
                    id,
                    Activo,
                    idUsuario
                );

            res.json({
                success: true,
                mensaje: 'Estado del alumno actualizado correctamente',
                data: resultado
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async obtenerEstadoBiblioteca(req, res) {
        const { id } = req.params;

        try {
            const resultado =
                await AlumnosService.obtenerEstadoBiblioteca(id);

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
}

module.exports = AlumnosController;