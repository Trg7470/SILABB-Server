const path = require("path");

const RUTAS = {

    // Plantillas Word
    plantillas: path.join(__dirname, "../recursos/plantillas_docx"),

    // Documentos Word temporales
    temporalesDocx: path.join(__dirname, "../../storage/temporales/docx"),

    // Documentos PDF temporales
    temporalesPdf: path.join(__dirname, "../../storage/temporales/pdf"),

    // Recursos generales
    recursos: path.join(__dirname, "../recursos"),

    // Fotos
    fotos: path.join(__dirname, "../recursos/fotos")
};

module.exports = RUTAS;