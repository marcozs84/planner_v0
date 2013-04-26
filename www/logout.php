<?
session_start();

include_once ('tools.php');

if (isset ( $_POST ['token'] )) {

	unset($_SESSION[$_POST ['token']]);
	unset($_SESSION["nombre_cliente"]);
	session_destroy();
	//header("Location: index.php");

	writelog("Succesfully logged out.");

	$resultJSON = Array(
			"result" => "TRUE",
			"message" => "Logged out",
			"package" => "null"
	);
	print json_encode($resultJSON);
	die();

	exit;

}

?>