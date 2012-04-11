<?php

$semanaIni = $dateSt = '03/05/2012';
$semanas = 4;

$startWeek = date("W",strtotime("$dateSt"));

$timelines = Array(
		Array("id" => 1,"name" => "Mario Luis", "team" => 1, "days" => Array(), "tasks" => Array()),
		Array("id" => 2,"name" => "Mateo", "team" => 1, "days" => Array(), "tasks" => Array()),
		Array("id" => 3, "name" => "Mariela", "team" => 1, "days" => Array(), "tasks" => Array()),
		Array("id" => 4,"name" => "Alberto", "team" => 2, "days" => Array(), "tasks" => Array()),
		Array("id" => 5,"name" => "Albaro", "team" => 2, "days" => Array(), "tasks" => Array()),
		Array("id" => 6,"name" => "Alicia", "team" => 2, "days" => Array(), "tasks" => Array())
);

$timelineId = 6;


$teams = Array(
		Array("id" => 1,"name" => "Team 1"),
		Array("id" => 2,"name" => "Team 2")
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
		'id' => 0,
		'name' => 'Lorem ipsum dolor',
		'duration' => 48,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#ccc',
		'splits' => Array());

$split = Array(
		'id' => 0,
		'parentId' => 0,
		'devId' => 0,
		'assigned' => 0,
		'closed' => 0,
		'startDate' => '',
		'originalDate' => '',
		'delay' => 0,			// In Hours, the amount of hours delayed, 0 means no delays.
		'duration' => 10		// cannot be bigger than the parent task.
		);
*/


//TEST TASKS

$task1 = Array(
		'id' => 1,
		'name' => 'Lorem ipsum Lorem ipsum a d fasdf asdf adfaf ',
		'duration' => 12,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#654789',
		'splits' => Array(
			Array(
				'id' => 1,
				'parentId' => 1,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '',
				'originalDate' => '',
				'delayBeginning' => 0,
				'delay' => 5,
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
		'splits' => Array(
			Array(
				'id' => 2,
				'parentId' => 2,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '',
				'originalDate' => '',
				'delayBeginning' => 0,
				'delay' => 0,
				'duration' => 4
			),
			Array(
				'id' => 3,
				'parentId' => 2,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '',
				'originalDate' => '',
				'delayBeginning' => 0,
				'delay' => 0,
				'duration' => 8
			)
		));

$task3 = Array(
		'id' => 3,
		'name' => 'Fixed date task',
		'duration' => 13,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#83000c',
		'splits' => Array(
			Array(
				'id' => 4,
				'parentId' => 3,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '07/03/2012',
				'originalDate' => '07/03/2012',
				'delayBeginning' => 0,
				'delay' => 0,
				'duration' => 13
			)
		));

$task4 = Array(
		'id' => 4,
		'name' => 'Fixed date task 2',
		'duration' => 13,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#874900',
		'splits' => Array(
			Array(
				'id' => 5,
				'parentId' => 4,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '07/03/2012',
				'originalDate' => '07/03/2012',
				'delayBeginning' => 0,
				'delay' => 0,
				'duration' => 13
			)
		));

$task5 = Array(
		'id' => 5,
		'name' => 'auto task 5',
		'duration' => 13,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#036',
		'splits' => Array(
			Array(
				'id' => 6,
				'parentId' => 5,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '',
				'originalDate' => '',
				'delayBeginning' => 0,
				'delay' => 0,
				'duration' => 13
			)
		));

$task6 = Array(
		'id' => 6,
		'name' => 'fixed for 4 tasks',
		'duration' => 1,
		'assigned' => 0,
		'closed' => 0,
		'color' => '#00ff00',
		'splits' => Array(
			Array(
				'id' => 7,
				'parentId' => 6,
				'devId' => 0,
				'assigned' => 0,
				'closed' => 0,
				'startDate' => '07/03/2012',
				'originalDate' => '',
				'delayBeginning' => 0,
				'delay' => 0,
				'duration' => 1
			)
		));

$tasks[] = $task1;
$tasks[] = $task2;
$tasks[] = $task3;
$tasks[] = $task4;
$tasks[] = $task5;
$tasks[] = $task6;

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
	<thead>
	<tr>
		<th></th><th>{$date1}</th><th>{$date2}</th><th>{$date3}</th><th>{$date4}</th><th>{$date5}</th>
	</tr>
	</thead>
	<tbody>
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
		<td class="devName" style="width:50px;">
			{$timelines[$tm]['name']}
		</td>
		<td colspan="5">
			<div class="father">
				<div class="smallContainer" id="div_{$weekN}_{$tm}_1">
				</div>
				<div class="smallContainer" id="div_{$weekN}_{$tm}_2">
				</div>
				<div class="smallContainer" id="div_{$weekN}_{$tm}_3">
				</div>
				<div class="smallContainer" id="div_{$weekN}_{$tm}_4">
				</div>
				<div class="smallContainer" id="div_{$weekN}_{$tm}_5">
				</div>
			</div>
		</td>
	</tr>
xxx;
	}

	$dateSt = date("d-m-Y",strtotime("$dateSt + 7 day"));// current date

	$literal .= <<<xxx
	</tbody>
</table>
xxx;

}

function genDevList($timelines, $objId = "", $class = "" ){
	$literal = '';
	$literal .= <<<xxx
		<select id="{$objId}" class="{$class}">
xxx;
	for($tm = 0 ; $tm < count($timelines); $tm++){
		$id = $timelines[$tm]['id'];
		$name = $timelines[$tm]['name'];
		$literal .= <<<xxx
			<option value="{$id}">{$name} </option>
xxx;
	}
	$literal .= <<<xxx
		</select>
xxx;
	return $literal;
}

// print genDevList($timelines);