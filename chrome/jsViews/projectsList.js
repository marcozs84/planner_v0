var oPrjTable;
var ProjectOnEdit = 0;
var ProjectResourcesSelection = new Array();

/* Formating function for row details */
function projectDetails(nTr) {
	var aData = oPrjTable.fnGetData(nTr);

	var sOut = '';
	sOut += '<strong>Description</strong><br />';
	sOut += aData.description;
	sOut += '<table class="ui-widget" cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';
	sOut += '<caption>Resources</caption>';
	sOut += '<thead class="ui-widget-header">';
	sOut += '<tr>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Name</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Initials</th>';
	sOut += '</tr>';
	sOut += '</thead>';
	sOut += '<tbody class="ui-widget-content">';
	for ( var i = 0; i < aData.timelines.length; i++) {

		sOut += '<tr>';
		sOut += '<td>';
		sOut += getProjectById(aData.timelines[i].name);
		sOut += '</td>';
		sOut += '<td>';
		sOut += aData.tasks[i].duration;
		sOut += '</td>';
		sOut += '</tr>';
	}
	sOut += '</tbody>';
	sOut += '</table>';

	sOut += '<a href="javascript:;" id="btnAddResource_' + aData.id + '">Add Resources</a>';
	// sOut += '<script>callbackRow('+ aData.id +');</script>';

	return sOut;
}

var isEditingProject = 0;

function editProject(projectId) {
	isEditingProject = projectId;

	var objD = getProjectById(isEditingProject);
	$('#prjName').val(objD.name);
	$('#prjStartDate').val(objD.startDate);
	$('#prjEndDate').val(objD.endDate);
	$('#prjDescription').val(objD.description);

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
			description : $.trim($('#prjDescription').val()),
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

		console.log("answer Saving project: ");
		console.log(answer);

		if (answer.result == 'TRUE') {

			if (isEditingProject == 0) {
				$('#prjName').val('');
				$('#prjDescription').val('');
				$('#prjStartDate').val('');
				$('#prjEndDate').val('');
				$('#frmAddProject').slideUp();

				projects.push(answer.package);

				stringProjects = JSON.stringify(projects);
				localStorage.setItem('backProjects', stringProjects);
				projects = JSON.parse(localStorage.getItem('backProjects'));

				oPrjTable.fnClearTable(0);
				oPrjTable.fnAddData(projects);
				oPrjTable.fnDraw();
				notice('msgErrorProject', 'Created.', true);

			} else {

				var objP = getProjectById(isEditingProject);
				objP.name = $('#prjName').val();
				objP.description = $('#prjDescription').val();
				objP.startDate = $('#prjStartDate').val();
				objP.endDate = $('#prjEndDate').val();

				$('#frmAddProject').slideUp();

				stringProjects = JSON.stringify(projects);
				localStorage.setItem('backProjects', stringProjects);
				projects = JSON.parse(localStorage.getItem('backProjects'));

				oPrjTable.fnClearTable(0);
				oPrjTable.fnAddData(projects);
				oPrjTable.fnDraw();

				$('#prjName').val('');
				$('#prjDescription').val('');
				$('#prjStartDate').val('');
				$('#prjEndDate').val('');
				$('#frmAddProject').slideUp();

				isEditingProject = 0;

				notice('msgErrorProject', 'Saved.', true);
			}

		} else {
			$("#btnAddProject").button("option", "disabled", false);
			error('msgErrorProject', 'Error trying to save.');
		}
	}).fail(function() {
		notice('msgErrorProject', 'Couldn\'t connect with server.', true);
	});
}

function deleteProject(prjId) {

	if (prjId instanceof Array) {
	} else {
		prjId = Array(prjId);
	}

	var strPrjs = "[" + prjId.join(",") + "]";

	$.ajax({
		type : "POST",
		url : "http://planner/www/removeProject.php",
		data : {
			id : strPrjs
		}
	}).done(function(msg) {
		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		if (answer.result == 'TRUE') {

			$.ajax({
				type : "POST",
				url : "http://planner/www/getProjects.php",
				data : {
					taskId : 1
				// so the request is taken as POST
				}
			}).done(function(resultProjects) {

				try {
					var jsonProjectsResult = JSON.parse(resultProjects);
				} catch (error) {
					error('msgErrorProject', error);
					return false;
				}

				if (jsonProjectsResult.result == 'FALSE') {
					error('msgErrorProject', jsonProjectsResult.message);
					return false;
				}

				stringProjects = JSON.stringify(jsonProjectsResult.package.projects);
				localStorage.setItem('backProjects', stringProjects);
				projects = JSON.parse(localStorage.getItem('backProjects'));

				oPrjTable.fnClearTable(0);
				oPrjTable.fnAddData(projects);
				oPrjTable.fnDraw();

				$('#prjName').val('');
				$('#prjDescription').val('');
				$('#prjStartDate').val('');
				$('#prjEndDate').val('');
				$('#frmAddProject').slideUp();

				notice('msgErrorProject', 'Removed.', true);
			});

		} else {
			error('msgErrorProject', 'Error trying to remove.');
		}
	}).fail(function() {
		notice('msgErrorProject', 'Couldn\'t connect with server.', true);
	});
}

function initPrjAddFromToCalendars() {
	$("#prjStartDate").datepicker({
		defaultDate : "+1w",
		dateFormat : "d.m.yy",
		changeMonth : true,
		numberOfMonths : 3,
		onSelect : function(selectedDate) {
			$("#prjEndDate").datepicker("option", "minDate", selectedDate);
		}
	});
	$("#prjEndDate").datepicker({
		defaultDate : "+1w",
		dateFormat : "d.m.yy",
		changeMonth : true,
		numberOfMonths : 3,
		onSelect : function(selectedDate) {
			$("#prjStartDate").datepicker("option", "maxDate", selectedDate);
		}
	});
}

function initProjectsList() {

	initPrjAddFromToCalendars();

	$("#projectsList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [
				{
					text : "Delete",
					click : function() {

						$("#project-confirm-deletion").dialog("open");

					}
				}, {
					text : "Close",
					click : function() {
						$(this).dialog("close");
					}
				}
		]
	});

	$("#project-confirm-deletion").dialog({
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
				$('input:checkbox[name=projectIds]:checked').each(function() {
					deletes.push($(this).attr('value'));
				});

				deleteProject(deletes);

			}
		}
	});

	oPrjTable = $('#tblProjectsList').dataTable({
		"aaData" : projects,
		"bJQueryUI" : true,
		"sPaginationType" : "full_numbers",
		"aoColumns" : [
				{
					"mDataProp" : null,
					"sTitle" : "",
					"sClass" : "center",
					"bSortable" : false,
					"fnRender" : function(obj) {
						return '<img class="btnPrjOpenTbl" src="imgs/icon-add.png" />';
					}
				}, {
					"mDataProp" : "id",
					"sTitle" : "Id",
					"sClass" : "center",
					"bSortable" : true
				// }, {
				// "mDataProp" : "name",
				// "sTitle" : "NameHidden",
				// "sClass" : "center",
				// "bSortable" : true
				}, {
					"mDataProp" : null,
					"sTitle" : "Name",
					"sClass" : "left",
					"bSearchable" : true,
					"bSortable" : true,
					"fnRender" : function(obj) {
						return '<a href="javascript:;" onclick="editProject(' + obj.aData.id + ')">' + obj.aData.name + '</a>';
					}
				}, {
					"mDataProp" : "startDate",
					"sTitle" : "Start Date",
					"sClass" : "center",
					"bSortable" : false
				}, {
					"mDataProp" : "endDate",
					"sTitle" : "End Date",
					"sClass" : "center",
					"bSortable" : false
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

	$('#tblProjectsList tbody tr td img.btnPrjOpenTbl').live('click', function() {

		var nTr = $(this).parents('tr')[0];
		if (oPrjTable.fnIsOpen(nTr)) {
			/* This row is already open - close it */
			// this.src = "../examples_support/details_open.png";
			oPrjTable.fnClose(nTr);
		} else {
			/* Open this row */
			// this.src = "../examples_support/details_close.png";
			oPrjTable.fnOpen(nTr, projectDetails(nTr), 'details');

			var aData = oPrjTable.fnGetData(nTr);
			$('#btnAddResource_' + aData.id).button({
				icons : {
					primary : "ui-icon-plus"
				},
				btnProjectId : aData.id
			}).click(function() {
				console.log($('#btnAddResource_' + aData.id).button("option", "btnProjectId"));
				// $("#projectAddResource").dialog("open");
				ProjectOnEdit = $('#btnAddResource_' + aData.id).button("option", "btnProjectId");
				ProjectResourcesSelection = new Array();

				$("#resourcesList").dialog("open");

				$('#prjRscName').selectmenu();

			});
		}
	});

	$('#tblProjectsList tbody tr td img.btnPrjRemoveTbl').live('click', function() {

		var aData = oPrjTable.fnGetData(this.parentNode.parentNode); // get
		// datarow
		if (null != aData) { // null if we clicked on title row
			console.log("remove: " + aData.id);
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
						deleteProject(aData.id);
					}
				}
			});
		}

	});

	$('#tblProjectsList tbody tr td img.btnPrjEditTbl').live('click', function() {

		var aData = oPrjTable.fnGetData(this.parentNode.parentNode); // get
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
		$('#prjName').val('');
		$('#prjDescription').val('');
		$('#prjStartDate').val('');
		$('#prjEndDate').val('');
		$('#prjName').focus();

		$("#btnAddProject").button("option", "disabled", false);
	});

	$('#btnAddProject').button({
		icons : {
			primary : "ui-icon-disk"
		}
	}).click(function() {

		// console.log($( "#prjStartDate" ).datepicker( "option", "dateFormat"
		// ));
		// console.log($( "#prjEndDate" ).datepicker( "option", "dateFormat" ));
		// console.log($( "#prjStartDate" ).val());
		// console.log($( "#prjEndDate" ).val());

		// return false;

		if ($('#prjName').val() == '') {
			alert("Please provide a valid name.");
			return false;
		}

		if ($('#prjStartDate').val() == '') {
			alert("Please provide a valid name.");
			return false;
		}

		$("#btnAddProject").button("option", "disabled", true);

		saveProject();

	});

	$('#btnAddProjectCancel').button().click(function() {

		$('#prjName').val('');
		$('#prjDescription').val('');
		$('#prjStartDate').val('');
		$('#prjEndDate').val('');
		$('#frmAddProject').slideUp();

	});

};