<?php 

$tasks = "[{\"id\":1,\"name\":\"Lorem ipsum Lorem ipsum a d fasdf asdf adfaf \",\"duration\":12,\"assigned\":0,\"closed\":0,\"color\":\"#654789\",\"splits\":[{\"id\":1,\"parentId\":1,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":5,\"duration\":12}]},{\"id\":2,\"name\":\"dolor pa nombre mas largo\",\"duration\":12,\"assigned\":0,\"closed\":0,\"color\":\"#ff0000\",\"splits\":[{\"id\":2,\"parentId\":2,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":4},{\"id\":3,\"parentId\":2,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":8}]},{\"id\":3,\"name\":\"Fixed date task\",\"duration\":13,\"assigned\":0,\"closed\":0,\"color\":\"#83000c\",\"splits\":[{\"id\":4,\"parentId\":3,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"07\/03\/2012\",\"originalDate\":\"07\/03\/2012\",\"delayBeginning\":0,\"delay\":0,\"duration\":13}]},{\"id\":4,\"name\":\"Fixed date task 2\",\"duration\":13,\"assigned\":0,\"closed\":0,\"color\":\"#874900\",\"splits\":[{\"id\":5,\"parentId\":4,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"07\/03\/2012\",\"originalDate\":\"07\/03\/2012\",\"delayBeginning\":0,\"delay\":0,\"duration\":13}]},{\"id\":5,\"name\":\"auto task 5\",\"duration\":13,\"assigned\":0,\"closed\":0,\"color\":\"#036\",\"splits\":[{\"id\":6,\"parentId\":5,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":13}]},{\"id\":6,\"name\":\"fixed for 4 tasks\",\"duration\":1,\"assigned\":0,\"closed\":0,\"color\":\"#00ff00\",\"splits\":[{\"id\":7,\"parentId\":6,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"07\/03\/2012\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":1}]}]";
	if(isset($_POST['password']) && isset($_POST['username'])){
		print "{\"username\":\"".$_POST['username']."\",";
		print "\"password\":\"".$_POST['password']."\",";
		print "\"token\":\"abcde12345\",";
		print "\"isManager\":\"true\",";
		print "\"loginResult\":\"TRUE\"";
		print "\"permissions\":{
					\"admin\":\"create\", \"admin\":\"read\", \"admin\":\"update\", \"admin\":\"delete\",
					\"manager\":\"create\", \"manager\":\"read\", \"manager\":\"update\", \"manager\":\"delete\",
					\"developer\":\"create\", \"developer\":\"read\", \"developer\":\"update\", \"developer\":\"delete\"
				},";
		print "\"tasks\":,".$tasks;
		print "}";
	}
?>
