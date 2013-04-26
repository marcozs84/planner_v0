<?php
include_once ('tools.php');

writelog("Request to: ".__FILE__);

if (isset ( $_POST ['name'] ) && isset ( $_POST ['startDate'] )) {

	$id = trim ( $_POST ['id'] );
	$name = trim ( $_POST ['name'] );
	$description = trim ( $_POST ['description'] );
	$startDate = trim ( $_POST ['startDate'] );
	$endDate = trim ( $_POST ['endDate'] );

	$insertStartDate = date("Y-m-d",strtotime(str_replace('.', '-', $startDate)));
	$insertEndDate = date("Y-m-d",strtotime("$endDate"));

	$startDate = date("d.m.Y",strtotime("$startDate"));
	$endDate = date("d.m.Y",strtotime("$endDate"));

	if ($id == 0) {
		$query = "INSERT INTO
			tblproject(`name`,`description`,`startDate`,`endDate`)
			VALUES(
			'$name',
			'$description',
			'$insertStartDate',
			'$insertEndDate')";

		$res = $mysqli->query ( $query );

		if ($res) {
			$projectId = $mysqli->insert_id;

			$resultJSON = Array("result" => "TRUE",
					"message" => "Project was saved succesfully. ".displayQuery($query),
					"package" => Array(
							"id" => $projectId,
							"name" => $name,
							"description" => $description,
							"startDate" => $startDate,
							"endDate" => $endDate,
							"timelines" => Array()
							)
					);

			writelog("Insertion succesful. ");
			print json_encode($resultJSON);
		} else {
			writelog("Insertion query failed. ".$res);
			$resultJSON = Array(
					"result" => "FALSE",
					"message" => "Insertion query failed.".displayQuery($query),
					"package" => "null"
					);
			print json_encode($resultJSON);
		}
	} else {
		$query = "UPDATE
			tblproject set `name` = '$name', `description` = '$description', `startDate` = '$insertStartDate', `endDate` = '$insertEndDate' WHERE id=$id";

		$res = $mysqli->query ( $query );

		if ($res) {
			$resultJSON = Array("result" => "TRUE",
					"message" => "Project was saved succesfully. ".displayQuery($query),
					"package" => Array(
							"id" => $id,
							"name" => $name,
							"description" => $description,
							"startDate" => $startDate,
							"endDate" => $endDate,
							"timelines" => Array()				//@TODO fill with timelines corresponding to the updated project.
					)
			);
			writelog("Update succesful. ");
			print json_encode($resultJSON);
		} else {
// 			print "{\"result\":\"FALSE\",\"message\":\"Update query failed.\",\"package\":\"null\"}";
			writelog("Update query failed. ".$res);
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
