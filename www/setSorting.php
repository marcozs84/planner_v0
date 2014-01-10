<?php
include_once ('tools.php');

writelog("============================================= INIT SORT UPDATE =============================================");

if (isset ( $_POST ['splitId'] ) && isset ( $_POST ['sortDirection'] )) {

	$splitId = trim ( $_POST ['splitId'] );
	$sortDirection = trim ( $_POST ['sortDirection'] );


	//////////////// GETTING MAX ORDER VALUE FROM SPLITS ///////////////////////////

	$querySort = <<<xxx
SELECT * FROM tblsplit WHERE id = {$splitId};
xxx;

	$resMax = $mysqli->query ( $querySort );
	if($resSort){

		while ( $rowSort = $resSort->fetch_assoc() ) {
			$timelineId = $rowSort['timelineId'];
			$sorting = $rowSort['sorting'];
			writelog($maxOrder);
		}

	} else {
		$resultJSON = Array(
				"result" => "FALSE",
				"message" => "Error: " . $mysqli->error,
				"package" => "null"
		);
		print json_encode($resultJSON);
		die();
	}

	/**
	 * -------- CONTINUE HERE
	 *
	 * We have timelineId, splitId, currentSortingPlace
	 * it is required to get next value UP or DOWN depending on the sorting direction.
	 * update both, current and next affected.
	 * Also it is required to think in a solution when removing splits from a timeline, what would happen with the sort order blank spaces??
	 */

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
  duration = {$duration},
  sorting = $maxOrder
WHERE id={$splitId}
xxx;

	$res = $mysqli->query ( $query );

	if ($res) {

// 		Temporarily disabled until assignSplitToTimeline function is finished.
// 		assignSplitToTimeline($mysqli,$_POST,$timelineId);

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
