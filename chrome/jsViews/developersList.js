var oDevTable;

/* Formating function for row details */

function developerDetails(nTr) {
	var aData = oDevTable.fnGetData(nTr);

	var sOut = '';
	sOut += '<table class="ui-widget" cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';
	sOut += '<thead class="ui-widget-header">';
	sOut += '<tr>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Tasks</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Duration</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Finished</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Start Date</th>';
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
		sOut += '<td style="text-align:center; ">';
		sOut += aData.tasks[i].closed;
		sOut += '</td>';
		sOut += '<td style="text-align:center; ">';
		sOut += aData.tasks[i].startDate;
		sOut += '</td>';
		sOut += '</tr>';
	}
	sOut += '</tbody>';
	sOut += '</table>';

	return sOut;
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
			}

//			oDevTable.fnClearTable(0);
//			oDevTable.fnAddData(timeline);
//			oDevTable.fnDraw();
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