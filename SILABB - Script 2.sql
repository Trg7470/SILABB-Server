CREATE DATABASE  IF NOT EXISTS `silabb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `silabb`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: silabb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adeudos`
--

DROP TABLE IF EXISTS `adeudos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adeudos` (
  `Id_Adeudo` int NOT NULL AUTO_INCREMENT,
  `Id_Prestamo` int NOT NULL,
  `Tipo` enum('LIBRO_NO_DEVUELTO','LIBRO_PERDIDO','LIBRO_DANADO','OTRO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `Descripcion` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Estado` enum('PENDIENTE','RESUELTO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `Fecha_Creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Usuario_Creacion` int NOT NULL,
  `Fecha_Resolucion` datetime DEFAULT NULL,
  `Id_Usuario_Resolucion` int DEFAULT NULL,
  PRIMARY KEY (`Id_Adeudo`),
  KEY `IDX_Adeudos_Prestamo` (`Id_Prestamo`),
  KEY `IDX_Adeudos_Estado` (`Estado`),
  KEY `IDX_Adeudos_Usuario_Creacion` (`Id_Usuario_Creacion`),
  KEY `IDX_Adeudos_Usuario_Resolucion` (`Id_Usuario_Resolucion`),
  CONSTRAINT `FK_Adeudos_Prestamo` FOREIGN KEY (`Id_Prestamo`) REFERENCES `prestamos` (`Id_Prestamo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Adeudos_Usuario_Creacion` FOREIGN KEY (`Id_Usuario_Creacion`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Adeudos_Usuario_Resolucion` FOREIGN KEY (`Id_Usuario_Resolucion`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adeudos`
--

LOCK TABLES `adeudos` WRITE;
/*!40000 ALTER TABLE `adeudos` DISABLE KEYS */;
INSERT INTO `adeudos` VALUES (1,2,'LIBRO_NO_DEVUELTO','El alumno no ha realizado la devolución del libro solicitado en préstamo.','PENDIENTE','2026-08-14 12:47:59',1,NULL,NULL),(2,3,'LIBRO_PERDIDO','El alumno reportó como perdido el libro solicitado en préstamo.','PENDIENTE','2026-08-14 12:47:59',1,NULL,NULL);
/*!40000 ALTER TABLE `adeudos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `Id_Alumno` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Apellido_Paterno` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Apellido_Materno` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Semestre` tinyint unsigned DEFAULT NULL,
  `Carrera` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Numero_Control` bigint NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id_Alumno`),
  UNIQUE KEY `Numero_Control` (`Numero_Control`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,'ILEANA SARAI','HURTADO','FLORES',9,'Ingeniería en Sistemas Computacionales',222310202,1),(2,'VICTORIA FERNANDA','TORRES','HERNANDEZ',9,'Ingeniería en Sistemas Computacionales',222310166,1),(3,'MARIA MONSERRATH','RODRIGUEZ','RIVERA',9,'Ingeniería en Sistemas Computacionales',222310352,1),(4,'ISAAC','CASTRO','GOMEZ',9,'Ingeniería en Sistemas Computacionales',222310291,1);
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `Id_Bitacora` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int NOT NULL,
  `Accion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Tabla_Afectada` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Id_Registro` int DEFAULT NULL,
  `Descripcion` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Fecha_Hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id_Bitacora`),
  KEY `IDX_Bitacora_Usuario` (`Id_Usuario`),
  KEY `IDX_Bitacora_Tabla_Registro` (`Tabla_Afectada`,`Id_Registro`),
  KEY `IDX_Bitacora_Fecha` (`Fecha_Hora`),
  CONSTRAINT `FK_Bitacora_Usuario` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
INSERT INTO `bitacora` VALUES (1,1,'ACTUALIZAR','Libros',1,'Libro actualizado: \"Ingeniería de Software\"','2026-08-18 12:07:39'),(2,1,'ACTUALIZAR','Libros',1,'Libro actualizado: \"Ingeniería de Software\"','2026-08-18 12:08:26'),(3,1,'ACTUALIZAR','Libros',1,'Libro actualizado: \"Ingeniería de Software\"','2026-08-18 12:09:37'),(4,1,'ACTUALIZAR','Libros',1,'Libro actualizado: \"Ingeniería de Software\"','2026-08-18 12:19:38'),(5,1,'ACTUALIZAR','Libros',1,'Libro actualizado: \"Ingeniería de Software\"','2026-08-18 12:19:47'),(6,1,'ACTUALIZAR','Libros',3,'Libro actualizado: \"Sistemas Operativos\"','2026-08-18 12:23:00'),(7,1,'ACTUALIZAR','Libros',3,'Libro actualizado: \"Sistemas Operativos\"','2026-08-18 12:23:10');
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libros`
--

DROP TABLE IF EXISTS `libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libros` (
  `Id_Libro` int NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Autor` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Editorial` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ISBN` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Anio_Publicacion` year DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id_Libro`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libros`
--

LOCK TABLES `libros` WRITE;
/*!40000 ALTER TABLE `libros` DISABLE KEYS */;
INSERT INTO `libros` VALUES (1,'Ingeniería de Software','Ian Sommerville','Pearson','9786073206034',2011,1),(2,'Fundamentos de Bases de Datos','Abraham Silberschatz','McGraw-Hill','9788448190330',2009,1),(3,'Sistemas Operativos','William Stallings','Pearson','9788490352925',2015,1),(4,'Programación en C','Brian W. Kernighan','Prentice Hall','9780131103627',1988,1);
/*!40000 ALTER TABLE `libros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamos`
--

DROP TABLE IF EXISTS `prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamos` (
  `Id_Prestamo` int NOT NULL AUTO_INCREMENT,
  `Id_Alumno` int NOT NULL,
  `Id_Libro` int NOT NULL,
  `Id_Usuario` int NOT NULL,
  `Fecha_Prestamo` datetime NOT NULL,
  `Fecha_Vencimiento` datetime NOT NULL,
  `Fecha_Devolucion` datetime DEFAULT NULL,
  `Estado` enum('PRESTADO','VENCIDO','DEVUELTO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRESTADO',
  PRIMARY KEY (`Id_Prestamo`),
  KEY `IDX_Prestamos_Alumno` (`Id_Alumno`),
  KEY `IDX_Prestamos_Libro` (`Id_Libro`),
  KEY `IDX_Prestamos_Usuario` (`Id_Usuario`),
  KEY `IDX_Prestamos_Estado` (`Estado`),
  KEY `IDX_Prestamos_Fecha_Vencimiento` (`Fecha_Vencimiento`),
  CONSTRAINT `FK_Prestamos_Alumno` FOREIGN KEY (`Id_Alumno`) REFERENCES `alumnos` (`Id_Alumno`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Prestamos_Libro` FOREIGN KEY (`Id_Libro`) REFERENCES `libros` (`Id_Libro`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Prestamos_Usuario` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuarios` (`Id_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamos`
--

LOCK TABLES `prestamos` WRITE;
/*!40000 ALTER TABLE `prestamos` DISABLE KEYS */;
INSERT INTO `prestamos` VALUES (1,1,1,1,'2026-08-01 10:00:00','2026-08-08 10:00:00','2026-08-07 12:00:00','DEVUELTO'),(2,2,2,1,'2026-08-01 11:00:00','2026-08-08 11:00:00',NULL,'VENCIDO'),(3,3,3,1,'2026-08-02 09:00:00','2026-08-09 09:00:00',NULL,'VENCIDO'),(4,4,4,1,'2026-08-03 10:00:00','2026-08-10 10:00:00','2026-08-09 15:00:00','DEVUELTO');
/*!40000 ALTER TABLE `prestamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Id_Rol` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Id_Rol`),
  UNIQUE KEY `Nombre` (`Nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMINISTRADOR'),(2,'BIBLIOTECARIO');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `Id_Usuario` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Apellido_Paterno` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Apellido_Materno` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Id_Rol` int NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id_Usuario`),
  UNIQUE KEY `Usuario` (`Usuario`),
  KEY `FK_Usuarios_Roles` (`Id_Rol`),
  CONSTRAINT `FK_Usuarios_Roles` FOREIGN KEY (`Id_Rol`) REFERENCES `roles` (`Id_Rol`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'MARTHA ELENA','GARCIA','GARCIA','mgarcia','123456',2,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'silabb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-20 13:59:05
