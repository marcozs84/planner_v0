var oDevTable;

/* Formating function for row details */
function developerDetails(nTr) {
	var aData = oDevTable.fnGetData(nTr);

	var sOut = '';
	sOut += '<table cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%;">';
	sOut += '<tr>';
	sOut += '<td style="width:20px; padding:0px; text-align:center;">Tasks</td>';
	sOut += '<td style="width:20px; padding:0px; text-align:center;">Duration</td>';
	sOut += '<td style="width:20px; padding:0px; text-align:center;">Finished</td>';
	sOut += '<td style="width:20px; padding:0px; text-align:center;">Start Date</td>';
	sOut += '</tr>';
	for ( var i = 0; i < aData.tasks.length; i++) {

		sOut += '<tr>';
		sOut += '<td style="width:20px; padding:0px; text-align:left; vertical-align:middle; border-bottom:1px solid #A19B9E;">';
		sOut += getTaskName(aData.tasks[i].parentId);
		sOut += '</td>';
		sOut += '<td style="width:20px; padding:0px; text-align:center; vertical-align:middle; border-bottom:1px solid #A19B9E;">';
		sOut += aData.tasks[i].duration;
		sOut += '</td>';
		sOut += '<td style="width:20px; padding:0px; text-align:center; vertical-align:middle; border-bottom:1px solid #A19B9E;">';
		sOut += aData.tasks[i].closed;
		sOut += '</td>';
		sOut += '<td style="width:20px; padding:0px; text-align:center; vertical-align:middle; border-bottom:1px solid #A19B9E;">';
		sOut += aData.tasks[i].startDate;
		sOut += '</td>';
		sOut += '</tr>';
	}

	sOut += '</table>';

	return sOut;
}

function saveDeveloper() {

	strDevs = JSON.stringify(timeline);

	$.ajax({
		type : "POST",
		url : "http://planner/www/saveTimeline.php",
		data : {
			name : $.trim($('#devName').val()),
			teamId : $.trim($('#devTeam').val())
		}
	}).done(function(msg) {
		var answer = JSON.parse(msg);

		if(answer.result == 'TRUE'){

			notice('msgError','A new developer was created.',true,function(){
				$('#devName').val('');
				$('#frmAddDeveloper').slideUp();

				timeline.push(answer.package);

				oDevTable.fnClearTable(0);
				oDevTable.fnAddData(timeline);
				oDevTable.fnDraw();
				return true;
			});
		}else{
			chrome.extension.getBackgroundPage().error('msgError','An error has ocurred trying to save the Developer.');
		}
	});
}

function initDevelopersList(){

	$("#developersList").dialog({
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
		]
	});

//$(document).ready(function() {
	console.log(timeline);
	oDevTable = $('#tblDevelopersList').dataTable({
		"aaData" : timeline,
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"aoColumns" : [
				{
					"mDataProp" : null,
					"sTitle" : "",
					"sClass" : "center",
					"bSortable" : false,
					"fnRender" : function(obj) {
						return '<img src="imgs/details_open.png" />';
					}
				},{
					"mDataProp" : null,
					"sTitle" : "Actions",
					"sClass" : "center",
					"bSortable" : false,
					"fnRender" : function(obj) {
						return '<a href="javascript:;" class="btnTableIn">Delete</a>';
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
					"mDataProp" : "team",
					"sTitle" : "Team",
					"bSortable" : true
				}
		]
	});

	$('#tblDevelopersList tbody td img').live('click', function() {
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

	$('#tblDevelopersList tbody td a.btnTableIn').button({icons:{primary: "ui-icon-minusthick"},text: false}).click(function(){

//		CONTINUE HERE!!
//		$( "#timeline-confirm-deletion" ).dialog({
//			resizable: false,
//			height:140,
//			modal: true,
//			buttons: {
//				"Delete all items": function() {
//					$( this ).dialog( "close" );
//				},
//				Cancel: function() {
//					$( this ).dialog( "close" );
//				}
//			}
//		});
	});
//	live('click', function() {
//		var nTr = $(this).parents('tr')[0];
//		if (oDevTable.fnIsOpen(nTr)) {
//			/* This row is already open - close it */
//			// this.src = "../examples_support/details_open.png";
//			oDevTable.fnClose(nTr);
//		} else {
//			/* Open this row */
//			// this.src = "../examples_support/details_close.png";
//			oDevTable.fnOpen(nTr, developerDetails(nTr), 'details');
//		}
//	});

	$('#btnOpenDeveloperForm').button({icons:{primary: "ui-icon-plusthick"}}).click(function() {
		// if (!$('#frmAddDeveloper').is(':visible')) {
		// $('#devName').val('');
		//		}

		$('#frmAddDeveloper').slideDown();
		$('#devName').focus();

	});
	$('#btnAddDeveloper').button().click(function() {

		if ($('#devName').val() == '') {
			alert("Please provide a valid name.");
			return false;
		}

//		timelineId++;
//
//		var newElement = {
//			"id" : timelineId,
//			"name" : $('#devName').val(),
//			"team" : $('#devTeam').val(),
//			"days" : new Array(),
//			"tasks" : new Array()
//		};
//
//		timeline.push(newElement);

		saveDeveloper();

	});
};