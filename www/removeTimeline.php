<?php
 include_once('tools.php');

	if(isset($_POST['devId'])){

		$timelineId = trim($_POST['devId']);

		$query = "DELETE FROM tbltimeline WHERE id = ".$timelineId;

		$res = $mysqli->query($query);

		if($res){
			print "{\"result\":\"TRUE\",\"message\":\"Removed.\",\"package\":{\"id\" : $timelineId}}";
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed.\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
