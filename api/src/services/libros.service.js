const LibrosModel = require('../models/libros.model');
const PrestamosModel = require('../models/prestamos.model');
const BitacoraModel = require('../models/bitacora.model');

class LibrosService {
    static async listar() {
        return await LibrosModel.listar();
    }

    static async obtenerPorId(idLibro) {
        if (!idLibro) {
            throw new Error('El libro es obligatorio');
        }

        const libro =
            await LibrosModel.obtenerPorId(idLibro);

        if (!libro) {
            throw new Error('El libro no existe');
        }

        return libro;
    }

    static async buscar(termino) {
        if (!termino || !termino.trim()) {
            throw new Error(
                'El término de búsqueda es obligatorio'
            );
        }

        return await LibrosModel.buscar(
            termino.trim()
        );
    }

    static async obtenerDisponibles() {
        return await LibrosModel.obtenerDisponibles();
    }

    static async obtenerPrestados() {
        return await LibrosModel.obtenerPrestados();
    }

    static async verificarDisponible(idLibro) {
        if (!idLibro) {
            throw new Error('El libro es obligatorio');
        }

        const libro =
            await LibrosModel.obtenerPorId(idLibro);

        if (!libro) {
            throw new Error('El libro no existe');
        }

        if (!libro.Activo) {
            return false;
        }

        return await LibrosModel.verificarDisponible(
            idLibro
        );
    }

    static async crear(data, idUsuario) {
        const {
            Titulo,
            Autor,
            Editorial,
            ISBN,
            Anio_Publicacion
        } = data;

        if (!Titulo || !Titulo.trim()) {
            throw new Error(
                'El título del libro es obligatorio'
            );
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que registra el libro es obligatorio'
            );
        }

        if (ISBN) {
            const libros =
                await LibrosModel.buscar(
                    ISBN.trim()
                );

            const existeISBN =
                libros.some(
                    libro =>
                        libro.ISBN === ISBN.trim()
                );

            if (existeISBN) {
                throw new Error(
                    'Ya existe un libro con ese ISBN'
                );
            }
        }

        const idLibro =
            await LibrosModel.crear(
                Titulo.trim(),
                Autor ? Autor.trim() : null,
                Editorial ? Editorial.trim() : null,
                ISBN ? ISBN.trim() : null,
                Anio_Publicacion || null
            );

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'CREAR',
            Tabla_Afectada: 'Libros',
            Id_Registro: idLibro,
            Descripcion:
                `Libro creado: "${Titulo.trim()}"`
        });

        return await LibrosModel.obtenerPorId(
            idLibro
        );
    }

    static async actualizar(
        idLibro,
        data,
        idUsuario
    ) {
        const {
            Titulo,
            Autor,
            Editorial,
            ISBN,
            Anio_Publicacion
        } = data;

        if (!idLibro) {
            throw new Error(
                'El libro es obligatorio'
            );
        }

        if (!Titulo || !Titulo.trim()) {
            throw new Error(
                'El título del libro es obligatorio'
            );
        }

        if (!idUsuario) {
            throw new Error(
                'El usuario que actualiza el libro es obligatorio'
            );
        }

        const libro =
            await LibrosModel.obtenerPorId(
                idLibro
            );

        if (!libro) {
            throw new Error(
                'El libro no existe'
            );
        }

        if (ISBN) {
            const libros =
                await LibrosModel.buscar(
                    ISBN.trim()
                );

            const existeISBN =
                libros.some(
                    libroEncontrado =>
                        libroEncontrado.ISBN === ISBN.trim() &&
                        libroEncontrado.Id_Libro !== Number(idLibro)
                );

            if (existeISBN) {
                throw new Error(
                    'Ya existe otro libro con ese ISBN'
                );
            }
        }

        const resultado =
            await LibrosModel.actualizar(
                idLibro,
                Titulo.trim(),
                Autor ? Autor.trim() : null,
                Editorial ? Editorial.trim() : null,
                ISBN ? ISBN.trim() : null,
                Anio_Publicacion || null
            );

        if (!resultado) {
            throw new Error(
                'No fue posible actualizar el libro'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: 'ACTUALIZAR',
            Tabla_Afectada: 'Libros',
            Id_Registro: idLibro,
            Descripcion:
                `Libro actualizado: "${Titulo.trim()}"`
        });

        return await LibrosModel.obtenerPorId(
            idLibro
        );
    }

    static async cambiarEstado(
        idLibro,
        activo,
        idUsuario
    ) {
        if (!idLibro) {
            throw new Error(
                'El libro es obligatorio'
            );
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

        const libro =
            await LibrosModel.obtenerPorId(
                idLibro
            );

        if (!libro) {
            throw new Error(
                'El libro no existe'
            );
        }

        if (libro.Activo === activo) {
            throw new Error(
                `El libro ya se encuentra ${activo ? 'activo' : 'inactivo'}`
            );
        }

        if (!activo) {
            const tienePrestamoActivo =
                await PrestamosModel.tienePrestamoActivo(
                    idLibro
                );

            if (tienePrestamoActivo) {
                throw new Error(
                    'No se puede desactivar un libro que tiene un préstamo activo'
                );
            }
        }

        const resultado =
            await LibrosModel.cambiarEstado(
                idLibro,
                activo
            );

        if (!resultado) {
            throw new Error(
                'No fue posible cambiar el estado del libro'
            );
        }

        await BitacoraModel.log({
            Id_Usuario: idUsuario,
            Accion: activo
                ? 'ACTIVAR'
                : 'DESACTIVAR',
            Tabla_Afectada: 'Libros',
            Id_Registro: idLibro,
            Descripcion:
                `Libro ${activo ? 'activado' : 'desactivado'}: ` +
                `"${libro.Titulo}"`
        });

        return await LibrosModel.obtenerPorId(
            idLibro
        );
    }
}

module.exports = LibrosService;
