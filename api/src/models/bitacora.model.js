const { mysqlPool } = require('../config/mysql');

class BitacoraModel {

    static async all() {
        const [rows] = await mysqlPool.query(`
            SELECT
                b.Id_Bitacora,
                b.Id_Usuario,
                CONCAT(
                    u.Nombre, ' ',
                    u.Apellido_Paterno, ' ',
                    COALESCE(u.Apellido_Materno, '')
                ) AS Usuario,
                b.Accion,
                b.Tabla_Afectada,
                b.Id_Registro,
                b.Descripcion,
                b.Fecha_Hora
            FROM Bitacora b
            INNER JOIN Usuarios u
                ON u.Id_Usuario = b.Id_Usuario
            ORDER BY b.Fecha_Hora DESC
        `);

        return rows;
    }

    static async log(data) {
        const {
            Id_Usuario,
            Accion,
            Tabla_Afectada,
            Id_Registro,
            Descripcion
        } = data;

        const [result] = await mysqlPool.query(`
            INSERT INTO Bitacora (
                Id_Usuario,
                Accion,
                Tabla_Afectada,
                Id_Registro,
                Descripcion
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            Id_Usuario,
            Accion,
            Tabla_Afectada,
            Id_Registro,
            Descripcion
        ]);

        return result;
    }

    static async byUser(idUsuario) {
        const [rows] = await mysqlPool.query(`
            SELECT
                b.Id_Bitacora,
                b.Id_Usuario,
                CONCAT(
                    u.Nombre, ' ',
                    u.Apellido_Paterno, ' ',
                    COALESCE(u.Apellido_Materno, '')
                ) AS Usuario,
                b.Accion,
                b.Tabla_Afectada,
                b.Id_Registro,
                b.Descripcion,
                b.Fecha_Hora
            FROM Bitacora b
            INNER JOIN Usuarios u
                ON u.Id_Usuario = b.Id_Usuario
            WHERE b.Id_Usuario = ?
            ORDER BY b.Fecha_Hora DESC
        `, [idUsuario]);

        return rows;
    }

    static async byTableRecord(tabla, idRegistro) {
        const [rows] = await mysqlPool.query(`
            SELECT
                b.Id_Bitacora,
                b.Id_Usuario,
                CONCAT(
                    u.Nombre, ' ',
                    u.Apellido_Paterno, ' ',
                    COALESCE(u.Apellido_Materno, '')
                ) AS Usuario,
                b.Accion,
                b.Tabla_Afectada,
                b.Id_Registro,
                b.Descripcion,
                b.Fecha_Hora
            FROM Bitacora b
            INNER JOIN Usuarios u
                ON u.Id_Usuario = b.Id_Usuario
            WHERE b.Tabla_Afectada = ?
              AND b.Id_Registro = ?
            ORDER BY b.Fecha_Hora DESC
        `, [
            tabla,
            idRegistro
        ]);

        return rows;
    }

    static async byDateRange(fechaInicio, fechaFin) {
        const [rows] = await mysqlPool.query(`
            SELECT
                b.Id_Bitacora,
                b.Id_Usuario,
                CONCAT(
                    u.Nombre, ' ',
                    u.Apellido_Paterno, ' ',
                    COALESCE(u.Apellido_Materno, '')
                ) AS Usuario,
                b.Accion,
                b.Tabla_Afectada,
                b.Id_Registro,
                b.Descripcion,
                b.Fecha_Hora
            FROM Bitacora b
            INNER JOIN Usuarios u
                ON u.Id_Usuario = b.Id_Usuario
            WHERE b.Fecha_Hora BETWEEN ? AND ?
            ORDER BY b.Fecha_Hora DESC
        `, [
            fechaInicio,
            fechaFin
        ]);

        return rows;
    }
}

module.exports = BitacoraModel;