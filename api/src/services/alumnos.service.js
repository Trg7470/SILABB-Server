const AlumnosModel = require('../models/alumnos.model');
const PrestamosModel = require('../models/prestamos.model');
const AdeudosModel = require('../models/adeudos.model');
const BitacoraModel = require('../models/bitacora.model');

class AlumnosService {

    static async listar() {
        return await AlumnosModel.listar();
    }

    static async obtenerPorId(idAlumno) {
        const alumno = await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        return alumno;
    }

    static async obtenerPorNumeroControl(numeroControl) {
        if (!numeroControl) {
            throw new Error('El número de control es obligatorio');
        }

        const alumno =
            await AlumnosModel.obtenerPorNumeroControl(numeroControl);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        return alumno;
    }

    static async listarActivos() {
        return await AlumnosModel.listarActivos();
    }

    static async buscar(termino) {
        if (!termino || !termino.trim()) {
            throw new Error('El término de búsqueda es obligatorio');
        }

        return await AlumnosModel.buscar(termino.trim());
    }

    static async crear(data, idUsuario) {
        const {
            Nombre,
            Semestre,
            Carrera,
            Numero_Control
        } = data;

        if (!Nombre || !Nombre.trim()) {
            throw new Error('El nombre del alumno es obligatorio');
        }

        if (!Carrera || !Carrera.trim()) {
            throw new Error('La carrera es obligatoria');
        }

        if (!Numero_Control) {
            throw new Error('El número de control es obligatorio');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que registra al alumno es obligatorio'
            );
        }

        const alumnoExistente =
            await AlumnosModel.obtenerPorNumeroControl(
                Numero_Control
            );

        if (alumnoExistente) {
            throw new Error(
                'Ya existe un alumno con ese número de control'
            );
        }

        const idAlumno = await AlumnosModel.crear(
            Nombre.trim(),
            Semestre || null,
            Carrera.trim(),
            Numero_Control
        );

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'CREAR',
            Tabla_Afectada: 'Alumnos',
            Id_Registro: idAlumno,
            Descripcion:
                `Alumno creado: ${Nombre.trim()} ` +
                `(${Numero_Control})`
        });

        return await AlumnosModel.obtenerPorId(idAlumno);
    }

    static async actualizar(idAlumno, data, idUsuario) {
        const {
            Nombre,
            Semestre,
            Carrera,
            Numero_Control
        } = data;

        if (!idAlumno) {
            throw new Error('El alumno es obligatorio');
        }

        if (!Nombre || !Nombre.trim()) {
            throw new Error('El nombre del alumno es obligatorio');
        }

        if (!Carrera || !Carrera.trim()) {
            throw new Error('La carrera es obligatoria');
        }

        if (!Numero_Control) {
            throw new Error('El número de control es obligatorio');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que actualiza al alumno es obligatorio'
            );
        }

        const alumno =
            await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        const alumnoNumero =
            await AlumnosModel.obtenerPorNumeroControl(
                Numero_Control
            );

        if (
            alumnoNumero &&
            alumnoNumero.Id_Alumno !== Number(idAlumno)
        ) {
            throw new Error(
                'Ya existe otro alumno con ese número de control'
            );
        }

        const resultado =
            await AlumnosModel.actualizar(
                idAlumno,
                Nombre.trim(),
                Semestre || null,
                Carrera.trim(),
                Numero_Control
            );

        if (!resultado) {
            throw new Error(
                'No fue posible actualizar el alumno'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'ACTUALIZAR',
            Tabla_Afectada: 'Alumnos',
            Id_Registro: idAlumno,
            Descripcion:
                `Alumno actualizado: ${Nombre.trim()} ` +
                `(${Numero_Control})`
        });

        return await AlumnosModel.obtenerPorId(idAlumno);
    }

    static async cambiarEstado(idAlumno, activo, idUsuario) {
        if (!idAlumno) {
            throw new Error('El alumno es obligatorio');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que cambia el estado es obligatorio'
            );
        }

        if (typeof activo !== 'boolean') {
            throw new Error(
                'El estado debe ser verdadero o falso'
            );
        }

        const alumno =
            await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        const resultado =
            await AlumnosModel.cambiarEstado(
                idAlumno,
                activo
            );

        if (!resultado) {
            throw new Error(
                'No fue posible cambiar el estado del alumno'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: activo ? 'ACTIVAR' : 'DESACTIVAR',
            Tabla_Afectada: 'Alumnos',
            Id_Registro: idAlumno,
            Descripcion:
                `Alumno ${activo ? 'activado' : 'desactivado'}: ` +
                `${alumno.Numero_Control}`
        });

        return await AlumnosModel.obtenerPorId(idAlumno);
    }

    static async obtenerEstadoBiblioteca(idAlumno) {
        const alumno =
            await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        // Solo se obtienen los préstamos que siguen activos.
        // Los préstamos ya devueltos/resueltos no afectan
        // la generación de la constancia.
        const prestamos =
            await PrestamosModel.obtenerActivosPorAlumno(
                idAlumno
            );

        // Solo se obtienen los adeudos pendientes.
        // Los adeudos resueltos no afectan
        // la generación de la constancia.
        const adeudos =
            await AdeudosModel.obtenerPendientesPorAlumno(
                idAlumno
            );

        const tienePrestamos =
            prestamos.length > 0;

        const tieneAdeudos =
            adeudos.length > 0;

        const puedeSolicitarConstancia =
            !tienePrestamos && !tieneAdeudos;

        return {
            alumno,
            prestamos,
            adeudos,
            tienePrestamos,
            tieneAdeudos,
            puedeSolicitarConstancia
        };
    }
}

module.exports = AlumnosService;