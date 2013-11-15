var oRscTable;

var isEditingResource = 0;

function updateResourceLinks(){

	$('#tblResourcesList tbody tr td a.linkName').on('click', function() {
		var nTr = $(this).parents('tr')[0];
		editResource(nTr);
	});

	return false;
}

function editResource(event) {

	var aData = oRscTable.fnGetData(event);
	var resourceId = aData.id;

	console.log(resourceId);

	isEditingResource = resourceId;

	var objD = getResourceById(isEditingResource);
	console.log(objD);
	$('#rscName').val(objD.name);
	$('#rscInitials').val(objD.initials);

	$('#frmAddResource').dialog("open");
	$('#rscName').focus();

	$("#btnAddResource").button("option", "disabled", false);

}

function saveResource() {

	$.ajax({
		type : "POST",
		url : "http://planner/www/saveResource.php",
		data : {
			id : isEditingResource,
			name : $.trim($('#rscName').val()),
			initials : $.trim($('#rscInitials').val())
		}
	}).done(function(msg) {

		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		console.log("answer Saving resource: ");
		console.log(answer);

		if (answer.result == 'TRUE') {

			if (isEditingResource == 0) {
				$('#rscName').val('');
				$('#rscInitials').val('');
				$('#frmAddResource').dialog("close");

				resources.push(answer.package);

				stringResources = JSON.stringify(resources);
				localStorage.setItem('backResources', stringResources);
				resources = JSON.parse(localStorage.getItem('backResources'));

				oRscTable.fnClearTable(0);
				oRscTable.fnAddData(resources);
				oRscTable.fnDraw();

				updateResourceLinks();

				notice('msgErrorResource', 'Created.', true);

			} else {

				var objP = getResourceById(isEditingResource);
				objP.name = $('#rscName').val();
				objP.initials = $('#rscInitials').val();

				stringResources = JSON.stringify(resources);
				localStorage.setItem('backResources', stringResources);
				resources = JSON.parse(localStorage.getItem('backResources'));

				oRscTable.fnClearTable(0);
				oRscTable.fnAddData(resources);
				oRscTable.fnDraw();

				updateResourceLinks();

				$('#rscName').val('');
				$('#rscInitials').val('');
				$('#frmAddResource').dialog("close");

				isEditingResource = 0;

				notice('msgErrorResource', 'Saved.', true);
			}

		} else {
			$("#btnAddResource").button("option", "disabled", false);
			error('msgErrorResourceAdd', 'Error trying to save.');
		}
	}).fail(function() {
		$("#btnAddResource").button("option", "disabled", false);
		notice('msgErrorResource', 'Couldn\'t connect with server.', true);
	});
}

function deleteResource(rscId) {

	if (rscId instanceof Array) {
	} else {
		rscId = Array(rscId);
	}

	var strRscs = "[" + rscId.join(",") + "]";

	$.ajax({
		type : "POST",
		url : "http://planner/www/removeResource.php",
		data : {
			id : strRscs
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
				url : "http://planner/www/getResources.php",
				data : {
					taskId : 1
				// so the request is taken as POST
				}
			}).done(function(resultResources) {

				try {
					var jsonResourcesResult = JSON.parse(resultResources);
				} catch (error) {
					error('msgErrorResource', error);
					return false;
				}

				if (jsonResourcesResult.result == 'FALSE') {
					error('msgErrorResource', jsonResourcesResult.message);
					return false;
				}

				stringResources = JSON.stringify(jsonResourcesResult.package.resources);
				localStorage.setItem('backResources', stringResources);
				resources = JSON.parse(localStorage.getItem('backResources'));

				oRscTable.fnClearTable(0);
				oRscTable.fnAddData(resources);
				oRscTable.fnDraw();

				updateResourceLinks();

				$('#rscName').val('');
				$('#rscInitials').val('');
				$('#frmAddResource').slideUp();

				notice('msgErrorResource', 'Removed.', true);
			});

		} else {
			error('msgErrorResource', 'Error trying to remove.');
		}
	}).fail(function() {
		notice('msgErrorResource', 'Couldn\'t connect with server.', true);
	});
}

function initResourcesList() {

	$("#resourcesList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		close : function(event, ui){
			if(ProjectOnEdit != 0){
				ProjectOnEdit = 0;
			}
		},
		open : function(event, ui) {

			$('input:checkbox[name=resourceIds]').each(function() {
				$(this).attr('disabled', false);
				$(this).attr('checked', false);
			});

			var buttons = {};

			if(ProjectOnEdit != 0){

				$('#btnOpenResourceForm').hide();

				console.log(ProjectExistingResources);

				$('input:checkbox[name=resourceIds]').each(function() {

					var searchResult = jQuery.inArray($(this).attr('value'), ProjectExistingResources);

					if(searchResult >= 0){
						$(this).attr('disabled', true);
					}else{
						$(this).attr('disabled', false);
//						$(this).removeAttr("disabled");
					}
				});

				ProjectExistingResources = new Array();


				buttons["Select"] = function() {
					$('input:checkbox[name=resourceIds]:checked').each(function() {
						ProjectResourcesSelection.push($(this).attr('value'));
					});

					addResourcesToProject(ProjectOnEdit,ProjectResourcesSelection);

					$(this).dialog("close");

				};

			}else{

				$('#btnOpenResourceForm').show();

				buttons["Delete"] = function() {
					$("#resource-confirm-deletion").dialog("open");
				};
				buttons["Close"] = function() {
					$(this).dialog("close");
				};
			}

			$('#resourcesList').dialog("option","buttons",buttons);

		}
//		,
//		buttons : [
//				{
//					text : "Delete",
//					click : function() {
//
//						$("#resource-confirm-deletion").dialog("open");
//
//					}
//				}, {
//					text : "Close",
//					click : function() {
//						$(this).dialog("close");
//					}
//				}
//		]
	});

	$("#frmAddResource").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [ {
			text : "Save",
			click : function() {

				if ($('#rscName').val() == '') {
					alert("Please provide a valid name.");
					return false;
				}

				if ($('#rscInitials').val() == '') {
					alert("Please provide Initials for the selected resource.");
					return false;
				}

				saveResource();
			}
		}, {
			text : "Close",
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});

	$("#resource-confirm-deletion").dialog({
		resizable : false,
		autoOpen : false,
		height : "auto",
		modal : true,
		buttons : {
			Cancel : function() {
				$(this).dialog("close");
			},
			"Accept" : function() {
				$(this).dialog("close");

				var deletes = new Array();
				$('input:checkbox[name=resourceIds]:checked').each(function() {
					deletes.push($(this).attr('value'));
				});

				deleteResource(deletes);

			}
		}
	});

	oRscTable = $('#tblResourcesList').dataTable({
		"aaData" : resources,
		"bJQueryUI" : true,
		"sPaginationType" : "full_numbers",
		"aoColumns" : [
				{
					"mDataProp" : "id",
					"sTitle" : "Id",
					"sClass" : "center",
					"bSortable" : true
				}, {
					"mDataProp" : null,
					"sTitle" : "Name",
					"sClass" : "left",
					"bSearchable" : true,
					"bSortable" : true,
					"fnRender" : function(obj) {
						return '<a href="#" class="linkName">' + obj.aData.name + '</a>';
					}
				}, {
					"mDataProp" : "initials",
					"sTitle" : "Initials",
					"sClass" : "center",
					"bSortable" : false
				}, {
					"mDataProp" : null,
					"sTitle" : "",
					"sClass" : "center",
					"bSortable" : false,
					"fnRender" : function(obj) {
						return '<input type="checkbox" value="' + obj.aData.id + '" name="resourceIds" />';
					}
				}
		]
	});

	updateResourceLinks();

	$('#tblResourcesList tbody tr td img.btnRscOpenTbl').on('click', function() {
		var nTr = $(this).parents('tr')[0];
		if (oRscTable.fnIsOpen(nTr)) {
			oRscTable.fnClose(nTr);
		} else {
			oRscTable.fnOpen(nTr, resourceDetails(nTr), 'details');
		}
	});

	$('#tblResourcesList tbody tr td img.btnRscRemoveTbl').on('click', function() {

		var aData = oRscTable.fnGetData(this.parentNode.parentNode); // get
		// datarow
		if (null != aData) { // null if we clicked on title row
			console.log("remove: " + aData.id);
			$("#resource-confirm-deletion").dialog({
				resizable : false,
				height : 100,
				modal : true,
				buttons : {
					Cancel : function() {
						$(this).dialog("close");
					},
					"Accept" : function() {
						$(this).dialog("close");
						deleteResource(aData.id);
					}
				}
			});
		}

	});

	$('#btnOpenResourceForm').button({
		icons : {
			primary : "ui-icon-plus"
		}
	}).click(function() {
		openModal('frmAddResource');
		$('#rscName').val('');
		$('#rscInitials').val('');
		$('#rscName').focus();

		return false;
	});

	$('#btnAddResourceCancel').button().click(function() {

		$('#rscName').val('');
		$('#rscInitials').val('');
		$('#frmAddResource').slideUp();

	});

};
