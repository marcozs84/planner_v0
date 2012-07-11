<?php
include_once ('tools.php');

if (isset ( $_POST ['splitId'] ) && isset ( $_POST ['duration'] )) {

	$splitId = trim ( $_POST ['splitId'] );
	$parentId = trim ( $_POST ['parentId'] );
	$timelineId = trim ( $_POST ['timelineId'] );
	$assigned = trim ( $_POST ['assigned'] );
	$closed = trim ( $_POST ['closed'] );
	$startDate = trim ( $_POST ['startDate'] );
	$originalDate = trim ( $_POST ['originalDate'] );
	$delayBeginning = trim ( $_POST ['delayBeginning'] );
	$delay = trim ( $_POST ['delay'] );
	$duration = trim ( $_POST ['duration'] );



		$query = <<<xxx
UPDATE
  tblsplit
SET
  parentId = {$parentId},
  timelineId = {$timelineId},
  assigned = {$assigned},
  closed = {$closed},
  startDate = '{$startDate}',
  originalDate = '{$originalDate}',
  delayBeginning = {$delayBeginning},
  delay = {$delay},
  duration = {$duration}
WHERE id={$splitId}
xxx;

	$res = $mysqli->query ( $query );

	if ($res) {
		include_once ('getTasks.php');
	} else {
		$resultJSON = Array("result" => "FALSE",
				"message" => "Update query failed when updating. Error: ".$mysqli->error. " Query: ".$query ,
				"package" => "null"
		);

		print json_encode($resultJSON);
	}

	$mysqli->close();

} else {
	$resultJSON = Array("result" => "FALSE",
			"message" => "Incomming variables failed.",
			"package" => "null"
	);

	print json_encode($resultJSON);
}
?>
