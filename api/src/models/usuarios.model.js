const { mysqlPool } = require('../config/mysql');

class Usuarios {
    static async all() {
        const [rows] = await mysqlPool.query(`
            SELECT
                u.Id_Usuario,
                u.Nombre,
                u.Apellido_Paterno,
                u.Apellido_Materno,
                u.Usuario,
                u.Id_Rol,
                r.Nombre AS Rol,
                u.Activo
            FROM Usuarios u
            INNER JOIN Roles r
                ON r.Id_Rol = u.Id_Rol
            ORDER BY u.Id_Usuario ASC
        `);
        return rows;
    }

    static async userById(id) {
        const [rows] = await mysqlPool.query(`
            SELECT
                u.Id_Usuario,
                u.Nombre,
                u.Apellido_Paterno,
                u.Apellido_Materno,
                u.Usuario,
                u.Id_Rol,
                r.Nombre AS Rol,
                u.Activo
            FROM Usuarios u
            INNER JOIN Roles r
                ON r.Id_Rol = u.Id_Rol
            WHERE u.Id_Usuario = ?
        `, [id]);
        return rows;
    }

    static async createUser(data) {
        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Usuario,
            Password,
            Id_Rol
        } = data;
        const [result] = await mysqlPool.query(`
            INSERT INTO Usuarios (
                Nombre,
                Apellido_Paterno,
                Apellido_Materno,
                Usuario,
                Password,
                Id_Rol
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Usuario,
            Password,
            Id_Rol
        ]);
        return result;
    }

    static async updateUser(id, data) {
        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Usuario,
            Id_Rol,
            Activo
        } = data;

        const [result] = await mysqlPool.query(`
            UPDATE Usuarios
            SET
                Nombre = ?,
                Apellido_Paterno = ?,
                Apellido_Materno = ?,
                Usuario = ?,
                Id_Rol = ?,
                Activo = ?
            WHERE Id_Usuario = ?
        `, [
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Usuario,
            Id_Rol,
            Activo,
            id
        ]);

        return result;
    }

    static async updatePassword(id, password) {
        const [result] = await mysqlPool.query(`
            UPDATE Usuarios
            SET Password = ?
            WHERE Id_Usuario = ?
        `, [
            password,
            id
        ]);

        return result;
    }

    static async deactivateUser(id) {
        const [result] = await mysqlPool.query(`
            UPDATE Usuarios
            SET Activo = FALSE
            WHERE Id_Usuario = ?
        `, [id]);

        return result;
    }

    static async activateUser(id) {
        const [result] = await mysqlPool.query(`
            UPDATE Usuarios
            SET Activo = TRUE
            WHERE Id_Usuario = ?
        `, [id]);

        return result;
    }

    static async findByUsername(usuario) {
        const [rows] = await mysqlPool.query(`
            SELECT
                u.Id_Usuario,
                u.Nombre,
                u.Apellido_Paterno,
                u.Apellido_Materno,
                u.Usuario,
                u.Password,
                u.Id_Rol,
                r.Nombre AS Rol,
                u.Activo
            FROM Usuarios u
            INNER JOIN Roles r
                ON r.Id_Rol = u.Id_Rol
            WHERE u.Usuario = ?
            LIMIT 1
        `, [usuario]);

        return rows;
    }

    static async existsUsername(usuario) {
        const [rows] = await mysqlPool.query(`
            SELECT Id_Usuario
            FROM Usuarios
            WHERE Usuario = ?
            LIMIT 1
        `, [usuario]);

        return rows.length > 0;
    }
}

module.exports = Usuarios;