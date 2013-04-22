var oPrjTable;
var ProjectOnEdit = 0;
var ProjectRowPos = 0;
var ProjectRowPosTmp = 0;
var ProjectResourcesSelection = new Array();
var ProjectExistingResources = new Array();

var selectedProject = 0;

function renderButtonAddResource(aDataId) {
	$('#btnAddResource_' + aDataId).button({
		icons : {
			primary : "ui-icon-plus"
		},
		btnProjectId : aDataId,
		btnProjectRowPos : ProjectRowPosTmp
	}).click(function() {
		// console.log($('#btnAddResource_' + aData.id).button("option",
		// "btnProjectId"));
		// console.log($('#btnAddResource_' + aData.id).button("option",
		// "btnProjectRowPos"));
		// $("#projectAddResource").dialog("open");

		$('input:checkbox[name=project_' + aDataId + '_ResourceIds]').each(function() {
			ProjectExistingResources.push($(this).attr('value'));
		});

		ProjectOnEdit = $('#btnAddResource_' + aDataId).button("option", "btnProjectId");
		ProjectRowPos = $('#btnAddResource_' + aDataId).button("option", "btnProjectRowPos");

		ProjectResourcesSelection = new Array();

		$("#resourcesList").dialog("open");

		$('#prjRscName').selectmenu();

	});

	$('#btnRemResource_' + aDataId).button({
		icons : {
			primary : "ui-icon-plus"
		},
		btnProjectId : aDataId,
		btnProjectRowPos : ProjectRowPosTmp
	}).click(function() {
		var projectId = $('#btnAddResource_' + aDataId).button("option", "btnProjectId");
		var projectResourceIds = new Array();

		$('input:checkbox[name=project_' + projectId + '_ResourceIds]:checked').each(function() {
			projectResourceIds.push($(this).attr('value'));
		});

		ProjectOnEdit = $('#btnAddResource_' + aDataId).button("option", "btnProjectId");
		ProjectRowPos = $('#btnAddResource_' + aDataId).button("option", "btnProjectRowPos");

		deleteProjectResources(projectId, projectResourceIds);

		projectResourceIds = new Array();

	});

	ProjectRowPosTmp = 0;

	$('.tableInnerDescription tr td').css('border-bottom', '1px solid #444');
	// oPrjTable = $('.tableInnerDescription').dataTable({
	// "bJQueryUI" : true,
	// "sPaginationType" : "full_numbers"
	// });
}

/* Formating function for row details */
function projectDetails(nTr) {

	var aData = oPrjTable.fnGetData(nTr);
	ProjectRowPosTmp = oPrjTable.fnGetPosition(nTr);

	var sOut = '';
	sOut += '<br />';
	sOut += '<strong>Description</strong><br />';
	sOut += aData.description + '<br /><br />';
	sOut += '<strong>Resources</strong><br />';
	// sOut += '<table class="ui-widget" cellpadding="5" cellspacing="0"
	// border="0" style="/*padding-left:50px;*/ width:100%;">';
	sOut += '<table class="tableInnerDescription" cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';
	// sOut += '<caption>Resources</caption>';
	// sOut += '<thead class="ui-widget-header">';
	// sOut += '<tr>';
	// sOut += '<th style="width:20px; padding:0px;
	// text-align:center;">Name</th>';
	// sOut += '<th style="width:20px; padding:0px;
	// text-align:center;">Initials</th>';
	// sOut += '</tr>';
	// sOut += '</thead>';
	sOut += '<tbody class="ui-widget-content">';
	for ( var i = 0; i < aData.timelines.length; i++) {

		sOut += '<tr>';
		sOut += '<td>';
		sOut += aData.timelines[i].name;
		sOut += '</td>';
		sOut += '<td>';
		sOut += aData.timelines[i].initials;
		sOut += '</td>';
		sOut += '<td style="width:20px;">';
		sOut += '<input type="checkbox" value="' + aData.timelines[i].resourceId + '" name="project_' + aData.id + '_ResourceIds" />';
		sOut += '</td>';
		sOut += '</tr>';
	}
	sOut += '</tbody>';
	sOut += '</table>';
	sOut += '<br />';

	sOut += '<a href="javascript:;" id="btnAddResource_' + aData.id + '">Add Resources</a>';
	sOut += '<a href="javascript:;" id="btnRemResource_' + aData.id + '">Remove Resources</a>';
	sOut += '<br />';
	sOut += '<br />';
	sOut += '<script>renderButtonAddResource(' + aData.id + ');</script>';

	return sOut;
}

var isEditingProject = 0;

function editProject(event) {
	var parts = event.data.id.split("_");
	var projId = parts[parts.length - 1];
//	isEditingProject = event.data.id;
	isEditingProject = projId;

	console.log("editing project: " + projId);

	var objD = getProjectById(isEditingProject);
	$('#prjName').val(objD.name);
	$('#prjStartDate').val(objD.startDate);
	$('#prjEndDate').val(objD.endDate);
	$('#prjDescription').val(objD.description);

//	$('#frmAddProject').slideDown();
	$('#frmAddProject').dialog("open");
	$('#prjName').focus();

	$("#btnAddProject").button("option", "disabled", false);

}

function selectProject(projectId) {
	selectedProject = projectId;
	var prj = getProjectById(projectId);

	$("#calendarFrom").datepicker("option", "minDate", prj.startDate);
	$("#calendarFrom").datepicker("option", "maxDate", prj.endDate);
	$("#calendarTo").datepicker("option", "minDate", prj.startDate);
	$("#calendarTo").datepicker("option", "maxDate", prj.endDate);

	$('#calendarFrom').val(prj.startDate);
	$('#calendarTo').val(prj.endDate);

	$('#lblProjectName').html(prj.name);
	$("#projectsList").dialog("close");

	localStorage.setItem('selectedProject',selectedProject);
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
//				$('#frmAddProject').slideUp();
				$('#frmAddProject').dialog("close");

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

//				$('#frmAddProject').slideUp();
				$('#frmAddProject').dialog("close");

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
//				$('#frmAddProject').slideUp();
				$('#frmAddProject').dialog("close");

				isEditingProject = 0;

				notice('msgErrorProject', 'Saved.', true);
			}

		} else {
			$("#btnAddProject").button("option", "disabled", false);
			error('msgErrorProjectAdd', 'Error trying to save. '+ msg);
		}
	}).fail(function() {
		notice('msgErrorProjectAdd', 'Couldn\'t connect with server.', true);
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
//				$('#frmAddProject').slideUp();
				$('#frmAddProject').dialog("close");

				notice('msgErrorProject', 'Removed.', true);
			});

		} else {
			error('msgErrorProject', 'Error trying to remove.');
		}
	}).fail(function() {
		notice('msgErrorProject', 'Couldn\'t connect with server.', true);
	});
}

function deleteProjectResources(projectId, resources){
	if (resources instanceof Array) {
	} else {
		resources = Array(resources);
	}

	if(resources.length < 1){
		error('msgErrorProject', 'No resources selected.');
		return false;
	}

	var strPrjs = "[" + resources.join(",") + "]";

	$.ajax({
		type : "POST",
		url : "http://planner/www/removeProjectResource.php",
		data : {
			projectId : projectId,
			resourceIds : strPrjs
		}
	}).done(function(msg) {
		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		if (answer.result == 'TRUE') {

			ProjectOnEdit = 0;
			ProjectResourcesSelection = new Array();

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

				var nNodes = oPrjTable.fnGetNodes(ProjectRowPos);

				if (oPrjTable.fnIsOpen(nNodes)) {
					oPrjTable.fnClose(nNodes);
					oPrjTable.fnOpen(nNodes, projectDetails(nNodes), 'details');
				} else {
					oPrjTable.fnOpen(nNodes, projectDetails(nNodes), 'details');
				}

				notice('msgErrorProject', 'Resources removed succesfully.', true);
			});

		} else {
			error('msgErrorProject', 'Error trying to add resources.');
		}
	}).fail(function() {
		notice('msgErrorProject', 'Couldn\'t connect with server.', true);
	});
}

function addResourcesToProject(projectId, resources) {
	if (resources instanceof Array) {
	} else {
		resources = Array(resources);
	}

	if(resources.length < 1){
		error('msgErrorProject', 'No resources selected.');
		return false;
	}

	var strPrjs = "[" + resources.join(",") + "]";

	$.ajax({
		type : "POST",
		url : "http://planner/www/addProjectResource.php",
		data : {
			projectId : projectId,
			resourceIds : strPrjs
		}
	}).done(function(msg) {
		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		if (answer.result == 'TRUE') {

			ProjectOnEdit = 0;
			ProjectResourcesSelection = new Array();

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
//				$('#frmAddProject').slideUp();
				$('#frmAddProject').dialog("close");

				var nNodes = oPrjTable.fnGetNodes(ProjectRowPos);

				if (oPrjTable.fnIsOpen(nNodes)) {
					oPrjTable.fnClose(nNodes);
					oPrjTable.fnOpen(nNodes, projectDetails(nNodes), 'details');
				} else {
					oPrjTable.fnOpen(nNodes, projectDetails(nNodes), 'details');
				}

				notice('msgErrorProject', 'Resources added succesfully.', true);
			});

		} else {
			error('msgErrorProject', 'Error trying to add resources.');
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
		beforeShowDay: $.datepicker.noWeekends,
		onSelect : function(selectedDate) {
			$("#prjEndDate").datepicker("option", "minDate", selectedDate);
		}
	});
	$("#prjEndDate").datepicker({
		defaultDate : "+1w",
		dateFormat : "d.m.yy",
		changeMonth : true,
		numberOfMonths : 3,
		beforeShowDay: $.datepicker.noWeekends,
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
		buttons : [ {
			text : "Delete",
			click : function() {

				$("#project-confirm-deletion").dialog("open");

			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});

	$("#frmAddProject").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [ {
			text : "Save",
			click : function() {

				if ($('#prjName').val() == '') {
					alert("Please provide a valid name.");
					return false;
				}

				if ($('#prjStartDate').val() == '') {
					alert("Please provide a valid Start Date.");
					return false;
				}

				if ($('#prjEndDate').val() == '') {
					alert("Please provide a valid End Date.");
					return false;
				}

				saveProject();
			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
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
		"aoColumns" : [ {
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
//			"mDataProp" : 'name',
			"sTitle" : "Name",
			"sClass" : "left",
			"bSearchable" : true,
			"bSortable" : true,
			"fnRender" : function(obj) {
				cellId = obj.iDataColumn + '_' + obj.iDataRow + '_' + obj.aData.id;
//				console.log(obj.iDataColumn + '_' + obj.iDataRow + '_' + obj.aData.id );
//				document.getElementById(cellId).addEventListener('onclick', editProject);
//				return '<a href="javascript:;" id="'+ cellId +'" onclick="editProject(' + obj.aData.id + ')">' + obj.aData.name + '</a>';
//				this.setAttribute( 'mzIdentifier', obj.aData.id );
//				console.log(this.parent);
//				console.log($('td',this));
//				$('td',this).attr( 'prjId', obj.aData.id );
////				console.log($('tr',this.parent));
//				console.log($('td',this).attr('prjId'));
				return '<a href="#" id="prjList_'+ cellId +'">' + obj.aData.name + '</a>';
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
			"sTitle" : "Select",
			"sClass" : "left",
			"bSearchable" : false,
			"bSortable" : false,
			"fnRender" : function(obj) {
				return '<a href="javascript:;" onclick="selectProject(' + obj.aData.id + ')">Select project</a>';
			}
		}, {
			"mDataProp" : null,
			"sTitle" : "",
			"sClass" : "center",
			"bSortable" : false,
			"fnRender" : function(obj) {
				return '<input type="checkbox" value="' + obj.aData.id + '" name="projectIds" />';
			}
		} ]
	});

	oPrjTable.$('tr').each(function(){
		var nTds = $('td',this.parent);
		var nAs = $('a',this);

//		console.log($(nTds[2]).text());
//		console.log($(nTds[2]));
//		console.log($(nAs[0]).attr('id') + ' - ' + "projId: " + $('tr',this.parent).attr('prjId'));


//		var anchor =
//		document.getElementById($(nAs[0]).attr('id')).addEventListener('onclick', editProject,$(nAs[0]).attr('id'));
		$(nAs[0]).on('click',{id:$(nAs[0]).attr('id')},editProject);

//		$(nTds[2]).text('<a >' + $(nTds[2]).text() +'</a>')
	});

	$('#tblProjectsList tbody tr td img.btnPrjOpenTbl').on('click', function() {

		var nTr = $(this).parents('tr')[0];
		if (oPrjTable.fnIsOpen(nTr)) {
			/* This row is already open - close it */
			// this.src = "../examples_support/details_open.png";
			oPrjTable.fnClose(nTr);
		} else {
			/* Open this row */
			// this.src = "../examples_support/details_close.png";
			oPrjTable.fnOpen(nTr, projectDetails(nTr), 'details');
		}
	});

	$('#tblProjectsList tbody tr td img.btnPrjRemoveTbl').on('click', function() {

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

	$('#tblProjectsList tbody tr td img.btnPrjEditTbl').on('click', function() {

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
		openModal('frmAddProject');
//		$("#frmAddProject").dialog("open");
//		$('#frmAddProject').slideDown();
		$('#prjName').val('');
		$('#prjDescription').val('');
		$('#prjStartDate').val('');
		$('#prjEndDate').val('');
		$('#prjName').focus();

		$("#btnAddProject").button("option", "disabled", false);
		return false;
	});

};