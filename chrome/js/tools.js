chrome.extension.onRequest.addListener(function(request, sender) {
	console.log(request.redirect);
	chrome.tabs.update(sender.tab.id, {url: request.redirect});
});

window['backTasks'] = '';


window['detachWindow'] = function(url){
	console.log("detaching" + url);
	var detachedPos = {
		top: 100,
		left: 100,
		width: 800,
		height: 600 + 20
	};
	window.open(chrome.extension.getURL(url + '?detached'), 'WebWorkPlan',
			'left=' + detachedPos.left + ',top=' + (detachedPos.top - 22) + // Magic 22...
			',width=' + detachedPos.width + ',height=' + detachedPos.height +
		'location=no,menubar=no,resizable=yes,status=no,titlebar=yes,toolbar=no');
};

function notice(obj,message,autoclose,callback){
	obj = $('#'+obj);
//	obj.css('display','none');
	obj.css('padding','4px');
	obj.hide();
	obj.addClass('ui-state-highlight ui-corner-all');
	obj.html('<p><span class="ui-icon ui-icon-info" style="float: left; margin-right:3px;"></span>'+message+'</p>');

	if(autoclose == true){
		obj.slideDown();
		setTimeout(function() {
			obj.slideUp();
			if(callback){
				callback();
			}
		}, 3000);

	}else{
		obj.slideDown();
		if(callback){
			callback();
		}
	}
};

window['notice'] = notice;

function error(obj,message,autoclose,callback){
	obj = $('#'+obj);
	obj.css('display','none');
	obj.css('padding','4px');
	obj.addClass('ui-state-error ui-corner-all');
	obj.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right:3px;"></span>'+message+'</p>');

	if(autoclose == true){
		obj.slideDown();
		setTimeout(function() {
			obj.slideUp();
			if(callback){
				callback();
			}
		}, 4000);

	}else{
		obj.slideDown();
		if(callback){
			callback();
		}
	}
};
window['error'] = error;