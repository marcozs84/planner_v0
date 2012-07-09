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

DROP DATABASE IF EXISTS `weekplanner`;

CREATE DATABASE `weekplanner`
    CHARACTER SET 'utf8'
    COLLATE 'utf8_general_ci';

USE `weekplanner`;

#
# Structure for the `tblsplit` table : 
#

DROP TABLE IF EXISTS `tblsplit`;

CREATE TABLE `tblsplit` (
  `id` int(11) NOT NULL auto_increment,
  `parentId` int(11) default NULL,
  `timelineId` int(11) default '0',
  `assigned` int(11) default '0',
  `closed` int(11) default '0',
  `startDate` datetime default NULL,
  `originalDate` datetime default NULL,
  `delayBeginning` int(11) default '0',
  `delay` int(11) default '0',
  `duration` int(11) default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

#
# Data for the `tblsplit` table  (LIMIT 0,500)
#

INSERT INTO `tblsplit` (`id`, `parentId`, `timelineId`, `assigned`, `closed`, `startDate`, `originalDate`, `delayBeginning`, `delay`, `duration`) VALUES 
  (1,4,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,32),
  (2,5,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,23),
  (3,6,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,33),
  (4,7,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,322),
  (5,8,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,54),
  (6,9,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,88);
COMMIT;

#
# Structure for the `tbltask` table : 
#

DROP TABLE IF EXISTS `tbltask`;

CREATE TABLE `tbltask` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(250) default NULL,
  `description` text,
  `duration` int(11) default '0',
  `assigned` int(11) default '0',
  `closed` int(11) default '0',
  `color` varchar(20) default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

#
# Data for the `tbltask` table  (LIMIT 0,500)
#

INSERT INTO `tbltask` (`id`, `name`, `description`, `duration`, `assigned`, `closed`, `color`) VALUES 
  (1,'asdf sdf','ASDFASDF',23,0,0,'81C600'),
  (2,'asdfsdf','asdfasdf',32,0,0,'81C600'),
  (3,'asdfsdf','asdfasdf',32,0,0,'81C600'),
  (4,'asdfsdf','asdfasdf',32,0,0,'81C600'),
  (5,'adfasf','',23,0,0,'FFCC00'),
  (6,'2323','',33,0,0,'FFCC00'),
  (7,'numero 7','',77,0,0,'0008A7'),
  (8,'asdfsadf','asdfa dfd',54,0,0,'00AE02'),
  (9,'numero 9','',99,0,0,'0008A7');
COMMIT;

#
# Structure for the `tbltimeline` table : 
#

DROP TABLE IF EXISTS `tbltimeline`;

CREATE TABLE `tbltimeline` (
  `id` int(11) NOT NULL auto_increment,
  `name` text,
  `teamId` int(11) default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

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