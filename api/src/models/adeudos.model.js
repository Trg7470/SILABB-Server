const {mysqlPool} = require('../config/mysql');

class AdeudosModel {

    static async listar() {
        const [resultado] = await mysqlPool.query(`
            SELECT
                a.Id_Adeudo,
                a.Id_Prestamo,
                a.Tipo,
                a.Descripcion,
                a.Estado,
                a.Fecha_Creacion,
                a.Id_Usuario_Creacion,
                a.Fecha_Resolucion,
                a.Id_Usuario_Resolucion
            FROM Adeudos a
            ORDER BY a.Fecha_Creacion DESC
        `);
        return resultado;
    }

    static async obtenerPorId(id) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                a.Id_Adeudo,
                a.Id_Prestamo,
                a.Tipo,
                a.Descripcion,
                a.Estado,
                a.Fecha_Creacion,
                a.Id_Usuario_Creacion,
                a.Fecha_Resolucion,
                a.Id_Usuario_Resolucion
            FROM Adeudos a
            WHERE a.Id_Adeudo = ?
        `, [id]);

        return resultado[0];
    }

    static async obtenerPorPrestamo(idPrestamo) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                a.Id_Adeudo,
                a.Id_Prestamo,
                a.Tipo,
                a.Descripcion,
                a.Estado,
                a.Fecha_Creacion,
                a.Id_Usuario_Creacion,
                a.Fecha_Resolucion,
                a.Id_Usuario_Resolucion
            FROM Adeudos a
            WHERE a.Id_Prestamo = ?
            ORDER BY a.Fecha_Creacion DESC
        `, [idPrestamo]);

        return resultado;
    }

    static async obtenerPendientesPorAlumno(idAlumno) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                a.Id_Adeudo,
                a.Id_Prestamo,
                a.Tipo,
                a.Descripcion,
                a.Estado,
                a.Fecha_Creacion,
                p.Id_Alumno,
                p.Id_Libro,
                l.Titulo,
                p.Fecha_Prestamo,
                p.Fecha_Vencimiento
            FROM Adeudos a
            INNER JOIN Prestamos p
                ON a.Id_Prestamo = p.Id_Prestamo
            INNER JOIN Libros l
                ON p.Id_Libro = l.Id_Libro
            WHERE p.Id_Alumno = ?
              AND a.Estado = 'PENDIENTE'
            ORDER BY a.Fecha_Creacion DESC
        `, [idAlumno]);

        return resultado;
    }

    static async crear(
        idPrestamo,
        tipo,
        descripcion,
        idUsuarioCreacion
    ) {
        const [resultado] = await mysqlPool.query(`
            INSERT INTO Adeudos (
                Id_Prestamo,
                Tipo,
                Descripcion,
                Id_Usuario_Creacion
            )
            VALUES (?, ?, ?, ?)
        `, [
            idPrestamo,
            tipo,
            descripcion,
            idUsuarioCreacion
        ]);

        return resultado.insertId;
    }

    static async resolver(
        idAdeudo,
        idUsuarioResolucion
    ) {
        const [resultado] = await mysqlPool.query(`
            UPDATE Adeudos
            SET
                Estado = 'RESUELTO',
                Fecha_Resolucion = CURRENT_TIMESTAMP,
                Id_Usuario_Resolucion = ?
            WHERE Id_Adeudo = ?
              AND Estado = 'PENDIENTE'
        `, [
            idUsuarioResolucion,
            idAdeudo
        ]);

        return resultado.affectedRows;
    }

    static async actualizar(
        idAdeudo,
        tipo,
        descripcion
    ) {
        const [resultado] = await mysqlPool.query(`
            UPDATE Adeudos
            SET
                Tipo = ?,
                Descripcion = ?
            WHERE Id_Adeudo = ?
        `, [
            tipo,
            descripcion,
            idAdeudo
        ]);

        return resultado.affectedRows;
    }

    static async eliminar(idAdeudo) {
        const [resultado] = await mysqlPool.query(`
            DELETE FROM Adeudos
            WHERE Id_Adeudo = ?
        `, [idAdeudo]);

        return resultado.affectedRows;
    }
}

module.exports = AdeudosModel;