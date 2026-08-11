const AlumnosModel = require('../models/alumnos.model');
const LibrosModel = require('../models/libros.model');
const PrestamosModel = require('../models/prestamos.model');
const AdeudosModel = require('../models/adeudos.model');
const BitacoraModel = require('../models/bitacora.model');

class PrestamosService {
    static async listar() {
        return await PrestamosModel.listar();
    }

    static async obtenerPorId(idPrestamo) {
        if (!idPrestamo) {
            throw new Error('El préstamo es obligatorio');
        }

        const prestamo =
            await PrestamosModel.obtenerPorId(idPrestamo);

        if (!prestamo) {
            throw new Error('El préstamo no existe');
        }

        return prestamo;
    }

    static async obtenerPorAlumno(idAlumno) {
        if (!idAlumno) {
            throw new Error('El alumno es obligatorio');
        }

        const alumno =
            await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        return await PrestamosModel.obtenerPorAlumno(idAlumno);
    }

    static async obtenerActivosPorAlumno(idAlumno) {
        if (!idAlumno) {
            throw new Error('El alumno es obligatorio');
        }

        const alumno =
            await AlumnosModel.obtenerPorId(idAlumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        return await PrestamosModel.obtenerActivosPorAlumno(
            idAlumno
        );
    }

    static async obtenerVencidos() {
        await PrestamosModel.marcarVencidos();

        return await PrestamosModel.obtenerVencidos();
    }

    static async crear(data, idUsuario) {

        const {
            Id_Alumno,
            Id_Libro,
            Fecha_Prestamo,
            Fecha_Vencimiento
        } = data;

        if (!Id_Alumno) {
            throw new Error('El alumno es obligatorio');
        }

        if (!Id_Libro) {
            throw new Error('El libro es obligatorio');
        }

        if (!Fecha_Prestamo) {
            throw new Error(
                'La fecha de préstamo es obligatoria'
            );
        }

        if (!Fecha_Vencimiento) {
            throw new Error(
                'La fecha de vencimiento es obligatoria'
            );
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que registra el préstamo es obligatorio'
            );
        }

        const alumno =
            await AlumnosModel.obtenerPorId(Id_Alumno);

        if (!alumno) {
            throw new Error('El alumno no existe');
        }

        if (!alumno.Activo) {
            throw new Error('El alumno está inactivo');
        }

        /*
         * Un alumno con adeudos pendientes
         * no puede solicitar otro préstamo.
         */
        const adeudos =
            await AdeudosModel.obtenerPendientesPorAlumno(
                Id_Alumno
            );

        if (adeudos.length > 0) {
            throw new Error(
                'El alumno tiene adeudos pendientes y no puede solicitar préstamos'
            );
        }

        const libro =
            await LibrosModel.obtenerPorId(Id_Libro);

        if (!libro) {
            throw new Error('El libro no existe');
        }

        if (!libro.Activo) {
            throw new Error('El libro está inactivo');
        }

        const disponible =
            await LibrosModel.verificarDisponible(Id_Libro);

        if (!disponible) {
            throw new Error('El libro no está disponible');
        }

        const prestamoActivo =
            await PrestamosModel.verificarPrestamoActivo(
                Id_Alumno,
                Id_Libro
            );

        if (prestamoActivo) {
            throw new Error(
                'El alumno ya tiene este libro en préstamo'
            );
        }

        if (
            new Date(Fecha_Vencimiento) <=
            new Date(Fecha_Prestamo)
        ) {
            throw new Error(
                'La fecha de vencimiento debe ser posterior a la fecha de préstamo'
            );
        }

        const idPrestamo =
            await PrestamosModel.crear(
                Id_Alumno,
                Id_Libro,
                idUsuario,
                Fecha_Prestamo,
                Fecha_Vencimiento
            );

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'CREAR',
            Tabla_Afectada: 'Prestamos',
            Id_Registro: idPrestamo,
            Descripcion:
                `Préstamo creado para el alumno ` +
                `${alumno.Numero_Control} ` +
                `del libro "${libro.Titulo}"`
        });

        return await PrestamosModel.obtenerPorId(
            idPrestamo
        );
    }

    static async devolver(idPrestamo, idUsuario) {

        if (!idPrestamo) {
            throw new Error('El préstamo es obligatorio');
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que registra la devolución es obligatorio'
            );
        }

        const prestamo =
            await PrestamosModel.obtenerPorId(idPrestamo);

        if (!prestamo) {
            throw new Error('El préstamo no existe');
        }

        if (prestamo.Estado === 'DEVUELTO') {
            throw new Error(
                'El préstamo ya fue devuelto'
            );
        }

        const resultado =
            await PrestamosModel.devolver(idPrestamo);

        if (!resultado) {
            throw new Error(
                'No fue posible registrar la devolución'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'DEVOLVER',
            Tabla_Afectada: 'Prestamos',
            Id_Registro: idPrestamo,
            Descripcion:
                `Devolución registrada del libro ` +
                `"${prestamo.Titulo}" ` +
                `del alumno ${prestamo.Numero_Control}`
        });

        return await PrestamosModel.obtenerPorId(
            idPrestamo
        );
    }

    static async actualizarVencidos() {
        return await PrestamosModel.marcarVencidos();
    }
}

module.exports = PrestamosService;
