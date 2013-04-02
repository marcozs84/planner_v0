chrome.extension.onRequest.addListener(function(request, sender) {
	console.log(request.redirect);
	chrome.tabs.update(sender.tab.id, {
		url : request.redirect
	});
});

window['backTasks'] = '';

window['detachWindow'] = function(url) {
	console.log("detaching" + url);
	var detachedPos = {
		top : 100,
		left : 100,
		width : 800,
		height : 600 + 20
	};
	window.open(chrome.extension.getURL(url + '?detached'), 'WebWorkPlan', 'left=' + detachedPos.left + ',top=' + (detachedPos.top - 22) + // Magic
	// 22...
	',width=' + detachedPos.width + ',height=' + detachedPos.height + 'location=no,menubar=no,resizable=yes,status=no,titlebar=yes,toolbar=no');
};

function notice(obj, message, autoclose, callback) {
	obj = $('#' + obj);
	obj.removeClass();
	obj.css('display', 'none');
	obj.css('margin', '4px');
	obj.css('padding', '4px');
	obj.hide();
	obj.addClass('ui-state-highlight ui-corner-all');
	obj.html('<p><span class="ui-icon ui-icon-info" style="float: left; margin-right:3px;"></span>' + message + '</p>');

	if (autoclose == true) {
		obj.slideDown();
		setTimeout(function() {
			obj.slideUp();
			if (callback) {
				callback();
			}
		}, 3000);

	} else {
		obj.slideDown();
		if (callback) {
			callback();
		}
	}
};

window['notice'] = notice;

function error(obj, message, autoclose, callback) {
	obj = $('#' + obj);
	obj.removeClass();
	obj.css('display', 'none');
	obj.css('margin', '4px');
	obj.css('padding', '4px');
	obj.addClass('ui-state-error ui-corner-all');
	obj.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right:3px;"></span>' + message + '</p>');

	if (autoclose == true) {
		obj.slideDown();
		setTimeout(function() {
			obj.slideUp();
			if (callback) {
				callback();
			}
		}, 4000);

	} else {
		obj.slideDown();
		if (callback) {
			callback();
		}
	}
};
window['error'] = error;

function findAndRemove(array, property, value) {
	$.each(array, function(index, result) {
		try {
			if (result[property] == value) {
				// Remove from array
				array.splice(index, 1);
			}
		} catch (err) {
			// error('msgError', err, true);
			return false;
		}
	});
}

/**
 * Samples
 * 1)
 * var today = new Date();
 * var weekno = today.getWeek();
 *
 * 2)
 * var jul07 = new Date(2007,6,1);
 * var weekno = jul07.getWeek();
 *
 * Months starts at 0 -> January
 *
 * @returns
 */
Date.prototype.getWeek = function() {
    var determinedate = new Date();
    determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
    var D = determinedate.getDay();
    if(D == 0) D = 7;
    determinedate.setDate(determinedate.getDate() + (4 - D));
    var YN = determinedate.getFullYear();
    var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
    var WN = 1 + Math.floor(ZBDoCY / 7);
    return WN;
};

function getDayNameByIndex(index,fullShort){
	var days = new Array();
	days[0] = "Sun";
	days[1] = "Mon";
	days[2] = "Tue";
	days[3] = "Wed";
	days[4] = "Thu";
	days[5] = "Fri";
	days[6] = "Sat";

	return days[index];
}

function getMonthNameByIndex(index,fullShort){
	var days = new Array();
	days[0] = "Jan";
	days[1] = "Feb";
	days[2] = "Mar";
	days[3] = "Apr";
	days[4] = "May";
	days[5] = "Jun";
	days[6] = "Jul";
	days[7] = "Aug";
	days[8] = "Sep";
	days[9] = "Oct";
	days[10] = "Nov";
	days[11] = "Dic";

	return days[index];
}

/**
 * Transforms form a text into a JS Date Obj.
 * @param str Regular date dd/mm/yyyy
 * @returns {Date}
 */
function strToDate(str){
	var n = str.split(".");
	var nDate = new Date(n[2],n[1]-1,n[0]);
	return nDate;
}

Date.prototype.addDays = function (dias){
	var fecha1 = new Date(2011, 1,20);
	var fecha2 = new Date(2011, 1,21);
	var diferencia = fecha2.getTime() - fecha1.getTime();
	var luego = new Date();
	luego.setTime( this.getTime() + (dias * diferencia )  );
	return luego;
}