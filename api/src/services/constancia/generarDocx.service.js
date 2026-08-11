const fs = require("fs");
const path = require("path");
const carbone = require("carbone");
const RUTAS = require("../../config/rutas");

function GenerarDocumento(plantilla, datos, nombre){

    return new Promise((resolve, reject)=>{
        carbone.render(plantilla,datos,{},(err, resultado)=>{
                if(err){
                    reject(err);
                    return;
                }

                // Crear carpeta temporal si no existe
                if(!fs.existsSync(RUTAS.temporalesDocx)){
                    fs.mkdirSync(
                        RUTAS.temporalesDocx,
                        {
                            recursive: true
                        }
                    );
                }

                const salida = path.join(RUTAS.temporalesDocx,`${nombre}.docx`);

                fs.writeFileSync(salida,resultado);
                resolve(salida);
            }
        );
    });
}

module.exports = {GenerarDocumento};