<?php
 include_once('tools.php');

	if(isset($_POST['taskId'])){

		$timelineId = json_decode($_POST['taskId']);

		$query = "DELETE FROM tbltask WHERE id IN (".@implode(",",$timelineId).")";

		$res = $mysqli->query($query);

		if($res){

			$querySplit = "DELETE from tblsplit WHERE parentId IN (".@implode(",",$timelineId).")";

			$resSplit = $mysqli->query($querySplit);

			if($resSplit){
				print "{\"result\":\"TRUE\",\"message\":\"Tasks removed.\",\"package\":{\"id\" : ".json_encode($timelineId)."}}";
			}else{
				print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed for splits. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
			}
		}else{
			print "{\"result\":\"FALSE\",\"message\":\"Deletion query failed for tasks. Error: ".$mysqli->errno." - ".$mysqli->error."<br />Query: ".$query."\",\"package\":\"null\"}";
		}

		$mysqli->close();

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	}
?>
