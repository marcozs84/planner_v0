<?php
include_once ('tools.php');

if (isset ( $_POST ['name'] ) && isset ( $_POST ['startDate'] )) {

	$id = trim ( $_POST ['id'] );
	$name = trim ( $_POST ['name'] );
	$description = trim ( $_POST ['description'] );
	$startDate = trim ( $_POST ['startDate'] );
	$endDate = trim ( $_POST ['endDate'] );

	$startDate = date("Y-m-d",strtotime("$startDate"));
	$endDate = date("Y-m-d",strtotime("$endDate"));

	if ($id == 0) {
		$query = "INSERT INTO
			tblproject(`name`,`description`,`startDate`,`endDate`)
			VALUES(
			'$name',
			'$description',
			'$startDate',
			'$endDate')";

		$res = $mysqli->query ( $query );

		if ($res) {
			$projectId = $mysqli->insert_id;

			$resultJSON = Array("result" => "TRUE",
					"message" => "Project was saved succesfully ".$query,
					"package" => Array(
							"id" => $projectId,
							"name" => $name,
							"description" => $description,
							"startDate" => $startDate,
							"endDate" => $endDate
							)
					);

			print json_encode($resultJSON);
		} else {
			$resultJSON = Array(
					"result" => "FALSE",
					"message" => "Insertion query failed.",
					"package" => "null"
					);
			print json_encode($resultJSON);
		}
	} else {
		$query = "UPDATE
			tblproject set `name` = '$name', `description` = '$description', `startDate` = '$startDate', `endDate` = '$endDate' WHERE id=$id";

		$res = $mysqli->query ( $query );

		if ($res) {
			$resultJSON = Array("result" => "TRUE",
					"message" => "Timeline was saved succesfully",
					"package" => Array(
							"id" => $id,
							"name" => $name,
							"description" => $description,
							"startDate" => $startDate,
							"endDate" => $endDate
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
