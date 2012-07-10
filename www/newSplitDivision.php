<?php
include_once ('tools.php');

if (isset ( $_POST ['oldId'] ) && isset ( $_POST ['behavior'] ) && isset ( $_POST ['duration'] )) {

	$splitId = trim ( $_POST ['oldId'] );
	$behavior = trim ( $_POST ['behavior'] );
	$duration = trim ( $_POST ['duration'] );

	$query = "SELECT * from tblsplit WHERE id = $splitId";

	$res = $mysqli->query ( $query );

	if ($res) {
		var_dump($res->fetch_assoc ());
	}

	// CONTINUE HERE FOR CREATING THE DUPLICATE
	die();

	if($behavior == 1){
		$query = "UPDATE tblsplit set `duration` = $duration WHERE id = $splitId";

		$res = $mysqli->query ( $query );

		if ($res) {
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
			$duration)";

			$resSplit = $mysqli->query ( $querySplit );

			if ($resSplit) {

			}
		}
	} elseif ($behavior == 0) {

	}

	if ($taskId == 0) {
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
				$duration)";

			$resSplit = $mysqli->query ( $querySplit );

			if ($resSplit) {
				$splitId = $mysqli->insert_id;

				$splitResult = Array(
						"id" => $splitId,
						"parentId" => $timelineId,
						"assigned" => 0,
						"closed" => 0,
						"startDate" => '',
						"originalDate" => '',
						"delayBeginning" => '',
						"delay" => '',
						"duration" => $duration,
						);

				$resultJSON = Array("result" => "TRUE",
						"message" => "Timeline was saved succesfully",
						"package" => Array(
								"id" => $timelineId,
								"name" => $name,
								"duration" => $duration,
								"description" => $description,
								"assigned" => $assigned,
								"closed" => $closed,
								"color" => $color,
								"splits" => Array($resSplit)
						)
				);

				print json_encode($resultJSON);
			}else{
				$resultJSON = Array(
						"result" => "FALSE",
						"message" => "Insertion query failed. Error: ".$mysqli->error. " Query: ".$query ,
						"package" => "null"
				);
				print json_encode($resultJSON);
			}

		} else {
			$resultJSON = Array(
					"result" => "FALSE",
					"message" => "Insertion query failed. Error: ".$mysqli->error. " Query: ".$query ,
					"package" => "null"
					);
			print json_encode($resultJSON);
		}
	} else {

		$query = <<<xxx
UPDATE
tbltask set
`name` = '{$name}',
`description` = '{$description}',
`duration` = {$duration},
`assigned` = {$assigned},
`closed` = {$closed},
`color` = '{$color}'
WHERE id={$taskId}
xxx;

		$res = $mysqli->query ( $query );

		if ($res) {
			$resultJSON = Array("result" => "TRUE",
					"message" => "Timeline was saved succesfully",
					"package" => Array(
							"id" => $taskId,
							"name" => $name,
							"duration" => $duration,
							"description" => $description,
							"assigned" => $assigned,
							"closed" => $closed,
							"color" => $color,
							"splits" => Array($resSplit)
					)
			);

			print json_encode($resultJSON);
		} else {
// 			print "{\"result\":\"FALSE\",\"message\":\"Update query failed.\",\"package\":\"null\"}";
			$resultJSON = Array("result" => "FALSE",
					"message" => "Update query failed when updating. Error: ".$mysqli->error. " Query: ".$query ,
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
