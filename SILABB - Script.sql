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

USE SILABB;

-- =========================================================
-- 1. ALUMNOS
-- =========================================================

INSERT INTO Alumnos
    (Nombre, Apellido_Paterno, Apellido_Materno, Semestre, Carrera, Numero_Control, Activo)
VALUES
    ('ILEANA SARAI', 'HURTADO', 'FLORES', 9, 'Ingeniería en Sistemas Computacionales', 222310202, TRUE),
    ('VICTORIA FERNANDA', 'TORRES', 'HERNANDEZ', 9, 'Ingeniería en Sistemas Computacionales', 222310166, TRUE),
    ('MARIA MONSERRATH', 'RODRIGUEZ', 'RIVERA', 9, 'Ingeniería en Sistemas Computacionales', 222310352, TRUE),
    ('ISAAC', 'CASTRO', 'GOMEZ', 9, 'Ingeniería en Sistemas Computacionales', 222310291, TRUE);


-- =========================================================
-- 2. USUARIO BIBLIOTECARIO
-- =========================================================

INSERT INTO Usuarios
    (Nombre, Apellido_Paterno, Apellido_Materno, Usuario, Password, Id_Rol, Activo)
VALUES
    ('MARTHA ELENA', 'GARCIA', 'GARCIA', 'mgarcia', '123456', 2, TRUE);


-- =========================================================
-- 3. LIBROS
-- =========================================================

INSERT INTO Libros
    (Titulo, Autor, Editorial, ISBN, Anio_Publicacion)
VALUES
    ('Ingeniería de Software', 'Ian Sommerville', 'Pearson', '9786073206034', 2011),
    ('Fundamentos de Bases de Datos', 'Abraham Silberschatz', 'McGraw-Hill', '9788448190330', 2009),
    ('Sistemas Operativos', 'William Stallings', 'Pearson', '9788490352925', 2015),
    ('Programación en C', 'Brian W. Kernighan', 'Prentice Hall', '9780131103627', 1988);


-- =========================================================
-- 4. PRESTAMOS
-- =========================================================

INSERT INTO Prestamos
    (Id_Alumno, Id_Libro, Id_Usuario, Fecha_Prestamo,
     Fecha_Vencimiento, Fecha_Devolucion, Estado)
VALUES

    -- ILEANA → DEVOLVIÓ EL LIBRO → SIN ADEUDO
    (1, 1, 1,
     '2026-08-01 10:00:00',
     '2026-08-08 10:00:00',
     '2026-08-07 12:00:00',
     'DEVUELTO'),

    -- VICTORIA → LIBRO NO DEVUELTO
    (2, 2, 1,
     '2026-08-01 11:00:00',
     '2026-08-08 11:00:00',
     NULL,
     'VENCIDO'),

    -- MARIA → LIBRO PERDIDO
    (3, 3, 1,
     '2026-08-02 09:00:00',
     '2026-08-09 09:00:00',
     NULL,
     'VENCIDO'),

    -- ISAAC → DEVOLVIÓ EL LIBRO → SIN ADEUDO
    (4, 4, 1,
     '2026-08-03 10:00:00',
     '2026-08-10 10:00:00',
     '2026-08-09 15:00:00',
     'DEVUELTO');


-- =========================================================
-- 5. ADEUDOS
-- =========================================================

-- VICTORIA → LIBRO NO DEVUELTO

INSERT INTO Adeudos
    (Id_Prestamo, Tipo, Descripcion, Estado, Id_Usuario_Creacion)
VALUES
    (
        2,
        'LIBRO_NO_DEVUELTO',
        'El alumno no ha realizado la devolución del libro solicitado en préstamo.',
        'PENDIENTE',
        1
    );


-- MARIA → LIBRO PERDIDO

INSERT INTO Adeudos
    (Id_Prestamo, Tipo, Descripcion, Estado, Id_Usuario_Creacion)
VALUES
    (
        3,
        'LIBRO_PERDIDO',
        'El alumno reportó como perdido el libro solicitado en préstamo.',
        'PENDIENTE',
        1
    );
    
    
ALTER TABLE Libros
ADD COLUMN Activo BOOLEAN NOT NULL DEFAULT TRUE;
    
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
