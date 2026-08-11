const express = require('express');
const LibrosController = require('../controllers/libros.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Consultas
router.get('/', verificarToken, LibrosController.listar);
router.get('/buscar', verificarToken, LibrosController.buscar);
router.get('/disponibles', verificarToken, LibrosController.obtenerDisponibles);
router.get('/prestados', verificarToken, LibrosController.obtenerPrestados);
router.get('/:id/disponible', verificarToken, LibrosController.verificarDisponible);
router.get('/:id', verificarToken, LibrosController.obtenerPorId);

// Operaciones
router.post('/', verificarToken, LibrosController.crear);
router.put('/:id', verificarToken, LibrosController.actualizar);
router.delete('/:id', verificarToken, LibrosController.eliminar);

module.exports = router;