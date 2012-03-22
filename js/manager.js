$(document).ready(function() {

	assignableTasks = Array();

	for ( var i = 0; i < tasks.length; i++) {
		for ( var j = 0; j < tasks[i].split.length; j++) {
			assignableTasks.push(tasks[i].split[j]);
		}
	}

	assignTask(assignableTasks[0], 3);
	assignTask(assignableTasks[2], 3);
	assignTask(assignableTasks[1], 6);

	assignHeights();

});

var Task = function(task) {
	this.id = 0;
	this.name = "";
	this.duration = "";
	this.closed = "";
	this.color = "";
	this.splits = "";
	this.splits = Array();

	this.construct = function() {
		if (task != null) {
			this.id = task.id;
			this.name = task.name;
			this.duration = task.duration;
			this.closed = task.closed;
			this.color = task.color;
			this.splits = task.splits;
			this.split = task.split;
		}
	}

	this.construct();
}

var Split = function(split) {
	this.id = 0;
	this.parentId = 0;
	this.devId = 0;
	this.assigned = 0;
	this.duration = 0;

	this.construct = function() {
		if (split != null) {
			this.id = split.id;
			this.parentId = split.parentId;
			this.devId = split.devId;
			this.assigned = split.assigned;
			this.duration = split.duration;
		}
	}

	this.construct();
}

function getTaskName(id) {
	var name = '';
	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == id) {
			name = tasks[i].name;
			break;
		}
	}
	return name;
}

function getColor(id) {
	var colorStr = '';
	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == id) {
			colorStr = tasks[i].color;
			break;
		}
	}
	return colorStr;
}

function hex2rgb(hexStr) {
	// note: hexStr should be #rrggbb
	var hex = parseInt(hexStr.substring(1), 16);
	var r = (hex & 0xff0000) >> 16;
	var g = (hex & 0x00ff00) >> 8;
	var b = hex & 0x0000ff;
	return [ r, g, b ];
}

/**
 * http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx
 * 
 * @param color
 * @returns
 */
function rgb2hex(color) {
	// if (color.substr(0, 1) === '#') {
	// return color;
	// }
	// var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

	var red = parseInt(color[0]);
	var green = parseInt(color[1]);
	var blue = parseInt(color[2]);

	var rgb = blue | (green << 8) | (red << 16);
	return '#' + rgb.toString(16);
};

function getFontColor(hexcode) {

	// oldColour = $(this).css('color');
	oldColour = hexcode;
	var rgb;
	if (oldColour.substring(0, 3) == 'rgb') {
		rgb = getRGB(oldColour);
	} else { // it's a hex
		rgb = hex2rgb(oldColour);
	}

	// Source:
	// http://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
	// Color ContrastColor(Color color)
	// int
	var d = 0;
	//
	// // Counting the perceptive luminance - human eye favors green color...
	// double
	a = 1 - (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
	//
	if (a < 0.5) {
		d = 0; // bright colors - black font
	} else {
		d = 255; // dark colors - white font
	}
	// return Color.FromArgb(d, d, d);
	rgbColor = Array(d, d, d);
	return rgb2hex(rgbColor);
}

function setAssigned(parentId, id) {

	var assignations = 0;
	var oTask = 0;
	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == parentId) {
			oTask = tasks[i];
			color = tasks[i].color;
			for ( var j = 0; j < tasks[i].split.length; j++) {
				if (tasks[i].split[j].id == id) {
					tasks[i].split[j].assigned = 1;
				}
			}

			for ( var j = 0; j < tasks[i].split.length; j++) {
				if (tasks[i].split[j].assigned == 1) {
					assignations++;
				}
			}

			if (assignations == tasks[i].splits) {
				tasks[i].assigned = 1;
			}

			break;
		}
	}

	return true;
}

var elements22 = Array();

function assignTask(task, devId) {

	if (task.assigned == 1) {
		alert('The provided task was already assigned.');
		return FALSE;
	}

	var timeId = 0; // represents Developers timeline.

	for ( var i = 0; i < timeline.length; i++) {
		if (timeline[i].id == devId) {
			timeId = i;
			dev = timeline[i];
			break;
		}
	}

	var available = 0;

	for ( var i = 0; i < dev.days.length; i++) {
		available = dev.days[i].hours - dev.days[i].used;
		hrsTotal = dev.days[i].hours;
		if (available > 0) {
			objI = i;
			break;
		}
	}

	var dayCounter = objI;
	var dayAvailable = 0
	var unassigned = task.duration;
	var taskHeight = '';

	var tTask = null;

	var obj = 0;
	while (unassigned > 0) {
		tTask = new Split(task);
		dayAvailable = dev.days[dayCounter].hours - dev.days[dayCounter].used;
		hrsTotal = dev.days[dayCounter].hours;
		obj = dev.days[dayCounter];
		if (unassigned > dayAvailable) {
			// task.duration = dayAvailable;
			// obj.tasks.push(task);
			tTask.duration = dayAvailable;
			obj.tasks.push(tTask);
			obj.used = dayAvailable;
			// if (dayAvailable == hrsTotal) {
			// taskHeight = 'height:100%;';
			// }
			unassigned = unassigned - dayAvailable;
			dayCounter++;
		} else {
			// task.duration = unassigned;
			// obj.tasks.push(task);
			tTask.duration = unassigned;
			obj.tasks.push(tTask);
			obj.used = unassigned;
			unassigned = 0;
			setAssigned(task.parentId, task.id);
		}

		backColor = getColor(task.parentId);
		color = getFontColor(backColor);
		name = getTaskName(task.parentId);

		var sufix = obj.week + '_' + timeId + '_' + obj.day + '_' + task.id;

		$('#div_' + obj.week + '_' + timeId + '_' + obj.day)
				.append(
						'<table id="tbl_'
								+ sufix
								+ '" cellspacing="0" cellpadding="0" border="0" class="task" style="'
								+ taskHeight
								+ '"><tr><td class="taskName" style="background-color:'
								+ backColor + '; color:' + color + '">tbl_'
								+ sufix + ':<br />' + name
								+ '</td><td class="taskTime">' + obj.used
								+ '</td></table>');

		elements22.push('#div_' + obj.week + '_' + timeId + '_' + obj.day);
		temp = 0;
	}
}

function assignHeights() {
	var elename = 0;
	for ( var i = 0; i < timeline.length; i++) {
		for ( var j = 0; j < timeline[i].days.length; j++) {
			for ( var k = 0; k < timeline[i].days[j].tasks.length; k++) {
				timeline[i].days[j].week;
				timeline[i].days[j].tasks[k].duration;

				elename = '#tbl_' + timeline[i].days[j].week + '_' + i + '_'
						+ timeline[i].days[j].day + '_'
						+ timeline[i].days[j].tasks[k].id;
				if (timeline[i].days[j].tasks.length == 1
						&& timeline[i].days[j].tasks[k].duration == timeline[i].days[j].hours) {
					$(elename).parent().height(
							$(elename).parent().parent().height());
					$(elename).height($(elename).parent().height());
				}
			}
		}
	}
}