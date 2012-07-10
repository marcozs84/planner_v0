var oTable;

/* Formating function for row details */
function taskDetails(nTr) {
	var aData = oTable.fnGetData(nTr);

	var sOut = '';
	sOut += '<table cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';
	sOut += '<tr><td style="width:20%; text-align:right;">Total Hours:</td><td style="width:80%;">' + aData.duration + '</td></tr>';
	sOut += '<tr><td style="width:20%; text-align:right; vertical-align:top;">Graphic:</td><td>';
	sOut += '<table cellspacing="0" cellpadding="0" style="width:100%; background:none;">';
	sOut += '<tr>';

	for ( var i = 0; i < aData.splits.length; i++) {
		wPercent = ((aData.splits[i].duration * 100) / aData.duration);
		sOut += '<td style="background-color:#ffffff; width:' + Math.floor(wPercent) + '%; height:12px; border:1px solid #000;">';
		sOut += '<a href="javascript:;" onclick="devideSplit('+ aData.splits[i].id +','+ aData.splits[i].duration +');" style="text-width:normal;">Devide</a>';
		sOut += '</td>';
	}

	sOut += '</tr>';
	sOut += '<tr>';

	for ( var i = 0; i < aData.splits.length; i++) {
		wPercent = ((aData.splits[i].duration * 100) / aData.duration);
		sOut += '<td style="width:' + Math.floor(wPercent) + '%; text-align:center; height:15px;">';

		sOut += '<span style="color:#fff; font-weight:normal;">' + aData.splits[i].duration + '</span>';

		if (aData.splits[i].timelineId == 0) {
			sOut += ' [<a href="javascript:;" onclick="" style="color:#fff; font-weight:normal;">Assign</a>]';
		} else {
			sOut += ' [' + getTimelineById(aData.splits[i].timelineId).name + ']';
		}

		sOut += '</td>';
	}

	sOut += '</tr>';
	sOut += '</table>';

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
	$('#tskColor').val(objT.color);
	$('#tskColor').css('background-color', '#' + $('#tskColor').val());

	$('#tskAssigned').val(objT.assigned);
	$('#tskClosed').val(objT.closed);

	$('#frmAddTask').slideDown();
	$('#tskName').focus();

	$("#btnAddTask").button("option", "disabled", false);

}

function devideSplit(splitId,duration){
	$("#task-divition").dialog("open");
	$('#spnCurrentTime').html(duration);
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
		buttons : [ {
			text : "Delete",
			click : function() {

				$("#task-confirm-deletion").dialog({
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
							$('input:checkbox[name=taskIds]:checked').each(function() {
								deletes.push($(this).attr('value'));
							});

							deleteTask(deletes);

						}
					}
				});

			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});

	$("#task-divition").dialog({
		width : '300px',
		autoOpen : false,
		modal : true,
		buttons : [ {
			text : "Divide",
			click : function() {

				var newSplitDuration = $('#newSplitDuration').val();

				var oldSplitDuration = eval($('#spnCurrentTime').html());

				if(newSplitDuration >= oldSplitDuration){
					alert('New division has to be smaller than the original division.');
					return false;
				}


				// CONTINUE HERE, SAVE A NEW DIVISION
				$.ajax({
					type : "POST",
					url : "http://planner/www/newSplit.php",
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

				});
			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
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
								return '<a href="javascript:;" onclick="editTask(' + obj.aData.id + ')">' + obj.aData.name + '</a>';
							}
						},
						{
							"mDataProp" : null,
							"sTitle" : "Duration",
							"sClass" : "center",
							"bSortable" : true,
							"fnRender" : function(obj) {

								var residual = obj.aData.duration;
								var iWeeks = 0;
								var iDays = 0;
								var iHours = 0;

								while (residual > 0) {
									if (residual > 40) {
										iWeeks++;
										residual -= 40;
										continue;
									}
									if (residual > 8) {
										iDays++;
										residual -= 8;
										continue;
									}
									iHours = residual;
									residual = 0;
								}

								return ((iWeeks > 0) ? iWeeks + 'w' : '') + ' ' + ((iDays > 0) ? iDays + 'd' : '') + ' '
										+ ((iHours > 0) ? iHours + 'h' : '') + ' ( ' + obj.aData.duration + 'h )';
							}
						},
						{
							"mDataProp" : null,
							"sTitle" : "Color",
							"sClass" : "center",
							"bSortable" : false,
							"fnRender" : function(obj) {
								return '<a href="javascript:;" style="background-color:#' + obj.aData.color
										+ '; text-decoration:none;" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>';
							}
						}, {
							"mDataProp" : null,
							"sTitle" : "",
							"sClass" : "center",
							"bSortable" : false,
							"fnRender" : function(obj) {
								return '<input type="checkbox" value="' + obj.aData.id + '" name="taskIds" />';
							}
						} ]
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

		$('#tskColor').css('background-color', '#' + $('#tskColor').val());

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