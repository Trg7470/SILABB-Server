const { mysqlPool } = require('../config/mysql');

class Auth {
    static async login(email) {
        try {
            const [rows] = await mysqlPool.query(
                `SELECT U.Id_Usuario, U.Correo, R.Nombre AS Rol, U.Contrasena 
                FROM Usuarios AS U
                INNER JOIN Roles AS R
                ON Id_Rol_Usuario = R.Id_Rol
                WHERE Correo = ?`,
                [email]
            );
            if (rows.length > 0) {
                return {
                    success: true,
                    user: rows[0]
                };
            } else {
                return { success: false };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Auth;