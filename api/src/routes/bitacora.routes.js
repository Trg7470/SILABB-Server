const express = require('express');
const router = express.Router();

const BitacoraController = require('../controllers/bitacora.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get(
    '/',
    verificarToken,
    BitacoraController.listar
);

router.get(
    '/usuario/:idUsuario',
    verificarToken,
    BitacoraController.obtenerPorUsuario
);

router.get(
    '/registro/:tabla/:idRegistro',
    verificarToken,
    BitacoraController.obtenerPorRegistro
);

router.get(
    '/fechas',
    verificarToken,
    BitacoraController.obtenerPorFechas
);

module.exports = router;