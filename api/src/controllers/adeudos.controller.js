const express = require('express');
const router = express.Router();

const AdeudosController = require('../controllers/adeudos.controller');
const { verificarToken } = require('../middleware/jwt.middleware');

router.get(
    '/',
    verificarToken,
    AdeudosController.listar
);

router.get(
    '/prestamo/:idPrestamo',
    verificarToken,
    AdeudosController.obtenerPorPrestamo
);

router.get(
    '/alumno/:idAlumno/pendientes',
    verificarToken,
    AdeudosController.obtenerPendientesPorAlumno
);

router.get(
    '/:id',
    verificarToken,
    AdeudosController.obtenerPorId
);

router.post(
    '/',
    verificarToken,
    AdeudosController.crear
);

router.put(
    '/:id',
    verificarToken,
    AdeudosController.actualizar
);

router.patch(
    '/:id/resolver',
    verificarToken,
    AdeudosController.resolver
);

router.delete(
    '/:id',
    verificarToken,
    AdeudosController.eliminar
);

module.exports = router;