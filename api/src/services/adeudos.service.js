const AdeudosModel = require('../models/adeudos.model');
const PrestamosModel = require('../models/prestamos.model');
const AlumnosModel = require('../models/alumnos.model');
const BitacoraModel = require('../models/bitacora.model');

class AdeudosService {

    static async listar() {
        return await AdeudosModel.listar();
    }

    static async obtenerPorId(idAdeudo) {
        const adeudo = await AdeudosModel.obtenerPorId(idAdeudo);

        if (!adeudo) {
            throw new Error('El adeudo no existe');
        }

        return adeudo;
    }

    static async obtenerPorPrestamo(idPrestamo) {
        const prestamo = await PrestamosModel.obtenerPorId(idPrestamo);

        if (!prestamo) {
            throw new Error('El préstamo no existe');
        }

        return await AdeudosModel.obtenerPorPrestamo(idPrestamo);
    }

    static async obtenerPendientesPorAlumno(idAlumno) {
        const alumno = await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        return await AdeudosModel.obtenerPendientesPorAlumno(idAlumno);
    }

    static async crear(data, idUsuario) {
        const {
            Id_Prestamo,
            Tipo,
            Descripcion
        } = data;

        if (!Id_Prestamo) {
            throw new Error('El préstamo es obligatorio');
        }

        if (!Tipo) {
            throw new Error('El tipo de adeudo es obligatorio');
        }

        if (!Descripcion || !Descripcion.trim()) {
            throw new Error('La descripción del adeudo es obligatoria');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que registra el adeudo es obligatorio'
            );
        }

        const prestamo =
            await PrestamosModel.obtenerPorId(Id_Prestamo);

        if (!prestamo) {
            throw new Error('El préstamo no existe');
        }

        const adeudos =
            await AdeudosModel.obtenerPorPrestamo(Id_Prestamo);

        const pendiente = adeudos.find(
            adeudo => adeudo.Estado === 'PENDIENTE'
        );

        if (pendiente) {
            throw new Error(
                'El préstamo ya tiene un adeudo pendiente'
            );
        }

        const idAdeudo = await AdeudosModel.crear(
            Id_Prestamo,
            Tipo,
            Descripcion.trim(),
            idUsuario
        );

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'CREAR',
            Tabla_Afectada: 'Adeudos',
            Id_Registro: idAdeudo,
            Descripcion:
                `Adeudo creado para el préstamo ${Id_Prestamo}. ` +
                `Tipo: ${Tipo}`
        });

        return await AdeudosModel.obtenerPorId(idAdeudo);
    }

    static async resolver(idAdeudo, idUsuario) {
        if (!idAdeudo) {
            throw new Error('El adeudo es obligatorio');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que resuelve el adeudo es obligatorio'
            );
        }

        const adeudo =
            await AdeudosModel.obtenerPorId(idAdeudo);

        if (!adeudo) {
            throw new Error('El adeudo no existe');
        }

        if (adeudo.Estado === 'RESUELTO') {
            throw new Error('El adeudo ya está resuelto');
        }

        const resultado =
            await AdeudosModel.resolver(
                idAdeudo,
                idUsuario
            );

        if (!resultado) {
            throw new Error(
                'No fue posible resolver el adeudo'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'RESOLVER',
            Tabla_Afectada: 'Adeudos',
            Id_Registro: idAdeudo,
            Descripcion:
                `Adeudo ${idAdeudo} marcado como RESUELTO`
        });

        return await AdeudosModel.obtenerPorId(idAdeudo);
    }

    static async actualizar(idAdeudo, data, idUsuario) {
        const {
            Tipo,
            Descripcion
        } = data;

        if (!idAdeudo) {
            throw new Error('El adeudo es obligatorio');
        }

        if (!Tipo) {
            throw new Error('El tipo de adeudo es obligatorio');
        }

        if (!Descripcion || !Descripcion.trim()) {
            throw new Error(
                'La descripción del adeudo es obligatoria'
            );
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que actualiza el adeudo es obligatorio'
            );
        }

        const adeudo =
            await AdeudosModel.obtenerPorId(idAdeudo);

        if (!adeudo) {
            throw new Error('El adeudo no existe');
        }

        if (adeudo.Estado === 'RESUELTO') {
            throw new Error(
                'No se puede modificar un adeudo resuelto'
            );
        }

        const resultado =
            await AdeudosModel.actualizar(
                idAdeudo,
                Tipo,
                Descripcion.trim()
            );

        if (!resultado) {
            throw new Error(
                'No fue posible actualizar el adeudo'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'ACTUALIZAR',
            Tabla_Afectada: 'Adeudos',
            Id_Registro: idAdeudo,
            Descripcion:
                `Adeudo ${idAdeudo} actualizado`
        });

        return await AdeudosModel.obtenerPorId(idAdeudo);
    }

    static async eliminar(idAdeudo, idUsuario) {
        if (!idAdeudo) {
            throw new Error('El adeudo es obligatorio');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que elimina el adeudo es obligatorio'
            );
        }

        const adeudo =
            await AdeudosModel.obtenerPorId(idAdeudo);

        if (!adeudo) {
            throw new Error('El adeudo no existe');
        }

        if (adeudo.Estado === 'RESUELTO') {
            throw new Error(
                'No se puede eliminar un adeudo resuelto'
            );
        }

        const resultado =
            await AdeudosModel.eliminar(idAdeudo);

        if (!resultado) {
            throw new Error(
                'No fue posible eliminar el adeudo'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'ELIMINAR',
            Tabla_Afectada: 'Adeudos',
            Id_Registro: idAdeudo,
            Descripcion:
                `Adeudo ${idAdeudo} eliminado`
        });

        return true;
    }
}

module.exports = AdeudosService;