const path = require("path");
const { GenerarConstanciaLiberacion } = require("../../services/constancia/constancia_liberacion.service");

async function GenerarConstanciaLiberacionController(req, res) {

    try {
        const documentos = await GenerarConstanciaLiberacion();

        res.status(200).json({
            mensaje: "Constancia de liberación de adeudos generada correctamente.",
            documentoWord: path.basename(documentos.docx),
            documentoPDF: path.basename(documentos.pdf)
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensaje: "Error al generar la constancia de liberación de adeudos."
        });
    }
}

module.exports = { GenerarConstanciaLiberacionController };