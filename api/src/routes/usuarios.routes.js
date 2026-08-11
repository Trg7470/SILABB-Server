const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, usuarioController.all);
router.get('/resume', verificarToken, usuarioController.usersResume);
router.get('/generate-password', usuarioController.generatePassword);
router.get('/:id', verificarToken, usuarioController.userbyId);
router.post('/reset/check', usuarioController.checkUser);
router.post('/reset/newPassword', usuarioController.resetPassword);
router.post('/create', verificarToken, usuarioController.createUser);
router.put('/:id', verificarToken, usuarioController.updateUser);
router.delete('/:id', verificarToken, usuarioController.deleteUser);

module.exports = router;