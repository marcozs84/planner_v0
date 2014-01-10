<?php
include_once ('tools.php');
writelog("============================================= RETRIEVING TIMELINES =============================================");
/**
 * ************************* GETTING TIMEINES *****************************
 */
$query = <<<xxx
select
	tbltimeline.id as id,
	tbltimeline.projectId as projectId,
	tbltimeline.resourceId as resourceId,
	tbltimeline.teamId as teamId,
	tblresource.name as name
from
tbltimeline
	INNER JOIN tblresource on tbltimeline.resourceId = tblresource.id
xxx;

writelog($query);

$res = $mysqli->query ( $query );

if ($res) {
	$addTimelines = Array();
	if ($res->num_rows > 0) {

		while ( $row = $res->fetch_assoc () ) {
			$tmpTimelineId = $row ['id'];
			$devSplitsQuery = "SELECT * FROM tblsplit WHERE timelineId = $tmpTimelineId  order by sorting ASC";
			writelog($devSplitsQuery);

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
							"duration" => $rowSplit ['duration'],
							"sorting" => $rowSplit ['sorting']
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
					"projectId" => $row ['projectId'],
					"resourceId" => $row ['resourceId'],
					"team" => $row ['teamId'],
					"days" => Array(),
					"tasks" => $tasksTimeline
					);
			writelog(json_encode($addTimelines));
		}

	}

	$resultJSON = Array("result" => "TRUE",
			"message" => "Timelines",
			"package" => Array(
					"timelines" => $addTimelines
			)
	);

	print json_encode($resultJSON);

}else{
	print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
}

?>
