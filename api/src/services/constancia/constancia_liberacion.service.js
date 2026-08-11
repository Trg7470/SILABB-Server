const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosConstanciaLiberacion } = require("./datos_constancia/constancia_liberacion.datos");
const { GenerarDocumento } = require("./generarDocx.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarConstanciaLiberacion() {

    // Obtener plantilla
    const plantilla = ObtenerPlantilla("Constancia_Liberacion_Adeudos");

    // Obtener datos
    const datos = ObtenerDatosConstanciaLiberacion();

    // Generar documento y PDF
    const rutaDocumento = await GenerarDocumento(plantilla,datos,"Constancia_Liberacion_Adeudos_Generada");
    const rutaPDF = await GenerarPDF(rutaDocumento,"Constancia_Liberacion_Adeudos_Generada");

    return {
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}

module.exports = { GenerarConstanciaLiberacion };