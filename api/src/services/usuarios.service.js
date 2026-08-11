const bcrypt = require('bcryptjs');
const UsuariosModel = require('../models/usuarios.model');
const BitacoraModel = require('../models/bitacora.model');

class UsuariosService {
    static async listar() {
        return await UsuariosModel.listar();
    }

    static async obtenerPorId(idUsuario) {

        if (!idUsuario) {
            throw new Error('El usuario es obligatorio');
        }

        const usuario =
            await UsuariosModel.obtenerPorId(idUsuario);

        if (!usuario) {
            throw new Error('El usuario no existe');
        }

        return usuario;
    }

    static async resumen() {

        const usuarios =
            await UsuariosModel.listar();

        return {
            total: usuarios.length,
            activos: usuarios.filter(
                usuario => usuario.Activo === 1 ||
                    usuario.Activo === true
            ).length,
            inactivos: usuarios.filter(
                usuario => usuario.Activo === 0 ||
                    usuario.Activo === false
            ).length
        };
    }

    static async verificarUsuario(usuario) {

        if (!usuario || !usuario.trim()) {
            throw new Error(
                'El usuario es obligatorio'
            );
        }

        const resultado =
            await UsuariosModel.buscarPorUsuario(
                usuario.trim()
            );

        if (!resultado) {
            throw new Error(
                'El usuario no está registrado'
            );
        }

        if (!resultado.Activo) {
            throw new Error(
                'El usuario se encuentra inactivo'
            );
        }

        return {
            Id_Usuario: resultado.Id_Usuario,
            Usuario: resultado.Usuario
        };
    }

    static async restablecerPassword(
        usuario,
        newPassword
    ) {

        if (!usuario || !usuario.trim()) {
            throw new Error(
                'El usuario es obligatorio'
            );
        }

        if (!newPassword || !newPassword.trim()) {
            throw new Error(
                'La nueva contraseña es obligatoria'
            );
        }

        const usuarioEncontrado =
            await UsuariosModel.obtenerPorUsuarioParaReset(
                usuario.trim()
            );

        if (!usuarioEncontrado) {
            throw new Error(
                'El usuario no está registrado'
            );
        }

        if (!usuarioEncontrado.Activo) {
            throw new Error(
                'El usuario se encuentra inactivo'
            );
        }

        const salt =
            await bcrypt.genSalt(10);

        const passwordHash =
            await bcrypt.hash(
                newPassword,
                salt
            );

        const resultado =
            await UsuariosModel.actualizarPassword(
                usuarioEncontrado.Id_Usuario,
                passwordHash
            );

        if (!resultado) {
            throw new Error(
                'No fue posible actualizar la contraseña'
            );
        }

        return true;
    }

    static async crear(data, idUsuario) {

        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Usuario,
            Password,
            Contrasena,
            Id_Rol
        } = data;

        const password =
            Password || Contrasena;

        if (!Nombre || !Nombre.trim()) {
            throw new Error(
                'El nombre es obligatorio'
            );
        }

        if (
            !Apellido_Paterno ||
            !Apellido_Paterno.trim()
        ) {
            throw new Error(
                'El apellido paterno es obligatorio'
            );
        }

        if (!Usuario || !Usuario.trim()) {
            throw new Error(
                'El usuario es obligatorio'
            );
        }

        if (!password || !password.trim()) {
            throw new Error(
                'La contraseña es obligatoria'
            );
        }

        if (!Id_Rol) {
            throw new Error(
                'El rol es obligatorio'
            );
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que registra es obligatorio'
            );
        }

        const existe =
            await UsuariosModel.existeUsuario(
                Usuario.trim()
            );

        if (existe) {
            throw new Error(
                'Ya existe un usuario con ese nombre de usuario'
            );
        }

        const salt =
            await bcrypt.genSalt(10);

        const passwordHash =
            await bcrypt.hash(
                password,
                salt
            );

        const idNuevoUsuario =
            await UsuariosModel.crear(
                Nombre.trim(),
                Apellido_Paterno.trim(),
                Apellido_Materno
                    ? Apellido_Materno.trim()
                    : null,
                Usuario.trim(),
                passwordHash,
                Id_Rol
            );

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'CREAR',
            Tabla_Afectada: 'Usuarios',
            Id_Registro: idNuevoUsuario,
            Descripcion:
                `Usuario creado: ${Usuario.trim()}`
        });

        return await UsuariosModel.obtenerPorId(
            idNuevoUsuario
        );
    }

    static async actualizar(
        idUsuario,
        data,
        idUsuarioActual
    ) {

        const {
            Nombre,
            Apellido_Paterno,
            Apellido_Materno,
            Usuario,
            Password,
            Contrasena,
            Id_Rol
        } = data;

        const password =
            Password || Contrasena;

        if (!idUsuario) {
            throw new Error(
                'El usuario es obligatorio'
            );
        }

        if (!idUsuarioActual) {
            throw new Error(
                'El usuario que actualiza es obligatorio'
            );
        }

        if (!Nombre || !Nombre.trim()) {
            throw new Error(
                'El nombre es obligatorio'
            );
        }

        if (
            !Apellido_Paterno ||
            !Apellido_Paterno.trim()
        ) {
            throw new Error(
                'El apellido paterno es obligatorio'
            );
        }

        if (!Usuario || !Usuario.trim()) {
            throw new Error(
                'El usuario es obligatorio'
            );
        }

        if (!Id_Rol) {
            throw new Error(
                'El rol es obligatorio'
            );
        }

        const usuarioExistente =
            await UsuariosModel.obtenerPorId(
                idUsuario
            );

        if (!usuarioExistente) {
            throw new Error(
                'El usuario no existe'
            );
        }

        const usuarioDuplicado =
            await UsuariosModel.existeUsuarioOtroId(
                Usuario.trim(),
                idUsuario
            );

        if (usuarioDuplicado) {
            throw new Error(
                'Ya existe otro usuario con ese nombre de usuario'
            );
        }

        let resultado;

        if (password && password.trim()) {

            const salt =
                await bcrypt.genSalt(10);

            const passwordHash =
                await bcrypt.hash(
                    password,
                    salt
                );

            resultado =
                await UsuariosModel.actualizarConPassword(
                    idUsuario,
                    Nombre.trim(),
                    Apellido_Paterno.trim(),
                    Apellido_Materno
                        ? Apellido_Materno.trim()
                        : null,
                    Usuario.trim(),
                    passwordHash,
                    Id_Rol
                );

        } else {

            resultado =
                await UsuariosModel.actualizar(
                    idUsuario,
                    Nombre.trim(),
                    Apellido_Paterno.trim(),
                    Apellido_Materno
                        ? Apellido_Materno.trim()
                        : null,
                    Usuario.trim(),
                    Id_Rol
                );
        }

        if (!resultado) {
            throw new Error(
                'No fue posible actualizar el usuario'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuarioActual,
            Accion: 'ACTUALIZAR',
            Tabla_Afectada: 'Usuarios',
            Id_Registro: idUsuario,
            Descripcion:
                `Usuario actualizado: ${Usuario.trim()}`
        });

        return await UsuariosModel.obtenerPorId(
            idUsuario
        );
    }

    static async cambiarEstado(
        idUsuario,
        activo,
        idUsuarioActual
    ) {

        if (!idUsuario) {
            throw new Error(
                'El usuario es obligatorio'
            );
        }

        if (!idUsuarioActual) {
            throw new Error(
                'El usuario que cambia el estado es obligatorio'
            );
        }

        if (typeof activo !== 'boolean') {
            throw new Error(
                'El estado debe ser verdadero o falso'
            );
        }

        const usuario =
            await UsuariosModel.obtenerPorId(
                idUsuario
            );

        if (!usuario) {
            throw new Error(
                'El usuario no existe'
            );
        }

        if (
            usuario.Activo === activo ||
            usuario.Activo === Number(activo)
        ) {
            throw new Error(
                `El usuario ya se encuentra ${activo ? 'activo' : 'inactivo'}`
            );
        }

        const resultado =
            await UsuariosModel.cambiarEstado(
                idUsuario,
                activo
            );

        if (!resultado) {
            throw new Error(
                'No fue posible cambiar el estado del usuario'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuarioActual,
            Accion: activo
                ? 'ACTIVAR'
                : 'DESACTIVAR',
            Tabla_Afectada: 'Usuarios',
            Id_Registro: idUsuario,
            Descripcion:
                `Usuario ${activo ? 'activado' : 'desactivado'}: ` +
                `${usuario.Usuario}`
        });

        return await UsuariosModel.obtenerPorId(
            idUsuario
        );
    }

    static generarPassword() {

        const caracteres =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz' +
            '0123456789@#$%&*!';

        const longitud = 12;

        let password = '';

        for (
            let i = 0;
            i < longitud;
            i++
        ) {
            const indice =
                cryptoRandomInt(
                    caracteres.length
                );

            password += caracteres[indice];
        }

        return password;
    }

}

function cryptoRandomInt(max) {
    const crypto = require('crypto');

    return crypto.randomInt(0, max);

}

module.exports = UsuariosService;
