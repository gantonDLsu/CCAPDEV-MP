-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: enteract
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `postid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `message` text,
  `datetime` datetime NOT NULL,
  `media` longtext,
  `mediatype` text,
  `usershare` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`postid`),
  KEY `userid_idx` (`username`),
  CONSTRAINT `poststousersusername` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'johndoe','John Doe','Hello world','2022-11-26 08:12:53',NULL,NULL,NULL),(2,'marydoe','Mary Doe','Enteract is here!','2022-11-26 08:13:47',NULL,NULL,NULL),(3,'gabrieldeleon','Gabriel Anton de Leon','This is an updated post','2022-11-26 08:14:56',NULL,NULL,NULL),(4,'johndoe','John Doe','Definitely not a \"Lorem ipsum\" post','2022-11-26 08:17:45',NULL,NULL,NULL),(5,'johndoe','John Doe','!@#$%^&*()-=','2022-11-26 08:19:07',NULL,NULL,NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercomments`
--

DROP TABLE IF EXISTS `usercomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercomments` (
  `commentid` int NOT NULL AUTO_INCREMENT,
  `postid` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`commentid`),
  UNIQUE KEY `commentid_UNIQUE` (`commentid`),
  KEY `postid_idx` (`postid`),
  CONSTRAINT `usercommentstouserspostid` FOREIGN KEY (`postid`) REFERENCES `posts` (`postid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercomments`
--

LOCK TABLES `usercomments` WRITE;
/*!40000 ALTER TABLE `usercomments` DISABLE KEYS */;
INSERT INTO `usercomments` VALUES (1,1,'Mary Doe','Hello!'),(2,3,'John Doe','This is a comment'),(3,5,'John Doe',',./;\'[]<>?:\"{}'),(5,3,'Gabriel Anton de Leon','This is another comment'),(6,2,'Mary Doe','Enter-act yay!'),(9,5,'Gabriel Anton de Leon','test comment');
/*!40000 ALTER TABLE `usercomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'gabrieldeleon','12345','Gabriel Anton de Leon','gabriel_anton_deleon@dlsu.edu.ph'),(3,'juliadalipe','12345','Julia Bettina Dalipe','julia_dalipe@dlsu.edu.ph'),(4,'reecedepadua','12345','Reece Cendrick De Padua','reece_depadua@dlsu.edu.ph'),(5,'johndoe','12345','John Doe','johndoe@gmail.com'),(6,'marydoe','12345','Mary Doe','marydoe@gmail.com'),(20,'test','$2b$10$sdTxhO80jeYN76vGKmJ.s.Cwb6xdKjHvNbqhwaAfkJ.cwMWjnGu3S','test','test@email.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-08 20:01:32
