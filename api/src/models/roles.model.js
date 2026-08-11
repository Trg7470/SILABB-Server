const { mysqlPool } = require('../config/mysql');

class Roles {

    static async all() {
        const [rows] = await mysqlPool.query(`
            SELECT
                Id_Rol,
                Nombre
            FROM Roles
            ORDER BY Id_Rol ASC
        `);

        return rows;
    }

    static async roleById(id) {
        const [rows] = await mysqlPool.query(`
            SELECT
                Id_Rol,
                Nombre
            FROM Roles
            WHERE Id_Rol = ?
        `, [id]);

        return rows;
    }

    static async createRole(nombre) {
        const [result] = await mysqlPool.query(`
            INSERT INTO Roles (Nombre)
            VALUES (?)
        `, [nombre]);

        return result;
    }

    static async updateRole(id, nombre) {
        const [result] = await mysqlPool.query(`
            UPDATE Roles
            SET Nombre = ?
            WHERE Id_Rol = ?
        `, [
            nombre,
            id
        ]);

        return result;
    }

    static async existsRole(nombre) {
        const [rows] = await mysqlPool.query(`
            SELECT Id_Rol
            FROM Roles
            WHERE Nombre = ?
            LIMIT 1
        `, [nombre]);

        return rows.length > 0;
    }
}

module.exports = Roles;