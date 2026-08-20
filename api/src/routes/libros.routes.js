const express = require('express');
const LibrosController = require('../controllers/libros.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Consultas
router.get(
    '/',
    LibrosController.listar
);

router.get(
    '/buscar',
    LibrosController.buscar
);

router.get(
    '/disponibles',
    LibrosController.obtenerDisponibles
);

router.get(
    '/prestados',
    LibrosController.obtenerPrestados
);

router.get(
    '/:id/disponible',
    LibrosController.verificarDisponible
);

router.get(
    '/:id',
    LibrosController.obtenerPorId
);

// Operaciones
router.post(
    '/',
    LibrosController.crear
);

router.put(
    '/:id',
    LibrosController.actualizar
);

router.patch(
    '/:id/estado',
    LibrosController.cambiarEstado
);

module.exports = router;
