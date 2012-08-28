var oTable;

/* Formating function for row details */
function taskDetails(nTr) {
	var posRow = oTable.fnGetPosition(nTr);
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
		sOut += '<a href="javascript:;" onclick="devideSplit('+ aData.splits[i].id +','+ aData.splits[i].duration +','+ aData.splits[i].parentId +','+ posRow +');" style="text-width:normal;">Devide</a>';
		sOut += '</td>';
	}

	sOut += '</tr>';
	sOut += '<tr>';

	for ( var i = 0; i < aData.splits.length; i++) {
		wPercent = ((aData.splits[i].duration * 100) / aData.duration);
		sOut += '<td style="width:' + Math.floor(wPercent) + '%; text-align:center; height:15px;">';

		sOut += '<span style="color:#fff; font-weight:normal;">' + aData.splits[i].duration + '</span><br />';

		if (aData.splits[i].timelineId == 0) {
			sOut += ' [<a href="javascript:;" onclick="assignTask(' + aData.splits[i].id + ','+ posRow +');" style="color:#fff; font-weight:normal;">Assign</a>]';
		} else {
			var tmlne = getTimelineById(aData.splits[i].timelineId);
			console.log(tmlne);
			var rsce = getResourceById(tmlne.resourceId);
			console.log(rsce);
			if(rsce.initials == ''){
				sOut += ' [' + rsce.name + ']';
			}else{
				sOut += ' [' + rsce.initials + ']';
			}

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

var newDivRowObj = 0;
var newDivParentTaskId = 0;
var newDivOldSplitId = 0;
var newDivOldSplitDuration = 0;
var newDivNewSplitid = 0;
var newDivNewSplitDuration = 0;


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

function devideSplit(splitId,duration,parentId,rowPos){
	$("#task-divition").dialog("open");
	$('#spnCurrentTime').html(duration);

	$('#newSplitDuration').val(0);
	$('#newSplitDuration').focus();
	$('#newSplitDuration').select();

	$('input[name="splitbehavior"]').attr('checked', false);
	$('input[name="splitbehavior"]')[0].checked = true;

	newDivRowObj = rowPos;
	newDivOldSplitId = splitId;
	newDivOldSplitDuration = duration;
	newDivParentTaskId = parentId;
}

var toAssignSplitId = 0;
var toAssignSplitObj = 0;
var toAssignSplitRowPos = 0;

function assignTask(splitId,rowPos){
	toAssignSplitId = splitId;
//	console.log(splitObj);
//	toAssignSplitObj = splitObj;
	toAssignSplitRowPos = rowPos;

	$("#tskDevList").empty();

	if(localStorage.getItem('selectedProject') == 0 || localStorage.getItem('selectedProject') == ''){
		alert("Please select a Project first.");
		return false;
	};

	var prjId = localStorage.getItem('selectedProject');

	var prj = getProjectById(prjId);

	console.log(prj);

	$.each(prj.timelines, function() {
		$("#tskDevList").append($("<option/>").attr("value", this.id).text(this.name));
	});

	$('#tskDevList').selectmenu();

	$("#task-assignation").dialog("open");
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

		try{
			var answer = JSON.parse(msg);
		}catch(error){
			console.log(msg + ' ' + error);
			return false;
		}

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
		try{
			var answer = JSON.parse(msg);
		}catch(error){
			console.log(msg + ' ' + error);
			return false;
		}

		if (answer.result == 'TRUE') {

			$.ajax({
				type : "POST",
				url : "http://planner/www/getTasks.php",
				data : {
					taskId : 1		//so the request is taken as POST
				}
			}).done(function(resultTasks) {
				try{
					var jsonTasksResult = JSON.parse(resultTasks);
				}catch(error){
					console.log(resultTasks + ' ' + error);
					return false;
				}

				if(jsonTasksResult.result == 'TRUE'){
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
				}else{
					error('msgErrorTask', jsonTasksResult.message);
				}
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

				$("#task-confirm-deletion").dialog("open");

			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});

	$("#task-confirm-deletion").dialog({
		resizable : false,
		autoOpen : false,
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

	$("#task-divition").dialog({
		width : '410px',
		autoOpen : false,
		modal : true,
		buttons : [ {
			text : "Divide",
			click : function() {

				newDivNewSplitDuration = $.trim($('#newSplitDuration').val());

				if(newDivNewSplitDuration >= newDivOldSplitDuration){
					alert('New division has to be smaller than the original division.');
					return false;
				}

				if(newDivNewSplitDuration == 0){
					alert('New division has to be greater than 0.');
					return false;
				}

				if (newDivNewSplitDuration == '' || isNaN(newDivNewSplitDuration)) {
					alert("Please provide a valid duration value. Only numbers are allowed.");
					$('#newSplitDuration').focus();
					$('#newSplitDuration').select();
					return false;
				}

				var thisDialTask = this;

				$.ajax({
					type : "POST",
					url : "http://planner/www/newSplitDivision.php",
					data : {
						oldId : newDivOldSplitId,
						parentId : newDivParentTaskId,
						behavior : $("input[name='splitbehavior']:checked").val(),
						duration : newDivNewSplitDuration
					}
				}).done(function(msg) {

					try{
						var jsonTasksResult = JSON.parse(msg);
					}catch(error){
						console.log(msg + ' ' + error);
						return false;
					}

					if(jsonTasksResult.package.result == 'FALSE'){
						error('msgErrorTask', jsonTasksResult.package.message);
						return false;
					}

					stringTasks = JSON.stringify(jsonTasksResult.package.tasks);
					localStorage.setItem('backTasks', stringTasks);
					tasks = JSON.parse(localStorage.getItem('backTasks'));

					oTable.fnClearTable(0);
					oTable.fnAddData(tasks);
					oTable.fnDraw();

//					$(this).parents("TR").fadeOut("slow", function () {
//						var pos = oTable.fnGetPosition(this);
//						oTable.fnDeleteRow(pos);
//					});

					var nNodes = oTable.fnGetNodes(newDivRowObj);

					if (oTable.fnIsOpen(nNodes)) {
						oTable.fnClose(nNodes);
						oTable.fnOpen(nNodes, taskDetails(nNodes), 'details');
					} else {
						oTable.fnOpen(nNodes, taskDetails(nNodes), 'details');
					}

					notice('msgErrorTask', 'New division created.', true);

					newDivRowObj = 0;
					newDivParentTaskId = 0;
					newDivOldSplitId = 0;
					newDivOldSplitDuration = 0;
					newDivNewSplitid = 0;
					newDivNewSplitDuration = 0;

					$(thisDialTask).dialog("close");
				});
			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});

	$("#task-assignation").dialog({
		width : '410px',
		autoOpen : false,
		modal : true,
		buttons : [ {
			text : "Assign",
			click : function() {

				var thisDialTask = this;

//				var posRow = oTable.fnGetPosition(nTr);
//				var aData = oTable.fnGetData(nTr);

				var nNodes = oTable.fnGetNodes(toAssignSplitRowPos);
				var aObj = oTable.fnGetData(nNodes);
				var aData = null;

				for(var j = 0 ; j < aObj.splits.length ; j++){
					if(aObj.splits[j].id == toAssignSplitId){
						aData = aObj.splits[j];
					}
				}

				console.log(aData);

				$.ajax({
					type : "POST",
					url : "http://planner/www/assignSplit.php",
					data : {
						splitId : aData.id,
						parentId : aData.parentId,
						timelineId : $('#tskDevList').val(),
						assigned : 1,
						closed : aData.closed,
						startDate : aData.startDate,
						originalDate : aData.originalDate,
						delayBeginning : aData.delayBeginning,
						delay : aData.delay,
						duration : aData.duration
					}
				}).done(function(msg) {

					try{
						var splitResult = JSON.parse(msg);
					}catch(error){
						console.log(msg + ' ' + error);
						return false;
					}

					if(splitResult.result == 'FALSE'){
						error('msgErrorTask', splitResult.message);
						$(thisDialTask).dialog("close");
						return false;
					}

					stringTasks = JSON.stringify(splitResult.package.tasks);
					localStorage.setItem('backTasks', stringTasks);
					tasks = JSON.parse(localStorage.getItem('backTasks'));

					oTable.fnClearTable(0);
					oTable.fnAddData(tasks);
					oTable.fnDraw();

					var nNodes = oTable.fnGetNodes(toAssignSplitRowPos);

					if (oTable.fnIsOpen(nNodes)) {
						oTable.fnClose(nNodes);
						oTable.fnOpen(nNodes, taskDetails(nNodes), 'details');
					} else {
						oTable.fnOpen(nNodes, taskDetails(nNodes), 'details');
					}

					notice('msgErrorTask', 'Task assigned.', true);

					updateTimelines();

					toAssignSplitObj = 0;
					toAssignSplitObj = 0;

					$(thisDialTask).dialog("close");

				});

				updateTimelines();

				 toAssignSplitId = 0;
			}
		}, {
			text : "Close",
			click : function() {
				 toAssignSplitId = 0;
				$(this).dialog("close");
			}
		} ],
		open : function(){

		}
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

	$('#btnAddTaskCancel').button().click(function() {

		$('#tskName').val('');
		$('#tskDuration').val('');
		$('#tskDescription').val('');
		$('#tskColor').val('');
		$('#tskAssigned').val('0');
		$('#tskClosed').val('0');

		$('#frmAddTask').slideUp();

	});
};