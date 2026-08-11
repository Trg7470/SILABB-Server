const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const AdeudosRoutes = require('./adeudos.routes');
const AlumnosRoutes = require('./alumnos.routes');
const BitacoraRoutes = require('./bitacora.routes');
const PrestamosRoutes = require('./prestamos.routes');

router.use('/alumnos', AlumnosRoutes);
router.use('/prestamos', PrestamosRoutes);
router.use('/adeudos', AdeudosRoutes);
router.use('/auth', AuthRoutes);
router.use('/bitacora', BitacoraRoutes);

module.exports = router;
