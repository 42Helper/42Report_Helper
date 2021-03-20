CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `intra_id` varchar(255) DEFAULT NULL,
  `on_off` int(10) DEFAULT 1,
	`week1` int(10) DEFAULT 0,
	`week2` int(10) DEFAULT 0,
	`week3` int(10) DEFAULT 0,
	`week4` int(10) DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE `report` (
  `report_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `created_date` timestamp,
  `created_week` int(10) DEFAULT NULL,
  PRIMARY KEY (`report_id`)
);

CREATE TABLE `period` (
	`key`	int	NOT NULL AUTO_INCREMENT,
	`month`	int	NULL,
	`week`	int	NULL,
	`start_of_week`	timestamp	NULL,
	`end_of_week`	timestamp	NULL,
  PRIMARY KEY (`key`)
);

--3월 산정기간 데이터 추가
INSERT INTO period(month, week, start_of_week, end_of_week)
VALUES
(3, 1, '2021-03-01', '2021-03-07'),
(3, 2, '2021-03-08', '2021-03-14'),
(3, 3, '2021-03-15', '2021-03-21'),
(3, 4, '2021-03-22', '2021-03-28');