<?php
include_once ('tools.php');

/**
 * ************************* GETTING PROJECTS *****************************
 */

function getTasksJSON(){

	$query = "select * from tblproject";

	$mysqli = ConnectDB();

	$res = $mysqli->query( $query );

	if ($res) {
		$package = Array();

		if ($res->num_rows > 0) {

			while ( $row = $res->fetch_assoc () ) {

				$package [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"description" => $row ['description'],
						"startDate" => date("d-m-Y",strtotime($row ['startDate'])),
						"endDate" => date("d-m-Y",strtotime($row ['endDate']))
						);
			}

		}

		$resultJSON = Array("result" => "TRUE",
				"message" => "Tasks",
				"package" => Array(
						"tasks" => $package
				)
		);

		print json_encode($resultJSON);

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
	}

}

if($_POST){
	getTasksJSON();
}

?>
