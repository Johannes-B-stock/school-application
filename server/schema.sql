drop database if exists prisma;
create database prisma;
-- /*!40100 default character set utf8 */;
use prisma;
DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!40101 SET character_set_client = utf8 */
;
CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `fullName` VARCHAR(255),
  `firstName` VARCHAR(255),
  `lastName` VARCHAR(255),
  `gender` VARCHAR(10),
  `birthday` date DEFAULT NULL,
  -- there are currently 4 roles:
  -- 0: user
  -- 1: student
  -- 2: staff
  -- 3: school-admin
  -- 4: admin
  `role` tinyint DEFAULT '0',
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `ipAddress` VARCHAR(20),
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastLogDate` datetime ON UPDATE CURRENT_TIMESTAMP,
  `emailActivated` tinyint(1) DEFAULT '0',
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `avatarSetNum` int(8) DEFAULT NULL,
  `avatarFileName` varchar(255) DEFAULT NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `user_information`;
CREATE TABLE `user_information` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `userId` INTEGER NOT NULL UNIQUE,
  `marriage` VARCHAR(255),
  `maritalStatusDate` date DEFAULT NULL,
  `spouseName` VARCHAR(255),
  `children` tinyint(4) DEFAULT NULL,
  `website` VARCHAR(255),
  `youtube` VARCHAR(255),
  `facebook` VARCHAR(255),
  `talents` VARCHAR(255),
  `firstLanguage` VARCHAR(255),
  `nativeLanguage` VARCHAR(255),
  `secondLanguage` VARCHAR(255),
  `secondLanguagePro` int(11) DEFAULT NULL,
  `thirdLanguage` VARCHAR(255),
  `thirdLanguagePro` int(11) DEFAULT NULL,
  `otherLanguage` VARCHAR(255),
  `otherLanguagePro` int(11) DEFAULT NULL,
  `life` VARCHAR(255),
  `health` text COLLATE latin1_german2_ci DEFAULT NULL,
  `glutenAllergy` tinyint(1) NOT NULL DEFAULT '0',
  `lactoseAllergy` tinyint(1) NOT NULL DEFAULT '0',
  `physicalDisability` tinyint(1) NOT NULL DEFAULT '0',
  `onMedication` tinyint(1) NOT NULL DEFAULT '0',
  `moldAllergy` tinyint(1) NOT NULL DEFAULT '0',
  `otherFoodAllergy` VARCHAR(255),
  `meds` VARCHAR(255),
  `shots` text COLLATE latin1_german2_ci DEFAULT NULL,
  `height` int(3) DEFAULT NULL,
  `eyeColor` VARCHAR(255),
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `emRelation` VARCHAR(255),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `school`;
CREATE TABLE `school` (
  `id` int AUTO_INCREMENT NOT NULL,
  `online` tinyint(1) DEFAULT '1',
  `name` VARCHAR(255),
  `acronym` VARCHAR(30),
  `hashtag` VARCHAR(255),
  `accountingName` VARCHAR(255),
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `outreachStartDate` date DEFAULT NULL,
  `outreachEndDate` date DEFAULT NULL,
  `miniOutreachStartDate` date DEFAULT NULL,
  `miniOutreachEndDate` date DEFAULT NULL,
  `description` longtext CHARACTER SET utf8,
  `travelNotice` text COLLATE latin1_german2_ci DEFAULT NULL,
  `schoolEmail` VARCHAR(255),
  `url` VARCHAR(255),
  `secondary` tinyint(1) DEFAULT NULL,
  `currency` VARCHAR(255),
  `applicationFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `schoolFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `miniOutreachFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `outreachFee` decimal(19, 2) NOT NULL DEFAULT '0',
  `foodDayStudent` decimal(5, 2) NOT NULL DEFAULT '0',
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `applicationQuestionsId` INT DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `nation`;
CREATE TABLE `nation` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `iso2` varchar(2) NOT NULL,
  `iso3` varchar(3) NOT NULL,
  `nameEn` varchar(64) NOT NULL,
  `nameDeu` VARCHAR(255),
  `deuVisa` tinyint(1) NOT NULL,
  `deuVisaBefore` tinyint(1) NOT NULL,
  `extraQ` int(2) NOT NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `passport`;
CREATE TABLE `passport` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER,
  `firstName` VARCHAR(255),
  `middleName` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `lastName` VARCHAR(255),
  `nationId` int DEFAULT NULL,
  `number` VARCHAR(255),
  `issue` date DEFAULT NULL,
  `expire` date DEFAULT NULL,
  `authority` VARCHAR(255),
  `birthCity` VARCHAR(255),
  `birthNationId` int(11) DEFAULT NULL,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`birthNationId`) REFERENCES `nation`(`id`),
  FOREIGN KEY (`nationId`) REFERENCES `nation`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER,
  `street` VARCHAR(255),
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `zip` VARCHAR(255),
  `country` VARCHAR(255),
  `nationId` int DEFAULT NULL,
  `phone` VARCHAR(255),
  `phone2` VARCHAR(255),
  FOREIGN KEY (`nationId`) REFERENCES `nation`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL,
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `application`;
CREATE TABLE `application` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `schoolId` INTEGER DEFAULT NULL,
  `transferredFromSchool` int(11) DEFAULT NULL,
  `userId` INTEGER NOT NULL,
  `status` VARCHAR(255),
  `isStaffApplication` TINYINT(1) DEFAULT 0,
  `progress` VARCHAR(255),
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
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
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
  `action` VARCHAR(255),
  `field` VARCHAR(255),
  `value` VARCHAR(255),
  `statusNum` VARCHAR(255),
  `error` VARCHAR(255),
  FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER DEFAULT NULL,
  `name` VARCHAR(255),
  `schoolId` INTEGER NOT NULL,
  `arrived` BOOLEAN,
  `canceled` BOOLEAN,
  `graduated` BOOLEAN,
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER DEFAULT NULL,
  `name` VARCHAR(255),
  `currentSchoolId` INTEGER DEFAULT NULL,
  `admin` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`currentSchoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
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
  `question` VARCHAR(1000),
  `questionCollectionId` INTEGER NOT NULL,
  FOREIGN KEY (`questionCollectionId`) REFERENCES `application_question_collection`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS `application_answer`;
CREATE TABLE `application_answer` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `applicationId` INTEGER DEFAULT NULL,
  `answer` longtext CHARACTER SET utf8,
  `question` VARCHAR(1000),
  `questionId` INTEGER DEFAULT NULL,
  FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (`questionId`) REFERENCES `application_question`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `reference`;
CREATE TABLE `reference` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `applicationId` int(11) NOT NULL,
  `refNum` int(11) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  `ipAddress` varchar(255) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `emailBy` int(11) NOT NULL,
  `emailDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `formIn` tinyint(1) NOT NULL,
  `received` tinyint(2) NOT NULL,
  `receivedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(150) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lang` varchar(64) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `relation` varchar(255) NOT NULL,
  `userGivenRelation` varchar(255) NOT NULL,
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
  `support` text NOT NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `schoolId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `teaching` VARCHAR(255),
  `file` VARCHAR(255),
  `name` VARCHAR(255),
  `ext` VARCHAR(255),
  `size` VARCHAR(255),
  `type` VARCHAR(255),
  `width` varchar(255) NOT NULL,
  `height` VARCHAR(255),
  `downloadCount` VARCHAR(255),
  `created` VARCHAR(255),
  `modified` VARCHAR(255),
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL,
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `child`;
CREATE TABLE `child` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent` int(11) NOT NULL,
  `name` VARCHAR(255),
  `birthday` VARCHAR(255),
  `gender` VARCHAR(255),
  FOREIGN KEY (`parent`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `email`;
CREATE TABLE `email` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `to` text,
  `schoolId` int(11) DEFAULT NULL,
  `applicationId` int(11) DEFAULT NULL,
  `group` int(11) DEFAULT NULL,
  `allStaff` tinyint(1) NOT NULL,
  `type` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `contents` longtext CHARACTER SET utf8,
  `sendAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `sentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL,
    FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE
  SET NULL
) CHARACTER SET latin1 COLLATE latin1_german2_ci;
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` longtext CHARACTER SET utf8,
  `description` text COLLATE latin1_german2_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE `school`
add FOREIGN KEY (`applicationQuestionsId`) REFERENCES `application_question_collection`(`id`) ON UPDATE CASCADE ON DELETE
SET NULL;
ALTER TABLE `reference`
add FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application`
add FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application`
add FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application_admin_note`
add FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `application_admin_note`
add FOREIGN KEY (`author`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE
SET NULL;