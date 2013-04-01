<?php

$semanaIni = $dateSt = '03/05/2012';
$semanas = 4;

$startWeek = date("W",strtotime("$dateSt"));

$timelines = Array(
// 		Array("id" => 1,"name" => "Mario Luis", "team" => 1, "days" => Array()),
// 		Array("id" => 2,"name" => "Mateo", "team" => 1, "days" => Array()),
		Array("id" => 3, "name" => "Mariela", "team" => 1, "days" => Array()),
// 		Array("id" => 4,"name" => "Alberto", "team" => 2, "days" => Array()),
// 		Array("id" => 5,"name" => "Albaro", "team" => 2, "days" => Array()),
		Array("id" => 6,"name" => "Alicia", "team" => 2, "days" => Array())
);

// Array samples
/*
$day = Array(
		'date' => "12/05/2012",
		'week' => 0,
		'day'=> 0,
		'hours' => 8,
		'used' => 0 ,
		'tasks' => Array());

$dayTask = Array("time" => 4,
		'color' => '#ffffff');
*/


// Tasks definition
/*
$tasks = Array();

$task = Array(
		'name' => 'Lorem ipsum dolor',
		'duration' => 48,
		'closed' => 0,
		'color' => '#ccc',
		'splits' => 1,
		'split' => Array());

$split = Array(
		'id' => 0,
		'parentId' => 0,
		'devId' => 0,
		'assigned' => 0,
		'duration' => 10		// cannot be bigger than the parent task
		);
*/

//TEST TASKS

$task1 = Array(
		'id' => 1,
		'name' => 'Lorem ipsum',
		'duration' => 12,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#332255',
		'splits' => 1,
		'split' => Array(
			$taskPart = Array(
					'id' => 1,
					'parentId' => 1,
					'devId' => 0,
					'assigned' => 0,
					'duration' => 12
			)
		));

$task2 = Array(
		'id' => 2,
		'name' => 'dolor pa nombre mas largo',
		'duration' => 12,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#ff0000',
		'splits' => 2,
		'split' => Array(
			Array(
				'id' => 2,
				'parentId' => 2,
				'devId' => 0,
				'assigned' => 0,
				'duration' => 4
			),
			Array(
				'id' => 3,
				'parentId' => 2,
				'devId' => 0,
				'assigned' => 0,
				'duration' => 8
			)
		));

$tasks[] = $task1;
$tasks[] = $task2;

//---------------------------


$literal = '';

for($w = 0; $w < $semanas ; $w++){

	$date1 = date("D j",strtotime("$dateSt"));
	$date2 = date("D j",strtotime("$dateSt + 1 day"));
	$date3 = date("D j",strtotime("$dateSt + 2 day"));
	$date4 = date("D j",strtotime("$dateSt + 3 day"));
	$date5 = date("D j",strtotime("$dateSt + 4 day"));

	$weekN = date("W",strtotime("$dateSt"));

	$literal .= <<<xxx
<table class="weekTable" cellpadding="0" cellspacing="0" border="0">
<caption>Week {$weekN}</caption>
	<tr class="header">
		<td></td><td>{$date1}</td><td>{$date2}</td><td>{$date3}</td><td>{$date4}</td><td>{$date5}</td>
	</tr>
xxx;

	$teamSt = $timelines[0]["team"];

	for($tm = 0 ; $tm < count($timelines); $tm++){

		for($k = 1 ; $k < 6 ; $k++){

			$kt = $k-1;
			$dateday = date("d/m/Y",strtotime("$dateSt + $kt day"));

			$amount = ($k == 1 ) ? 10 : 8;

			$day = Array(
					'date' => "$dateday",
					'week' => $weekN,
					'day'=> $k,
					'hours' => 8,		//$amount for displaying 10 at mondays
					'used' => 0 ,
					'tasks' => Array());

			$timelines[$tm]['days'][] = $day;
		}

		if($timelines[$tm]["team"] != $teamSt){
			$teamSt = $timelines[$tm]["team"];
			$literal .= <<<xxx
	<tr class="teamSeparator">
		<td colspan="6"></td>
	</tr>
xxx;
		}

		$literal .= <<<xxx
	<tr>
		<td class="devName">
			{$timelines[$tm]['name']}
		</td>
		<td>
			<div class="smallContainer" id="div_{$weekN}_{$tm}_1">
			</div>
		</td>
		<td>
			<div class="smallContainer" id="div_{$weekN}_{$tm}_2">
			</div>
		</td>
		<td>
			<div class="smallContainer" id="div_{$weekN}_{$tm}_3">
			</div>
		</td>
		<td>
			<div class="smallContainer" id="div_{$weekN}_{$tm}_4">
			</div>
		</td>
		<td>
			<div class="smallContainer" id="div_{$weekN}_{$tm}_5">
			</div>
		</td>
	</tr>
xxx;
	}

	$dateSt = date("d-m-Y",strtotime("$dateSt + 7 day"));// current date

	$literal .= <<<xxx
</table>
xxx;

}