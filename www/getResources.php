<?php
include_once ('tools.php');

/**
 * ************************* GETTING RESOURCES *****************************
 */
writelog("====================== GETTING RESOURCES ==============================");

function getResourcesJSON(){

	$query = "select * from tblresource";

	$mysqli = ConnectDB();

	$res = $mysqli->query( $query );

	if ($res) {
		$package = Array();

		if ($res->num_rows > 0) {

			while ( $row = $res->fetch_assoc() ) {

				$query2 = "SELECT
							  tblsplit.id,
							  tblsplit.parentId,
							  tblsplit.timelineId,
							  tblsplit.dayId,
							  tblsplit.assigned,
							  tblsplit.closed,
							  tblsplit.startDate,
							  tblsplit.originalDate,
							  tblsplit.delayBeginning,
							  tblsplit.delay,
							  tblsplit.duration as 'split_duration',
							  tblsplit.sorting,
							  tbltask.name,
							  tbltask.description,
							  tbltask.duration as 'total_duration'
							FROM
							  tblsplit
							  INNER JOIN tbltask ON (tblsplit.parentId = tbltask.id)
							WHERE
							  (tblsplit.timelineId = ".$row ['id'].")";

				$res2 = $mysqli->query( $query2 );

				$assignations = Array();

				if ($res2) {
					writelog("assignations query succed");

					if ($res2->num_rows > 0) {

						while ( $row2 = $res2->fetch_assoc() ) {
							$assignations = array(
									"id" => $row2['id'],
									"name" => $row2['name'],
									"split_duration" => $row2['split_duration'],
									"total_duration" => $row2['total_duration']
									);

						}
					}
				}

				$package [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"initials" => $row ['initials'],
						"assignations" => $assignations
						);
			}

		}

		$resultJSON = Array("result" => "TRUE",
				"message" => "Resources",
				"package" => Array(
						"resources" => $package
				)
		);

		print json_encode($resultJSON);

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
	}

}

if($_POST){
	getResourcesJSON();
}

?>
