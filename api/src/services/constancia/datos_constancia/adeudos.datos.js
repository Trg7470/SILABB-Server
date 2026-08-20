const { mysqlPool } = require("../../../config/mysql");

async function ObtenerAdeudosAlumno(numeroControl) {

    const [resultado] = await mysqlPool.query(
        `SELECT
            a.Numero_Control,
            a.Nombre,
            a.Apellido_Paterno,
            a.Apellido_Materno,
            l.Titulo,
            ad.Tipo,
            ad.Descripcion,
            ad.Estado
        FROM Adeudos ad
        INNER JOIN Prestamos p
            ON ad.Id_Prestamo = p.Id_Prestamo
        INNER JOIN Alumnos a
            ON p.Id_Alumno = a.Id_Alumno
        INNER JOIN Libros l
            ON p.Id_Libro = l.Id_Libro
        WHERE a.Numero_Control = ?
        AND ad.Estado = 'PENDIENTE'`,
        [numeroControl]
    );

    return resultado;
}

module.exports = {ObtenerAdeudosAlumno};