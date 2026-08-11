const express = require('express');
const AlumnosController = require('../controllers/alumnos.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Consultas
router.get('/', verificarToken, AlumnosController.listar);
router.get('/activos', verificarToken, AlumnosController.listarActivos);
router.get('/buscar', verificarToken, AlumnosController.buscar);
router.get('/numero-control/:numeroControl', verificarToken, AlumnosController.obtenerPorNumeroControl);
router.get('/:id', verificarToken, AlumnosController.obtenerPorId);

// Operaciones
router.post('/', verificarToken, AlumnosController.crear);
router.put('/:id', verificarToken, AlumnosController.actualizar);
router.patch('/:id/estado', verificarToken, AlumnosController.cambiarEstado);

// Estado bibliotecario del alumno
router.get('/:id/estado-biblioteca', verificarToken, AlumnosController.obtenerEstadoBiblioteca);

module.exports = router;