/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

USE `weekplanner`;

INSERT INTO `tblproject` (`id`, `name`, `description`, `startDate`, `endDate`) VALUES 
  (1,'Staffing','Project intended for testing and extra purposes','2013-12-02','2014-01-03');
COMMIT;

INSERT INTO `tblresource` (`id`, `name`, `initials`, `status`) VALUES 
  (1,'Jose Torquato','JT',1),
  (2,'Victor Mendoza','VM',1),
  (3,'Mateo Kuljis','MK',1);
COMMIT;

INSERT INTO `tblsplit` (`id`, `parentId`, `timelineId`, `dayId`, `assigned`, `closed`, `startDate`, `originalDate`, `delayBeginning`, `delay`, `duration`, `order`) VALUES 
  (1,1,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,20,0),
  (2,2,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,30,0),
  (3,1,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,10,0),
  (4,1,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,20,0),
  (5,1,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,10,0),
  (6,2,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,20,0),
  (7,2,0,0,0,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',0,0,10,0);
COMMIT;

INSERT INTO `tbltask` (`id`, `name`, `description`, `duration`, `assigned`, `closed`, `color`) VALUES 
  (1,'IdentityCard','Identity Card Creation',60,0,0,'FFCC00'),
  (2,'Candidate Calendar','Candidate''s Calendar',60,0,0,'81C600');
COMMIT;

INSERT INTO `tbltimeline` (`id`, `name`, `teamId`, `projectId`, `resourceId`) VALUES 
  (1,NULL,0,1,1),
  (2,NULL,0,1,2),
  (3,NULL,0,1,3);
COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;