<?php
include_once ('tools.php');

/**
 * ************************* GETTING TIMEINES *****************************
 */
$query = "select * from tbltimeline";

$res = $mysqli->query ( $query );

if ($res) {
	if ($res->num_rows > 0) {
		$addTimelines = Array();
		while ( $row = $res->fetch_assoc () ) {
// 			$addTimelines [] = "{\"id\" : " . $row ['id'] . ",\"name\" : \"" . $row ['name'] . "\",\"team\" : " . $row ['teamId'] . ",\"days\" : [],\"tasks\" : []}";
			$addTimelines [] = Array(
					"id" => $row ['id'],
					"name" => $row ['name'],
					"team" => $row ['teamId'],
					"days" => Array(),
					"tasks" => Array()
					);
		}

		/**
		 * ************************************************************************
		 */

// 		$timelines = "[";
// 		$timelines .= @implode ( ",", $addTimelines );
// 		$timelines .= "]";

		$resultJSON = Array("result" => "TRUE",
				"message" => "Timelines",
				"package" => Array(
						"timelines" => $addTimelines
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
