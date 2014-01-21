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

DROP DATABASE IF EXISTS weekplanner;

CREATE DATABASE weekplanner
    CHARACTER SET 'utf8'
    COLLATE 'utf8_general_ci';

USE weekplanner;

#
# Structure for the `tblday` table : 
#

DROP TABLE IF EXISTS tblday;

CREATE TABLE tblday (
  dayId int(11) NOT NULL AUTO_INCREMENT,
  timelineId int(11) DEFAULT NULL,
  date datetime DEFAULT NULL,
  week int(11) DEFAULT NULL,
  day int(11) DEFAULT NULL,
  totalHours int(11) DEFAULT NULL,
  used int(11) DEFAULT NULL,
  PRIMARY KEY (dayId),
  UNIQUE KEY dayId (dayId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for the `tblproject` table : 
#

DROP TABLE IF EXISTS tblproject;

CREATE TABLE tblproject (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(250) DEFAULT NULL,
  description text,
  startDate date DEFAULT '0000-00-00',
  endDate date DEFAULT '0000-00-00',
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Structure for the `tblresource` table : 
#

DROP TABLE IF EXISTS tblresource;

CREATE TABLE tblresource (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(250) NOT NULL,
  initials varchar(20) DEFAULT NULL,
  status int(11) DEFAULT '1',
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

#
# Structure for the `tblsplit` table : 
#

DROP TABLE IF EXISTS tblsplit;

CREATE TABLE tblsplit (
  id int(11) NOT NULL AUTO_INCREMENT,
  parentId int(11) DEFAULT '0',
  timelineId int(11) DEFAULT '0',
  dayId int(11) DEFAULT '0',
  assigned int(11) DEFAULT '0',
  closed int(11) DEFAULT '0',
  startDate datetime DEFAULT NULL,
  originalDate datetime DEFAULT NULL,
  delayBeginning int(11) DEFAULT '0',
  delay int(11) DEFAULT '0',
  duration int(11) DEFAULT '0',
  sorting int(11) DEFAULT '0',
  status int(11) DEFAULT '0',
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

#
# Structure for the `tbltask` table : 
#

DROP TABLE IF EXISTS tbltask;

CREATE TABLE tbltask (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(250) DEFAULT NULL,
  description text,
  duration int(11) DEFAULT '0',
  assigned int(11) DEFAULT '0',
  closed int(11) DEFAULT '0',
  color varchar(20) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

#
# Structure for the `tblteam` table : 
#

DROP TABLE IF EXISTS tblteam;

CREATE TABLE tblteam (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(250) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for the `tbltimeline` table : 
#

DROP TABLE IF EXISTS tbltimeline;

CREATE TABLE tbltimeline (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text,
  teamId int(11) DEFAULT '0',
  projectId int(11) DEFAULT '0',
  resourceId int(11) DEFAULT '0',
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;