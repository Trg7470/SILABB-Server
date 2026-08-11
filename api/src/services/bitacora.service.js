const BitacoraModel = require('../models/bitacora.model');
const UsuariosModel = require('../models/usuarios.model');

class BitacoraService {

    static async listar() {
        return await BitacoraModel.all();
    }

    static async obtenerPorUsuario(idUsuario) {
        if (!idUsuario) {
            throw new Error('El usuario es obligatorio');
        }

        const usuario =
            await UsuariosModel.userById(idUsuario);

        if (!usuario || usuario.length === 0) {
            throw new Error('El usuario no existe');
        }

        return await BitacoraModel.byUser(idUsuario);
    }

    static async obtenerPorRegistro(tabla, idRegistro) {
        if (!tabla || !tabla.trim()) {
            throw new Error('La tabla es obligatoria');
        }

        if (!idRegistro) {
            throw new Error('El registro es obligatorio');
        }

        return await BitacoraModel.byTableRecord(
            tabla.trim(),
            idRegistro
        );
    }

    static async obtenerPorFechas(fechaInicio, fechaFin) {
        if (!fechaInicio) {
            throw new Error(
                'La fecha de inicio es obligatoria'
            );
        }

        if (!fechaFin) {
            throw new Error(
                'La fecha final es obligatoria'
            );
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (
            Number.isNaN(inicio.getTime()) ||
            Number.isNaN(fin.getTime())
        ) {
            throw new Error(
                'Las fechas proporcionadas no son válidas'
            );
        }

        if (inicio > fin) {
            throw new Error(
                'La fecha de inicio no puede ser posterior a la fecha final'
            );
        }

        return await BitacoraModel.byDateRange(
            fechaInicio,
            fechaFin
        );
    }
}

module.exports = BitacoraService;