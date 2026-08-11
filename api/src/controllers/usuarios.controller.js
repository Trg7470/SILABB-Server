const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Usuarios = require('../models/usuarios.model');

class UsuarioController {
    static async all(req, res) {
        try {
            const result = await Usuario.all();
            res.json(result);
        } catch (error) {
            res.status(500).json
                (
                    {
                        mensaje: "Error al obtener usuarios",
                        error: error.message
                    }
                )
        }
    }
    static async userbyId(req, res) {
        const { id } = req.params;
        try {
            const result = await Usuario.userbyId(id);
            res.json(result);
        } catch (error) {
            res.status(500).json(
                {
                    mensaje: "Error al obtener usuarios",
                    error: error.message
                }
            )
        }
    }
    static async checkUser(req, res) {
        const { email } = req.body;

        try {
            const resultado = await Usuario.checkUser(email);

            if (resultado.success) {
                res.json({
                    success: true,
                    data: resultado.user,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "El usuario no está registrado."
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error en el servidor",
                error: error.message
            });
        }
    }
    static async resetPassword(req, res) {
        const { email, newPassword } = req.body;
        try {
            const passwordEncrypted = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, passwordEncrypted);

            const resultado = await Usuario.resetPassword(email, passwordHash);

            if (resultado.success) {
                res.json({
                    success: true,
                    message: "Contraseña actualizada correctamente."
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "No se pudo actualizar la contraseña."
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error en el servidor",
                error: error.message
            });
        }
    }
    static async usersResume(req, res) {
        try {
            const result = await Usuario.usersResume();
            res.json(result);
        } catch (error) {
            res.status(500).json
                (
                    {
                        mensaje: "Error al obtener usuarios",
                        error: error.message
                    }
                )
        }
    }

    static async createUser(req, res) {
        const data = req.body;

        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.Contrasena, salt);

            data.Contrasena = hash;

            const result = await Usuario.createUser(data);

            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: "Error al crear usuario",
                error: error.message
            });
        }
    }
    static async updateUser(req, res) {
        const { id } = req.params;
        const data = req.body;

        try {

            if (data.Contrasena) {
                const salt = await bcrypt.genSalt(10);
                data.Contrasena = await bcrypt.hash(data.Contrasena, salt);
            }

            const result = await Usuario.updateUser(id, data);

            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: "Error al actualizar usuario",
                error: error.message
            });
        }
    }
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const result = await Usuario.deleteUser(id);
            res.json(result);
        } catch (error) {
            res.status(500).json
                (
                    {
                        mensaje: "Error al eliminar usuario",
                        error: error.message
                    }
                )
        }
    }
    static async generatePassword(req, res) {
        try {
            const chars =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!';
            const length = 12;
            let password = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(
                    Math.random() * chars.length
                );
                password += chars[randomIndex];
            }
            return res.json({
                success: true,
                password: password
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error al generar contraseña",
                error: error.message
            });
        }
    }
}
module.exports = UsuarioController;