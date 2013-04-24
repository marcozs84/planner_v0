<?php
include_once ('tools.php');

if (isset ( $_POST ['name'] ) && isset ( $_POST ['initials'] )) {

	$id = trim ( $_POST ['id'] );
	$name = trim ( $_POST ['name'] );
	$initials = trim ( $_POST ['initials'] );

	if ($id == 0) {
		$query = "INSERT INTO
			tblresource(`name`,`initials`)
			VALUES(
			'$name',
			'$initials')";

		$res = $mysqli->query ( $query );

		if ($res) {
			$projectId = $mysqli->insert_id;

			$resultJSON = Array("result" => "TRUE",
					"message" => "Resource was saved succesfully. ".displayQuery($query),
					"package" => Array(
							"id" => $projectId,
							"name" => $name,
							"initials" => $initials
							)
					);

			print json_encode($resultJSON);
		} else {
			$resultJSON = Array(
					"result" => "FALSE",
					"message" => "Insertion query failed.".displayQuery($query),
					"package" => "null"
					);
			print json_encode($resultJSON);
		}
	} else {
		$query = "UPDATE
			tblresource set `name` = '$name', `initials` = '$initials' WHERE id=$id";

		$res = $mysqli->query ( $query );

		if ($res) {
			$resultJSON = Array("result" => "TRUE",
					"message" => "Resource was saved succesfully. ".displayQuery($query),
					"package" => Array(
							"id" => $id,
							"name" => $name,
							"initials" => $initials
					)
			);

			print json_encode($resultJSON);
		} else {
			$resultJSON = Array("result" => "FALSE",
					"message" => "Update query failed.",
					"package" => "null"
			);

			print json_encode($resultJSON);
		}
	}

	$mysqli->close ();

} else {
	$resultJSON = Array("result" => "FALSE",
			"message" => "Incomming variables failed.",
			"package" => "null"
	);

	print json_encode($resultJSON);
}
?>
