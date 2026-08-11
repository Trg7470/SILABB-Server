const fs = require("fs").promises;
const path = require("path");
const libreOffice = require("libreoffice-convert");
const RUTAS = require("../../config/rutas");

function convertirAPdf(documento){
    return new Promise((resolve, reject)=>{

        libreOffice.convert(documento,".pdf",undefined, (error, resultado)=>{
                if(error){
                    reject(error);
                    return;
                }
                resolve(resultado);
            }
        );
    });
}

async function GenerarPDF(rutaDocumento, nombreDocumento){
    try {
        // Leer documento DOCX
        const documento = await fs.readFile(rutaDocumento);

        const resultado = await convertirAPdf(documento);

        // Crear carpeta PDF si no existe
        await fs.mkdir(RUTAS.temporalesPdf,
            { recursive: true }
        );

         // Guardar PDF
        const rutaPDF = path.join(RUTAS.temporalesPdf,`${nombreDocumento}.pdf`);
        await fs.writeFile(rutaPDF,resultado);

        return rutaPDF;

    } catch(error){
        console.error("Error generando PDF:", error);
        throw error;
    }
}

module.exports = { GenerarPDF };