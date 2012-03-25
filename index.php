<?php
include_once 'manager.php';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta
	http-equiv="Content-Type"
	content="text/html; charset=ISO-8859-1"
/>
<title>Insert title here</title>

<script
	type="text/javascript"
	src="js/jquery-1.7.1.min.js"
></script>
<script
	type="text/javascript"
	src="js/jquery-ui-1.8.18.custom.min.js"
></script>
<script type="text/javascript">
   var timeline = <?php print json_encode($timelines); ?>;
   var tasks = <?php print json_encode($tasks); ?>;
   var startWeek = <?php print $startWeek; ?>;
</script>
<script
	type="text/javascript"
	src="js/manager.js"
></script>
<script
	type="text/javascript"
	src="js/taskList.js"
></script>

<?php
$path = "development-bundle/ui/minified/";
$handle=opendir($path);
while (($file = readdir($handle))!==false) {
	if(($file != '.') &&
		($file != '..')
	){
		if(is_file($path.$file)){
			echo '<script type="text/javascript" src="'.$path.$file.'"></script>'."\r\n";
		}
	}
}
closedir($handle);
?>

<?php
$path = "development-bundle/themes/minimal_v1/";
$handle=opendir($path);
while (($file = readdir($handle))!==false) {
	if(($file != '.') &&
		($file != '..')
	){
		if(is_file($path.$file)){
			echo '<link href="'.$path.$file.'" rel="stylesheet" type="text/css" />'."\r\n";
		}
	}
}
closedir($handle);
?>

<link
	href="css/style.css"
	rel="stylesheet"
	type="text/css"
/>
<link
	href="css/gradient.css"
	rel="stylesheet"
	type="text/css"
/>
</head>
<body>

<div class="floating-menu">
<h3>Planner</h3>
<a href="javascript:;">Add Developer</a>
<a href="javascript:;">Assign Tasks</a>
<a href="javascript:;">Display Tasks</a>
<a href="javascript:;">Create Task</a>
</div>


<div class="weeksWrapper">
	<div>

<div class="demo">

<div id="dialog-form" title="Create new user">
	<p class="validateTips">All form fields are required.</p>

	<form>
	<fieldset>
		<label for="name">Name</label>
		<input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
		<label for="email">Email</label>
		<input type="text" name="email" id="email" value="" class="text ui-widget-content ui-corner-all" />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />
	</fieldset>
	</form>
</div>


<div id="users-contain" class="ui-widget">
	<h1>Existing Users:</h1>
	<table id="users" class="ui-widget ui-widget-content">
		<thead>
			<tr class="ui-widget-header ">
				<th>Name</th>
				<th>Email</th>
				<th>Password</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>John Doe</td>
				<td>john.doe@example.com</td>
				<td>johndoe1</td>
			</tr>
		</tbody>
	</table>
</div>
<button id="create-user">Create new user</button>

</div><!-- End demo -->



<h1>Planner</h1>

<?PHP



// print json_encode($timelines);


print $literal;

// $date = date("Y-m-d");// current date
// print("\$date = ". $date."<br />");
// $date = date("d-m-Y",strtotime("03/08/2010 + 1 day"));// current date
// print("\$date = ". $date."<br />");


// $date = strtotime(date("Y-m-d", strtotime($date)) . " +1 day");
// print("\$date = ". $date."<br />");
// $date = strtotime(date("Y-m-d", strtotime($date)) . " +1 week");
// print("\$date = ". $date."<br />");
// $date = strtotime(date("Y-m-d", strtotime($date)) . " +2 week");
// print("\$date = ". $date."<br />");
// $date = strtotime(date("Y-m-d", strtotime($date)) . " +1 month");
// print("\$date = ". $date."<br />");
// $date = strtotime(date("Y-m-d", strtotime($date)) . " +30 days");
// print("\$date = ". $date."<br />");

?>

	</div>

</div>

</body>
</html>