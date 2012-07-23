<?php
include_once ('tools.php');

/**
 * ************************* GETTING PROJECTS *****************************
 */

function getProjectsJSON(){

	$query = "select * from tblproject";

	$mysqli = ConnectDB();

	$res = $mysqli->query( $query );

	if ($res) {
		$package = Array();

		if ($res->num_rows > 0) {

			while ( $row = $res->fetch_assoc () ) {

				$tmpProjectId = $row ['id'];
				$devTimelinesQuery = "
				SELECT
				`tblresource`.`name` as 'name',
				`tbltimeline`.`teamId` as 'teamId'
				FROM tbltimeline
				INNER JOIN tblresource ON tbltimeline.resourceId = tblresource.id
				WHERE projectId = $tmpProjectId";

				$resSplit2 = $mysqli->query($devTimelinesQuery);

				$timelinesProject = Array();
				if($resSplit2){
					while($rowSplit = $resSplit2->fetch_assoc()){
						$timelinesProject[] = Array(
								"id" => $rowSplit ['id'],
								"name" => $rowSplit ['name'],
								"initials" => $rowSplit ['initials'],
								"resourceId" => $rowSplit ['resourceId'],
								"projectId" => $rowSplit ['projectId'],
								"teamId" => $rowSplit ['teamId']
						);
					}
				} else {
					$resultJSON = Array(
							"result" => "FALSE",
							"message" => "Failed to get Timelines per Project. Error: " . $mysqli->error,
							"package" => "null"
					);
					print json_encode($resultJSON);
					die();
				}

				$package [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"description" => $row ['description'],
						"startDate" => date("d.m.Y",strtotime($row ['startDate'])),
						"endDate" => date("d.m.Y",strtotime($row ['endDate'])),
						"timelines" => $timelinesProject
						);
			}

		}

		$resultJSON = Array("result" => "TRUE",
				"message" => "Projects",
				"package" => Array(
						"projects" => $package
				)
		);

		print json_encode($resultJSON);

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
	}

}

if($_POST){
	getProjectsJSON();
}

?>
