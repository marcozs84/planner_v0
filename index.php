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
	src="js/jquery.dataTables.min.js"
></script>
<script
	type="text/javascript"
	src="js/jquery.dotdotdot-1.4.0-packed.js"
></script>
<script
	type="text/javascript"
	src="js/jquery.grrrid-1.0.0.js"
></script>
<script
	type="text/javascript"
	src="js/jquery-ui-1.8.18.custom.min.js"
></script>
<script
	type="text/javascript"
	src="js/jquery.ui.selectmenu.js"
></script>
<script type="text/javascript">
   var timeline = <?php print json_encode($timelines); ?>;
   var timelineId = <?php print $timelineId; ?>;
   var tasks = <?php print json_encode($tasks); ?>;
   var startWeek = <?php print $startWeek; ?>;
   var teams = <?php print $teams; ?>;
</script>

<script
	type="text/javascript"
	src="js/manager.js"
></script>
<script
	type="text/javascript"
	src="js/taskList.js"
></script>
<script
	type="text/javascript"
	src="js/developersList.js"
></script>
<script
	type="text/javascript"
	src="js/fixedTaskMove.js"
></script>

<?php
// $path = "development-bundle/ui/minified/";
// $handle=opendir($path);
// while (($file = readdir($handle))!==false) {
// 	if(($file != '.') &&
// 		($file != '..')
// 	){
// 		if(is_file($path.$file)){
// 			echo '<script type="text/javascript" src="'.$path.$file.'"></script>'."\r\n";
// 		}
// 	}
// }
// closedir($handle);
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

<!-- <link -->
<!-- 	href="css/eggplant/jquery-ui-1.8.18.custom.css" -->
<!-- 	rel="stylesheet" -->
<!-- 	type="text/css" -->
<!-- /> -->

<link
	href="css/style.css"
	rel="stylesheet"
	type="text/css"
/>
<link
	href="css/demo_table.css"
	rel="stylesheet"
	type="text/css"
/>
<link
	href="css/jquery.ui.selectmenu.css"
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

<a href="javascript:;" onclick="openModal('developersList')">Developers List</a>
<a href="javascript:;" onclick="openModal('taskList')">Assign Tasks</a>
<a href="javascript:;" onclick="openModal('taskList')">Tasks List</a>
<a href="javascript:;" onclick="openModal('taskList')">Create Task</a>

<script type="text/javascript">

function openModal(view){
	$("#"+view).dialog("open");
}

</script>

</div>

<div style="display:none;">		<!-- Div holder for all views -->
<?php
	include_once 'jsViews/taskList.php';
	include_once 'jsViews/developersList.php';
?>
</div>

<div class="weeksWrapper">

	<div>

	<h1>Planner</h1>

	<?PHP print $literal; ?>

	</div>

</div>

</body>
</html>