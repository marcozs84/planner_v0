<?php
include_once ('tools.php');

writelog("============================================= INIT STATUS UPDATE =============================================");

if (isset ( $_POST ['splitId'] ) && isset ( $_POST ['status'] )) {

	$splitId = trim ( $_POST ['splitId'] );
	$status = trim ( $_POST ['status'] );


			$queryUpd1 = <<<xxx
UPDATE
  tblsplit
SET
  status = $status
WHERE id={$splitId}
xxx;

			$resUpd1 = $mysqli->query ( $queryUpd1 );

			if(!$resUpd1){
				$resultJSON = Array("result" => "FALSE",
						"message" => "An error occured while setting status.",
						"package" => "null"
				);
				print json_encode($resultJSON);
				die();
			} else {
				include_once ('getTimelines.php');
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
