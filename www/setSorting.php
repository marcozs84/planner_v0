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

	$resSort = $mysqli->query ( $querySort );
	if($resSort){

		while ( $rowSort = $resSort->fetch_assoc() ) {
			$timelineId = $rowSort['timelineId'];
			$sorting = $rowSort['sorting'];
			writelog($sorting);
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

	if ($sortDirection == 'up'){
		/** Get Next Up Position */

		$query = <<<xxx
	SELECT id, sorting FROM tblsplit WHERE timelineId = {$timelineId} AND sorting = (SELECT MIN(sorting) FROM tblsplit WHERE timelineId = {$timelineId} AND sorting > {$sorting} )
xxx;

	} else {
		/** Get Next Down Position */

		$query = <<<xxx
	SELECT id, sorting FROM tblsplit WHERE timelineId = {$timelineId} AND sorting = (SELECT MAX(sorting) FROM tblsplit WHERE timelineId = {$timelineId} AND sorting < {$sorting} )
xxx;
	}

	$res = $mysqli->query ( $query );


	if ($res) {

		if ($res->num_rows > 0) {
			while ( $row = $res->fetch_assoc() ) {
				$altSplitId = $row['id'];
				$altSplitSorting = $row['sorting'];
				writelog("Next Alternative position: splitId: " . $altSplitId . " Pos: ". $altSplitSorting);
			}

			$queryUpd1 = <<<xxx
UPDATE
  tblsplit
SET
  sorting = $altSplitSorting
WHERE id={$splitId}
xxx;
			$queryUpd2 = <<<xxx
UPDATE
  tblsplit
SET
  sorting = $sorting
WHERE id={$altSplitId}
xxx;

			$resUpd1 = $mysqli->query ( $queryUpd1 );
			$resUpd2 = $mysqli->query ( $queryUpd2 );

			if(!$resUpd1 || !$resUpd2){
				$resultJSON = Array("result" => "FALSE",
						"message" => "An error occured during the sorting procedure.",
						"package" => "null"
				);
				print json_encode($resultJSON);
				die();
			} else {
				include_once ('getTimelines.php');
			}

		} else {
			$resultJSON = Array("result" => "FALSE",
					"message" => "The sort position has reached the limit of the list.",
					"package" => "null"
			);
			print json_encode($resultJSON);
			die();
		}

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
