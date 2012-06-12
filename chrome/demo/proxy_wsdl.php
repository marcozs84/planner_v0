<?php

$gets = Array();
$getss = '';
if(isset($_GET['wsdl'])){
	
	foreach($_GET as $name => $value) {
// 		print "$name : $value<br>";
		if($value == ''){
			$gets[] = "$name";
		}else{
			$gets[] = "$name=$value";
		}
		
	}
	
	$getss = '?'.implode("&", $gets);
	
// 	$daurl = 'http://tools.emini.dk/jira/rpc/soap/jirasoapservice-v2'.$getss;
// 	print $daurl;
// 	die();
}
// Set your return content type
header('Content-type: application/xml');

// Website url to open

$daurl = 'http://tools.emini.dk/jira/rpc/soap/jirasoapservice-v2'.$getss;
// Get that website's content
$handle = fopen($daurl, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>