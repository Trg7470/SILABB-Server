const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/usuarios.model');

class AuthService {

    static async login(Usuario, Password) {
        const usuarios = await Usuarios.findByUsername(Usuario);

        if (usuarios.length === 0) {
            throw new Error('Credenciales inválidas.');
        }
        const usuario = usuarios[0];
        if (!usuario.Activo) {
            throw new Error('El usuario se encuentra inactivo.');
        }
        const passwordValida = await bcrypt.compare(
            Password,
            usuario.Password
        );
        if (!passwordValida) {
            throw new Error('Credenciales inválidas.');
        }
        const payload = {
            Id_Usuario: usuario.Id_Usuario,
            Usuario: usuario.Usuario,
            Id_Rol: usuario.Id_Rol
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '6h'
            }
        );
        return {
            token,
            usuario: {
                Id_Usuario: usuario.Id_Usuario,
                Nombre: usuario.Nombre,
                Apellido_Paterno: usuario.Apellido_Paterno,
                Apellido_Materno: usuario.Apellido_Materno,
                Usuario: usuario.Usuario,
                Id_Rol: usuario.Id_Rol,
                Rol: usuario.Rol
            }
        };
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
}

module.exports = AuthService;