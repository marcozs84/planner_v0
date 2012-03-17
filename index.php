<?php
include_once 'manager.php';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta
	http-equiv="Content-Type"
	content="text/html; charset=ISO-8859-1"
>
<title>Insert title here</title>
<link
	href="css/style.css"
	rel="stylesheet"
	type="text/css"
/>
<script
	type="text/javascript"
	src="js/jquery-1.7.1.min.js"
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
</head>
<body>

<h1>Planner</h1>

<div id="info"></div>

<div class="weeksWrapper">
	<div>

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