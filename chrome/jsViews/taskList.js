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

$(function() {

	$("#taskList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [
			{
				text : "Close",
				click : function() {
					$(this).dialog("close");
				}
			}
		],
		close:	function(){
//			saveTasks();
		}
	});

});

function initTaskList(){
//$(document).ready(function() {
	oTable = $('#tblTaskList').dataTable({
		"aaData" : tasks,
		"bJQueryUI": true,
//		"asStripeClasses": ["odd ui-widget-content","even ui-state-default"],
		"sPaginationType": "full_numbers",
		"aoColumns" : [
				{
					"mDataProp" : null,
					"sTitle" : "",
					"sClass" : "center",
					"fnRender" : function(obj) {
						return '<img src="imgs/details_open.png" />';
					}
				}, {
					"mDataProp" : "id",
					"sTitle" : "Id",
					"bSortable" : true,
				}, {
					"mDataProp" : "name",
					"sTitle" : "Name",
					"bSortable" : false
				}, {
					"mDataProp" : "duration",
					"sTitle" : "Duration",
					"bSortable" : false
				}
		]
	});

	$('#tblTaskList tbody td img').live('click', function() {
		var nTr = $(this).parents('tr')[0];
		if (oTable.fnIsOpen(nTr)) {
			/* This row is already open - close it */
			// this.src = "../examples_support/details_open.png";
			oTable.fnClose(nTr);
		} else {
			/* Open this row */
			// this.src = "../examples_support/details_close.png";
			oTable.fnOpen(nTr, taskDetails(nTr), 'details');
		}
	});
//});
};