<?php
include_once ('tools.php');

if (isset ( $_POST ['password'] ) && isset ( $_POST ['username'] )) {

/**
 * ************************* GETTING TIMELINES *****************************
 */
	$query = "select * from tbltimeline";

	$res = $mysqli->query ( $query );

	if ($res) {
		$addTimelines = Array ();
		if ($res->num_rows > 0) {

			while ( $row = $res->fetch_assoc () ) {

				$tmpTimelineId = $row ['id'];
				$devSplitsQuery = "SELECT * FROM tblsplit WHERE timelineId = $tmpTimelineId";

				$resSplit2 = $mysqli->query($devSplitsQuery);

				$tasksTimeline = Array();
				if($resSplit2){
					while($rowSplit = $resSplit2->fetch_assoc()){
						$tasksTimeline[] = Array(
								"id" => $rowSplit ['id'],
								"parentId" => $rowSplit ['parentId'],
								"timelineId" => $rowSplit ['timelineId'],
								"assigned" => $rowSplit ['assigned'],
								"closed" => $rowSplit ['closed'],
								"startDate" => $rowSplit ['startDate'],
								"originalDate" => $rowSplit ['originalDate'],
								"delayBeginning" => $rowSplit ['delayBeginning'],
								"delay" => $rowSplit ['delay'],
								"duration" => $rowSplit ['duration']
						);
					}
				} else {
					$resultJSON = Array(
							"result" => "FALSE",
							"message" => "Failed to get Tasks per Timeline. Error: " . $mysqli->error,
							"package" => "null"
					);
					print json_encode($resultJSON);
					die();
				}

				$addTimelines [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"team" => $row ['teamId'],
						"days" =>  Array(),
						"tasks" => $tasksTimeline
						);
			}
		}

	} else {
		$resultJSON = Array(
				"result" => "FALSE",
				"message" => "Failed to get Timelines. Error: " . $mysqli->error,
				"package" => "null"
		);
		print json_encode($resultJSON);
		die();
	}

	$timelines = $addTimelines;

// 	$timelines = "[";
// 	$timelines .= @implode ( ",", $addTimelines );
// 	$timelines .= "]";


	// ****************************** GETTING TASKS *****************************************************

	$queryTasks = "select * from tbltask";

	$resTask = $mysqli->query ( $queryTasks );

	if ($resTask) {
		$addTasks = Array ();
		if ($resTask->num_rows > 0) {
			while ( $row = $resTask->fetch_assoc () ) {

				$parentId = $row ['id'];

				$querySplits = "select * from tblsplit where parentId = ".$parentId;
				$resSplit = $mysqli->query($querySplits);

				if($resSplit){
					$splits = Array();
					if ($resTask->num_rows > 0) {

						while($rowSplit = $resSplit->fetch_assoc()){
							$splits[] = Array(
									"id" => $rowSplit ['id'],
									"parentId" => $rowSplit ['parentId'],
									"timelineId" => $rowSplit ['timelineId'],
									"assigned" => $rowSplit ['assigned'],
									"closed" => $rowSplit ['closed'],
									"startDate" => $rowSplit ['startDate'],
									"originalDate" => $rowSplit ['originalDate'],
									"delayBeginning" => $rowSplit ['delayBeginning'],
									"delay" => $rowSplit ['delay'],
									"duration" => $rowSplit ['duration']
							);
						}
					}

				}else{
					$resultJSON = Array(
							"result" => "FALSE",
							"message" => "Failed to get Splits of tasks. Error: " . $mysqli->error,
							"package" => "null"
					);
					print json_encode($resultJSON);
					die();
				}

				$addTasks [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"description" => $row ['description'],
						"duration" => $row ['duration'],
						"assigned" => $row ['assigned'],
						"closed" => $row ['closed'],
						"color" => $row ['color'],
						"splits" => $splits
				);

			}
		}

		$tasks = $addTasks;

	} else {
		$resultJSON = Array(
				"result" => "FALSE",
				"message" => "Failed to get Tasks. Error: " . $mysqli->error,
				"package" => "null"
		);
		print json_encode($resultJSON);
		die();
	}


// 	$tasks = "[{\"id\":1,\"name\":\"Lorem ipsum Lorem ipsum a d fasdf asdf adfaf \",\"duration\":12,\"assigned\":0,\"closed\":0,\"color\":\"#654789\",\"splits\":[{\"id\":1,\"parentId\":1,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":5,\"duration\":12}]},{\"id\":2,\"name\":\"dolor pa nombre mas largo\",\"duration\":12,\"assigned\":0,\"closed\":0,\"color\":\"#ff0000\",\"splits\":[{\"id\":2,\"parentId\":2,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":4},{\"id\":3,\"parentId\":2,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":8}]},{\"id\":3,\"name\":\"Fixed date task\",\"duration\":13,\"assigned\":0,\"closed\":0,\"color\":\"#83000c\",\"splits\":[{\"id\":4,\"parentId\":3,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"07\/03\/2012\",\"originalDate\":\"07\/03\/2012\",\"delayBeginning\":0,\"delay\":0,\"duration\":13}]},{\"id\":4,\"name\":\"Fixed date task 2\",\"duration\":13,\"assigned\":0,\"closed\":0,\"color\":\"#874900\",\"splits\":[{\"id\":5,\"parentId\":4,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"07\/03\/2012\",\"originalDate\":\"07\/03\/2012\",\"delayBeginning\":0,\"delay\":0,\"duration\":13}]},{\"id\":5,\"name\":\"auto task 5\",\"duration\":13,\"assigned\":0,\"closed\":0,\"color\":\"#036\",\"splits\":[{\"id\":6,\"parentId\":5,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":13}]},{\"id\":6,\"name\":\"fixed for 4 tasks\",\"duration\":1,\"assigned\":0,\"closed\":0,\"color\":\"#00ff00\",\"splits\":[{\"id\":7,\"parentId\":6,\"devId\":0,\"assigned\":0,\"closed\":0,\"startDate\":\"07\/03\/2012\",\"originalDate\":\"\",\"delayBeginning\":0,\"delay\":0,\"duration\":1}]}]";

	$loginResult = Array(
		"username" => $_POST ['username'],
		"password" => $_POST ['password'],
		"token" => 'abcde12345',
		"isManager" => "TRUE",
		"loginResult" => "TRUE",
		"permissions" => Array(
			"admin" => "create",
			"admin" => "read",
			"admin" => "update",
			"admin" => "delete",
			"manager" => "create",
			"manager" => "read",
			"manager" => "update",
			"manager" => "delete",
			"developer" => "create",
			"developer" => "read",
			"developer" => "update",
			"developer" => "delete"
		),
		"tasks" => $tasks,
		"timelines" => $timelines
	);

	print json_encode($loginResult);


// 	print "{\"username\":\"" . $_POST ['username'] . "\",";
// 	print "\"password\":\"" . $_POST ['password'] . "\",";
// 	print "\"token\":\"abcde12345\",";
// 	print "\"isManager\":\"true\",";
// 	print "\"loginResult\":\"TRUE\",";
// 	print "\"permissions\":{
// 		\"admin\":\"create\", \"admin\":\"read\", \"admin\":\"update\", \"admin\":\"delete\",
// 		\"manager\":\"create\", \"manager\":\"read\", \"manager\":\"update\", \"manager\":\"delete\",
// 		\"developer\":\"create\", \"developer\":\"read\", \"developer\":\"update\", \"developer\":\"delete\"
// 	},";
// 	print "\"tasks\":" . $tasks . ",";
// 	print "\"timelines\":" . $timelines;
// 	print "}";
}

?>
