const { ObtenerFechaActual } = require("../../utilidades/documentos.util");

function ObtenerDatosConstanciaLiberacion(alumno) {

    return {
        Folio: "CL-0001",

        Nombre: alumno.Nombre,
        Apellido_Paterno: alumno.Apellido_Paterno,
        Apellido_Materno: alumno.Apellido_Materno,

        Numero_Control: alumno.Numero_Control,

        Carrera: alumno.Carrera,

        Fecha: ObtenerFechaActual(),

        Encargado: "Martha Elena García García",

        Ocupacion: "Jefe(a) del Departamento de Biblioteca"
    };
}

module.exports = {
    ObtenerDatosConstanciaLiberacion
};