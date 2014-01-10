var oDevTable;

function requestSorting($splitId, $sortDirection){
	$.ajax({
		type : "POST",
		url : "http://planner/www/setSorting.php",
		data : {
			splitId : $splitId,
			sortDirection : $sortDirection
		}
	}).done(function(msg) {

		try {
			var answer = JSON.parse(msg);
		} catch (error) {
			console.log(msg + ' ' + error);
			return false;
		}

		console.log("answer Sorting Split Down: ");
		console.log(answer);

		if (answer.result == 'TRUE') {

//			updateTimelines();

			stringTimelines = JSON.stringify(answer.package.timelines);
			localStorage.setItem('backTimelines', stringTimelines);
			timeline = JSON.parse(localStorage.getItem('backTimelines'));

			oDevTable.fnClearTable(0);
			oDevTable.fnAddData(timeline);
			oDevTable.fnDraw();

			updateDevelopersLinks();


//			notice('msgErrorDevelopers', 'Saved.', true);

		} else {
			notice('msgErrorDevelopers', 'An error occured while trying to sort the task down.', true);
		}
	}).fail(function() {
		notice('msgErrorProjectAdd', 'Couldn\'t connect with server.', true);
	});
}

function renderSortingButtons(aDataId) {

//	$( "a[class=sortingButtonDown]" ).css({"font-weight":"normal", "color":"#ffffff" }).click(function( event ) {
	$( "a[class=sortingButtonDown]" ).button({
		icons : {
			primary : "ui-icon-triangle-1-s"
		},
		text: false
	}).click(function( event ) {
		event.preventDefault();
		console.log("Start sorting");
        console.log("SplitId: " + $(this).attr('rel'));
		requestSorting($(this).attr('rel'), 'down');

	});

//	$( "a[class=sortingButtonUp]" ).css({"font-weight":"normal", "color":"#ffffff" }).click(function( event ) {
	$( "a[class=sortingButtonUp]" ).button({
		icons : {
			primary : "ui-icon-triangle-1-n"
		},
		text: false
	}).click(function( event ) {
        event.preventDefault();
        console.log("Start sorting");
        console.log("SplitId: " + $(this).attr('rel'));
        requestSorting($(this).attr('rel'), 'up');
    });

}

/**
 * Formatting method for row details
 */
function developerDetails(nTr) {
	var aData = oDevTable.fnGetData(nTr);

	var sOut = '';
	sOut += '<table class="ui-widget" cellpadding="5" cellspacing="0" border="0" style="/*padding-left:50px;*/ width:100%; margin:5px;">';
	sOut += '<thead class="ui-widget-header">';
	sOut += '<tr>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Tasks</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Duration</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Finished</th>';
//	sOut += '<th style="width:20px; padding:0px; text-align:center;">Start Date</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">Sorting</th>';
	sOut += '<th style="width:20px; padding:0px; text-align:center;">SortingVal</th>';
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

		if(i == 0){
			sOut += '<td style="text-align:center; width:50px;">';
			sOut += '<a href="#" class="sortingButtonDown" rel="'+ aData.tasks[i].id +'">Down</a>';
			sOut += '</td>';
		} else if (i == aData.tasks.length -1) {
			sOut += '<td style="text-align:center; width:50px;">';
			sOut += '<a href="#" class="sortingButtonUp" rel="'+ aData.tasks[i].id +'">Up</a>';
			sOut += '</td>';
		} else {
			sOut += '<td style="text-align:center; width:50px;">';
			sOut += '<a href="#" class="sortingButtonUp" rel="'+ aData.tasks[i].id +'">Up</a> - <a href="#" class="sortingButtonDown" rel="'+ aData.tasks[i].id +'">Down</a>';
			sOut += '</td>';
		}

		sOut += '<td style="text-align:center; ">';
		sOut += aData.tasks[i].sorting;
		sOut += '</td>';


//		sOut += '<td style="text-align:center; ">';
//		sOut += aData.tasks[i].startDate;
//		sOut += '</td>';
		sOut += '</tr>';
	}
	sOut += '</tbody>';
	sOut += '</table>';
	sOut += '<script>renderSortingButtons(' + aData.id + ');</script>';

	return sOut;
}

function updateDevelopersLinks(){


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

	return false;
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