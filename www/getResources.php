<?php
include_once ('tools.php');

/**
 * ************************* GETTING RESOURCES *****************************
 */

function getResourcesJSON(){

	$query = "select * from tblresource";

	$mysqli = ConnectDB();

	$res = $mysqli->query( $query );

	if ($res) {
		$package = Array();

		if ($res->num_rows > 0) {

			while ( $row = $res->fetch_assoc () ) {

				$package [] = Array(
						"id" => $row ['id'],
						"name" => $row ['name'],
						"initials" => $row ['initials']
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
