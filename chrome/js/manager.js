var assignableTasks = Array();
var dev = new Object();

$(document).ready(function() {

	var localSession = localStorage.getItem('localSession');
	if (localSession == null || localSession == '') {
		window.location.href = 'login.html';
		// chrome.extension.sendRequest({redirect: "login.html"});
	} else {
		if (location.search != '?detached') {


			// chrome.extension.getBackgroundPage().detachWindow('manager.html');
			// NEW detaching procedure
			chrome.windows.create({
				type:"detached_panel",
				url:"manager.html?detached",
				width:800,
				height:400
			});

			window.close();

			return false;
		} else {
			console.log("detached already");
		}
	}

	tasks = JSON.parse(localStorage.getItem('backTasks'));
	timeline = JSON.parse(localStorage.getItem('backTimelines'));
	resources = JSON.parse(localStorage.getItem('backResources'));
	projects = JSON.parse(localStorage.getItem('backProjects'));

	loadView('taskList', initTaskList);
	loadView('developersList', initDevelopersList);
	loadView('projectsList', initProjectsList);
	loadView('resourcesList', initResourcesList);

	// initTaskList();
	// initDevelopersList();

	toolBarInit();

	initFromToCalendars();

	OnProject = localStorage.getItem('selectedProject');

	if(OnProject == '' || OnProject == 0){
		$('#lblProjectName').html('No project selected.');
	}else{
		var prj = getProjectById(OnProject);
		$('#lblProjectName').html(prj.name);

		selectProject(OnProject);
	}

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
			dev = timeline[i];
			break;
		}
	}

	return dev;
}

/**
 *
 * @param Id
 * @returns {Project}
 */
function getProjectById(Id) {
	// Searching Projects
	var dev = 0;
	for ( var i = 0; i < projects.length; i++) {
		if (projects[i].id == Id) {
			dev = projects[i];
			break;
		}
	}

	return dev;
}

function getResourceById(Id) {
	// Searching Resources
	var dev = 0;
	for ( var i = 0; i < resources.length; i++) {
		if (resources[i].id == Id) {
			dev = resources[i];
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

/**
 * In Fact this assigns a Split
 * @param task
 * @param devId
 * @returns {Boolean}
 */
function assignTask(task, devId) {

	if (task.assigned == 1) {
		alert('The provided task was already assigned.');
		return false;
	}

	dev = getTimelineById(devId);

	dev.tasks.push(task);

	setAssigned(task.parentId, task.id, devId);

	generateTimeline(dev.id);

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

/**
 * CHROME
 * @param from
 * @param to
 */
function GenerateCalendar(from,to){

//	console.log(from);
//	console.log(to);

	var prj = getProjectById(localStorage.getItem('selectedProject'));

	var leftDateLimit = from.split(".");
	leftDateLimit = new Date(leftDateLimit[2],leftDateLimit[1] -1 ,leftDateLimit[0]);
	var leftLimitWeek = leftDateLimit.getWeek();

	var rightDateLimit = to.split(".");
	rightDateLimit = new Date(rightDateLimit[2],rightDateLimit[1] -1 ,rightDateLimit[0]);
	var rightLimitWeek = rightDateLimit.getWeek();

//	var fromDate = from.split(".");
	var fromDate = prj.startDate.split(".");
	fromDate = new Date(fromDate[2],fromDate[1] -1 ,fromDate[0]);
	var fromWeek = fromDate.getWeek();

//	console.log("fromDate: " + fromDate);
//	console.log("fromWeek: " + fromWeek);
//	console.log("fromWeekDay: " + fromDate.getDay());

//	var toDate = to.split(".");
	var toDate = prj.endDate.split(".");
	toDate = new Date(toDate[2],toDate[1] -1 ,toDate[0]);
	var toWeek = toDate.getWeek();

//	console.log("toDate: " + toDate);
//	console.log("toWeek: " + toWeek);

	var html = '';

	var startDate = new Date();
	startDate = fromDate;

	if(fromDate.getDay() > 1){
		startDate.setDate(startDate.getDate() - (fromDate.getDay()-1));
	}

//	console.log(fromWeek,toWeek);
//
//	console.log("startDate:" + startDate);


	var dateday = new Date();
	var displayNone = '';

	for(var i = fromWeek ; i <= toWeek ; i++){

		var weekN = i;

		var headerDate = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
//		headerDate = startDate;

//		console.log("week: " + i + " startDate:" + startDate);

		date1 = headerDate.getDate();
		month1 = headerDate.getMonth();
		headerDate.setDate(headerDate.getDate() + 1);
		date2 = headerDate.getDate();
		month2 = headerDate.getMonth();
		headerDate.setDate(headerDate.getDate() + 1);
		date3 = headerDate.getDate();
		month3 = headerDate.getMonth();
		headerDate.setDate(headerDate.getDate() + 1);
		date4 = headerDate.getDate();
		month4 = headerDate.getMonth();
		headerDate.setDate(headerDate.getDate() + 1);
		date5 = headerDate.getDate();
		month5 = headerDate.getMonth();

		if((i >= leftLimitWeek) && (i <= rightLimitWeek)){
			displayNone = "  ";
		}else{
			displayNone = " display:none; ";
		}

		html += '<table class="weekTable ui-widget" cellpadding="0" cellspacing="0" border="0" style="'+ displayNone +'">';
		html += '		<caption>Week'+ i +'</caption>';
		html += '<thead class="ui-widget-header">';
		html += '<tr>';
		html += '<th></th><th>'+ 'Mon ' + date1 + ', ' + getMonthNameByIndex(month1) + '</th><th>'+ 'Tue ' + date2 + ', ' + getMonthNameByIndex(month2)+'</th><th>'+ 'Wed ' + date3 + ', ' + getMonthNameByIndex(month3)+'</th><th>'+ 'Thu ' + date4 + ', ' + getMonthNameByIndex(month4)+'</th><th>'+ 'Fri ' + date5 + ', ' + getMonthNameByIndex(month5)+'</th>';
		html += '</tr>';
		html += '</thead>';
		html += '<tbody class="ui-widget-content">';

		for(var j = 0 ; j < timeline.length ; j++){

			if(timeline[j].projectId != prj.id){
				continue;
			}

			var timelineDate = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());

			var tm = j;

			html += '<tr>';
			html += '<td class="devName" style="width:50px;">';
			html += timeline[j].name;
			html += '</td>';
			html += '<td colspan="5">';
			html += '<div class="father">';

			for(var k = 1 ; k < 6 ; k++){

				kt = k - 1;

				var day = new Object();

				day.date = timelineDate.getFullYear() + "/" + (timelineDate.getMonth() + 1) + "/" + timelineDate.getDate();
				day.week = weekN;
				day.day = k;
				day.hours = 8;
				day.used = 0 ;
				day.tasks = Array();

//				timeline[j].days.push(day);	// CAUSING ERROR: THIS WAS PUSHING DAYS INTO TIMELINE.CALENDAR EVEN IF THE DAY WAS OUT OF THE PROJECTS RANGE

				var prjStartDate = strToDate(prj.startDate);
				var prjEndDate = strToDate(prj.endDate);

//				console.log(startDate);
//				console.log(prjStartDate);
//				console.log(prjEndDate);

				if((timelineDate >= prjStartDate) && (timelineDate <= prjEndDate)){
//					console.log("is in range");
					timeline[tm].days.push(day);
				}

				html += '<div class="smallContainer" id="div_' + weekN +'_'+ timeline[j].id +'_'+ k +'">';
				html += '</div>';

				timelineDate.setDate(timelineDate.getDate() + 1);

			}
			html += '</div>';
			html += '</td>';
			html += '</tr>';
		}

		html += '</tbody>';
		html += '</table>';

		$('#weeksHolder').append(html);

		html = '';

//		console.log("last startDate:" + startDate);
		startDate.setDate(startDate.getDate() + 7);
//		console.log(startDate);
//		console.log("-----------");

	}

//	console.log("prj.timelines");
//	console.log(timeline);

	generateAll();
	$('.father > div').grrrid('justify', 'height');
	assignHeights();
	$('.finalCont').dotdotdot({
		wrapper : 'div',
		wrap : "word",
		watch : true
	});

}

function generateAll() {

//	console.log(JSON.stringify(timeline));

	var prj = getProjectById(localStorage.getItem('selectedProject'));

	for ( var i = 0; i < timeline.length; i++) {
//		console.log("Generating Timeline: " + timeline[i].id);
//		console.log(timeline[i]);
		if(timeline[i].projectId == prj.id){
			generateTimeline(timeline[i].id);
		}

//		console.log("================================================");
	}

//	console.log(JSON.stringify(timeline));
}

function generateTimeline(devId) {

	dev = getTimelineById(devId);

	var tasks = dev.tasks;
	var dTasks = Array();
	var fTasks = Array();

	for ( var i = 0; i < tasks.length; i++) {
		if ((tasks[i].startDate != '') && (tasks[i].startDate != '0000-00-00 00:00:00')) {
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

//	console.log("building FIXED tasks: " + fTasks.length);
	for ( var k = 0; k < fTasks.length; k++) {
		task = fTasks[k];
		buildTask(task);
	}

//	console.log("building DYNAMIC tasks: " + dTasks.length);
	for ( var k = 0; k < dTasks.length; k++) {
		task = dTasks[k];
		buildTask(task);
	}
}

function buildTask(task) {

	// Search for first available day
	var objI = 0;
//	console.log("building task: ");
//	console.log(task);
	for ( var i = 0; i < dev.days.length; i++) {
		if (task.startDate == '' || task.startDate == '0000-00-00 00:00:00') {
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

	var timeId = dev.id;
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
			oDay.used += eval(dayAvailable);
			assigned = dayAvailable;
			unassigned = unassigned - dayAvailable;

			dayCounter++;
		} else {
			tTask.duration = unassigned;
			oDay.tasks.push(tTask);
			oDay.used += eval(unassigned);
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
						+ '"><tr><td class="taskName" style="background-color:#' + backColor // + ';
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

			var divElementDiv = '#div_' + timeline[i].days[j].week + '_' + timeline[i].id + '_' + timeline[i].days[j].day + ' div';

			if (timeline[i].days[j].tasks.length == 1) {
				xtramargin = 1;
			} else {
				xtramargin = 0;

			}

			xtramargin = timeline[i].days[j].tasks.length;

			if((timeline[i].days[j].used < timeline[i].days[j].hours) && (timeline[i].days[j].used > 0)){

				elename2 = '#div_' + timeline[i].days[j].week + '_' + timeline[i].id + '_' + timeline[i].days[j].day;

				var nheightPer = ((100*timeline[i].days[j].used) / timeline[i].days[j].hours);
				if(nheightPer < 50){
					nheightPer = 50;
				}
				var nheight = (($(elename2).height() * nheightPer) / 100);

				$(elename2).css('max-height', nheight + 'px');

				for ( var k = 0; k < timeline[i].days[j].tasks.length; k++) {

					var nheightDot = nheight / timeline[i].days[j].tasks.length;

					elename2a = '#tbl_' + timeline[i].days[j].week + '_' + timeline[i].id + '_' + timeline[i].days[j].day + '_' + timeline[i].days[j].tasks[k].id;

					$(elename2a).parent().css('height', (nheightDot) + 'px');
					$(elename2a).css('height', (nheightDot) + 'px');
					$(elename2a + ' div.finalCont').css('height', (nheightDot) + 'px');
				}


			}else{
				for ( var k = 0; k < timeline[i].days[j].tasks.length; k++) {

					elename2 = '#tbl_' + timeline[i].days[j].week + '_' + timeline[i].id + '_' + timeline[i].days[j].day + '_' + timeline[i].days[j].tasks[k].id
							+ ' .finalCont';

					$(elename2).css('max-height', $(divElementDiv).height());

				}
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

	$("#btnTBResources").button({
		text : "Resources",
		icons : {
			primary : "ui-icon-person"
		}
	}).click(function() {
		openModal('resourcesList');
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
		localStorage.setItem('selectedProject', '');
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

/**
 * CHROME
 * @param callback
 */
function updateTimelines(callback) {
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
			return false;
		}

		stringTimelines = JSON.stringify(jsonTimelinesResult.package.timelines);
		localStorage.setItem('backTimelines', stringTimelines);
		timeline = JSON.parse(localStorage.getItem('backTimelines'));

		if(callback != null){
			callback();
		}

	});
}

var CalendarDateFrom = '';
var CalendarDateTo = '';

function initFromToCalendars() {
	$("#calendarFrom").datepicker({
		defaultDate : "+1w",
		dateFormat : "d.m.yy",
		changeMonth : true,
		numberOfMonths : 3,
		showWeek: true,
		beforeShowDay: $.datepicker.noWeekends,
		onSelect : function(selectedDate) {
			CalendarDateFrom = selectedDate;
			$("#calendarTo").datepicker("option", "minDate", selectedDate);
		}
	});
	$("#calendarFrom").datepicker('setDate', 'now()');

	$("#calendarTo").datepicker({
		defaultDate : "+1w",
		dateFormat : "d.m.yy",
		changeMonth : true,
		numberOfMonths : 3,
		showWeek: true,
		beforeShowDay: $.datepicker.noWeekends,
		onSelect : function(selectedDate) {
			CalendarDateTo = selectedDate;
			$("#calendarFrom").datepicker("option", "maxDate", selectedDate);
		}
	});
	$("#calendarTo").datepicker('setDate', '+3w');

	$('#btnGenerateCalendar').button({
		text : "Generate"
	}).click(function() {
		updateCalendarDisplay();
	});
}

function updateCalendarDisplay(){

	console.log("updating calendar Display");
	CalendarDateFrom = $('#calendarFrom').val();
	CalendarDateTo = $('#calendarTo').val();

	OnProject = localStorage.getItem('selectedProject');

	if(OnProject == '' || OnProject == 0){
		alert("Please select a project before generating the calendar");
		return false;
	}

	$('#weeksHolder').text('');

	for(var j = 0 ; j < timeline.length ; j++){
		timeline[j].days = new Array();
	}

	GenerateCalendar(CalendarDateFrom,CalendarDateTo);
}