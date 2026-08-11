const { mysqlPool } = require('../config/mysql');

class PrestamosModel {

    static async listar() {
        const [resultado] = await mysqlPool.query(`
            SELECT
                p.Id_Prestamo,
                p.Id_Alumno,
                a.Nombre AS Alumno,
                a.Numero_Control,
                a.Carrera,
                p.Id_Libro,
                l.Titulo,
                l.Autor,
                p.Id_Usuario,
                CONCAT(
                    u.Nombre, ' ',
                    u.Apellido_Paterno, ' ',
                    COALESCE(u.Apellido_Materno, '')
                ) AS Usuario,
                p.Fecha_Prestamo,
                p.Fecha_Vencimiento,
                p.Fecha_Devolucion,
                p.Estado
            FROM Prestamos p
            INNER JOIN Alumnos a
                ON p.Id_Alumno = a.Id_Alumno
            INNER JOIN Libros l
                ON p.Id_Libro = l.Id_Libro
            INNER JOIN Usuarios u
                ON p.Id_Usuario = u.Id_Usuario
            ORDER BY p.Fecha_Prestamo DESC
        `);

        return resultado;
    }

    static async obtenerPorId(idPrestamo) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                p.Id_Prestamo,
                p.Id_Alumno,
                a.Nombre AS Alumno,
                a.Numero_Control,
                a.Carrera,
                p.Id_Libro,
                l.Titulo,
                l.Autor,
                p.Id_Usuario,
                CONCAT(
                    u.Nombre, ' ',
                    u.Apellido_Paterno, ' ',
                    COALESCE(u.Apellido_Materno, '')
                ) AS Usuario,
                p.Fecha_Prestamo,
                p.Fecha_Vencimiento,
                p.Fecha_Devolucion,
                p.Estado
            FROM Prestamos p
            INNER JOIN Alumnos a
                ON p.Id_Alumno = a.Id_Alumno
            INNER JOIN Libros l
                ON p.Id_Libro = l.Id_Libro
            INNER JOIN Usuarios u
                ON p.Id_Usuario = u.Id_Usuario
            WHERE p.Id_Prestamo = ?
        `, [idPrestamo]);

        return resultado[0];
    }

    static async obtenerPorAlumno(idAlumno) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                p.Id_Prestamo,
                p.Id_Alumno,
                p.Id_Libro,
                l.Titulo,
                l.Autor,
                p.Fecha_Prestamo,
                p.Fecha_Vencimiento,
                p.Fecha_Devolucion,
                p.Estado
            FROM Prestamos p
            INNER JOIN Libros l
                ON p.Id_Libro = l.Id_Libro
            WHERE p.Id_Alumno = ?
            ORDER BY p.Fecha_Prestamo DESC
        `, [idAlumno]);

        return resultado;
    }

    static async obtenerActivosPorAlumno(idAlumno) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                p.Id_Prestamo,
                p.Id_Libro,
                l.Titulo,
                l.Autor,
                p.Fecha_Prestamo,
                p.Fecha_Vencimiento,
                p.Estado
            FROM Prestamos p
            INNER JOIN Libros l
                ON p.Id_Libro = l.Id_Libro
            WHERE p.Id_Alumno = ?
              AND p.Estado IN ('PRESTADO', 'VENCIDO')
            ORDER BY p.Fecha_Vencimiento ASC
        `, [idAlumno]);

        return resultado;
    }

    static async obtenerVencidos() {
        const [resultado] = await mysqlPool.query(`
            SELECT
                p.Id_Prestamo,
                p.Id_Alumno,
                a.Nombre AS Alumno,
                a.Numero_Control,
                p.Id_Libro,
                l.Titulo,
                p.Fecha_Prestamo,
                p.Fecha_Vencimiento,
                p.Estado
            FROM Prestamos p
            INNER JOIN Alumnos a
                ON p.Id_Alumno = a.Id_Alumno
            INNER JOIN Libros l
                ON p.Id_Libro = l.Id_Libro
            WHERE p.Estado = 'VENCIDO'
            ORDER BY p.Fecha_Vencimiento ASC
        `);

        return resultado;
    }

    static async crear(
        idAlumno,
        idLibro,
        idUsuario,
        fechaPrestamo,
        fechaVencimiento
    ) {
        const [resultado] = await mysqlPool.query(`
            INSERT INTO Prestamos (
                Id_Alumno,
                Id_Libro,
                Id_Usuario,
                Fecha_Prestamo,
                Fecha_Vencimiento
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            idAlumno,
            idLibro,
            idUsuario,
            fechaPrestamo,
            fechaVencimiento
        ]);

        return resultado.insertId;
    }

    static async devolver(idPrestamo) {
        const [resultado] = await mysqlPool.query(`
            UPDATE Prestamos
            SET
                Fecha_Devolucion = CURRENT_TIMESTAMP,
                Estado = 'DEVUELTO'
            WHERE Id_Prestamo = ?
              AND Estado IN ('PRESTADO', 'VENCIDO')
        `, [idPrestamo]);

        return resultado.affectedRows;
    }

    static async marcarVencidos() {
        const [resultado] = await mysqlPool.query(`
            UPDATE Prestamos
            SET Estado = 'VENCIDO'
            WHERE Estado = 'PRESTADO'
              AND Fecha_Vencimiento < CURRENT_TIMESTAMP
        `);

        return resultado.affectedRows;
    }

    static async tienePrestamoActivo(idLibro) {
        const [resultado] = await mysqlPool.query(`
        SELECT
            Id_Prestamo
        FROM Prestamos
        WHERE Id_Libro = ?
          AND Estado IN ('PRESTADO', 'VENCIDO')
        LIMIT 1
    `, [idLibro]);

        return resultado.length > 0;
    }

    static async verificarPrestamoActivo(idAlumno, idLibro) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Prestamo,
                Estado,
                Fecha_Vencimiento
            FROM Prestamos
            WHERE Id_Alumno = ?
              AND Id_Libro = ?
              AND Estado IN ('PRESTADO', 'VENCIDO')
            LIMIT 1
        `, [
            idAlumno,
            idLibro
        ]);

        return resultado[0];
    }
}

module.exports = PrestamosModel;