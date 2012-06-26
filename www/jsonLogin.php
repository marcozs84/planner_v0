<?php 

	if(isset($_POST['password']) && isset($_POST['username'])){
		print "{\"username\":\"".$_POST['username']."\",";
		print "\"password\":\"".$_POST['password']."\",";
		print "\"loginResult\":\"TRUE\"}";
	}
?>
