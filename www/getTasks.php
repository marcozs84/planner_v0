<?php
include_once ('tools.php');

/**
 * ************************* GETTING TIMEINES *****************************
 */
$query = "select * from tbltask";

$res = $mysqli->query ( $query );

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
						"id" => $row ['id'],
						"parentId" => $row ['parentId'],
						"devId" => $row ['devId'],
						"assigned" => $row ['assigned'],
						"closed" => $row ['closed'],
						"startDate" => $row ['startDate'],
						"originalDate" => $row ['originalDate'],
						"delayBeginning" => $row ['delayBeginning'],
						"delay" => $row ['delay'],
						"duration" => $row ['duration']
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
				"message" => "Timelines",
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

?>
