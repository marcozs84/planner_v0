<?php
 include_once('tools.php');

	if(isset($_POST['projectId']) && isset($_POST['resourceIds'])){

		$projectId = $_POST['projectId'];

		$resourceIds = json_decode($_POST['resourceIds']);

		$query = "DELETE FROM tbltimeline WHERE `projectId` = $projectId and `resourceId` in ( ".implode(',', $resourceIds) .")";

		$res = $mysqli->query($query);

		if($res){
			print "{\"result\":\"TRUE\",\"message\":\"Added.\",\"package\":{\"projectId\" : ".$projectId.",\"resourceIds\" : ".json_encode($resourceIds)."}}";
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Addition query failed. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
