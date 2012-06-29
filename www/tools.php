<?php 
$con = mysqli_connect('localhost','root','');
$mysqli = new mysqli('localhost', 'root', '', 'weekplanner');

if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	die();
}

if($_POST){

	if(isset($_POST['content'])){

		$type = @trim($_POST['type']);
		$content = @trim($_POST['content']);


		$query = "select dataId as dataCount from tblData where clientId = $clientId and key = '$type'";

		$res = $mysqli->query($query);

		if($res->num_rows > 0){
			$query = "update tbldata set value='$content' where clientId = $clientId AND key = '$type'";
		}else{
			$query = <<<xxx
				 insert into tblData('clientId', 'key', 'value', 'description')
				values ('{$clientId}','{$type}','{$content}','');
xxx;
		}

		print $content;

// 		$res = $mysqli->query($query);


// 		die();

// 		print $res->num_rows.'<br/ >';

// 		for ($row_no = 0; $row_no < $res->num_rows; $row_no++) {
// 			$res->data_seek($row_no);
// 			$row = $res->fetch_assoc();
// 			echo " id = " . $row['dataCount'] . "\n";
// 		}

// 		$res->data_seek(0);


// 		var_dump($res);
// 		die();

// 		while ($row = $res->fetch_assoc()) {
// 			echo " id = " . $row['dataId'] . "\n";
// 		}

// 		if($con){

// 			$exec = mysqli_query($query);
// 			$query = "update ";
// 		}

		die();

	}

}
?>
