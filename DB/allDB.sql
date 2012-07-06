# SQL Manager 2010 for MySQL 4.5.0.9
# ---------------------------------------
# Host     : localhost
# Port     : 3306
# Database : weekplanner


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

SET FOREIGN_KEY_CHECKS=0;

CREATE DATABASE `weekplanner`
    CHARACTER SET 'utf8'
    COLLATE 'utf8_general_ci';

USE `weekplanner`;

#
# Structure for the `tbltask` table : 
#

DROP TABLE IF EXISTS `tbltask`;

CREATE TABLE `tbltask` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(250) COLLATE utf8_general_ci DEFAULT NULL,
  `duration` INTEGER(11) DEFAULT '0',
  `assigned` INTEGER(11) DEFAULT '0',
  `closed` INTEGER(11) DEFAULT '0',
  `color` VARCHAR(20) COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)

)ENGINE=InnoDB COMMENT='InnoDB free: 10240 kB' CHECKSUM=0 DELAY_KEY_WRITE=0 PACK_KEYS=0 MIN_ROWS=0 MAX_ROWS=0 ROW_FORMAT=COMPACT CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';

#
# Structure for the `tbltimeline` table : 
#

DROP TABLE IF EXISTS `tbltimeline`;

CREATE TABLE `tbltimeline` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `name` TEXT COLLATE utf8_general_ci,
  `teamId` INTEGER(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)

)ENGINE=InnoDB COMMENT='InnoDB free: 10240 kB' CHECKSUM=0 DELAY_KEY_WRITE=0 PACK_KEYS=0 MIN_ROWS=0 MAX_ROWS=0 ROW_FORMAT=COMPACT CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';

#
# Data for the `tbltimeline` table  (LIMIT 0,500)
#

INSERT INTO `tbltimeline` (`id`, `name`, `teamId`) VALUES 
  (42,'500''ss',1),
  (46,'test 3',2),
  (47,'tes 4',2);
COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;