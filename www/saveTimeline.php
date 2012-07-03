<?php
include_once ('tools.php');

if (isset ( $_POST ['name'] ) && isset ( $_POST ['teamId'] )) {

	$devId = trim ( $_POST ['devId'] );
	$name = trim ( $_POST ['name'] );
	$teamId = trim ( $_POST ['teamId'] );

	if ($devId == 0) {
		$query = "INSERT INTO
			tbltimeline(`name`,`teamId`)
			VALUES(
			'$name',
			$teamId)";

		$res = $mysqli->query ( $query );

		if ($res) {
			$timelineId = $mysqli->insert_id;
			print "{\"result\":\"TRUE\",\"message\":\"Timeline was saved succesfully.\",\"package\":{\"id\" : $timelineId,\"name\" : \"" . $name . "\",\"team\" : $teamId,\"days\" : [],\"tasks\" : []}}";
		} else {
			print "{\"result\":\"FALSE\",\"message\":\"Insertion query failed.\",\"package\":\"null\"}";
		}
	} else {
		$query = "UPDATE
			tbltimeline set `name` = '$name', `teamId` = $teamId WHERE id=$devId";

		$res = $mysqli->query ( $query );

		if ($res) {
			print "{\"result\":\"TRUE\",\"message\":\"Timeline was saved succesfully.\",\"package\":{\"id\" : $teamId,\"name\" : \"" . $name . "\",\"team\" : $teamId,\"days\" : [],\"tasks\" : []}}";
		} else {
			print "{\"result\":\"FALSE\",\"message\":\"Update query failed.\",\"package\":\"null\"}";
		}
	}

	$mysqli->close ();

} else {
	print "{\"result\":\"FALSE\",\"message\":\"Incomming variables failed.\",\"package\":\"null\"}";
}
?>
