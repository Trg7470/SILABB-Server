const fs = require("fs");
const path = require("path");
const RUTAS = require("../../config/rutas");

function ObtenerPlantilla(nombrePlantilla) {

    const rutaPlantilla = path.join(RUTAS.plantilla_constancia,`${nombrePlantilla}.docx`);

    if (!fs.existsSync(rutaPlantilla)) {
        throw new Error(
            `No existe la plantilla: ${rutaPlantilla}`
        );
    }
    return rutaPlantilla;
}

module.exports = {ObtenerPlantilla};