<?php
 include_once('tools.php');

	if(isset($_POST['id'])){

		$resourceId = json_decode($_POST['id']);

		$query = "DELETE FROM tblresource WHERE id IN (".@implode(",",$resourceId).")";

		$res = $mysqli->query($query);

		if($res){
			print "{\"result\":\"TRUE\",\"message\":\"Removed.\",\"package\":{\"id\" : ".json_encode($resourceId)."}}";
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
