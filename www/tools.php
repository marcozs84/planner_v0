<?php
$con = @mysqli_connect('localhost','root','');

if($con){
	$mysqli = new mysqli('localhost', 'root', '', 'weekplanner');

	if ($mysqli->connect_errno) {
// 		echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	}
}else{
	$resultJSON = Array(
			"result" => "FALSE",
			"message" => "Connection error. Error: ".$mysqli->error ,
			"package" => "null"
	);
	print json_encode($resultJSON);
	die();
}



$go = '';

if($go == 'go'){

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

		die();

	}

}
?>
