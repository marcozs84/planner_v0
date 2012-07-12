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
  `parentId` int(11) default '0',
  `timelineId` int(11) default '0',
  `assigned` int(11) default '0',
  `closed` int(11) default '0',
  `startDate` datetime default NULL,
  `originalDate` datetime default NULL,
  `delayBeginning` int(11) default '0',
  `delay` int(11) default '0',
  `duration` int(11) default '0',
  `order` int(11) default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;