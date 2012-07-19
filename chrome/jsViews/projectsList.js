var oDevTable;

/* Formating function for row details */
function projectDetails(nTr) {
	var aData = oDevTable.fnGetData(nTr);

	var sOut = '';
	sOut += '<table class="ui-widget" cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';
	sOut += '<caption>Resources</caption>';
	sOut += '<thead class="ui-widget-header">';
	sOut += '<tr>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Name</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Initials</th>';
	sOut += '</tr>';
	sOut += '</thead>';
	sOut += '<tbody class="ui-widget-content">';
	for ( var i = 0; i < aData.tasks.length; i++) {

		sOut += '<tr>';
		sOut += '<td>';
		sOut += getTimelineById(aData.timelines[i].name);
		sOut += '</td>';
		sOut += '<td>';
		sOut += aData.tasks[i].duration;
		sOut += '</td>';
		sOut += '</tr>';
	}
	sOut += '</tbody>';
	sOut += '</table>';

	return sOut;
}

var isEditingProject = 0;

function editProject(projectId) {
	isEditingProject = projectId;

	var objD = getTimelineById(isEditingProject);
	$('#prjName').val(objD.name);
	$('#prjStartDate').val(objD.startDate);
	$('#prjEndtDate').val(objD.endDate);

	$('#frmAddProject').slideDown();
	$('#prjName').focus();

	$("#btnAddProject").button("option", "disabled", false);

}

function saveProject() {

	$.ajax({
		type : "POST",
		url : "http://planner/www/saveProject.php",
		data : {
			id : isEditingProject,
			name : $.trim($('#prjName').val()),
			startDate : $.trim($('#prjStartDate').val()),
			endDate : $.trim($('#prjEndDate').val())
		}
	}).done(function(msg) {

		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		console.log("answer Saving project: " + answer);

		if (answer.result == 'TRUE') {

			if (isEditingProject == 0) {
				$('#prjName').val('');
				$('#prjStartDate').val('');
				$('#prjEndDate').val('');
				$('#frmAddProject').slideUp();

				projects.push(answer.package);

				stringTimelines = JSON.stringify(timeline);
				localStorage.setItem('backTimelines', stringTimelines);
				timeline = JSON.parse(localStorage.getItem('backTimelines'));

				oDevTable.fnClearTable(0);
				oDevTable.fnAddData(timeline);
				oDevTable.fnDraw();
				notice('msgError', 'Created.', true);

			} else {

				var objD = getTimelineById(isEditingProject);
				objD.name = $('#devName').val();
				objD.team = $('#devTeam').val();

				stringTimelines = JSON.stringify(timeline);
				localStorage.setItem('backTimelines', stringTimelines);
				timeline = JSON.parse(localStorage.getItem('backTimelines'));

				oDevTable.fnClearTable(0);
				oDevTable.fnAddData(timeline);
				oDevTable.fnDraw();

				$('#devName').val('');
				$('#frmAddProject').slideUp();

				isEditingProject = 0;

				notice('msgError', 'Saved.', true);
			}

		} else {
			$("#btnAddProject").button("option", "disabled", false);
			error('msgError', 'Error trying to save.');
		}
	}).fail(function() {
		notice('msgError', 'Couldn\'t connect with server.', true);
	});
}

function deleteProject(devId) {

	if (devId instanceof Array) {
	} else {
		devId = Array(devId);
	}

	var strDevs = "[" + devId.join(",") + "]";

	$.ajax({
		type : "POST",
		url : "http://planner/www/removeTimeline.php",
		data : {
			devId : strDevs
		}
	}).done(function(msg) {
		var answer = JSON.parse(msg);

		if (answer.result == 'TRUE') {

			$.ajax({
				type : "POST",
				url : "http://planner/www/getTimelines.php"
			}).done(function(resultTimelines) {

				try {
					var jsonTimelinesResult = JSON.parse(resultTimelines);
				} catch (error) {
					error('msgError', error);
					return false;
				}

				if (jsonTimelinesResult.result == 'FALSE') {
					error('msgError', jsonTimelinesResult.message);
					return false
				}

				stringTimelines = JSON.stringify(jsonTimelinesResult.package.timelines);
				localStorage.setItem('backTimelines', stringTimelines);
				timeline = JSON.parse(localStorage.getItem('backTimelines'));

				oDevTable.fnClearTable(0);
				oDevTable.fnAddData(timeline);
				oDevTable.fnDraw();

				$('#devName').val('');
				$('#frmAddProject').slideUp();

				notice('msgError', 'Removed.', true);
			});

		} else {
			error('msgError', 'Error trying to remove.');
		}
	}).fail(function() {
		notice('msgError', 'Couldn\'t connect with server.', true);
	});
}

function initPrjAddFromToCalendars() {
	$("#prjStartDate").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		onSelect : function(selectedDate) {
			$("#prjEndDate").datepicker("option", "minDate", selectedDate);
		}
	});
	$("#prjEndDate").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		onSelect : function(selectedDate) {
			$("#prjStartDate").datepicker("option", "maxDate", selectedDate);
		}
	});
}

function initProjectsList() {

	initPrjAddFromToCalendars();

	$('#devTeam').selectmenu();

	$("#projectsList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [
				{
					text : "Delete",
					click : function() {

						$("#project-confirm-deletion").dialog({
							resizable : false,
							height : 100,
							modal : true,
							buttons : {
								Cancel : function() {
									$(this).dialog("close");
								},
								"Accept" : function() {
									$(this).dialog("close");

									var deletes = new Array();
									$('input:checkbox[name=projectIds]:checked').each(function() {
										deletes.push($(this).attr('value'));
									});

									deleteProject(deletes);

								}
							}
						});

					}
				}, {
					text : "Close",
					click : function() {
						$(this).dialog("close");
					}
				}
		]
	});

	oDevTable = $('#tblProjectsList').dataTable({
		"aaData" : timeline,
		"bJQueryUI" : true,
		"sPaginationType" : "full_numbers",
		"aoColumns" : [
				{
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
					"bSortable" : true
				}, {
					"mDataProp" : null,
					"sTitle" : "Name",
					"sClass" : "left",
					"bSortable" : true,
					"fnRender" : function(obj) {
						return '<a href="javascript:;" onclick="editProject(' + obj.aData.id + ')">' + obj.aData.name + '</a>';
					}
				}, {
					"mDataProp" : "team",
					"sTitle" : "Team",
					"sClass" : "center",
					"bSortable" : true
				}, {
					"mDataProp" : null,
					"sTitle" : "",
					"sClass" : "center",
					"bSortable" : false,
					"fnRender" : function(obj) {
						return '<input type="checkbox" value="' + obj.aData.id + '" name="projectIds" />';
					}
				}
		]
	});

	$('#tblProjectsList tbody tr td img.btnDevOpenTbl').live('click', function() {

		var nTr = $(this).parents('tr')[0];
		if (oDevTable.fnIsOpen(nTr)) {
			/* This row is already open - close it */
			// this.src = "../examples_support/details_open.png";
			oDevTable.fnClose(nTr);
		} else {
			/* Open this row */
			// this.src = "../examples_support/details_close.png";
			oDevTable.fnOpen(nTr, projectDetails(nTr), 'details');
		}
	});

	$('#tblProjectsList tbody tr td img.btnDevRemoveTbl').live('click', function() {

		var aData = oDevTable.fnGetData(this.parentNode.parentNode); // get
		// datarow
		if (null != aData) { // null if we clicked on title row
			console.log("remove: " + aData.id);
			$("#timeline-confirm-deletion").dialog({
				resizable : false,
				height : 100,
				modal : true,
				buttons : {
					Cancel : function() {
						$(this).dialog("close");
					},
					"Accept" : function() {
						$(this).dialog("close");
						deleteProject(aData.id);
					}
				}
			});
		}

	});

	$('#tblProjectsList tbody tr td img.btnDevEditTbl').live('click', function() {

		var aData = oDevTable.fnGetData(this.parentNode.parentNode); // get
		// datarow
		if (null != aData) { // null if we clicked on title row
			console.log("edit: " + aData.id);
		}
	});

	$('#btnOpenProjectForm').button({
		icons : {
			primary : "ui-icon-plus"
		}
	}).click(function() {
		$('#frmAddProject').slideDown();
		$('#devName').val('');
		$('#devTeam').val('');
		$('#devName').focus();

		$("#btnAddProject").button("option", "disabled", false);
	});

	$('#btnAddProject').button({
		icons : {
			primary : "ui-icon-disk"
		}
	}).click(function() {

		if ($('#devName').val() == '') {
			alert("Please provide a valid name.");
			return false;
		}

		$("#btnAddProject").button("option", "disabled", true);

		saveProject();

	});

};