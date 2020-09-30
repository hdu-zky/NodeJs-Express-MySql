-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: nodeexpress
-- ------------------------------------------------------
-- Server version	8.0.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `author` (
  `authorId` int(45) NOT NULL AUTO_INCREMENT,
  `authorName` varchar(45) NOT NULL,
  `regTime` varchar(10) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`authorId`),
  UNIQUE KEY `authorId_UNIQUE` (`authorId`)
) ENGINE=InnoDB AUTO_INCREMENT=20200940 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `author`
--

LOCK TABLES `author` WRITE;
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
INSERT INTO `author` VALUES (20200929,'无言123','2020-09-29','1234'),(20200930,'宅猪','2020-09-29','1234'),(20200931,'天蚕土豆','2020-09-29','1234'),(20200932,'我吃西红柿','2020-09-29','1234'),(20200933,'辰东','2020-09-29','1234'),(20200934,'净无痕','2020-09-29','1234'),(20200935,'猫腻','2020-09-29','1234'),(20200936,'唐家三少','2020-09-29','1234'),(20200937,'莫默','2020-09-29','1234'),(20200938,'善良的蜜蜂','2020-09-29','1234'),(20200939,'永恒之火','2020-09-29','1234');
/*!40000 ALTER TABLE `author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `book` (
  `bookId` int(45) NOT NULL,
  `authorId` int(45) NOT NULL,
  `bookName` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `updateTime` varchar(45) NOT NULL,
  `createTime` varchar(45) NOT NULL,
  `Introduction` varchar(256) NOT NULL,
  PRIMARY KEY (`bookId`),
  UNIQUE KEY `bookId_UNIQUE` (`bookId`),
  KEY `bookAuthorIdfore_idx` (`authorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (2020,0,'校园修仙','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2021,0,'人道至尊','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2022,0,'大主宰','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2023,0,'雪鹰领主','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2024,0,'圣墟','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2025,0,'太古神王','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2026,0,'择天记','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2027,0,'龙王传说','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2028,0,'武炼巅峰','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2029,0,'修罗武神','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。'),(2030,0,'儒道至圣','1','2017-04-21','2014-5-12','在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，他考上了全县最尊贵的高中。');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookchapter`
--

DROP TABLE IF EXISTS `bookchapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bookchapter` (
  `bookId` int(45) NOT NULL,
  `bookChapterId` int(45) NOT NULL,
  `chapterTitle` varchar(45) NOT NULL,
  `chapterContentUrl` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookchapter`
--

LOCK TABLES `bookchapter` WRITE;
/*!40000 ALTER TABLE `bookchapter` DISABLE KEYS */;
INSERT INTO `bookchapter` VALUES (2020,1,'第一章 时间方恨少','/booktxt/2020/1.txt'),(2020,2,'第二章 声名远扬','/booktxt/2020/2.txt'),(2020,3,'第三章 湖边老头','/booktxt/2020/3.txt'),(2020,4,'第四章 变化','/booktxt/2020/4.txt'),(2020,5,'第五章 同学被打','/booktxt/2020/5.txt'),(2020,6,'第六章 考试','/booktxt/2020/6.txt'),(2020,7,'第七章 注定的悲哀','/booktxt/2020/7.txt');
/*!40000 ALTER TABLE `bookchapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookinfo`
--

DROP TABLE IF EXISTS `bookinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bookinfo` (
  `bookInfoId` int(40) NOT NULL AUTO_INCREMENT,
  `bookTypeId` int(20) NOT NULL,
  `bookId` int(45) NOT NULL,
  `authorId` int(45) NOT NULL,
  `bookTypeName` varchar(256) NOT NULL,
  `bookName` varchar(256) NOT NULL,
  `authorName` varchar(256) NOT NULL,
  PRIMARY KEY (`bookInfoId`),
  UNIQUE KEY `bookInfoId_UNIQUE` (`bookInfoId`),
  KEY `bookTypeIdfore_idx` (`bookTypeId`),
  KEY `bookIdfore_idx` (`bookId`),
  KEY `authorIdfore_idx` (`authorId`),
  CONSTRAINT `authorIdfore` FOREIGN KEY (`authorId`) REFERENCES `author` (`authorid`),
  CONSTRAINT `bookIdfore` FOREIGN KEY (`bookId`) REFERENCES `book` (`bookId`),
  CONSTRAINT `bookTypeIdfore` FOREIGN KEY (`bookTypeId`) REFERENCES `booktype` (`booktypeid`)
) ENGINE=InnoDB AUTO_INCREMENT=1132 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookinfo`
--

LOCK TABLES `bookinfo` WRITE;
/*!40000 ALTER TABLE `bookinfo` DISABLE KEYS */;
INSERT INTO `bookinfo` VALUES (1000,2,2020,20200929,'仙侠小说','校园修仙','无言123'),(1001,2,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1002,2,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1003,2,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1004,2,2024,20200933,'仙侠小说','圣墟','辰东'),(1005,2,2025,20200934,'仙侠小说','太古神王','净无痕'),(1006,2,2026,20200935,'仙侠小说','择天记','猫腻'),(1007,2,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1008,2,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1009,2,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1010,2,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1011,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1012,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1013,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1014,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1015,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1016,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1017,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1018,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1019,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1020,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1021,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1022,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1023,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1024,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1025,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1026,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1027,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1028,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1029,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1030,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1031,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1032,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1033,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1034,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1035,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1036,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1037,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1038,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1039,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1040,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1041,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1042,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1043,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1044,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1045,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1046,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1047,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1048,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1049,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1050,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1051,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1052,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1053,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1054,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1055,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1056,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1057,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1058,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1059,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1060,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1061,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1062,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1063,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1064,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1065,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1066,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1067,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1068,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1069,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1070,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1071,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1072,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1073,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1074,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1075,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1076,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1077,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1078,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1079,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1080,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1081,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1082,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1083,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1084,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1085,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1086,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1087,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1088,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1089,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1090,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1091,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1092,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1093,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1094,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1095,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1096,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1097,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1098,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1099,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1100,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1101,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1102,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1103,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1104,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1105,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1106,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1107,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1108,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1109,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1110,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1111,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1112,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1113,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1114,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1115,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1116,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1117,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1118,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1119,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1120,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火'),(1121,1,2020,20200929,'仙侠小说','校园修仙','无言123'),(1122,1,2021,20200930,'仙侠小说','人道至尊','宅猪'),(1123,1,2022,20200931,'仙侠小说','大主宰','天蚕土豆'),(1124,1,2023,20200932,'仙侠小说','雪鹰领主','我吃西红柿'),(1125,1,2024,20200933,'仙侠小说','圣墟','辰东'),(1126,1,2025,20200934,'仙侠小说','太古神王','净无痕'),(1127,1,2026,20200935,'仙侠小说','择天记','猫腻'),(1128,1,2027,20200936,'仙侠小说','龙王传说','唐家三少'),(1129,1,2028,20200937,'仙侠小说','武炼巅峰','莫默'),(1130,1,2029,20200938,'仙侠小说','修罗武神','善良的蜜蜂'),(1131,1,2030,20200939,'仙侠小说','儒道至圣','永恒之火');
/*!40000 ALTER TABLE `bookinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booktype`
--

DROP TABLE IF EXISTS `booktype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `booktype` (
  `bookTypeId` int(20) NOT NULL,
  `bookTypeName` varchar(256) NOT NULL,
  PRIMARY KEY (`bookTypeId`),
  UNIQUE KEY `bookTypeId_UNIQUE` (`bookTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booktype`
--

LOCK TABLES `booktype` WRITE;
/*!40000 ALTER TABLE `booktype` DISABLE KEYS */;
INSERT INTO `booktype` VALUES (1,'玄幻小说'),(2,'仙侠小说'),(3,'都市小说'),(4,'历史小说'),(5,'游戏小说'),(6,'科幻小说'),(7,'言情小说'),(8,'同人小说'),(9,'灵异小说'),(10,'奇幻小说'),(11,'竞技小说'),(12,'武侠小说'),(13,'军事小说'),(14,'校园小说'),(15,'官场小说');
/*!40000 ALTER TABLE `booktype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `userId` int(50) NOT NULL AUTO_INCREMENT,
  `nickName` varchar(15) NOT NULL,
  `passWord` varchar(45) NOT NULL,
  `userEmail` varchar(50) NOT NULL,
  `userPhone` varchar(15) NOT NULL,
  `headImg` varchar(256) DEFAULT NULL,
  `sex` varchar(10) DEFAULT '0',
  `signature` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `id_UNIQUE` (`userId`),
  UNIQUE KEY `userName_UNIQUE` (`userEmail`),
  UNIQUE KEY `nickName_UNIQUE` (`nickName`),
  UNIQUE KEY `userPhone_UNIQUE` (`userPhone`),
  UNIQUE KEY `headImg_UNIQUE` (`headImg`)
) ENGINE=InnoDB AUTO_INCREMENT=1015 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1000,'阿木木','1234','zky3332342053@outlook.com','12333333333','/uploads/1000.JPG','1','213123qwe111'),(1001,'木木不哭站起来撸','1234','1000@12','12332121233','/uploads/1001.jpg','2','蕾姆'),(1002,'1002','1234','123123@123','12312333312','/uploads/1002.jpg','1','111111312'),(1003,'1003','1234','123432@123','12312343423',NULL,'1','1234234'),(1004,'木木不哭起来撸','1234','1000@1233','12333312312','/uploads/1004.WEBP','2','肥肥'),(1005,'1111','1234','124@234','12312312322','/uploads/1005.JPG','1','最爱萌白酱'),(1007,'312123','1234','1000@123','32112333213','/uploads/1007.JPG','1','啊啊啊啊啊啊啊'),(1008,'1008','1234','123122@321','41344545646',NULL,'2','323443'),(1009,'1224','1234','qwwe@12','11111211111','/uploads/1009.JPG','1','黑丝黑丝黑丝！！'),(1011,'白娘子','1234','124@2234','12312123111','/uploads/1011.JPG','2',''),(1012,'水柔','1234','13324@2234','32131233121','/uploads/1012.JPG','2',''),(1013,'dww','1234','13324@qq','12345436756','/uploads/1013.JPG','0',NULL),(1014,'dww1','1234','13324@qq1','12345431756',NULL,'0',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-30 13:27:18
