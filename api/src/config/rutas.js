const path = require("path");

const RUTAS = {

     // Documentos Word temporales
    temporalesDocx: path.join(__dirname, "../../storage/temporales/docx"),

    // Documentos PDF temporales
    temporalesPdf: path.join(__dirname, "../../storage/temporales/pdf"),

    //Recursos generales
    recursos: path.join(__dirname, "../recursos"),

    //plantilla constancia liberacion
    plantilla_constancia: path.join(__dirname, "../recursos/plantilla_constancia"),

};

module.exports = RUTAS;