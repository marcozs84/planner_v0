<?php
include_once ('tools.php');

if (isset ( $_POST ['name'] ) && isset ( $_POST ['teamId'] )) {

	$taskId = trim ( $_POST ['tskId'] );
	$name = trim ( $_POST ['name'] );
	$description = trim ( $_POST ['description'] );
	$duration = trim ( $_POST ['duration'] );
	$assigned = trim ( $_POST ['assigned'] );
	$closed = trim ( $_POST ['closed'] );
	$color = trim ( $_POST ['color'] );

	if ($devId == 0) {
		$query = "INSERT INTO
				  tbltask(
				  `name`,
				  `description`,
				  `duration`,
				  `assigned`,
				  `closed`,
				  `color`)
				VALUES(
				  '$name',
				  '$description',
				  $duration,
				  $assigned,
				  $closed,
				  '$color')";

		$res = $mysqli->query ( $query );

		if ($res) {
			$timelineId = $mysqli->insert_id;

			$querySplit = "
			INSERT INTO
				  tblsplit(
				  `parentId`,
				  `timelineId`,
				  `assigned`,
				  `closed`,
				  `startdate`,
				  `originalDate`,
				  `delayBeginning`,
				  `delay`,
				  `duration`)
				VALUES(
				  $timelineId,
				  0,
				  0,
				  0,
				  '',
				  '',
				  0,
				  0,
				  $duration)
			";

			$resSplit = $mysqli->query ( $querySplit );

			if ($res) {
				$splitId = $mysqli->insert_id;

				$splitResult = Array(
						"id" => $splitId,
						"parentId" => $timelineId,
						""	// CONTINUE HERE, FILL AL FIELDS MISSING
						);

				$resultJSON = Array("result" => "TRUE",
						"message" => "Timeline was saved succesfully",
						"package" => Array(
								"id" => $timelineId,
								"name" => $name,
								"team" => $teamId,
								"days" => Array(),
								"tasks" => Array()
						)
				);
			}


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
			tbltimeline set `name` = '$name', `teamId` = $teamId WHERE id=$devId";

		$res = $mysqli->query ( $query );

		if ($res) {
// 			print "{\"result\":\"TRUE\",\"message\":\"Timeline was saved succesfully.\",\"package\":{\"id\" : $teamId,\"name\" : \"" . $name . "\",\"team\" : $teamId,\"days\" : [],\"tasks\" : []}}";
			$resultJSON = Array("result" => "TRUE",
					"message" => "Timeline was saved succesfully",
					"package" => Array(
							"id" => $devId,
							"name" => $name,
							"team" => $teamId,
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
