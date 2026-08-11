const { mysqlPool } = require('../config/mysql');
class UsuariosModel {
    static async listar() {
        const [resultado] = await mysqlPool.query(`
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

        return resultado;
    }

    static async obtenerPorId(idUsuario) {
        const [resultado] = await mysqlPool.query(`
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
    `, [idUsuario]);

        return resultado[0];
    }

    static async crear(
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        usuario,
        password,
        idRol
    ) {
        const [resultado] = await mysqlPool.query(`
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
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            usuario,
            password,
            idRol
        ]);

        return resultado.insertId;
    }

    static async actualizar(
        idUsuario,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        usuario,
        idRol
    ) {
        const [resultado] = await mysqlPool.query(`
        UPDATE Usuarios
        SET
            Nombre = ?,
            Apellido_Paterno = ?,
            Apellido_Materno = ?,
            Usuario = ?,
            Id_Rol = ?
        WHERE Id_Usuario = ?
    `, [
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            usuario,
            idRol,
            idUsuario
        ]);

        return resultado.affectedRows;
    }

    static async actualizarConPassword(
        idUsuario,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        usuario,
        password,
        idRol
    ) {
        const [resultado] = await mysqlPool.query(`
        UPDATE Usuarios
        SET
            Nombre = ?,
            Apellido_Paterno = ?,
            Apellido_Materno = ?,
            Usuario = ?,
            Password = ?,
            Id_Rol = ?
        WHERE Id_Usuario = ?
    `, [
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            usuario,
            password,
            idRol,
            idUsuario
        ]);

        return resultado.affectedRows;
    }

    static async actualizarPassword(
        idUsuario,
        password
    ) {
        const [resultado] = await mysqlPool.query(`
        UPDATE Usuarios
        SET Password = ?
        WHERE Id_Usuario = ?
    `, [
            password,
            idUsuario
        ]);

        return resultado.affectedRows;
    }

    static async cambiarEstado(
        idUsuario,
        activo
    ) {
        const [resultado] = await mysqlPool.query(`
        UPDATE Usuarios
        SET Activo = ?
        WHERE Id_Usuario = ?
    `, [
            activo,
            idUsuario
        ]);

        return resultado.affectedRows;
    }

    static async buscarPorUsuario(usuario) {
        const [resultado] = await mysqlPool.query(`
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

        return resultado[0];
    }

    static async buscarPorId(idUsuario) {
        const [resultado] = await mysqlPool.query(`
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
        WHERE u.Id_Usuario = ?
        LIMIT 1
    `, [idUsuario]);

        return resultado[0];
    }

    static async existeUsuario(usuario) {
        const [resultado] = await mysqlPool.query(`
        SELECT Id_Usuario
        FROM Usuarios
        WHERE Usuario = ?
        LIMIT 1
    `, [usuario]);

        return resultado.length > 0;
    }

    static async existeUsuarioOtroId(
        usuario,
        idUsuario
    ) {
        const [resultado] = await mysqlPool.query(`
        SELECT Id_Usuario
        FROM Usuarios
        WHERE Usuario = ?
          AND Id_Usuario <> ?
        LIMIT 1
    `, [
            usuario,
            idUsuario
        ]);

        return resultado.length > 0;
    }

    static async obtenerPorUsuarioParaReset(usuario) {
        const [resultado] = await mysqlPool.query(`
        SELECT
            Id_Usuario,
            Usuario,
            Activo
        FROM Usuarios
        WHERE Usuario = ?
        LIMIT 1
    `, [usuario]);

        return resultado[0];
    }
}

module.exports = UsuariosModel;
