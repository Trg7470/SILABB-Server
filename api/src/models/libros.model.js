const { mysqlPool } = require('../config/mysql');

class LibrosModel {
    static async listar() {
    const [resultado] = await mysqlPool.query(`
        SELECT
            l.Id_Libro,
            l.Titulo,
            l.Autor,
            l.Editorial,
            l.ISBN,
            l.Anio_Publicacion,
            l.Activo,
            CASE
                WHEN l.Activo = TRUE
                AND NOT EXISTS (
                    SELECT 1
                    FROM Prestamos p
                    WHERE p.Id_Libro = l.Id_Libro
                    AND p.Estado IN ('PRESTADO', 'VENCIDO')
                )
                THEN TRUE
                ELSE FALSE
            END AS Disponible
        FROM Libros l
        ORDER BY l.Titulo ASC
    `);

    return resultado;
}

    static async obtenerPorId(idLibro) {
    const [resultado] = await mysqlPool.query(`
        SELECT
            l.Id_Libro,
            l.Titulo,
            l.Autor,
            l.Editorial,
            l.ISBN,
            l.Anio_Publicacion,
            l.Activo,

            CASE
                WHEN l.Activo = TRUE
                AND NOT EXISTS (
                    SELECT 1
                    FROM Prestamos p
                    WHERE p.Id_Libro = l.Id_Libro
                    AND p.Estado IN ('PRESTADO', 'VENCIDO')
                )
                THEN 1
                ELSE 0
            END AS Disponible

        FROM Libros l
        WHERE l.Id_Libro = ?
    `, [idLibro]);

    return resultado[0];
}

    static async buscar(termino) {
        const [resultado] = await mysqlPool.query(`
        SELECT
            Id_Libro,
            Titulo,
            Autor,
            Editorial,
            ISBN,
            Anio_Publicacion,
            Activo
        FROM Libros
        WHERE Titulo LIKE ?
        OR Autor LIKE ?
        OR Editorial LIKE ?
        OR ISBN LIKE ?
        ORDER BY Titulo ASC
    `, [
            `%${termino}%`,
            `%${termino}%`,
            `%${termino}%`,
            `%${termino}%`
        ]);

        return resultado;
    }

    static async obtenerDisponibles() {
        const [resultado] = await mysqlPool.query(`
        SELECT
            l.Id_Libro,
            l.Titulo,
            l.Autor,
            l.Editorial,
            l.ISBN,
            l.Anio_Publicacion,
            l.Activo
        FROM Libros l
        WHERE l.Activo = TRUE
        AND NOT EXISTS (
            SELECT 1
            FROM Prestamos p
            WHERE p.Id_Libro = l.Id_Libro
                AND p.Estado IN ('PRESTADO', 'VENCIDO')
        )
        ORDER BY l.Titulo ASC
    `);

        return resultado;
    }

    static async obtenerPrestados() {
        const [resultado] = await mysqlPool.query(`
        SELECT
            l.Id_Libro,
            l.Titulo,
            l.Autor,
            l.Activo,
            p.Id_Prestamo,
            p.Id_Alumno,
            a.Nombre AS Alumno,
            a.Numero_Control,
            p.Fecha_Prestamo,
            p.Fecha_Vencimiento,
            p.Estado
        FROM Libros l
        INNER JOIN Prestamos p
            ON l.Id_Libro = p.Id_Libro
        INNER JOIN Alumnos a
            ON p.Id_Alumno = a.Id_Alumno
        WHERE p.Estado IN ('PRESTADO', 'VENCIDO')
        ORDER BY p.Fecha_Vencimiento ASC
    `);

        return resultado;
    }

    static async verificarDisponible(idLibro) {
        const [resultado] = await mysqlPool.query(`
        SELECT
            l.Id_Libro
        FROM Libros l
        WHERE l.Id_Libro = ?
        AND l.Activo = TRUE
        AND NOT EXISTS (
            SELECT 1
            FROM Prestamos p
            WHERE p.Id_Libro = l.Id_Libro
                AND p.Estado IN ('PRESTADO', 'VENCIDO')
        )
    `, [idLibro]);

        return resultado.length > 0;
    }

    static async crear(
        titulo,
        autor,
        editorial,
        isbn,
        anioPublicacion
    ) {
        const [resultado] = await mysqlPool.query(`
        INSERT INTO Libros (
            Titulo,
            Autor,
            Editorial,
            ISBN,
            Anio_Publicacion
        )
        VALUES (?, ?, ?, ?, ?)
    `, [
            titulo,
            autor,
            editorial,
            isbn,
            anioPublicacion
        ]);

        return resultado.insertId;
    }

    static async actualizar(
        idLibro,
        titulo,
        autor,
        editorial,
        isbn,
        anioPublicacion
    ) {
        const [resultado] = await mysqlPool.query(`
        UPDATE Libros
        SET
            Titulo = ?,
            Autor = ?,
            Editorial = ?,
            ISBN = ?,
            Anio_Publicacion = ?
        WHERE Id_Libro = ?
    `, [
            titulo,
            autor,
            editorial,
            isbn,
            anioPublicacion,
            idLibro
        ]);

        return resultado.affectedRows;
    }

    static async cambiarEstado(idLibro, activo) {
        const [resultado] = await mysqlPool.query(`
        UPDATE Libros
        SET Activo = ?
        WHERE Id_Libro = ?
    `, [
            activo,
            idLibro
        ]);

        return resultado.affectedRows;
    }
}

module.exports = LibrosModel;
