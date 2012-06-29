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

