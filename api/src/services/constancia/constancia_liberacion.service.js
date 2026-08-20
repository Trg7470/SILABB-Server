const { ObtenerAlumno } = require("./datos_constancia/alumno.datos");
const { ObtenerAdeudosAlumno } = require("./datos_constancia/adeudos.datos");
const { ObtenerPlantilla } = require("./encontrarPlantilla.service");
const { ObtenerDatosConstanciaLiberacion } = require("./datos_constancia/constancia_liberacion.datos");
const { GenerarDocumento } = require("./generarDocx.service");
const { GenerarPDF } = require("./generarPDF.service");

async function GenerarConstanciaLiberacion(numeroControl) {

    // ==========================================
    // 1. BUSCAR ALUMNO
    // ==========================================

    const alumno = await ObtenerAlumno(numeroControl);

    if (!alumno) {
        return {
            alumnoEncontrado: false
        };
    }

    // ==========================================
    // 2. BUSCAR ADEUDOS
    // ==========================================

    const adeudos = await ObtenerAdeudosAlumno(numeroControl);

    if (adeudos.length > 0) {
        return {
            alumnoEncontrado: true,
            tieneAdeudos: true,
            alumno,
            adeudos
        };
    }

    // ==========================================
    // 3. SIN ADEUDOS → GENERAR CONSTANCIA
    // ==========================================


    const plantilla = ObtenerPlantilla(
        "Constancia_Liberacion_Adeudos"
    );

    const datos = ObtenerDatosConstanciaLiberacion(
        alumno
    );

    const rutaDocumento = await GenerarDocumento(
        plantilla,
        datos,
        "Constancia_Liberacion_Adeudos_Generada"
    );

    const rutaPDF = await GenerarPDF(
        rutaDocumento,
        "Constancia_Liberacion_Adeudos_Generada"
    );

    return {
        alumnoEncontrado: true,
        tieneAdeudos: false,
        alumno,
        docx: rutaDocumento,
        pdf: rutaPDF
    };
}


module.exports = {
    GenerarConstanciaLiberacion
};
