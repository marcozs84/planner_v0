<?php
include_once ('tools.php');

function assignSplitToTimeline(splitId,timelineId){

	$queryFreeDays = <<<xxx
	SELECT
	  tblday.dayId,
	  tblday.timelineId,
	  tblday.`date`,
	  tblday.week,
	  tblday.`day`,
	  tblday.totalHours,
	  tblday.used
	FROM
	  tblday
	WHERE (`tblday`.totalHours - `tblday`.`used`) > 0
xxx;

	$res = $mysqli->query ( $query );

	$objArray = Array();

	if ($res) {

		while ( $row = $res->fetch_assoc () ) {

			$objArray[$row ['dayId']] = Array(
					"id" => $row ['dayId'],
					"timelineId" => $row ['timelineId'],
					"date" => $row ['date'],
					"week" => $row ['week'],
					"day" => $row ['day'],
					"totalHours" => $row ['totalHours'],
					"used" => $row ['used']
					);


		}

	} else {
		$resultJSON = Array("result" => "FALSE",
				"message" => "Update query failed when updating. Error: ".$mysqli->error. " Query: ".$query ,
				"package" => "null"
		);

		print json_encode($resultJSON);
	}


}

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
