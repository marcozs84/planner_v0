var oTable;

/* Formating function for row details */
function fnFormatDetails ( nTr )
{
    var aData = oTable.fnGetData( nTr );
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    sOut += '<tr><td>Rendering engine:</td><td>'+aData[2]+' '+aData[5]+'</td></tr>';
    sOut += '<tr><td>Link to source:</td><td>Could provide a link here</td></tr>';
    sOut += '<tr><td>Extra info:</td><td>And any further details here (images etc)</td></tr>';
    sOut += '</table>';

    return sOut;
}


$(function() {

	$("#taskList").dialog({
		width	:	'70%',
		autoOpen : false,
		modal : true,
		buttons : [
				{
					text : "Create an account",
					click : function() {}
				}, {
					text : "Cancel",
					click : function() {
						$(this).dialog("close");
					}
				}
		],
	});

});

$(document).ready(function() {
    oTable = $('#tblTaskList').dataTable( {
        "bProcessing": true,
        "bServerSide": false,
//        "sAjaxSource": "scripts/details_col.php",
        "aoColumns": [
            { "sClass": "center", "bSortable": false },
            null,
            null
        ],
        "aaSorting": [[1, 'asc']]
    } );

    $('#tblTaskList tbody td img').live( 'click', function () {
        var nTr = $(this).parents('tr')[0];
        if ( oTable.fnIsOpen(nTr) )
        {
            /* This row is already open - close it */
            //this.src = "../examples_support/details_open.png";
            oTable.fnClose( nTr );
        }
        else
        {
            /* Open this row */
            //this.src = "../examples_support/details_close.png";
            oTable.fnOpen( nTr, fnFormatDetails(nTr), 'details' );
        }
    } );
} );
