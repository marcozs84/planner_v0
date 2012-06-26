<?php
include_once 'manager.php';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<title>Insert title here</title>
<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/jquery.dotdotdot-1.4.0-packed.js"></script>
<script type="text/javascript" src="js/jquery.grrrid-1.0.0.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.18.custom.min.js"></script>
<script type="text/javascript" src="js/jquery.ui.selectmenu.js"></script>
<script type="text/javascript" src="js/json2.js"></script>
<script type="text/javascript">
   var timeline = <?php print json_encode($timelines); ?>;
   var timelineId = <?php print $timelineId; ?>;
   var tasks = <?php print json_encode($tasks); ?>;
   var startWeek = <?php print $startWeek; ?>;
   var teams = <?php print $teams; ?>;
</script>
<script type="text/javascript" src="js/manager.js"></script>
<script type="text/javascript" src="jsViews/taskList.js"></script>
<script type="text/javascript" src="jsViews/developersList.js"></script>

<?php
// $path = "development-bundle/ui/minified/";
// $handle=opendir($path);
// while (($file = readdir($handle))!==false) {
// if(($file != '.') &&
// ($file != '..')
// ){
// if(is_file($path.$file)){
// echo '<script type="text/javascript" src="'.$path.$file.'"></script>'."\r\n";
// }
// }
// }
// closedir($handle);
?>

<?php
// $path = "development-bundle/themes/minimal_v1/";
// $handle=opendir($path);
// while (($file = readdir($handle))!==false) {
// if(($file != '.') &&
// ($file != '..')
// ){
// if(is_file($path.$file)){
// echo '<link href="'.$path.$file.'" rel="stylesheet" type="text/css"
// />'."\r\n";
// }
// }
// }
// closedir($handle);
?>

<link href="css/eggplant/jquery-ui-1.8.18.custom.css" rel="stylesheet" type="text/css" />
<style type="text/css">
.ui-dialog .ui-dialog-content{
	padding:5px 0px 0px 0px;
}
</style>
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="css/jquery.dataTables_themeroller.css" rel="stylesheet" type="text/css" />
<!-- <link href="css/jquery.dataTables.css" rel="stylesheet" type="text/css" /> -->
<style type="text/css">
.dataTable {
	color: #000;
}

.dataTable .details {
	color: #fff;
}

.paging_full_numbers a {
	float: left;
}

.table.dataTable tr.odd{
/* 	background:none; */
	background:rgba(0,0,0,0.2);
}
.table.dataTable tr.even{
/* 	background:none; */
	background: rgba(0,0,0,0.1);
}

</style>
<link href="css/jquery.ui.selectmenu.css" rel="stylesheet" type="text/css" />
<link href="css/mainTable_eggplant.css" rel="stylesheet" type="text/css" />
<!-- <link href="css/default.css" rel="stylesheet" type="text/css" /> -->
<style type="text/css">
/*demo page css*/
body {
	font: 62.5% "Trebuchet MS", sans-serif; /* margin: 50px; */
}

#dialog_link {
	padding: .4em 1em .4em 20px; text-decoration: none; position: relative;
}

#dialog_link span.ui-icon {
	margin: 0 5px 0 0; position: absolute; left: .2em; top: 50%; margin-top: -8px;
}

ul#icons {
	margin: 0; padding: 0;
}

ul#icons li {
	margin: 2px; position: relative; padding: 4px 0; cursor: pointer; float: left; list-style: none;
}

ul#icons span.ui-icon {
	float: left; margin: 0 4px;
}

#toolbar {
	padding: 3px;
}
</style>
</head>
<body>
	<div class="floating-menu ui-widget-header">
		<span id="toolbar" class="ui-corner-all" style="float:right; clear:none;">
			<button id="btnLogOut">Salir</button>
		</span>
		<span id="toolbar" class="ui-corner-all" style="/* float:right; */ float:none; margin:0px auto 0px auto; width:auto; display:table; clear:none;">
			<button id="btnTest">Test Ajax</button>
			<button id="btnTBDevelopers">Developers</button>
			<button id="btnTBTasks">Tasks</button>
		</span>
	</div>
	<div style="display: none;">
		<!-- Div holder for all views -->
<?php
include_once 'jsViews/taskList.html.php';
include_once 'jsViews/developersList.html.php';
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