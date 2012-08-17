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
	src="js/jquery-ui-1.8.18.custom.min.js"
></script>
<!-- <script -->
<!-- 	type="text/javascript" -->
<!-- 	src="js/jquery.dotdotdot-1.4.0-packed.js" -->
<!-- ></script> -->
<!-- <script -->
<!-- 	type="text/javascript" -->
<!-- 	src="js/jquery.grrrid-1.0.0.js" -->
<!-- ></script> -->
<!-- <script -->
<!-- 	type="text/javascript" -->
<!-- 	src="js/jquery.ui.selectmenu.js" -->
<!-- ></script> -->
<script type="text/javascript">
	var timeline = <?php print json_encode($timelines); ?>;
	var timelineId = <?php print $timelineId; ?>;
	var tasks = <?php print json_encode($tasks); ?>;
	var startWeek = <?php print $startWeek; ?>;
	var teams = <?php print $teams; ?>;
</script>

<!-- <script -->
<!-- 	type="text/javascript" -->
<!-- 	src="js/manager.js" -->
<!-- ></script> -->
<script
	type="text/javascript"
	src="js/taskList.js"
></script>
<!-- <script -->
<!-- 	type="text/javascript" -->
<!-- 	src="js/developersList.js" -->
<!-- ></script> -->

<!-- <script -->
<!-- 	type="text/javascript" -->
<!-- 	src="js/fixedTaskMove.js" -->
<!-- ></script> -->

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
// $path = "development-bundle/themes/minimal_v1/";
// $handle=opendir($path);
// while (($file = readdir($handle))!==false) {
// 	if(($file != '.') &&
// 		($file != '..')
// 	){
// 		if(is_file($path.$file)){
// 			echo '<link href="'.$path.$file.'" rel="stylesheet" type="text/css" />'."\r\n";
// 		}
// 	}
// }
// closedir($handle);
?>

<link
	href="css/eggplant/jquery-ui-1.8.18.custom.css"
	rel="stylesheet"
	type="text/css"
/>

		<style type="text/css">
 			/*demo page css*/ */
body{ font: 62.5% "Trebuchet MS", sans-serif; margin: 50px;}
#dialog_link {padding: .4em 1em .4em 20px;text-decoration: none;position: relative;}
#dialog_link span.ui-icon {margin: 0 5px 0 0;position: absolute;left: .2em;top: 50%;margin-top: -8px;}
ul#icons {margin: 0; padding: 0;}
ul#icons li {margin: 2px; position: relative; padding: 4px 0; cursor: pointer; float: left;  list-style: none;}
ul#icons span.ui-icon {float: left; margin: 0 4px;}
.ui-widget {font-size:0.7em;}
#toolbar {padding: 10px 4px;}
		</style>

<!-- <link -->
<!-- 	href="css/style.css" -->
<!-- 	rel="stylesheet" -->
<!-- 	type="text/css" -->
<!-- /> -->
<!-- <link -->
<!-- 	href="css/demo_table.css" -->
<!-- 	rel="stylesheet" -->
<!-- 	type="text/css" -->
<!-- /> -->
<!-- <link -->
<!-- 	href="css/jquery.ui.selectmenu.css" -->
<!-- 	rel="stylesheet" -->
<!-- 	type="text/css" -->
<!-- /> -->
<!-- <link -->
<!-- 	href="css/gradient.css" -->
<!-- 	rel="stylesheet" -->
<!-- 	type="text/css" -->
<!-- /> -->
</head>
<body>

<div class="demo">

<span id="toolbar" class="ui-widget-header ui-corner-all">
	<button id="beginning">go to beginning</button>
	<button id="rewind">rewind</button>
	<button id="play">play</button>
	<button id="stop">stop</button>
	<button id="forward">fast forward</button>
	<button id="end">go to end</button>

	<input type="checkbox" id="shuffle" /><label for="shuffle">Shuffle</label>

	<span id="repeat">
		<input type="radio" id="repeat0" name="repeat" checked="checked" /><label for="repeat0">No Repeat</label>
		<input type="radio" id="repeat1" name="repeat" /><label for="repeat1">Once</label>
		<input type="radio" id="repeatall" name="repeat" /><label for="repeatall">All</label>
	</span>
</span>

</div>

<div class="floating-menu">
<h3>Planner</h3>

<a href="javascript:;" onclick="openModal('developersList')">Developers List</a>
<a href="javascript:;" onclick="openModal('taskList')">Assign Tasks</a>
<a href="javascript:;" onclick="openModal('taskList')">Tasks List</a>
<a href="javascript:;" onclick="openModal('taskList')">Create Task</a>

<script type="text/javascript">

$(function() {
	$( "#beginning" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-start"
		}
	});
	$( "#rewind" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	});
	$( "#play" ).button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	})
	.click(function() {
		var options;
		if ( $( this ).text() === "play" ) {
			options = {
				label: "pause",
				icons: {
					primary: "ui-icon-pause"
				}
			};
		} else {
			options = {
				label: "play",
				icons: {
					primary: "ui-icon-play"
				}
			};
		}
		$( this ).button( "option", options );
	});
	$( "#stop" ).button({
		text: false,
		icons: {
			primary: "ui-icon-stop"
		}
	})
	.click(function() {
		$( "#play" ).button( "option", {
			label: "play",
			icons: {
				primary: "ui-icon-play"
			}
		});
	});
	$( "#forward" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	});
	$( "#end" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-end"
		}
	});
	$( "#shuffle" ).button();
	$( "#repeat" ).buttonset();
});

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

		<?PHP //print $literal; ?>

	</div>

</div>

</body>
</html>