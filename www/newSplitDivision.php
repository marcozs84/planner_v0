<?php
include_once ('tools.php');

if (isset ( $_POST ['oldId'] ) && isset ( $_POST ['behavior'] ) && isset ( $_POST ['duration'] ) && isset ( $_POST ['parentId'] )) {

	$splitId = trim ( $_POST ['oldId'] );
	$behavior = trim ( $_POST ['behavior'] );
	$duration = trim ( $_POST ['duration'] );
	$parentId = trim ( $_POST ['parentId'] );

	$query = "INSERT INTO tblsplit (
		`parentId`,
		`timelineId`,
		`assigned`,
		`closed`,
		`startdate`,
		`originalDate`,
		`delayBeginning`,
		`delay`,
		`duration`)
	SELECT
		`parentId`,
		0,
		0,
		0,
		'',
		'',
		'',
		'',
		$duration
	from tblsplit WHERE id = $splitId ";

	$res = $mysqli->query ( $query );

	if($res){

		if($behavior == 1){
			$query = "
			update tblsplit set `duration` = `duration` - $duration WHERE id = $splitId;
			";

			$res = $mysqli->query ( $query );


		}else{
			$query = "
			update `tbltask` set `duration` = ( SELECT SUM(`duration`) FROM `tblsplit` WHERE `tblsplit`.`parentId` = $parentId) WHERE id = $parentId;
			";

			$res = $mysqli->query ( $query );
		}

// 		$resultJSON = Array(
// 				"result" => "TRUE",
// 				"message" => "New division created.",
// 				"package" => "null"
// 		);
// 		print json_encode($resultJSON);

		include_once ('getTasks.php');

	}else{
		print "{\"result\":\"FALSE\",\"message\":\"".$mysqli->error."\",\"package\":\"null\"}";
	}


}else{
	$resultJSON = Array("result" => "FALSE",
			"message" => "Incomming variables failed.",
			"package" => "null"
	);

	print json_encode($resultJSON);
}


?>
