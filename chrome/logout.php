<?php
session_start();

$_SESSION = array();

if (ini_get("session.use_cookies")) {
	$params = session_get_cookie_params();
	setcookie(session_name(), '', time() - 42000,
			$params["path"], $params["domain"],
			$params["secure"], $params["httponly"]
	);
}

session_destroy();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<title>Insert title here</title>
<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.18.custom.min.js"></script>
<link href="css/eggplant/jquery-ui-1.8.18.custom.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<div class="weeksWrapper">
		<div>
			<h1>Loged Out</h1>

<button id="btnLogIn">Log In Again</button>

<script type="text/javascript">


$(document).ready(function(){
	$("#btnLogIn").button({
		text : "Log In Again"
	}).click(function() {
		$.ajax({
			type : "POST",
			url : "login.php",
			data : {
				user : 'pepe',
				pass : 'perez'
			}
		}).done(function(msg) {
			alert(msg);
			//tasks = JSON.parse(msg);
			window.location.replace("index.php");
		});
	});
});

</script>

		</div>
	</div>
</body>
</html>