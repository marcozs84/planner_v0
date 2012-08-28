<?php
include_once ('tools.php');

writelog("============================================= INIT ASSIGN SPLIT =============================================");

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

		$availableTime = 0;

		if ($res->num_rows < 1) {
			$queryPrjTime = <<<xxx
				SELECT
				  tblproject.id,
				  tblproject.startDate AS startDate,
				  tblproject.endDate AS endDate
				FROM
				  tblproject
				WHERE `tblproject`.id= (select tbltimeline.projectId FROM tbltimeline WHERE tbltimeline.id = {$timelineId})
xxx;

			$resPrjTime = $mysqli->query ( $queryPrjTime );

			if(!$resPrjTime){
				writelog("############## ERROR IN QUERY");
				writelog($queryPrjTime);
				$resultJSON = Array("result" => "FALSE",
						"message" => "Error trying to get the project based on timelineId. Error: ".$mysqli->error. " Query: ".$queryPrjTime ,
						"package" => "null"
				);
				print json_encode($resultJSON);
				die();
			}

			if ($resPrjTime->num_rows > 1) {
				writelog("############## WARNING, BIG EXCEPTION, MORE THAN 1 PROJECT IS BEING RETURNED PER TIMELINEID");
			}

			while ( $row = $resPrjTime->fetch_assoc () ) {
				$lastDate = $row['startDate'];
			}

			$lastDate = date("d-m-Y",strtotime("$lastDate - 1 day"));

		}else{
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

				$lastDate = $row ['date'];
			}
		}

		writelog("\$lastDate = ". $lastDate);
		writelog("\$POST['duration'] = ". $POST['duration']);
		writelog("=============================================");

		writelog("\$availableTime = ". $availableTime);
		writelog("\$POST['duration'] = ". $POST['duration']);

		if($availableTime < $POST['duration']){

			writelog("generating more days");

			$needHrs = $POST['duration'] - $availableTime;
			$needHrs = ceil($needHrs / 8);

			for($i = 0 ; $i < $needHrs ; $i++){

				$lastDate = date("d-m-Y",strtotime("$lastDate + 1 day"));
				writelog("\$lastDate = ". $lastDate);

				$dayN = date("w",strtotime("$lastDate"));
				if(($dayN < 1)){
					$lastDate = date("d-m-Y",strtotime("$lastDate + 1 day"));
					writelog("\$lastDate UPDATED avoid Weekend= ". $lastDate);
				}elseif ($dayN > 5){
					$lastDate = date("d-m-Y",strtotime("$lastDate + 2 day"));
					writelog("\$lastDate UPDATED avoid Weekend= ". $lastDate);
				}

				$date2 = date("Y-m-d",strtotime("$lastDate"));
				$weekN = date("W",strtotime("$lastDate"));
				$dayN = date("w",strtotime("$lastDate"));

				$objArray[] = Array(
						"id" => 0,
						"timelineId" => $POST['timelineId'],
						"date" => $date2,
						"week" => $weekN,
						"day" => $dayN,
						"totalHours" => 8,
						"used" => 0,

						"typeQuery" => "ins"
				);
			}

		}else{
			writelog("days covered with existing");
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
