/**
 * Javascript for PopUp window in case a fixed task wasn't able to fit in his
 * old date cause a previous fixed task has grown in its original place.
 */

// $(document).ready(function() {
//
// });
$(function() {
	// a workaround for a flaw in the demo system
	// (http://dev.jqueryui.com/ticket/4375), ignore!
	$("#dialog:ui-dialog").dialog("destroy");

	$("#newdateFTask").datepicker({
		currentText : 'Now'
	});

	var name = $("#name"), email = $("#email"), password = $("#password"), allFields = $(
			[]).add(name).add(email).add(password), tips = $(".validateTips");

	function updateTips(t) {
		tips.text(t).addClass("ui-state-highlight");
		setTimeout(function() {
			tips.removeClass("ui-state-highlight", 1500);
		}, 500);
	}

	function checkLength(o, n, min, max) {
		if (o.val().length > max || o.val().length < min) {
			o.addClass("ui-state-error");
			updateTips("Length of " + n + " must be between " + min + " and "
					+ max + ".");
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp(o, regexp, n) {
		if (!(regexp.test(o.val()))) {
			o.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}

//	$("#moveFTask").dialog({
//		autoOpen : false,
//		height : 300,
//		width : 350,
//		modal : true,
//		buttons : [ {
//			text : "Create an account",
//			click : function() {
//				
//				alert($(this).data('link').id);
//				
//			}
//		}, {
//			text : "Cancel",
//			click : function() {
//				$(this).dialog("close");
//			}
//		} ],
//		close : function() {
//			allFields.val("").removeClass("ui-state-error");
//		}
//	});
//
//	$("#openMoveFTask").button().click(function() {
//		$("#moveFTask").data('link',{"id":123} ).dialog("open");
//	});
});
