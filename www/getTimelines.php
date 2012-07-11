<?php
include_once ('tools.php');

/**
 * ************************* GETTING TIMEINES *****************************
 */
$query = "select * from tbltimeline";

$res = $mysqli->query ( $query );

if ($res) {
	$addTimelines = Array();
	if ($res->num_rows > 0) {

		while ( $row = $res->fetch_assoc () ) {
			$addTimelines [] = Array(
					"id" => $row ['id'],
					"name" => $row ['name'],
					"team" => $row ['teamId'],
					"days" => Array(),
					"tasks" => Array()
					);
		}

	}

	$resultJSON = Array("result" => "TRUE",
			"message" => "Timelines",
			"package" => Array(
					"timelines" => $addTimelines
			)
	);

	print json_encode($resultJSON);

}else{
	print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
}

?>
