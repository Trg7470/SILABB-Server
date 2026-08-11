const {mysqlPool} = require('../config/mysql');

class AlumnosModel {

    static async listar() {
        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Alumno,
                Nombre,
                Semestre,
                Carrera,
                Numero_Control,
                Activo
            FROM Alumnos
            ORDER BY Nombre ASC
        `);

        return resultado;
    }

    static async obtenerPorId(idAlumno) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Alumno,
                Nombre,
                Semestre,
                Carrera,
                Numero_Control,
                Activo
            FROM Alumnos
            WHERE Id_Alumno = ?
        `, [idAlumno]);

        return resultado[0];
    }

    static async obtenerPorNumeroControl(numeroControl) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Alumno,
                Nombre,
                Semestre,
                Carrera,
                Numero_Control,
                Activo
            FROM Alumnos
            WHERE Numero_Control = ?
        `, [numeroControl]);

        return resultado[0];
    }

    static async listarActivos() {
        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Alumno,
                Nombre,
                Semestre,
                Carrera,
                Numero_Control
            FROM Alumnos
            WHERE Activo = TRUE
            ORDER BY Nombre ASC
        `);

        return resultado;
    }

    static async buscar(termino) {
        const [resultado] = await mysqlPool.query(`
            SELECT
                Id_Alumno,
                Nombre,
                Semestre,
                Carrera,
                Numero_Control,
                Activo
            FROM Alumnos
            WHERE Nombre LIKE ?
               OR Numero_Control LIKE ?
               OR Carrera LIKE ?
            ORDER BY Nombre ASC
        `, [
            `%${termino}%`,
            `%${termino}%`,
            `%${termino}%`
        ]);

        return resultado;
    }

    static async crear(
        nombre,
        semestre,
        carrera,
        numeroControl
    ) {
        const [resultado] = await mysqlPool.query(`
            INSERT INTO Alumnos (
                Nombre,
                Semestre,
                Carrera,
                Numero_Control
            )
            VALUES (?, ?, ?, ?)
        `, [
            nombre,
            semestre,
            carrera,
            numeroControl
        ]);

        return resultado.insertId;
    }

    static async actualizar(
        idAlumno,
        nombre,
        semestre,
        carrera,
        numeroControl
    ) {
        const [resultado] = await mysqlPool.query(`
            UPDATE Alumnos
            SET
                Nombre = ?,
                Semestre = ?,
                Carrera = ?,
                Numero_Control = ?
            WHERE Id_Alumno = ?
        `, [
            nombre,
            semestre,
            carrera,
            numeroControl,
            idAlumno
        ]);

        return resultado.affectedRows;
    }

    static async cambiarEstado(idAlumno, activo) {
        const [resultado] = await mysqlPool.query(`
            UPDATE Alumnos
            SET Activo = ?
            WHERE Id_Alumno = ?
        `, [
            activo,
            idAlumno
        ]);

        return resultado.affectedRows;
    }
}

module.exports = AlumnosModel;