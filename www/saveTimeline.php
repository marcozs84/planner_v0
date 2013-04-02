<?php
include_once ('tools.php');

if (isset ( $_POST ['name'] ) && isset ( $_POST ['teamId'] )) {

	$devId = trim ( $_POST ['devId'] );
	$name = trim ( $_POST ['name'] );
	$teamId = trim ( $_POST ['teamId'] );
	$projectId = trim ( $_POST ['projectId'] );
	$resourceId = trim ( $_POST ['resourceId'] );

	if ($devId == 0) {
		$query = "INSERT INTO
			tbltimeline(`name`,`teamId`,`projectId`,`resourceId`)
			VALUES(
			'$name',
			$teamId,
			$projectId,
			$resourceId
		)";

		$res = $mysqli->query ( $query );

		if ($res) {
			$timelineId = $mysqli->insert_id;

			$resultJSON = Array("result" => "TRUE",
					"message" => "Timeline was saved succesfully",
					"package" => Array(
							"id" => $timelineId,
							"name" => $name,
							"team" => $teamId,
							"projectId" => $projectId,
							"resourceId" => $resourceId,
							"days" => Array(),
							"tasks" => Array()
							)
					);

			print json_encode($resultJSON);
		} else {
// 			print "{\"result\":\"FALSE\",\"message\":\"Insertion query failed.\",\"package\":\"null\"}";
			$resultJSON = Array(
					"result" => "FALSE",
					"message" => "Insertion query failed.",
					"package" => "null"
					);
			print json_encode($resultJSON);
		}
	} else {
		$query = "UPDATE
			tbltimeline set
			`name` = '$name',
			`teamId` = $teamId,
			`projectId` = $projectId,
			`resourceId` = $resourceId
		WHERE id=$devId";

		$res = $mysqli->query ( $query );

		if ($res) {
// 			print "{\"result\":\"TRUE\",\"message\":\"Timeline was saved succesfully.\",\"package\":{\"id\" : $teamId,\"name\" : \"" . $name . "\",\"team\" : $teamId,\"days\" : [],\"tasks\" : []}}";
			$resultJSON = Array("result" => "TRUE",
					"message" => "Timeline was saved succesfully",
					"package" => Array(
							"id" => $devId,
							"name" => $name,
							"team" => $teamId,
							"projectId" => $projectId,
							"resourceId" => $resourceId,
							"days" => Array(),
							"tasks" => Array()
					)
			);

			print json_encode($resultJSON);
		} else {
// 			print "{\"result\":\"FALSE\",\"message\":\"Update query failed.\",\"package\":\"null\"}";
			$resultJSON = Array("result" => "FALSE",
					"message" => "Update query failed.",
					"package" => "null"
			);

			print json_encode($resultJSON);
		}
	}

	$mysqli->close ();

} else {
// 	print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
	$resultJSON = Array("result" => "FALSE",
			"message" => "Incomming variables failed.",
			"package" => "null"
	);

	print json_encode($resultJSON);
}
?>
