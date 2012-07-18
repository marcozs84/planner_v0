var assignableTasks = Array();

$(document).ready(function() {

	var localSession = localStorage.getItem('localSession');
	if (localSession == null || localSession == '') {
		window.location.href = 'login.html';
		// chrome.extension.sendRequest({redirect: "login.html"});
	} else {
		if (location.search != '?detached') {
			chrome.extension.getBackgroundPage().detachWindow('manager.html');
			return false;
		} else {
			console.log("detached already");
		}
	}

	tasks = JSON.parse(localStorage.getItem('backTasks'));
	timeline = JSON.parse(localStorage.getItem('backTimelines'));
	projects = JSON.parse(localStorage.getItem('backProjects'));

	loadView('taskList', initTaskList);
	loadView('developersList', initDevelopersList);
	loadView('projectsList', initProjectsList);

	// initTaskList();
	// initDevelopersList();

	toolBarInit();

	initFromToCalendars();

	return false;

	assignableTasks = Array();

	for ( var i = 0; i < tasks.length; i++) {
		for ( var j = 0; j < tasks[i].splits.length; j++) {
			assignableTasks[tasks[i].splits[j].id] = tasks[i].splits[j];
		}
	}

	// assignFixedTasks();

	// assignTask(assignableTasks[0], 3);
	assignTask(assignableTasks[1], 3);
	// assignTask(assignableTasks[2], 3);
	assignTask(assignableTasks[3], 6);
	assignTask(assignableTasks[4], 6); // fixed
	assignTask(assignableTasks[5], 6); // fixed
	assignTask(assignableTasks[7], 3); // fixed
	assignTask(assignableTasks[6], 3);

	// removeTask(assignableTasks[4]);

	generateAll();

	$('.father > div').grrrid('justify', 'height');

	assignHeights();

	$('.finalCont').dotdotdot({
		wrapper : 'div',
		wrap : "word",
		watch : true
	});

	$('select').selectmenu();

	// ==================================================

	// toolBarInit();

	// $('.taskName').textOverFlow('...',true);
	// $(".finalCont").dotdotdot();
	// $("#testerdiv").dotdotdot();
	// $(".taskName").dotdotdot({
	// ellipsis: '... ', /* The HTML to add as ellipsis. */
	// wrapper : 'span', /* The element to wrap the content in. */
	// ellipsis: '... ', /* The HTML to add as ellipsis. */
	// wrap : 'word', /* How to cut off the text/html:
	// 'word'/'letter'/'children' */
	// after : null, /* A jQuery-selector for the element to keep
	// and put after the ellipsis. */
	// watch : false, /* Whether to update the ellipsis:
	// true/'window' */
	// height : null, /* Optionally set a max-height,
	// if null, the height will be measured. */
	// tolerance: 0 /* Deviation for the height-option. */
	// });
	// $('.taskName').css("color","red");

});

function loadView(viewName, callbackFunc) {
	$.ajax({
		type : "POST",
		url : "jsViews/" + viewName + ".html"
	}).done(function(msg) {
		$('#modalsHolder').append(msg);
		callbackFunc();
	});
}

function initModalWindows() {
	// modalsHolder
	$.ajax({
		type : "POST",
		url : "jsViews/developersList.html"
	}).done(function(msg) {
		alert("Modal loaded: " + msg);
		$('#modalsHolder').append(msg);
	});
	$.ajax({
		type : "POST",
		url : "jsViews/tasksList.html"
	}).done(function(msg) {
		alert("Modal loaded: " + msg);
		$('#modalsHolder').append(msg);
	});
}

var Task = function(task) {
	this.id = 0;
	this.name = "";
	this.duration = "";
	this.assigned = 0;
	this.closed = 0;
	this.color = "";
	this.splits = Array();

	this.construct = function() {
		if (task != null) {
			this.id = task.id;
			this.name = task.name;
			this.duration = task.duration;
			this.assigned = task.assigned;
			this.closed = task.closed;
			this.color = task.color;
			this.splits = task.splits;
		}
	};

	this.construct();
};

var Split = function(split) {
	this.id = 0;
	this.parentId = 0;
	this.devId = 0;
	this.assigned = 0;
	this.closed = 0;
	this.startDate = '';
	this.originalDate = '';
	this.delayBeginning = 0;
	this.delay = 0;
	this.duration = 0;

	this.construct = function() {
		if (split != null) {
			this.id = split.id;
			this.parentId = split.parentId;
			this.devId = split.devId;
			this.assigned = split.assigned;
			this.closed = split.closed;
			this.startDate = split.startDate;
			this.originalDate = split.originalDate;
			this.delayBeginning = split.delayBeginning;
			this.delay = split.delay;
			this.duration = split.duration;
		}
	};

	this.construct();
};

function getTimelineById(devId) {
	// Searching Developers timeline
	var dev = 0;
	for ( var i = 0; i < timeline.length; i++) {
		if (timeline[i].id == devId) {
			timeId = i;
			dev = timeline[i];
			break;
		}
	}

	return dev;
}

function getTaskById(id) {
	var task = '';
	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == id) {
			task = tasks[i];
			break;
		}
	}
	return task;
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

function setAssigned(parentId, id, devId) {

	var assignations = 0;
	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == parentId) {
			color = tasks[i].color;
			for ( var j = 0; j < tasks[i].splits.length; j++) {
				if (tasks[i].splits[j].id == id) {
					tasks[i].splits[j].assigned = 1;
					tasks[i].splits[j].devId = devId;
				}
			}

			for ( var j = 0; j < tasks[i].splits.length; j++) {
				if (tasks[i].splits[j].assigned == 1) {
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

function setClosed(parentId, id) {

	var assignations = 0;
	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == parentId) {
			color = tasks[i].color;
			for ( var j = 0; j < tasks[i].splits.length; j++) {
				if (tasks[i].splits[j].id == id) {
					tasks[i].splits[j].closed = 1;
				}
			}

			for ( var j = 0; j < tasks[i].splits.length; j++) {
				if (tasks[i].splits[j].closed == 1) {
					assignations++;
				}
			}

			if (assignations == tasks[i].splits) {
				tasks[i].closed = 1;
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
		return false;
	}

	dev = getTimelineById(devId);

	dev.tasks.push(task);

	setAssigned(task.parentId, task.id, devId);

	// generateTimeline(dev.id);

}

function removeTaskFromTimeline(taskId, devId) {
	dev = getTimelineById(devId);

	for ( var i = 0; i < dev.tasks.length; i++) {
		if (dev.tasks[i].id == taskId) {
			dev.tasks[i] = null;
			dev.tasks.splice(i, 1);
		}
	}

	generateTimeline(devId);
}

function generateAll() {
	for ( var i = 0; i < timeline.length; i++) {
		generateTimeline(timeline[i].id);
	}
}

function generateTimeline(devId) {

	dev = getTimelineById(devId);

	var tasks = dev.tasks;
	var dTasks = Array();
	var fTasks = Array();

	for ( var i = 0; i < tasks.length; i++) {
		if (tasks[i].startDate != '') {
			fTasks.push(tasks[i]);
		} else {
			dTasks.push(tasks[i]);
		}
	}

	// Sort by StartDate
	fTasks.sort((function(index) {
		return function(a, b) {

			fA = a[index];
			fA = fA.split('/');
			dA = new Date(fA[2], fA[1], fA[0], 0, 0, 0);

			fB = b[index];
			fB = fB.split('/');
			dB = new Date(fB[2], fB[1], fB[0], 0, 0, 0);

			return (dA === dB ? 0 : (dA < dB ? -1 : 1)); // Desc (7,8);
		};
	})('startDate')); // 2 is the index

	// return false;

	var task = null;

	for ( var k = 0; k < fTasks.length; k++) {
		task = fTasks[k];
		buildTask(task);
	}
	for ( var k = 0; k < dTasks.length; k++) {
		task = dTasks[k];
		buildTask(task);
	}
}

function buildTask(task) {

	// Search for first available day
	for ( var i = 0; i < dev.days.length; i++) {
		if (task.startDate == '') {
			available = dev.days[i].hours - dev.days[i].used;
			hrsTotal = dev.days[i].hours;
			if (available > 0) {
				objI = i;
				break;
			}
		} else {
			if (dev.days[i].date == task.startDate) {
				available = dev.days[i].hours - dev.days[i].used;
				hrsTotal = dev.days[i].hours;
				if (available > 0) {
					objI = i;
					break;
				} else {
					task.delayBeginning = 1;
					task.startDate = dev.days[i + 1].date;
					// alert("La tarea" + getTaskName(task.parentId) + " fue
					// movida de su fecha original a:" + task.startDate + ".");
					// return false;
					// break;
				}
			}
		}
	}

	var dayCounter = objI;
	var dayAvailable = 0;
	var unassigned = task.duration;
	var delayHrs = task.delay;

	var tTask = null;
	var isDelay = 0;

	var oDay = 0;
	while (unassigned > 0) {
		tTask = new Split(task);
		dayAvailable = dev.days[dayCounter].hours - dev.days[dayCounter].used;
		if (dayAvailable < 1) {
			dayCounter++;
			continue;
		}
		hrsTotal = dev.days[dayCounter].hours;
		oDay = dev.days[dayCounter];

		if (unassigned > dayAvailable) {
			tTask.duration = dayAvailable;
			oDay.tasks.push(tTask);
			oDay.used += dayAvailable;
			assigned = dayAvailable;
			unassigned = unassigned - dayAvailable;

			dayCounter++;
		} else {
			tTask.duration = unassigned;
			oDay.tasks.push(tTask);
			oDay.used += unassigned;
			assigned = unassigned;
			unassigned = 0;

			// setAssigned(task.parentId, task.id); // it was already setted
			// in
			// assignTask function
		}

		backColor = getColor(task.parentId);
		color = getFontColor(backColor);
		name = getTaskName(task.parentId);

		var sufix = oDay.week + '_' + timeId + '_' + oDay.day + '_' + task.id;
		var classes = '';
		if (isDelay == 1) {
			classes = " delayed";
		}

		$('#div_' + oDay.week + '_' + timeId + '_' + oDay.day).append(
				'<div><table id="tbl_' + sufix + '" cellspacing="0" cellpadding="0" border="0" class="task ' + classes + '" style="'
						+ '"><tr><td class="taskName" style="background-color:' + backColor // + ';
						// color:'
						// +
						// color
						+ '"><div class="finalCont">'
						// + sufix + ':<br />' + name
						+ name + '</div></td><td class="taskTime">' + assigned + '</td></table></div>');

		elements22.push('#div_' + oDay.week + '_' + timeId + '_' + oDay.day);
		temp = 0;

		if (unassigned == 0) {
			if (delayHrs > 0) {
				unassigned = delayHrs;
				delayHrs = 0;
				isDelay = 1;
			}
		}
	}
}

function assignHeights() {

	var elename2 = 0;
	for ( var i = 0; i < timeline.length; i++) {
		for ( var j = 0; j < timeline[i].days.length; j++) {

			var divElementDiv = '#div_' + timeline[i].days[j].week + '_' + i + '_' + timeline[i].days[j].day + ' div';

			if (timeline[i].days[j].tasks.length == 1) {
				xtramargin = 1;
			} else {
				xtramargin = 0;

			}

			xtramargin = timeline[i].days[j].tasks.length;

			for ( var k = 0; k < timeline[i].days[j].tasks.length; k++) {
				// timeline[i].days[j].week;
				// timeline[i].days[j].tasks[k].duration;

				// elename = '#tbl_' + timeline[i].days[j].week + '_' + i + '_'
				// + timeline[i].days[j].day + '_'
				// + timeline[i].days[j].tasks[k].id;
				//
				// elenameTaskName = '#tbl_' + timeline[i].days[j].week + '_' +
				// i + '_' + timeline[i].days[j].day + '_'
				// + timeline[i].days[j].tasks[k].id + ' .taskName div';

				elename2 = '#tbl_' + timeline[i].days[j].week + '_' + i + '_' + timeline[i].days[j].day + '_' + timeline[i].days[j].tasks[k].id
						+ ' .finalCont';

				$(elename2).css('max-height', $(divElementDiv).height());

			}
		}
	}
}

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

function openModal(view) {
	console.log("opening modal: " + view);
	console.log($("#" + view));
	$("#" + view).dialog("open");
}

function toolBarInit() {

	$("#btnTest").button({
		text : "Test Ajax"
	// icons: {
	// primary: "ui-icon-stop"
	// }
	}).click(function() {
		// saveTasks();
	});

	$("#btnTBProjects").button({
		text : "Projects",
		icons : {
			primary : "ui-icon-suitcase"
		}
	}).click(function() {
		openModal('projectsList');
	});

	$("#btnTBDevelopers").button({
		text : "Developers",
		icons : {
			primary : "ui-icon-person"
		}
	}).click(function() {
		openModal('developersList');
	});

	$("#btnTBTasks").button({
		text : "Tasks",
		icons : {
			primary : "ui-icon-clipboard"
		}
	}).click(function() {
		openModal('taskList');
	});

	$("#btnKillSession").button({
		text : "KillSession",
		icons : {
			primary : "ui-icon-power"
		}
	}).click(function() {
		localStorage.setItem('localSession', '');
		window.location.href = window.location.href;
	});

	$("#btnLogOut").button({
		text : "Log Out",
		icons : {
			primary : "ui-icon-power"
		}
	}).click(function() {
		window.location.replace("logout.php");
	});
}

function updateTimelines() {
	$.ajax({
		type : "POST",
		url : "http://planner/www/getTimelines.php"
	}).done(function(resultTimelines) {

		try {
			var jsonTimelinesResult = JSON.parse(resultTimelines);
		} catch (error) {
			alert(error);
			return false;
		}

		if (jsonTimelinesResult.result == 'FALSE') {
			alert(jsonTimelinesResult.message);
			return false
		}

		stringTimelines = JSON.stringify(jsonTimelinesResult.package.timelines);
		localStorage.setItem('backTimelines', stringTimelines);
		timeline = JSON.parse(localStorage.getItem('backTimelines'));

		oDevTable.fnClearTable(0);
		oDevTable.fnAddData(timeline);
		oDevTable.fnDraw();

	});
}

function initFromToCalendars() {
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 3,
		onSelect : function(selectedDate) {
			$("#to").datepicker("option", "minDate", selectedDate);
		}
	});
	$("#to").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 3,
		onSelect : function(selectedDate) {
			$("#from").datepicker("option", "maxDate", selectedDate);
		}
	});
}