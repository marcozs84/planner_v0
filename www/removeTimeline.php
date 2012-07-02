<?php
 include_once('tools.php');

	if(isset($_POST['timelineId'])){

		$timelineId = trim($_POST['timelineId']);

		$query = "DELETE FROM tbltimeline WHERE id = ".$timelineId;

		$res = $mysqli->query($query);

		if($res){
			print "{\"result\":\"TRUE\",\"message\":\"Timeline was saved succesfully.\",\"package\":{\"id\" : $timelineId}}";
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Insertion query failed.\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
