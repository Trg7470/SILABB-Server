const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const AdeudosRoutes = require('./adeudos.routes');
const AlumnosRoutes = require('./alumnos.routes');
const BitacoraRoutes = require('./bitacora.routes');
const ConstanciaLiberacionRoutes = require("./constancia/constancia_liberacion.routes");

router.use('/adeudos', AdeudosRoutes);
router.use('/auth', AuthRoutes);
router.use('/bitacora', BitacoraRoutes);
router.use('/constancia/liberacion', ConstanciaLiberacionRoutes);


module.exports = router;
