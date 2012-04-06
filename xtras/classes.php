<?php

class Task {
	public $id = 0;
	public $name = '';
	public $duration = 0;
	public $assigned = 0;
	public $startDate = '';
	public $closed = false;
	public $color = '';  // #ccc
	public $splits = Array();

	public function addSplit($split){
		$this->splits[] = $split;
	}
}

class Split {
	public $id = 0;
	public $parentId = 0;
	public $devId = 0;
	public $assigned = 0;
	public $startDate = '';
	public $duration = 0;
}

$task1 = new Task();
$task1->id = 0;
$task1->name = 'nombre';
$task1->duration = 10;

$split1 = new Split();
$split1->id = 0;

print json_encode($task1);