<?php 
include_once('tools.php');

	if(isset($_POST['token']) 
			&& isset($_POST['timelineId'])
			&& isset($_POST['fechaIni'])
			&& isset($_POST['fechaEnd'])
			){

		$weekStart = date("W",strtotime(trim($_POST['dateIni'])));
		$weekEnd = date("W",strtotime($_POST['dateEnd']));
		
		print("\$weekStart = ". $weekStart."<br />");
		print("\$weekEnd = ". $weekEnd."<br />");
		
		
		for($i = $weekStart ; $i < $weekEnd; $i++){
			print("\$week = ". $i."<br />");
		}
		
		die();
		
		
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
		
		print "{\"username\":\"".$_POST['username']."\",";
		print "\"password\":\"".$_POST['password']."\",";
		print "\"token\":\"abcde12345\",";
		print "\"isManager\":\"true\",";
		print "\"loginResult\":\"TRUE\"";
		print "\"permissions\":{
					\"admin\":\"create\", \"admin\":\"read\", \"admin\":\"update\", \"admin\":\"delete\",
					\"manager\":\"create\", \"manager\":\"read\", \"manager\":\"update\", \"manager\":\"delete\",
					\"developer\":\"create\", \"developer\":\"read\", \"developer\":\"update\", \"developer\":\"delete\"
				},";
		print "\"tasks\":,".$tasks;
		print "\"timelines\":,".$timelines;
		print "}";
	}
?>
