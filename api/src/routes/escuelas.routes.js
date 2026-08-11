const express = require('express');
const router = express.Router();
const EscuelasController = require('../controllers/escuelas.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', EscuelasController.all);
router.get('/:tipo/:municipio', EscuelasController.tipo_municipio);

module.exports = router;