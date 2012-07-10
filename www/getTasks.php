<?php
include_once ('tools.php');

/**
 * ************************* GETTING TIMEINES *****************************
 */

function getTasksJSON(){

	$query = "select * from tbltask";

	$mysqli = ConnectDB();

	$res = $mysqli->query( $query );

	if ($res) {
		if ($res->num_rows > 0) {
			$package = Array();
			while ( $row = $res->fetch_assoc () ) {

				$parentId = $row ['id'];

				$querySplits = "select * from tblsplit where parentId = ".$parentId;

				$splits = Array();

				$resSplit = $mysqli->query($querySplits);
				while($rowSplit = $resSplit->fetch_assoc()){
					$splits[] = Array(
							"id" => $rowSplit ['id'],
							"parentId" => $rowSplit ['parentId'],
							"timelineId" => $rowSplit ['timelineId'],
							"assigned" => $rowSplit ['assigned'],
							"closed" => $rowSplit ['closed'],
							"startDate" => $rowSplit ['startDate'],
							"originalDate" => $rowSplit ['originalDate'],
							"delayBeginning" => $rowSplit ['delayBeginning'],
							"delay" => $rowSplit ['delay'],
							"duration" => $rowSplit ['duration']
							);
				}

				$package [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"description" => $row ['description'],
						"duration" => $row ['duration'],
						"assigned" => $row ['assigned'],
						"closed" => $row ['closed'],
						"color" => $row ['color'],
						"splits" => $splits
						);
			}

			/**
			 * ************************************************************************
			 */


			$resultJSON = Array("result" => "TRUE",
					"message" => "Tasks",
					"package" => Array(
							"tasks" => $package
					)
			);

			print json_encode($resultJSON);

		}else{
			print "{\"result\":\"FALSE\",\"message\":\"There is no data to show.\",\"package\":\"null\"}";
		}

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
	}

}

if($_POST){
	getTasksJSON();
}

?>
