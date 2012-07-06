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

var isEditingDeveloper = 0;

function editDeveloper(developerId) {
	isEditingDeveloper = developerId;

	var objD = getTimelineById(isEditingDeveloper);
	$('#devName').val(objD.name);
	$('#devTeam').val(objD.team);

	$('#frmAddDeveloper').slideDown();
	$('#devName').focus();

	$("#btnAddDeveloper").button("option", "disabled", false);

}

function saveDeveloper() {

	strDevs = JSON.stringify(timeline);

	$.ajax({
		type : "POST",
		url : "http://planner/www/saveTimeline.php",
		data : {
			devId : isEditingDeveloper,
			name : $.trim($('#devName').val()),
			teamId : $.trim($('#devTeam').val())
		}
	}).done(function(msg) {

		var answer = JSON.parse(msg);

		console.log("answer: " + answer);

		if (answer.result == 'TRUE') {

			if (isEditingDeveloper == 0) {
				notice('msgError', 'Created.', true, function() {
					$('#devName').val('');
					$('#frmAddDeveloper').slideUp();

					timeline.push(answer.package);

					stringTimelines = JSON.stringify(timeline);
					localStorage.setItem('backTimelines', stringTimelines);
					timeline = JSON.parse(localStorage.getItem('backTimelines'));

					oDevTable.fnClearTable(0);
					oDevTable.fnAddData(timeline);
					oDevTable.fnDraw();
				});
			} else {
				notice('msgError', 'Saved.', true, function() {

					var objD = getTimelineById(isEditingDeveloper);
					objD.name = $('#devName').val();
					objD.team = $('#devTeam').val();

					stringTimelines = JSON.stringify(timeline);
					localStorage.setItem('backTimelines', stringTimelines);
					timeline = JSON.parse(localStorage.getItem('backTimelines'));

					oDevTable.fnClearTable(0);
					oDevTable.fnAddData(timeline);
					oDevTable.fnDraw();

					$('#devName').val('');
					$('#frmAddDeveloper').slideUp();

					isEditingDeveloper = 0;

					return true;
				});
			}

		} else {
			$("#btnAddDeveloper").button("option", "disabled", false);
			error('msgError', 'Error trying to save.');
		}
	}).fail(function(){
		notice('msgError', 'Couldn\'t connect with server.', true);
	});
}

function deleteDeveloper(devId) {

	if(devId instanceof Array){
	}else{
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
				var jsonTimelinesResult = JSON.parse(resultTimelines);

				stringTimelines = JSON.stringify(jsonTimelinesResult.package.timelines);
				localStorage.setItem('backTimelines', stringTimelines);
				timeline = JSON.parse(localStorage.getItem('backTimelines'));

				oDevTable.fnClearTable(0);
				oDevTable.fnAddData(timeline);
				oDevTable.fnDraw();

				$('#devName').val('');
				$('#frmAddDeveloper').slideUp();

				notice('msgError', 'Removed.', true);
			});

		} else {
			error('msgError', 'Error trying to remove.');
		}
	}).fail(function(){
		notice('msgError', 'Couldn\'t connect with server.', true);
	});
}

function initDevelopersList() {

	$("#developersList").dialog({
		width : '70%',
		autoOpen : false,
		modal : true,
		buttons : [ {
			text : "Delete",
			click : function() {
				var deletes = new Array();
				$('input:checkbox[name=developerIds]:checked').each(function() {
					deletes.push($(this).attr('value'));
				});

				deleteDeveloper(deletes);

				console.log(deletes);
			}
		},{
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
			"bSortable" : true
		}, {
			"mDataProp" : null,
			"sTitle" : "Name",
			"sClass" : "left",
			"bSortable" : true,
			"fnRender" : function(obj) {
				return '<a href="javascript:;" onclick="editDeveloper(' + obj.aData.id + ')">' + obj.aData.name + '</a>';
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
				return '<input type="checkbox" value="' + obj.aData.id + '" name="developerIds" />';
			}
		}]
	});

	$('#tblDevelopersList tbody tr td img.btnDevOpenTbl').live('click', function() {

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

	$('#tblDevelopersList tbody tr td img.btnDevRemoveTbl').live('click', function() {

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
						deleteDeveloper(aData.id);
					}
				}
			});
		}

	});


		// CONTINUE HERE!!
	$('#tblDevelopersList tbody tr td img.btnDevEditTbl').live('click', function() {

		var aData = oDevTable.fnGetData(this.parentNode.parentNode); // get
		// datarow
		if (null != aData) { // null if we clicked on title row
			console.log("edit: " + aData.id);
		}
	});

	$('#btnOpenDeveloperForm').button({
		icons : {
			primary : "ui-icon-plus"
		}
	}).click(function() {
		$('#frmAddDeveloper').slideDown();
		$('#devName').val('');
		$('#devTeam').val('');
		$('#devName').focus();

		$("#btnAddDeveloper").button("option", "disabled", false);
	});

	$('#btnAddDeveloper').button({
		icons : {
			primary : "ui-icon-disk"
		}
	}).click(function() {

		if ($('#devName').val() == '') {
			alert("Please provide a valid name.");
			return false;
		}

		$("#btnAddDeveloper").button("option", "disabled", true);

		saveDeveloper();

	});
};