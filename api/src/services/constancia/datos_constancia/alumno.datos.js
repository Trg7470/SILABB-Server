const { mysqlPool } = require("../../../config/mysql");

async function ObtenerAlumno(numeroControl) {

    const [resultado] = await mysqlPool.query(
        `SELECT
            Id_Alumno,
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Semestre,
            Carrera,
            Numero_Control,
            Activo
        FROM Alumnos
        WHERE Numero_Control = ?
        AND Activo = TRUE`,
        [numeroControl]
    );

    return resultado[0] || null;
}

module.exports = {ObtenerAlumno};