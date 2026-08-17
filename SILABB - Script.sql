CREATE DATABASE IF NOT EXISTS SILABB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE SILABB;
-- =========================================================
-- 1. TABLA: ROLES
-- =========================================================
CREATE TABLE Roles (
    Id_Rol INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;
-- =========================================================
-- 2. TABLA: USUARIOS
-- =========================================================
CREATE TABLE Usuarios (
    Id_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido_Paterno VARCHAR(100) NOT NULL,
    Apellido_Materno VARCHAR(100),
    Usuario VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Id_Rol INT NOT NULL,
    Activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT FK_Usuarios_Roles
        FOREIGN KEY (Id_Rol)
        REFERENCES Roles(Id_Rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;
-- =========================================================
-- 3. TABLA: ALUMNOS
-- =========================================================
CREATE TABLE Alumnos (
    Id_Alumno INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL,
    Semestre TINYINT UNSIGNED,
    Carrera VARCHAR(150) NOT NULL,
    Numero_Control BIGINT NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- =========================================================
-- 4. TABLA: LIBROS
-- =========================================================

CREATE TABLE Libros (
    Id_Libro INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    Autor VARCHAR(200),
    Editorial VARCHAR(200),
    ISBN VARCHAR(20),
    Anio_Publicacion YEAR
) ENGINE=InnoDB;

-- =========================================================
-- 5. TABLA: PRESTAMOS
-- =========================================================

CREATE TABLE Prestamos (
    Id_Prestamo INT AUTO_INCREMENT PRIMARY KEY,
    Id_Alumno INT NOT NULL,
    Id_Libro INT NOT NULL,
    Id_Usuario INT NOT NULL,
    Fecha_Prestamo DATETIME NOT NULL,
    Fecha_Vencimiento DATETIME NOT NULL,
    Fecha_Devolucion DATETIME,
    Estado ENUM(
        'PRESTADO',
        'VENCIDO',
        'DEVUELTO'
    ) NOT NULL DEFAULT 'PRESTADO',

    CONSTRAINT FK_Prestamos_Alumno
        FOREIGN KEY (Id_Alumno)
        REFERENCES Alumnos(Id_Alumno)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Prestamos_Libro
        FOREIGN KEY (Id_Libro)
        REFERENCES Libros(Id_Libro)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Prestamos_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES Usuarios(Id_Usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- 6. TABLA: ADEUDOS
-- =========================================================

CREATE TABLE Adeudos (
    Id_Adeudo INT AUTO_INCREMENT PRIMARY KEY,
    Id_Prestamo INT NOT NULL,

    Tipo ENUM(
        'LIBRO_NO_DEVUELTO',
        'LIBRO_PERDIDO',
        'LIBRO_DANADO',
        'OTRO'
    ) NOT NULL,

    Descripcion VARCHAR(500) NOT NULL,

    Estado ENUM(
        'PENDIENTE',
        'RESUELTO'
    ) NOT NULL DEFAULT 'PENDIENTE',

    Fecha_Creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Id_Usuario_Creacion INT NOT NULL,

    Fecha_Resolucion DATETIME,
    Id_Usuario_Resolucion INT,

    CONSTRAINT FK_Adeudos_Prestamo
        FOREIGN KEY (Id_Prestamo)
        REFERENCES Prestamos(Id_Prestamo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Adeudos_Usuario_Creacion
        FOREIGN KEY (Id_Usuario_Creacion)
        REFERENCES Usuarios(Id_Usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Adeudos_Usuario_Resolucion
        FOREIGN KEY (Id_Usuario_Resolucion)
        REFERENCES Usuarios(Id_Usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- 7. TABLA: BITACORA
-- =========================================================

CREATE TABLE Bitacora (
    Id_Bitacora INT AUTO_INCREMENT PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Accion VARCHAR(100) NOT NULL,
    Tabla_Afectada VARCHAR(100) NOT NULL,
    Id_Registro INT,
    Descripcion VARCHAR(500),
    Fecha_Hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Bitacora_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES Usuarios(Id_Usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- ÍNDICES
-- =========================================================

-- Prestamos
CREATE INDEX IDX_Prestamos_Alumno
    ON Prestamos(Id_Alumno);

CREATE INDEX IDX_Prestamos_Libro
    ON Prestamos(Id_Libro);

CREATE INDEX IDX_Prestamos_Usuario
    ON Prestamos(Id_Usuario);

CREATE INDEX IDX_Prestamos_Estado
    ON Prestamos(Estado);

CREATE INDEX IDX_Prestamos_Fecha_Vencimiento
    ON Prestamos(Fecha_Vencimiento);

-- Adeudos
CREATE INDEX IDX_Adeudos_Prestamo
    ON Adeudos(Id_Prestamo);

CREATE INDEX IDX_Adeudos_Estado
    ON Adeudos(Estado);

CREATE INDEX IDX_Adeudos_Usuario_Creacion
    ON Adeudos(Id_Usuario_Creacion);

CREATE INDEX IDX_Adeudos_Usuario_Resolucion
    ON Adeudos(Id_Usuario_Resolucion);

-- Bitacora
CREATE INDEX IDX_Bitacora_Usuario
    ON Bitacora(Id_Usuario);

CREATE INDEX IDX_Bitacora_Tabla_Registro
    ON Bitacora(Tabla_Afectada, Id_Registro);

CREATE INDEX IDX_Bitacora_Fecha
    ON Bitacora(Fecha_Hora);

-- =========================================================
-- DATOS INICIALES: ROLES
-- =========================================================

INSERT INTO Roles (Nombre) VALUES
('ADMINISTRADOR'),
('BIBLIOTECARIO');

ALTER TABLE Alumnos
ADD COLUMN Apellido_Paterno VARCHAR(100) NOT NULL AFTER Nombre,
ADD COLUMN Apellido_Materno VARCHAR(100) AFTER Apellido_Paterno;

SELECT * FROM Alumnos;

-- =========================================================
-- DATOS DE PRUEBA: USUARIOS
-- =========================================================

INSERT INTO Usuarios
(Nombre, Apellido_Paterno, Apellido_Materno, Usuario, Password, Id_Rol, Activo)
VALUES
('Carlos', 'Hernández', 'López', 'admin', '123456', 1, TRUE),
('María', 'García', 'Martínez', 'mgarcia', '123456', 2, TRUE),
('José', 'Ramírez', 'Torres', 'jramirez', '123456', 2, TRUE),
('Ana', 'Sánchez', 'Flores', 'asanchez', '123456', 2, TRUE);


-- =========================================================
-- DATOS DE PRUEBA: ALUMNOS
-- =========================================================

INSERT INTO Alumnos
(Nombre, Apellido_Paterno, Apellido_Materno, Semestre, Carrera, Numero_Control, Activo)
VALUES
('Juan', 'Pérez', 'Gómez', 2, 'Ingeniería en Sistemas Computacionales', 222310291, TRUE),
('Luis', 'Martínez', 'Hernández', 4, 'Ingeniería en Sistemas Computacionales', 222310865, TRUE),
('Sofía', 'García', 'Ramírez', 6, 'Ingeniería en Sistemas Computacionales', 222310645, TRUE),
('Daniel', 'López', 'Sánchez', 8, 'Ingeniería Informática', 222310273, TRUE),
('Mariana', 'Torres', 'Flores', 3, 'Ingeniería Informática', 222310829, TRUE),
('Pedro', 'Gómez', 'Castillo', 5, 'Ingeniería en Sistemas Computacionales', 222310192, TRUE),
('Andrea', 'Hernández', 'Morales', 7, 'Ingeniería Informática', 222310982, TRUE),
('Miguel', 'Ramírez', 'Vargas', 1, 'Ingeniería en Sistemas Computacionales', 222310352, TRUE);


-- =========================================================
-- DATOS DE PRUEBA: LIBROS
-- =========================================================

INSERT INTO Libros
(Titulo, Autor, Editorial, ISBN, Anio_Publicacion)
VALUES
('Cien años de soledad', 'Gabriel García Márquez', 'Diana', '9780307474728', 1967),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 'Alfaguara', '9788420412146', 1605),
('El principito', 'Antoine de Saint-Exupéry', 'Salamandra', '9788498381498', 1943),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', '9780132350884', 2008),
('Introducción a los algoritmos', 'Thomas H. Cormen', 'MIT Press', '9780262046305', 2009),
('Programación en C', 'Brian W. Kernighan', 'Pearson', '9780131103627', 1988),
('Bases de datos', 'Abraham Silberschatz', 'McGraw-Hill', '9780078022159', 2019),
('Redes de computadoras', 'Andrew S. Tanenbaum', 'Pearson', '9780132126953', 2011),
('Sistemas operativos', 'Abraham Silberschatz', 'Wiley', '9781119456339', 2018),
('Java: Cómo programar', 'Paul Deitel', 'Pearson', '9780135166307', 2019);


-- =========================================================
-- DATOS DE PRUEBA: PRESTAMOS
-- =========================================================

-- 1. Préstamo actualmente prestado
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Estado)
VALUES
(1, 4, 2, '2026-08-10 10:00:00', '2026-08-24 10:00:00', 'PRESTADO');

-- 2. Otro préstamo actualmente prestado
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Estado)
VALUES
(2, 7, 2, '2026-08-12 11:30:00', '2026-08-26 11:30:00', 'PRESTADO');

-- 3. Préstamo vencido
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Estado)
VALUES
(3, 8, 3, '2026-07-15 09:00:00', '2026-07-29 09:00:00', 'VENCIDO');

-- 4. Libro devuelto
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Fecha_Devolucion, Estado)
VALUES
(4, 1, 2, '2026-07-01 12:00:00', '2026-07-15 12:00:00',
 '2026-07-12 15:30:00', 'DEVUELTO');

-- 5. Libro devuelto
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Fecha_Devolucion, Estado)
VALUES
(5, 3, 3, '2026-07-20 10:00:00', '2026-08-03 10:00:00',
 '2026-08-01 09:20:00', 'DEVUELTO');

-- 6. Libro vencido
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Estado)
VALUES
(6, 5, 2, '2026-07-10 14:00:00', '2026-07-24 14:00:00', 'VENCIDO');

-- 7. Préstamo reciente
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Estado)
VALUES
(7, 6, 4, '2026-08-13 16:00:00', '2026-08-27 16:00:00', 'PRESTADO');

-- 8. Otro préstamo devuelto
INSERT INTO Prestamos
(Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo, Fecha_Vencimiento, Fecha_Devolucion, Estado)
VALUES
(8, 2, 3, '2026-06-15 09:30:00', '2026-06-29 09:30:00',
 '2026-06-28 13:00:00', 'DEVUELTO');


-- =========================================================
-- DATOS DE PRUEBA: ADEUDOS
-- =========================================================

-- Adeudo por libro no devuelto
INSERT INTO Adeudos
(Id_Prestamo, Tipo, Descripcion, Estado, Id_Usuario_Creacion)
VALUES
(3, 'LIBRO_NO_DEVUELTO',
 'El alumno no ha realizado la devolución del libro dentro del periodo establecido.',
 'PENDIENTE', 2);

-- Adeudo por libro perdido
INSERT INTO Adeudos
(Id_Prestamo, Tipo, Descripcion, Estado, Id_Usuario_Creacion)
VALUES
(6, 'LIBRO_PERDIDO',
 'El alumno reportó que perdió el libro durante el periodo de préstamo.',
 'PENDIENTE', 3);

-- Adeudo por libro dañado
INSERT INTO Adeudos
(Id_Prestamo, Tipo, Descripcion, Estado, Id_Usuario_Creacion)
VALUES
(4, 'LIBRO_DANADO',
 'El libro fue devuelto con daños en la portada.',
 'RESUELTO', 2);

-- Adeudo resuelto
INSERT INTO Adeudos
(Id_Prestamo, Tipo, Descripcion, Estado,
 Fecha_Resolucion, Id_Usuario_Creacion, Id_Usuario_Resolucion)
VALUES
(5, 'OTRO',
 'El alumno presentó una incidencia durante la devolución.',
 'RESUELTO',
 '2026-08-02 10:00:00', 3, 2);


-- =========================================================
-- DATOS DE PRUEBA: BITACORA
-- =========================================================

INSERT INTO Bitacora
(Id_Usuario, Accion, Tabla_Afectada, Id_Registro, Descripcion)
VALUES
(1, 'INSERTAR', 'Usuarios', 2,
 'Se registró un nuevo bibliotecario.'),

(2, 'INSERTAR', 'Prestamos', 1,
 'Se registró préstamo del libro Clean Code al alumno Juan Pérez.'),

(2, 'INSERTAR', 'Prestamos', 2,
 'Se registró préstamo del libro Bases de datos al alumno Luis Martínez.'),

(3, 'INSERTAR', 'Prestamos', 3,
 'Se registró préstamo del libro Redes de computadoras al alumno Sofía García.'),

(2, 'DEVOLVER', 'Prestamos', 4,
 'Se registró devolución de Cien años de soledad.'),

(2, 'INSERTAR', 'Adeudos', 1,
 'Se generó adeudo por libro no devuelto.'),

(3, 'INSERTAR', 'Adeudos', 2,
 'Se generó adeudo por libro perdido.'),

(2, 'RESOLVER', 'Adeudos', 3,
 'Se resolvió adeudo por libro dañado.');
 
 SELECT COUNT(*) FROM Alumnos;