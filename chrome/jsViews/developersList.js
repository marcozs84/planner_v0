var oDevTable;
var DevRowPosTmp = 0;

function requestSorting($splitId, $sortDirection, devRowPos){
	$.ajax({
		type : "POST",
		url : "http://planner/www/setSorting.php",
		data : {
			splitId : $splitId,
			sortDirection : $sortDirection
		}
	}).done(function(msg) {

		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		console.log("answer Sorting Split Down: ");
		console.log(answer);

		if (answer.result == 'TRUE') {

//			updateTimelines();

			stringTimelines = JSON.stringify(answer.package.timelines);
			localStorage.setItem('backTimelines', stringTimelines);
			timeline = JSON.parse(localStorage.getItem('backTimelines'));

			oDevTable.fnClearTable(0);
			oDevTable.fnAddData(timeline);
			oDevTable.fnDraw();

			updateDevelopersLinks();

			var nNodes = oDevTable.fnGetNodes(devRowPos);

			if (oDevTable.fnIsOpen(nNodes)) {
				oDevTable.fnClose(nNodes);
				oDevTable.fnOpen(nNodes, developerDetails(nNodes), 'details');
			} else {
				oDevTable.fnOpen(nNodes, developerDetails(nNodes), 'details');
			}

			/**
			 * The UpdateTimelines will occur when the dialog is closed,
			 * see the close event for $("#developersList").dialog
			 */
//			updateTimelines(updateCalendarDisplay);		/* <----- This is what updates the timelines AND updates the calendars after assignations */

		} else {
			notice('msgErrorDevelopers', 'An error occured while trying to sort the task down.', true);
		}
	}).fail(function() {
		notice('msgErrorProjectAdd', 'Couldn\'t connect with server.', true);
	});
}

function setSplitStatus($splitId, $status, devRowPos){
	$.ajax({
		type : "POST",
		url : "http://planner/www/setSplitStatus.php",
		data : {
			splitId : $splitId,
			status : $status
		}
	}).done(function(msg) {

		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		console.log("answer setting split status: ");
		console.log(answer);

		if (answer.result == 'TRUE') {

//			updateTimelines();

			stringTimelines = JSON.stringify(answer.package.timelines);
			localStorage.setItem('backTimelines', stringTimelines);
			timeline = JSON.parse(localStorage.getItem('backTimelines'));

			oDevTable.fnClearTable(0);
			oDevTable.fnAddData(timeline);
			oDevTable.fnDraw();

			updateDevelopersLinks();

			var nNodes = oDevTable.fnGetNodes(devRowPos);

			if (oDevTable.fnIsOpen(nNodes)) {
				oDevTable.fnClose(nNodes);
				oDevTable.fnOpen(nNodes, developerDetails(nNodes), 'details');
			} else {
				oDevTable.fnOpen(nNodes, developerDetails(nNodes), 'details');
			}

			/**
			 * The UpdateTimelines will occur when the dialog is closed,
			 * see the close event for $("#developersList").dialog
			 */
//			updateTimelines(updateCalendarDisplay);		/* <----- This is what updates the timelines AND updates the calendars after assignations */

		} else {
			notice('msgErrorDevelopers', 'An error occured while trying to set a status for the selected task.', true);
		}
	}).fail(function() {
		notice('msgErrorProjectAdd', 'Couldn\'t connect with server.', true);
	});
}

function renderSortingButtons(aDataId, devRowPosTmp) {

	$( "a[class=sortingButtonDown_"+ devRowPosTmp +"]" ).button({
		icons : {
			primary : "ui-icon-triangle-1-s"
		},
		text: false,
		btnDevPos: devRowPosTmp
	}).click(function( event ) {
		event.preventDefault();
		var btnDevPos = $(this).button("option", "btnDevPos");
		requestSorting($(this).attr('rel'), 'down',btnDevPos);
	});

	$( "a[class=sortingButtonUp_"+ devRowPosTmp +"]" ).button({
		icons : {
			primary : "ui-icon-triangle-1-n"
		},
		text: false,
		btnDevPos: devRowPosTmp
	}).click(function( event ) {
        event.preventDefault();
        var btnDevPos = $(this).button("option", "btnDevPos");
        requestSorting($(this).attr('rel'), 'up',btnDevPos);
    });

	$( "select[class=taskStatusSelector_"+ devRowPosTmp +"]" ).on("change", function( event ){
//		console.log($(this).attr('id'),$(this).val(),$(this).attr('rel'));
		setSplitStatus($(this).attr('id'),$(this).val(),$(this).attr('rel'));
	});

	$('#devSubList_'+ devRowPosTmp).dataTable({
		"bJQueryUI" : true,
		"sPaginationType" : "two_button",
	});

}

/**
 * Formatting method for row details
 */
function developerDetails(nTr) {
	var aData = oDevTable.fnGetData(nTr);
	var posRow = oDevTable.fnGetPosition(nTr);
	DevRowPosTmp = posRow;

	var sOut = '';
	sOut += '<table id="devSubList_'+ DevRowPosTmp +'" class="ui-widget" cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%; margin:5px;">';
	sOut += '<thead>';
	sOut += '<tr>';
	sOut += '<th style="width:20px; text-align:center;">Task</th>';
	sOut += '<th style="width:20px; text-align:center;">Duration</th>';
//	sOut += '<th style="width:20px; text-align:center;">Finished</th>';
	sOut += '<th style="width:20px; text-align:center;">Status</th>';
//	sOut += '<th style="width:20px; text-align:center;">Start Date</th>';
	sOut += '<th style="width:20px; text-align:center;">Sorting</th>';
	sOut += '</tr>';
	sOut += '</thead>';
	sOut += '<tbody class="ui-widget-content">';
	for ( var i = 0; i < aData.tasks.length; i++) {

		sOut += '<tr>';
		sOut += '<td>';
		sOut += getTaskName(aData.tasks[i].parentId);
		sOut += '</td>';
		sOut += '<td style="text-align:center; ">';
		sOut += aData.tasks[i].duration;
		sOut += '</td>';
//		sOut += '<td style="text-align:center; ">';
//		sOut += aData.tasks[i].closed;
//		sOut += '</td>';
		sOut += '<td style="text-align:center; ">';
//		sOut += aData.tasks[i].status;

		sOut += '<select class="taskStatusSelector_'+ DevRowPosTmp +'" id="'+ aData.tasks[i].id +'" rel="'+ DevRowPosTmp +'">';
		sOut += '<option value="0" ' + (0 == aData.tasks[i].status ? 'selected' : '') + '>Open</option>';
		sOut += '<option value="1" ' + (1 == aData.tasks[i].status ? 'selected' : '') + '>In Progress</option>';
		sOut += '<option value="2" ' + (2 == aData.tasks[i].status ? 'selected' : '' )+ '>Sent to QA</option>';
		sOut += '<option value="3" ' + (3 == aData.tasks[i].status ? 'selected' : '' )+ '>Resolved</option>';
		sOut += '<option value="4" ' + (4 == aData.tasks[i].status ? 'selected' : '' )+ '>Closed</option>';
		sOut += '</select>';

		sOut += '</td>';

//		sOut += '<td style="text-align:center; ">';
//		sOut += aData.tasks[i].startDate;
//		sOut += '</td>';

		if(i == 0){
			sOut += '<td style="text-align:center; width:50px;">';
			sOut += '<a href="#" class="sortingButtonDown_'+ DevRowPosTmp +'" rel="'+ aData.tasks[i].id +'">Down</a>';
			sOut += '</td>';
		} else if (i == aData.tasks.length -1) {
			sOut += '<td style="text-align:center; width:50px;">';
			sOut += '<a href="#" class="sortingButtonUp_'+ DevRowPosTmp +'" rel="'+ aData.tasks[i].id +'">Up</a>';
			sOut += '</td>';
		} else {
			sOut += '<td style="text-align:center; width:50px;">';
			sOut += '<a href="#" class="sortingButtonUp_'+ DevRowPosTmp +'" rel="'+ aData.tasks[i].id +'">Up</a> - <a href="#" class="sortingButtonDown_'+ DevRowPosTmp +'" rel="'+ aData.tasks[i].id +'">Down</a>';
			sOut += '</td>';
		}

		sOut += '</tr>';
	}
	sOut += '</tbody>';
	sOut += '</table>';
	sOut += '<script>renderSortingButtons(' + aData.id + ','+ DevRowPosTmp +');</script>';

	return sOut;
}

function updateDevelopersLinks(){


	$('#tblDevelopersList tbody tr td img.btnDevOpenTbl').on('click', function() {

		var nTr = $(this).parents('tr')[0];
		if (oDevTable.fnIsOpen(nTr)) {
			/* This row is already open - close it */
			// this.src = "../examples_support/details_open.png";
			oDevTable.fnClose(nTr);
		} else {
			/* Open this row */
			// this.src = "../examples_support/details_close.png";
			oDevTable.fnOpen(nTr, developerDetails(nTr), 'details');
		}
	});

	return false;
}

var isEditingDeveloper = 0;


function initDevelopersList() {

	$('#devTeam').selectmenu();

	$("#developersList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		open: function( event, ui ) {
			/**
			 * Checking selected project before displaying developers
			 * if non selected, then no developers are shown
			 */
			OnProject = localStorage.getItem('selectedProject');
			if(OnProject == '' || OnProject == 0){
				$('#tblDevelopersList').dataTable().fnFilter(	"-1",		2,	false,	false);
			}else{
				$('#tblDevelopersList').dataTable().fnFilter(	OnProject,	2,	false,	false);
			};
		},
		close: function( event, ui ) {
			updateTimelines(updateCalendarDisplay);		/* <----- This is what updates the timelines AND updates the calendars after assignations */
		},
		buttons : [{
			text : "Close",
			click : function(){
				$(this).dialog("close");
			}
		} ]
	});

	oDevTable = $('#tblDevelopersList').dataTable({
		"aaData" : timeline,
		"bJQueryUI" : true,
		"sPaginationType" : "full_numbers",
		"aoColumns" : [ {
			"mDataProp" : null,
			"sTitle" : "",
			"sClass" : "center",
			"bSortable" : false,
			"fnRender" : function(obj) {
				return '<img class="btnDevOpenTbl" src="imgs/icon-add.png" />';
			}
		}, {
			"mDataProp" : "id",
			"sTitle" : "Id",
			"sClass" : "center",
			"bSortable" : true,
			"bVisible" : false
		}, {
			"mDataProp" : "projectId",
			"sTitle" : "Project Id",
			"sClass" : "center",
			"bSortable" : true,
			"bVisible" : false
		}, {
			"mDataProp" : "name",
			"sTitle" : "Name",
			"sClass" : "left",
			"bSortable" : true
		}, {
			"mDataProp" : "team",
			"sTitle" : "Team",
			"sClass" : "center",
			"bSortable" : true
//		}, {
//			"mDataProp" : null,
//			"sTitle" : "",
//			"sClass" : "center",
//			"bSortable" : false,
//			"fnRender" : function(obj) {
//				return '<input type="checkbox" value="' + obj.aData.id + '" name="developerIds" />';
//			}
		}]
	});

	$('#tblDevelopersList tbody tr td img.btnDevOpenTbl').on('click', function() {

		var nTr = $(this).parents('tr')[0];
		if (oDevTable.fnIsOpen(nTr)) {
			/* This row is already open - close it */
			// this.src = "../examples_support/details_open.png";
			oDevTable.fnClose(nTr);
		} else {
			/* Open this row */
			// this.src = "../examples_support/details_close.png";
			oDevTable.fnOpen(nTr, developerDetails(nTr), 'details');
		}
	});

};