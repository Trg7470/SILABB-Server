const express = require('express');

const UsuariosController =
    require('../controllers/usuarios.controller');

const {
    verificarToken
} = require('../middleware/auth.middleware');

const router = express.Router();

// Consultas
router.get(
    '/',
    verificarToken,
    UsuariosController.listar
);

router.get(
    '/resume',
    verificarToken,
    UsuariosController.resumen
);

router.get(
    '/generate-password',
    verificarToken,
    UsuariosController.generarPassword
);

router.get(
    '/:id',
    verificarToken,
    UsuariosController.obtenerPorId
);

// Recuperación de contraseña
router.post(
    '/reset/check',
    UsuariosController.verificarUsuario
);

router.post(
    '/reset/newPassword',
    UsuariosController.restablecerPassword
);

// Operaciones
router.post(
    '/',
    verificarToken,
    UsuariosController.crear
);

router.put(
    '/:id',
    verificarToken,
    UsuariosController.actualizar
);

router.patch(
    '/:id/estado',
    verificarToken,
    UsuariosController.cambiarEstado
);

module.exports = router;
