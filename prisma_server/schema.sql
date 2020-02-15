CREATE TABLE `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` longtext CHARACTER SET utf8,
  `app_for_text` varchar(255) COLLATE latin1_german2_ci DEFAULT NULL,
  `position` longtext CHARACTER SET utf8,
  `school_id` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `transferred_from_school_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `location_id` int(8) NOT NULL,
  `accounting_id` int(11) NOT NULL,
  `track_id` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `status` longtext CHARACTER SET utf8,
  `progress` longtext CHARACTER SET utf8,
  `accepted` longtext CHARACTER SET utf8,
  `packet_sent` longtext CHARACTER SET utf8,
  `postcard_sent` longtext CHARACTER SET utf8,
  `app_fee` longtext CHARACTER SET utf8,
  `school_fee` longtext CHARACTER SET utf8,
  `mini_outreach_fee` longtext CHARACTER SET utf8,
  `insurance_fee` longtext CHARACTER SET utf8,
  `visa_fee` longtext CHARACTER SET utf8,
  `created` longtext COLLATE latin1_german2_ci,
  `submit_date` datetime DEFAULT NULL,
  `in_review_date` datetime NOT NULL,
  `canceled_date` datetime NOT NULL,
  `accepted_date` datetime DEFAULT NULL,
  `arrived_date` datetime NOT NULL,
  `retired_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `application_admin_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` longtext CHARACTER SET utf8,
  `application_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `application_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `application_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `action` longtext CHARACTER SET utf8,
  `field` longtext CHARACTER SET utf8,
  `value` longtext CHARACTER SET utf8,
  `status_num` longtext CHARACTER SET utf8,
  `error` longtext CHARACTER SET utf8,
  PRIMARY KEY (`id`)
);

CREATE TABLE `references` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `application_id` int(11) NOT NULL,
  `ref_num` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `ip_address` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `status` tinyint(2) NOT NULL,
  `email_by` int(11) NOT NULL,
  `email_date` datetime NOT NULL,
  `form_in` tinyint(1) NOT NULL,
  `received` tinyint(2) NOT NULL,
  `received_date` datetime NOT NULL,
  `email` varchar(150) COLLATE latin1_german2_ci NOT NULL,
  `name` varchar(100) COLLATE latin1_german2_ci NOT NULL,
  `lang` varchar(64) COLLATE latin1_german2_ci NOT NULL,
  `hash` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `phone` varchar(100) COLLATE latin1_german2_ci NOT NULL,
  `relation` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `user_given_relation` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `how_well` text CHARACTER SET utf8 NOT NULL,
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
  `self_dis` int(5) NOT NULL,
  `punctual` int(5) NOT NULL,
  `initiative` int(5) NOT NULL,
  `family` text CHARACTER SET utf8 NOT NULL,
  `moral` tinyint(2) NOT NULL,
  `strengths` text CHARACTER SET utf8 NOT NULL,
  `weakness` text CHARACTER SET utf8 NOT NULL,
  `conflict` text CHARACTER SET utf8 NOT NULL,
  `church_life` text CHARACTER SET utf8 NOT NULL,
  `why_school` text CHARACTER SET utf8 NOT NULL,
  `get_help` tinyint(1) NOT NULL,
  `to_escape` tinyint(1) NOT NULL,
  `to_grow` tinyint(1) NOT NULL,
  `get_equipped` tinyint(1) NOT NULL,
  `for_adventure` tinyint(1) NOT NULL,
  `other` text CHARACTER SET utf8 NOT NULL,
  `support` text COLLATE latin1_german2_ci NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `school_event_id` int(8) NOT NULL,
  `teaching` longtext CHARACTER SET utf8,
  `file` longtext CHARACTER SET utf8,
  `name` longtext CHARACTER SET utf8,
  `ext` longtext CHARACTER SET utf8,
  `size` longtext CHARACTER SET utf8,
  `type` longtext CHARACTER SET utf8,
  `width` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `height` longtext CHARACTER SET utf8,
  `download_count` longtext CHARACTER SET utf8,
  `created` longtext CHARACTER SET utf8,
  `modified` longtext CHARACTER SET utf8,
  PRIMARY KEY (`id`)
);

CREATE TABLE `children` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` longtext CHARACTER SET utf8,
  `birthday` longtext CHARACTER SET utf8,
  `gender` longtext CHARACTER SET utf8,
  PRIMARY KEY (`id`)
);

CREATE TABLE `emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to` text COLLATE latin1_german2_ci,
  `school_id` int(11) DEFAULT NULL,
  `application_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `all_staff` tinyint(1) NOT NULL,
  `type` varchar(255) COLLATE latin1_german2_ci NOT NULL,
  `subject` varchar(255) COLLATE latin1_german2_ci DEFAULT NULL,
  `contents` mediumblob,
  `send_at` datetime DEFAULT NULL,
  `sent_date` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` longtext CHARACTER SET utf8,
  `description` text COLLATE latin1_german2_ci NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
);