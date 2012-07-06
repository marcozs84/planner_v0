<?php
 include_once('tools.php');

	if(isset($_POST['devId'])){

		$timelineId = json_decode($_POST['devId']);

		$query = "DELETE FROM tbltimeline WHERE id IN (".@implode(",",$timelineId).")";

		$res = $mysqli->query($query);

		if($res){
			print "{\"result\":\"TRUE\",\"message\":\"Removed.\",\"package\":{\"id\" : ".json_encode($timelineId)."}}";
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
