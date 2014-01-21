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

USE weekplanner;

#
# Data for the `tblproject` table  (LIMIT 0,500)
#

INSERT INTO `tblproject` (id, name, description, startDate, endDate) VALUES 
  (1,'Work Plan 2014','Test Work Plan for 2014','2014-01-06','2014-12-26');
COMMIT;

#
# Data for the `tblresource` table  (LIMIT 0,500)
#

INSERT INTO `tblresource` (id, name, initials, status) VALUES 
  (1,'Marco','MZ',1),
  (2,'Vivian','VT',1),
  (3,'Victor','VV',1),
  (4,'Limberg','LB',1),
  (5,'David','DS',1),
  (6,'Luis','LV',1);
COMMIT;

#
# Data for the `tblsplit` table  (LIMIT 0,500)
#

INSERT INTO `tblsplit` (id, parentId, timelineId, dayId, assigned, closed, startDate, originalDate, delayBeginning, delay, duration, sorting, status) VALUES 
  (1,1,6,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,5,1,0),
  (2,1,3,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,4,1,0),
  (3,1,2,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,4,1,0),
  (4,1,5,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,7,1,0),
  (5,2,2,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,2,2,0),
  (6,3,6,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,12,2,0),
  (7,3,4,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,28,1,0),
  (8,3,6,0,1,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,4,3,0);
COMMIT;

#
# Data for the `tbltask` table  (LIMIT 0,500)
#

INSERT INTO `tbltask` (id, name, description, duration, assigned, closed, color) VALUES 
  (1,'Estimation Tickets release 2.29','All team working to estimage tickets for release 2.29',20,0,0,'FFCC00'),
  (2,'Work Plan Planning/Updates','Time spent planning or updating the excel sheet.',2,0,0,'009BC3'),
  (3,'Invoices Scan','Time spent creating parsers for Invoices',44,0,0,'0059B1');
COMMIT;

#
# Data for the `tbltimeline` table  (LIMIT 0,500)
#

INSERT INTO `tbltimeline` (id, name, teamId, projectId, resourceId) VALUES 
  (1,NULL,0,1,1),
  (2,NULL,0,1,2),
  (3,NULL,0,1,3),
  (4,NULL,0,1,4),
  (5,NULL,0,1,5),
  (6,NULL,0,1,6);
COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;