<?php
 include_once('tools.php');

	if(isset($_POST['id'])){

		$projectId = json_decode($_POST['id']);

		$query = "DELETE FROM tbltimeline WHERE projectId IN (".@implode(",",$projectId).")";

		$res = $mysqli->query($query);

		if($res){
			$query = "DELETE FROM tblproject WHERE id IN (".@implode(",",$projectId).")";

			$res = $mysqli->query($query);

			if($res){
				print "{\"result\":\"TRUE\",\"message\":\"Removed.\",\"package\":{\"id\" : ".json_encode($projectId)."}}";
			}else{
				print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
			}
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
