const express = require('express');

const PrestamosController =
    require('../controllers/prestamos.controller');

const { verificarToken } =
    require('../middleware/auth.middleware');

const router = express.Router();

// Consultas
router.get(
    '/',
    verificarToken,
    PrestamosController.listar
);

router.get(
    '/vencidos',
    verificarToken,
    PrestamosController.obtenerVencidos
);

router.get(
    '/alumno/:idAlumno',
    verificarToken,
    PrestamosController.obtenerPorAlumno
);

router.get(
    '/alumno/:idAlumno/activos',
    verificarToken,
    PrestamosController.obtenerActivosPorAlumno
);

router.get(
    '/:id',
    verificarToken,
    PrestamosController.obtenerPorId
);

// Operaciones
router.post(
    '/',
    verificarToken,
    PrestamosController.crear
);

router.patch(
    '/:id/devolver',
    verificarToken,
    PrestamosController.devolver
);

// Actualizar automáticamente préstamos vencidos
router.patch(
    '/actualizar-vencidos',
    verificarToken,
    PrestamosController.actualizarVencidos
);

module.exports = router;
