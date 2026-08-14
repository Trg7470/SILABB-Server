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

SELECT * FROM Alumnos