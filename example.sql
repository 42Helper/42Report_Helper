CREATE TABLE `User` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `intra_id` varchar(255) DEFAULT NULL,
	`week1` int(10) DEFAULT NULL,
	`week2` int(10) DEFAULT NULL,
	`week3` int(10) DEFAULT NULL,
	`week4` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Report` (
  `report_id` int(10) NOT NULL AUTO_INCREMENT,
  `intra_id` varchar(255) DEFAULT NULL,
  `created_date` timestamp,
  `created_week` int(10) DEFAULT NULL,
  PRIMARY KEY (`report_id`)
);