drop database if exists prisma;
create database prisma
/*!40100 default character set utf8 */;
use prisma;
DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `fullName` longtext CHARACTER SET utf8,
  `firstName` longtext CHARACTER SET utf8,
  `lastName` longtext CHARACTER SET utf8,
  `gender` longtext CHARACTER SET utf8,
  `birthday` date DEFAULT NULL,
  -- there are currently 4 roles:
  -- 0: user
  -- 1: student
  -- 2: staff
  -- 3: school-admin
  -- 4: admin
  `role` tinyint DEFAULT '0',
  `email` longtext CHARACTER SET utf8,
  `password` longtext CHARACTER SET utf8,
  `ipAddress` longtext CHARACTER SET utf8,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastLogDate` datetime ON UPDATE CURRENT_TIMESTAMP,
  `emailActivated` tinyint(1) DEFAULT '0',
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `avatarSetNum` int(8) DEFAULT NULL
);
DROP TABLE IF EXISTS `user_information`;
CREATE TABLE `user_information` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `userId` INTEGER NOT NULL UNIQUE,
  `marriage` longtext CHARACTER SET utf8,
  `maritalStatusDate` date DEFAULT NULL,
  `spouseName` longtext CHARACTER SET utf8,
  `children` tinyint(4) DEFAULT NULL,
  `website` longtext CHARACTER SET utf8,
  `youtube` longtext CHARACTER SET utf8,
  `facebook` longtext CHARACTER SET utf8,
  `talents` longtext CHARACTER SET utf8,
  `firstLanguage` longtext CHARACTER SET utf8,
  `nativeLanguage` longtext CHARACTER SET utf8,
  `secondLanguage` longtext CHARACTER SET utf8,
  `secondLanguagePro` int(11) DEFAULT NULL,
  `thirdLanguage` longtext CHARACTER SET utf8,
  `thirdLanguagePro` int(11) DEFAULT NULL,
  `otherLanguage` longtext CHARACTER SET utf8,
  `otherLanguagePro` int(11) DEFAULT NULL,
  `life` longtext CHARACTER SET utf8,
  `health` text COLLATE latin1_german2_ci DEFAULT NULL,
  `glutenAllergy` tinyint(1) NOT NULL DEFAULT '0',
  `lactoseAllergy` tinyint(1) NOT NULL DEFAULT '0',
  `physicalDisability` tinyint(1) NOT NULL DEFAULT '0',
  `onMedication` tinyint(1) NOT NULL DEFAULT '0',
  `moldAllergy` tinyint(1) NOT NULL DEFAULT '0',
  `otherFoodAllergy` longtext CHARACTER SET utf8,
  `meds` longtext CHARACTER SET utf8,
  `shots` text COLLATE latin1_german2_ci DEFAULT NULL,
  `height` int(3) DEFAULT NULL,
  `eyeColor` longtext CHARACTER SET utf8,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `emRelation` longtext CHARACTER SET utf8,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS `school`;
CREATE TABLE `school` (
  `id` int AUTO_INCREMENT NOT NULL,
  `online` tinyint(1) DEFAULT '1',
  `name` longtext CHARACTER SET utf8,
  `acronym` longtext CHARACTER SET utf8,
  `hashtag` longtext CHARACTER SET utf8,
  `accountingName` longtext CHARACTER SET utf8,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `outreachStartDate` date DEFAULT NULL,
  `outreachEndDate` date DEFAULT NULL,
  `miniOutreachStartDate` date DEFAULT NULL,
  `miniOutreachEndDate` date DEFAULT NULL,
  `description` longtext CHARACTER SET utf8,
  `travelNotice` text COLLATE latin1_german2_ci DEFAULT NULL,
  `schoolEmail` longtext CHARACTER SET utf8,
  `url` longtext CHARACTER SET utf8,
  `secondary` tinyint(1) DEFAULT NULL,
  `currency` longtext CHARACTER SET utf8,
  `applicationFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `schoolFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `miniOutreachFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `outreachFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `foodDayStudent` decimal(5, 2) NOT NULL DEFAULT '0',
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `applicationQuestionsId` INT DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
DROP TABLE IF EXISTS `nation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nation` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `iso2` varchar(2) COLLATE latin1_german2_ci NOT NULL,
  `iso3` varchar(3) COLLATE latin1_german2_ci NOT NULL,
  `nameEn` varchar(64) COLLATE latin1_german2_ci NOT NULL,
  `nameDeu` longtext CHARACTER SET utf8,
  `deuVisa` tinyint(1) NOT NULL,
  `deuVisaBefore` tinyint(1) NOT NULL,
  `extraQ` int(2) NOT NULL
);
DROP TABLE IF EXISTS `passport`;
CREATE TABLE `passport` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER,
  `firstName` longtext CHARACTER SET utf8,
  `middleName` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `lastName` longtext CHARACTER SET utf8,
  `nationId` int DEFAULT NULL,
  `number` longtext CHARACTER SET utf8,
  `issue` date DEFAULT NULL,
  `expire` date DEFAULT NULL,
  `authority` longtext CHARACTER SET utf8,
  `birthCity` longtext CHARACTER SET utf8,
  `birthNationId` int(11) DEFAULT NULL,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`birthNationId`) REFERENCES `nation`(`id`),
  FOREIGN KEY (`nationId`) REFERENCES `nation`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL
);
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER,
  `street` longtext CHARACTER SET utf8,
  `city` longtext CHARACTER SET utf8,
  `state` longtext CHARACTER SET utf8,
  `zip` longtext CHARACTER SET utf8,
  `country` longtext CHARACTER SET utf8,
  `nationId` int DEFAULT NULL,
  `phone` longtext CHARACTER SET utf8,
  `phone2` longtext CHARACTER SET utf8,
  FOREIGN KEY (`nationId`) REFERENCES `nation`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL,
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS `application`;
CREATE TABLE `application` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `schoolId` INTEGER DEFAULT NULL,
  `transferredFromSchool` int(11) DEFAULT NULL,
  `userId` INTEGER NOT NULL,
  `status` longtext CHARACTER SET utf8,
  `isStaffApplication` TINYINT(1) DEFAULT 0,
  `progress` longtext CHARACTER SET utf8,
  `accepted` TINYINT(1) DEFAULT 0,
  `packetSent` TINYINT(1) DEFAULT 0,
  `postcardSent` TINYINT(1) DEFAULT 0,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `submitDate` datetime DEFAULT NULL,
  `inReviewDate` datetime DEFAULT NULL,
  `canceledDate` datetime DEFAULT NULL,
  `acceptedDate` datetime DEFAULT NULL,
  `arrivedDate` datetime DEFAULT NULL,
  `retiredDate` datetime DEFAULT NULL,
  `adminNotes` longtext CHARACTER SET utf8
);
DROP TABLE IF EXISTS `application_admin_note`;
CREATE TABLE `application_admin_note` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `note` longtext CHARACTER SET utf8,
  `applicationId` INTEGER NOT NULL,
  `author` INTEGER DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS `application_history`;
CREATE TABLE `application_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `applicationId` int(11) NOT NULL,
  `action` longtext CHARACTER SET utf8,
  `field` longtext CHARACTER SET utf8,
  `value` longtext CHARACTER SET utf8,
  `statusNum` longtext CHARACTER SET utf8,
  `error` longtext CHARACTER SET utf8,
  FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER DEFAULT NULL,
  `name` longtext CHARACTER SET utf8,
  `schoolId` INTEGER NOT NULL,
  `arrived` BOOLEAN,
  `canceled` BOOLEAN,
  `graduated` BOOLEAN,
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL
);
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER DEFAULT NULL,
  `name` longtext CHARACTER SET utf8,
  `currentSchoolId` INTEGER DEFAULT NULL,
  `admin` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`currentSchoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL
);
DROP TABLE IF EXISTS `application_question_collection`;
CREATE TABLE `application_question_collection` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `description` longtext CHARACTER SET utf8,
  `type` varchar(50) COLLATE latin1_german2_ci
);
DROP TABLE IF EXISTS `application_question`;
CREATE TABLE `application_question` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` longtext CHARACTER SET utf8,
  `questionCollectionId` INTEGER NOT NULL,
  FOREIGN KEY (`questionCollectionId`) REFERENCES `application_question_collection`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS `application_answer`;
CREATE TABLE `application_answer` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `applicationId` INTEGER DEFAULT NULL,
  `answer` longtext CHARACTER SET utf8,
  `question` longtext CHARACTER SET utf8,
  `questionId` INTEGER DEFAULT NULL,
  FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`questionId`) REFERENCES `application_question`(`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
DROP TABLE IF EXISTS `reference`;
CREATE TABLE `reference` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `applicationId` int(11) NOT NULL,
  `refNum` int(11) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `ipAddress` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `status` tinyint(2) NOT NULL,
  `emailBy` int(11) NOT NULL,
  `emailDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `formIn` tinyint(1) NOT NULL,
  `received` tinyint(2) NOT NULL,
  `receivedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(150) COLLATE latin1_german2_ci NOT NULL,
  `name` varchar(100) COLLATE latin1_german2_ci NOT NULL,
  `lang` varchar(64) COLLATE latin1_german2_ci NOT NULL,
  `hash` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `phone` varchar(100) COLLATE latin1_german2_ci NOT NULL,
  `relation` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `userGivenRelation` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `howWell` text CHARACTER SET utf8 NOT NULL,
  `christian` text CHARACTER SET utf8 NOT NULL,
  `communication` int(5) NOT NULL,
  `teachability` int(5) NOT NULL,
  `teamwork` int(5) NOT NULL,
  `ambition` int(5) NOT NULL,
  `organization` int(5) NOT NULL,
  `leadership` int(5) NOT NULL,
  `reliable` int(5) NOT NULL,
  `servanthood` int(5) NOT NULL,
  `emotion` int(5) NOT NULL,
  `selfDis` int(5) NOT NULL,
  `punctual` int(5) NOT NULL,
  `initiative` int(5) NOT NULL,
  `family` text CHARACTER SET utf8 NOT NULL,
  `moral` tinyint(2) NOT NULL,
  `strengths` text CHARACTER SET utf8 NOT NULL,
  `weakness` text CHARACTER SET utf8 NOT NULL,
  `conflict` text CHARACTER SET utf8 NOT NULL,
  `churchLife` text CHARACTER SET utf8 NOT NULL,
  `whySchool` text CHARACTER SET utf8 NOT NULL,
  `getHelp` tinyint(1) NOT NULL,
  `toEscape` tinyint(1) NOT NULL,
  `toGrow` tinyint(1) NOT NULL,
  `getEquipped` tinyint(1) NOT NULL,
  `forAdventure` tinyint(1) NOT NULL,
  `other` text CHARACTER SET utf8 NOT NULL,
  `support` text COLLATE latin1_german2_ci NOT NULL
);
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `schoolId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `teaching` longtext CHARACTER SET utf8,
  `file` longtext CHARACTER SET utf8,
  `name` longtext CHARACTER SET utf8,
  `ext` longtext CHARACTER SET utf8,
  `size` longtext CHARACTER SET utf8,
  `type` longtext CHARACTER SET utf8,
  `width` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `height` longtext CHARACTER SET utf8,
  `downloadCount` longtext CHARACTER SET utf8,
  `created` longtext CHARACTER SET utf8,
  `modified` longtext CHARACTER SET utf8,
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL,
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL
);
DROP TABLE IF EXISTS `child`;
CREATE TABLE `child` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent` int(11) NOT NULL,
  `name` longtext CHARACTER SET utf8,
  `birthday` longtext CHARACTER SET utf8,
  `gender` longtext CHARACTER SET utf8,
  FOREIGN KEY (`parent`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS `email`;
CREATE TABLE `email` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `to` text COLLATE latin1_german2_ci,
  `schoolId` int(11) DEFAULT NULL,
  `applicationId` int(11) DEFAULT NULL,
  `group` int(11) DEFAULT NULL,
  `allStaff` tinyint(1) NOT NULL,
  `type` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `subject` varchar(255) COLLATE latin1_german2_ci DEFAULT NULL,
  `contents` longtext CHARACTER SET utf8,
  `sendAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `sentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL,
    FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE
  SET
    NULL
);
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` longtext CHARACTER SET utf8,
  `description` text COLLATE latin1_german2_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE `school`
add
  FOREIGN KEY (`applicationQuestionsId`) REFERENCES `application_question_collection`(`id`) ON UPDATE CASCADE ON DELETE
SET
  NULL;
ALTER TABLE `reference`
add
  FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application`
add
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application`
add
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application_admin_note`
add
  FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application_admin_note`
add
  FOREIGN KEY (`author`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
SET
  NULL;