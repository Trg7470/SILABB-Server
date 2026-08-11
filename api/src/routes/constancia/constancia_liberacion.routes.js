const express = require("express");
const router = express.Router();

const {GenerarConstanciaLiberacionController} = require("../../controllers/constancia/constancia_liberacion.controller");

router.post("/", GenerarConstanciaLiberacionController);

module.exports = router;