const path = require("path");
const {GenerarConstanciaLiberacion} = require("../../services/constancia/constancia_liberacion.service");

async function GenerarConstanciaLiberacionController(req, res) {

    try {
        const { Numero_Control } = req.body || {};
        if (!Numero_Control) {
            return res.status(400).json({
                mensaje: "El número de control es obligatorio."
            });
        }

        const documentos = await GenerarConstanciaLiberacion(Numero_Control);
        if (!documentos.alumnoEncontrado) {
            return res.status(404).json({
                mensaje: "No se encontró un alumno activo con el número de control proporcionado.",
                alumnoEncontrado: false
            });
        }   

        if(documentos.tieneAdeudos) {
            return res.status(200).json({
                mensaje: "El alumno presenta adeudos pendientes.",
                alumnoEncontrado: true,
                tieneAdeudos: true,
                adeudos: documentos.adeudos
            });
        }

        res.status(200).json({
            mensaje: "Constancia de liberación de adeudos generada correctamente.",
            tieneAdeudos: false,
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar la constancia de liberación de adeudos.",
            error: error.message
        });
    }
}

module.exports = {GenerarConstanciaLiberacionController};