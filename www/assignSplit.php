<?php
include_once ('tools.php');

function assignSplitToTimeline(&$mysqli,$POST,$timelineId){

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

	$res = $mysqli->query ( $queryFreeDays );

	$objArray = Array();

	if ($res) {

		if ($res->num_rows > 0) {
			$lastDate = '';
		}

		$availableTime = 0;

		while ( $row = $res->fetch_assoc () ) {

			$objArray[$row ['dayId']] = Array(
					"id" => $row ['dayId'],
					"timelineId" => $row ['timelineId'],
					"date" => $row ['date'],
					"week" => $row ['week'],
					"day" => $row ['day'],
					"totalHours" => $row ['totalHours'],
					"used" => $row ['used'],

					"typeQuery" => "upd"
					);

			$availableTime += (((int) $row ['totalHours'] - (int) $row ['used']) > 0) ? ((int) $row ['totalHours'] - (int) $row ['used']) : 0 ;

			$lastDate = '';
		}

		writelog(print_r("\$POST['duration'] = ". $POST['duration'], true));
		writelog(print_r("\$availableTime = ". $availableTime,true));

		if($availableTime < $POST['duration']){
			$needHrs = $POST['duration'] - $availableTime;
			$needHrs = ceil($needHrs / 8);

			for($i = 0 ; $i < $needHrs ; $i++){
				$objArray[$row ['dayId']] = Array(
						"id" => 0,
						"timelineId" => $POST['timelineId'],
						"date" => $row ['date'],
						"week" => $row ['week'],
						"day" => $row ['day'],
						"totalHours" => $row ['totalHours'],
						"used" => $row ['used'],

						"typeQuery" => "ins"
				);
			}

		}else{
			writelog(print_r("\$availableTime = ". $availableTime,true));
		}

		for($i = 0 ; $i < count($objArray) ; $i++){

		}

		writelog(print_r($objArray,true));

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

		assignSplitToTimeline($mysqli,$_POST,$timelineId);

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
