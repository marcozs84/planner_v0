var oTable;

/* Formating function for row details */
function taskDetails(nTr) {
	var aData = oTable.fnGetData(nTr);

	var sOut = '';
	sOut += 'Total Hours: ' + aData.duration + '<br />';
	sOut += '';
	sOut += '<table cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';

	sOut += '<tr><td style="width:20%;">Graphic:</td><td style="width:80%;">';
	sOut += '<div style="background-color:#ccc; height:10px; width:100%; border:1px solid #333; padding:0px;">';

	for ( var i = 0; i < aData.splits.length; i++) {
		wPercent = ((aData.splits[i].duration * 100) / aData.duration);
		sOut += '<div style="background-color:#ff3300; height:100%; width:' + Math.floor(wPercent) + '%; float:left;"></div>';
	}

	sOut += '</div></td>';

	sOut += '</tr><tr>';
	sOut += '<td></td>';
	sOut += '<td style="padding:0px; text-align:center;">';

	for ( var i = 0; i < aData.splits.length; i++) {
		wPercent = ((aData.splits[i].duration * 100) / aData.duration);

		sOut += '<div style="width:' + Math.floor(wPercent) + '%; float:left;">';
		sOut += aData.splits[i].duration;

		if (aData.splits[i].devId == 0) {
			sOut += ' [<a href="javascript:;" onclick="">Assign</a>]';
		} else {
			sOut += ' [' + getTimelineById(aData.splits[i].devId).name + ']';
		}

		sOut += '</div>';

	}

	sOut += '</td>';
	sOut += '</tr>';
	sOut += '</table>';

	return sOut;
}

var isEditingTask = 0;

function editTask(taskId) {

	isEditingTask = taskId;

	var objT = getTaskById(isEditingTask);
	$('#tskName').val(objT.name);
	$('#tskDuration').val(objT.duration);
	$('#tskDuration').attr('disabled', true);
	$('#tskDescription').val(objT.description);
	console.log("edit color: " + objT.color);
	$('#tskColor').val(objT.color);
	$('#tskColor').css('background-color', '#' + $('#tskColor').val());
	console.log("edit color selected: " + $('#tskColor').val());

	$('#tskAssigned').val(objT.assigned);
	$('#tskClosed').val(objT.closed);

	$('#frmAddTask').slideDown();
	$('#tskName').focus();

	$("#btnAddTask").button("option", "disabled", false);

}

function saveTask() {

	strTsks = JSON.stringify(tasks);

	$.ajax({
		type : "POST",
		url : "http://planner/www/saveTask.php",
		data : {
			tskId : isEditingTask,
			name : $.trim($('#tskName').val()),
			duration : $.trim($('#tskDuration').val()),
			description : $.trim($('#tskDescription').val()),
			color : $.trim($('#tskColor').val()),
			assigned : $.trim($('#tskAssigned').val()),
			closed : $.trim($('#tskClosed').val())
		}
	}).done(function(msg) {

		var answer = JSON.parse(msg);

		console.log("answer: " + answer);

		if (answer.result == 'TRUE') {

			if (isEditingTask == 0) {

				$('#tskName').val('');
				$('#tskDuration').val('');
				$('#tskDescription').val('');
				$('#tskColor').val('');
				$('#tskAssigned').val('0');
				$('#tskClosed').val('0');

				$('#frmAddTask').slideUp();

				tasks.push(answer.package);

				stringTasks = JSON.stringify(tasks);
				localStorage.setItem('backTasks', stringTasks);
				tasks = JSON.parse(localStorage.getItem('backTasks'));

				oTable.fnClearTable(0);
				oTable.fnAddData(tasks);
				oTable.fnDraw();

				notice('msgErrorTask', 'Created.', true);
			} else {

				var objT = getTaskById(isEditingTask);
				objT.name = $('#tskName').val();
				objT.duration = $('#tskDuration').val();
				objT.color = $('#tskColor').val();
				objT.description = $('#tskDescription').val();
				objT.assigned = $('#tskAssigned').val();
				objT.closed = $('#tskClosed').val();

				$('#frmAddTask').slideUp();

				stringTasks = JSON.stringify(tasks);
				localStorage.setItem('backTasks', stringTasks);
				tasks = JSON.parse(localStorage.getItem('backTasks'));

				oTable.fnClearTable(0);
				oTable.fnAddData(tasks);
				oTable.fnDraw();

				$('#tskName').val('');
				$('#tskDuration').val('');
				$('#tskColor').val('');
				$('#tskDescription').val('');
				$('#tskAssigned').val('0');
				$('#tskClosed').val('0');
				$('#frmAddDeveloper').slideUp();

				isEditingTask = 0;

				notice('msgErrorTask', 'Saved.', true);
			}

		} else {
			$("#btnAddTask").button("option", "disabled", false);
			error('msgErrorTask', 'Error trying to save.');
			console.log(msg);
		}
	}).fail(function() {
		notice('msgErrorTask', 'Couldn\'t connect with server.', true);
	});
}

function deleteTask(taskId) {

	if (taskId instanceof Array) {
	} else {
		taskId = Array(taskId);
	}

	var strTsks = "[" + taskId.join(",") + "]";

	$.ajax({
		type : "POST",
		url : "http://planner/www/removeTask.php",
		data : {
			taskId : strTsks
		}
	}).done(function(msg) {
		var answer = JSON.parse(msg);

		if (answer.result == 'TRUE') {

			$.ajax({
				type : "POST",
				url : "http://planner/www/getTasks.php"
			}).done(function(resultTasks) {
				var jsonTasksResult = JSON.parse(resultTasks);

				stringTasks = JSON.stringify(jsonTasksResult.package.tasks);
				localStorage.setItem('backTasks', stringTasks);
				tasks = JSON.parse(localStorage.getItem('backTasks'));

				oTable.fnClearTable(0);
				oTable.fnAddData(tasks);
				oTable.fnDraw();

				$('#tskName').val('');
				$('#tskDuration').val('');
				$('#tskColor').val('');
				$('#tskDescription').val('');
				$('#tskAssigned').val('0');
				$('#tskClosed').val('0');

				$('#frmAddDeveloper').slideUp();

				notice('msgErrorTask', 'Removed.', true);
			});

		} else {
			error('msgErrorTask', 'Error trying to remove.');
		}
	}).fail(function() {
		notice('msgErrorTask', 'Couldn\'t connect with server.', true);
	});
}

function initTaskList() {

	$("#taskList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [
				{
					text : "Delete",
					click : function() {
						var deletes = new Array();
						$('input:checkbox[name=taskIds]:checked').each(function() {
							deletes.push($(this).attr('value'));
						});

						deleteTask(deletes);

					}
				}, {
					text : "Close",
					click : function() {
						$(this).dialog("close");
					}
				}
		]
	});

	// $(document).ready(function() {
	oTable = $('#tblTaskList').dataTable(
			{
				"aaData" : tasks,
				"bJQueryUI" : true,
				"sPaginationType" : "full_numbers",
				"aoColumns" : [
						{
							"mDataProp" : null,
							"sTitle" : "",
							"sClass" : "center",
							"fnRender" : function(obj) {
								return '<img class="btnTaskOpenTbl" src="imgs/details_open.png" />';
							}
						},
						{
							"mDataProp" : "id",
							"sTitle" : "Id",
							"sClass" : "center",
							"bSortable" : true
						},
						{
							"mDataProp" : null,
							"sTitle" : "Name",
							"sClass" : "left",
							"bSortable" : true,
							"fnRender" : function(obj) {
								return '<a href="javascript:;" onclick="editTask(' + obj.aData.id + ')">' + obj.aData.name
										+ '</a>';
							}
						},
						{
							"mDataProp" : "duration",
							"sTitle" : "Duration",
							"sClass" : "center",
							"bSortable" : true
						},
						{
							"mDataProp" : null,
							"sTitle" : "Color",
							"sClass" : "center",
							"bSortable" : false,
							"fnRender" : function(obj) {
								return '<a href="javascript:;" style="background-color:#' + obj.aData.color + '; text-decoration:none;" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>';
							}
						}, {
							"mDataProp" : null,
							"sTitle" : "",
							"sClass" : "center",
							"bSortable" : false,
							"fnRender" : function(obj) {
								return '<input type="checkbox" value="' + obj.aData.id + '" name="taskIds" />';
							}
						}
				]
			});

	$('#tblTaskList tbody td img.btnTaskOpenTbl').live('click', function() {
		var nTr = $(this).parents('tr')[0];
		if (oTable.fnIsOpen(nTr)) {
			oTable.fnClose(nTr);
		} else {
			oTable.fnOpen(nTr, taskDetails(nTr), 'details');
		}
	});

	$('#btnOpenTaskForm').button({
		icons : {
			primary : "ui-icon-plus"
		}
	}).click(function() {
		$('#frmAddTask').slideDown();
		$('#tskName').val('');
		$('#tskDuration').val('');
		$('#tskDuration').removeAttr('disabled');
		$('#tskDescription').val('');
		$('#tskColor').val('');
		$('#tskAssigned').val('0');
		$('#tskClosed').val('0');

		$('#tskName').focus();

		$("#btnAddTask").button("option", "disabled", false);
	});

	$('#btnAddTask').button({
		icons : {
			primary : "ui-icon-disk"
		}
	}).click(function() {

		if ($('#tskName').val() == '') {
			alert("Please provide a valid name.");
			return false;
		}

		if ($('#tskDuration').val() == '' || isNaN($('#tskDuration').val())) {
			alert("Please provide a valid duration value. Only numbers are allowed.");
			$('#tskDuration').focus();
			$('#tskDuration').select();
			return false;
		}

		$("#btnAddDeveloper").button("option", "disabled", true);

		saveTask();

	});

	$('#tskColor').change(function() {
		$('#tskColor').css('background-color', '#' + $('#tskColor').val());
	});

};