var TOKEN = '';

var Resolutions = Array();
var Statuses = Array();
var Priorities = Array();
var IssueTypes = Array();

var GPROP = Array();
GPROP['url'] = 'http://tools.emini.dk/jira/rpc/soap/jirasoapservice-v2';
GPROP['username'] = 'marco.zeballos';
GPROP['password'] = 'fregadera';
GPROP['async'] = true;

function HelloWorld() {
	var pl = new SOAPClientParameters();
	pl.add("username", "marco.zeballos");
	pl.add("password", "fregadera");
	
	GPROP['method'] = 'login';
	GPROP['parameters'] = pl;
	GPROP['callback'] = login_handle;
	GPROP['error'] = login_error;
	
	SOAPClient.invoke(GPROP);
}

function login_handle(r, xhr){
	console.log('login callback', xhr);
	if($("faultstring",xhr).text() != ''){
		console.log($("faultstring",xhr).text());
	} else {
//		alert("success");
		console.log("xhr: " + $(xhr).text());
		console.log("User Logged In");
		console.log("token: " + $(xhr).text());
		TOKEN = $(xhr).text();
		
//		getSettings();
//		
//		getUsers();
//		
//		getProjects();
	}
};

function login_error(r) {
	alert("WTF!!");
	$("#info").append("Error in the connection.");
}

HelloWorld();



// ------------------------------------------------------------------------------------------------

function getUsers(){
	var pl = new SOAPClientParameters();
	pl.add("in0", TOKEN);
	
	GPROP['method'] = 'getUsersNoSchemes';
	GPROP['parameters'] = pl;
	GPROP['callback'] = users_handler;
	GPROP['error'] = users_error;
	
	SOAPClient.invoke(GPROP);
	
}

function users_handler(r, xhr){
	Users = parseProjectXML(xhr);
	console.log(Users);
	console.log(1);
	
//	for(var i = 0 ; i < Users.length; i++){
	getIssuesByProjectKey(Users[1].name);
//	}
	
}
function users_error(r){
	console.log("xhrProj: error " + r);
}

// ------------------------------------------------------------------------------------------------

var tmpKey = '';

function getWorkLogsByIssueKey(issueKey){
	var pl = new SOAPClientParameters();
	pl.add("in0", TOKEN);
	pl.add("in1", issueKey);
	tmpKey = issueKey;
	
	GPROP['method'] = 'getWorklogs';
	GPROP['parameters'] = pl;
	GPROP['callback'] = workLogs_handler;
	GPROP['error'] = workLogs_error;
	
	SOAPClient.invoke(GPROP);
	
}
function workLogs_handler(r, xhr){
	workLogs = parseWorkLogXML(xhr);
	
	var html = '';
	html += '<table class="issuesList" cellspacing="0" cellpadding="0" border="0" >';
	
	for(var i = 0 ; i < workLogs.length; i++){
		html += '<tr>';
		html += '<td>' + workLogs[i].startDate + ' ' + workLogs[i].timeSpent + '<div id="wl_child_' + workLogs[i].id + '"></div></td>';
		html += '<td><a href="javascript:;" onclick="alert(\'' + workLogs[i].id + '\')">Get WorkLogs</a></td>';
		html += '</tr>';
	}
	
	html += '</table>';
	
	$('#wl_' + tmpKey).append(html);
	
	tmpKey = '';
	
	console.log(workLogs);
	console.log(1);
	
//	for(var i = 0 ; i < Projects.length; i++){
//	getIssuesByProjectKey(Projects[1].key);
//	}
	
}
function workLogs_error(r){
	console.log("xhrWorkLog: error " + r);
}

// ------------------------------------------------------------------------------------------------

function getProjects(){
	var pl = new SOAPClientParameters();
	pl.add("in0", TOKEN);
	
	GPROP['method'] = 'getProjectsNoSchemes';
	GPROP['parameters'] = pl;
	GPROP['callback'] = projects_handler;
	GPROP['error'] = projects_error;
	
	SOAPClient.invoke(GPROP);
	
}
function projects_handler(r, xhr){
	Projects = parseProjectXML(xhr);
	console.log(Projects);
	console.log(1);
	
//	for(var i = 0 ; i < Projects.length; i++){
	getIssuesByProjectKey(Projects[1].key);
//	}
	
}
function projects_error(r){
	console.log("xhrProj: error " + r);
}

// ------------------------------------------------------------------------------------------------

function getAvailableActionsByIssueKey(issueKey){
	var pl = new SOAPClientParameters();
	pl.add("in0", TOKEN);
	pl.add("in1", issueKey);
	
	GPROP['method'] = 'getAvailableActions';
	GPROP['parameters'] = pl;
	GPROP['callback'] = AvailableActionsByIssueKey_handler;
	GPROP['error'] = AvailableActionsByIssueKey_error;
	
	SOAPClient.invoke(GPROP);

}
function AvailableActionsByIssueKey_handler(r, xhr){
	Projects = parseProjectXML(xhr);
	console.log(Projects);
	console.log(1);
	
//	for(var i = 0 ; i < Projects.length; i++){
		getIssuesByProjectKey(Projects[1].key);
//	}

}
function AvailableActionsByIssueKey_error(r){
	console.log("xhrAvailableActions: error " + r);
}

// ---------------------------------------------------------------------------------------------------------

function getIssuesByUsername(){
	var username = $('#username').val();
	var jql = 'assignee = "'+ $.trim(username) +'" AND status in (Open, "In Progress", Reopened)';
	getIssuesByJQL(jql, issuesByUsername_handler);
}
function issuesByUsername_handler(r,xhr){
	Issues = parseIssuesXML(xhr);
	
	var html = '';
	html += '<table class="issuesList" cellspacing="0" cellpadding="0" border="0" >';
	
	for(var i = 0 ; i < Issues.length; i++){
		html += '<tr>';
		html += '<td>' + Issues[i].summary + ' <div id="wl_' + Issues[i].id + '"></div></td>';
		html += '<td><a href="javascript:;" onclick="getWorkLogsByIssueKey(\'' + Issues[i].key + '\')">Get WorkLogs</a></td>';
		html += '<td><a href="javascript:;" onclick="getAvailableActionsByIssueKey(\'' + Issues[i].key + '\')">Get Available Actions</a></td>';
		html += '</tr>';
		
		console.log(Issues[i].description);
	}
	
	html += '</table>';
	
	$('#info').append(html);
	
	console.log(Issues);
	console.log(1);
	
}

function issuesByProject_handler(r,xhr){
	Issues = parseIssuesXML(xhr);
	
	console.log(Issues);
	console.log(1);
	
}

//---------------------------------------------------------------------------------------------------------

function getIssuesByProjectKey(key){
	var jql = 'project = '+ key +' AND status = Open';
	var jql = 'project = '+ key +'';
	getIssuesByJQL(jql, issuesByProject_handler);
}
function issuesByProject_handler(r,xhr){
	Issues = parseIssuesXML(xhr);
	
	console.log(Issues);
	console.log(1);
	
}

// ---------------------------------------------------------------------------------------------------------

function getIssuesByJQL(jql, callback){
	var pl = new SOAPClientParameters();
	pl.add("in0", TOKEN);
	pl.add("in1", jql);
	pl.add("in2", 10);

	GPROP['method'] = 'getIssuesFromJqlSearch';
	GPROP['parameters'] = pl;
	GPROP['callback'] = callback;
	GPROP['error'] = null;
	
	SOAPClient.invoke(GPROP);
};


function parseProjectXML(xhr){
	var data = Array();
	$(xhr).children(":first").children(":first").children(":first").children(":first").children().each( function(){
		$("multiRef" + this.getAttribute('href') , xhr).each(function(i, val) {
			if($("key", val).text()){
				data.push({'id':$("id", val).text(),
				           'name':$("name", val).text(),
				           'project':$("project", val).text(),
				           'key':$("key", val).text(),
				           'description':$("description", val).text(),
				           'url':$("url", val).text()
				           });
			}
		});
	});
	return data;
};

function parseUsersXML(xhr){
	var data = [];
	$(xhr).children(":first").children(":first").children(":first").children(":first").children().each( function(){
		$("multiRef" + this.getAttribute('href') , xhr).each(function(i, val) {
			if($("key", val).text()){
				data.push({
					'id': $("id", val).text(),
					'description': $("description", val).text(),
					'originalestimate': $("originalEstimate", val).text(),
					'created': $("created", val).text(),
					'updated': $("updated", val).text(),
					'type': $("type", val).text(),
					'key': $("key", val).text(),
					'summary': $("summary", val).text(),
					'assignee': $("assignee", val).text(),
					'duedate': $("duedate", val).text(),
					'priority': parseInt($("priority", val).text()),
					'resolution': ($("resolution", val).text() == '')?'UNRESOLVED':Resolutions[$("resolution", val).text()],
							'status': $("status", val).text()
				});
			}
		});
	});
	return data;
};

function parseIssuesXML(xhr){
	var data = [];
	$(xhr).children(":first").children(":first").children(":first").children(":first").children().each( function(){
		$("multiRef" + this.getAttribute('href') , xhr).each(function(i, val) {
			if($("key", val).text()){
				data.push({
					'id': $("id", val).text(),
					'description': $("description", val).text(),
					'originalestimate': $("originalEstimate", val).text(),
					'created': $("created", val).text(),
					'updated': $("updated", val).text(),
					'type': $("type", val).text(),
					'key': $("key", val).text(),
					'summary': $("summary", val).text(),
					'assignee': $("assignee", val).text(),
					'duedate': $("duedate", val).text(),
					'priority': parseInt($("priority", val).text()),
					'resolution': ($("resolution", val).text() == '')?'UNRESOLVED':Resolutions[$("resolution", val).text()],
							'status': $("status", val).text()
				});
			}
		});
	});
	return data;
};

function parseWorkLogXML(xhr){
	var data = [];
	$(xhr).children(":first").children(":first").children(":first").children(":first").children().each( function(){
		$("multiRef" + this.getAttribute('href') , xhr).each(function(i, val) {
				if($("key", val).text()){
					data.push({
				        'id': $("id", val).text(),
				        'author': $("author", val).text(),
				        'comment': $("comment", val).text(),
				        'created': $("created", val).text(),
						'startDate': $("startDate", val).text(),
						'timeSpent': $("timeSpent", val).text(),
						'timeSpentInSeconds': $("timeSpentInSeconds", val).text(),
						'updateAuthor': $("updateAuthor", val).text(),
						'updated': $("updated", val).text()
					});
				}
		});
	});
	return data;
};

function getSettings(){
	var pl = new SOAPClientParameters();
	pl.add("in0", TOKEN);
	
	SOAPClient.invoke({
		'url': GPROP['url'], 'username':GPROP['username'],'password':GPROP['password'], 
		'method': "getResolutions", 
		'parameters': pl, 
		'async': true, 
		'callback': function(r, xhr){
			$(xhr).find("multiRef").each(function(i, val) {
				if($("id", val).text()){
					Resolutions[$("id", val).text()] = $("name", val).text();
				}
			});
		}
	});

	SOAPClient.invoke({
		'url': GPROP['url'], 'username':GPROP['username'],'password':GPROP['password'], 
		'method': "getIssueTypes", 
		'parameters': pl, 
		'async': true, 
		'callback': function(r, xhr){
			$(xhr).find("multiRef").each(function(i, val) {
				if($("id", val).text()){
					IssueTypes[$("id", val).text()] = {
						"icon": $("icon", val).text(), 
						"text": $("name", val).text()
					};
				}
			});
		}
	});
	
	SOAPClient.invoke({
		'url': GPROP['url'], 'username':GPROP['username'],'password':GPROP['password'], 
		'method': "getPriorities", 
		'parameters': pl, 
		'async': true, 
		'callback': function(r, xhr){
			$(xhr).find("multiRef").each(function(i, val) {
				if($("id", val).text()){
					Priorities[$("id", val).text()] = {
						"icon": $("icon", val).text(), 
						"text": $("name", val).text()
					};
				}
			});
		}
	});
	
	SOAPClient.invoke({
		'url': GPROP['url'], 'username':GPROP['username'],'password':GPROP['password'], 
		'method': "getStatuses", 
		'parameters': pl, 
		'async': true, 
		'callback': function(r, xhr){
			$(xhr).find("multiRef").each(function(i, val) {
				if($("id", val).text()){
					Statuses[$("id", val).text()] = {
						"icon": $("icon", val).text(), 
						"text": $("name", val).text()
					};
				}
			});
		}
	});


}

function detachWindow(){
	var detachedPos = {
			top: 100,
			left: 100,
			width: window.innerWidth,
			height: window.innerHeight + 20
		};
		window.open(chrome.extension.getURL('demo.html?detached'), 'jira_popup_window',
		  'left=' + detachedPos.left + ',top=' + (detachedPos.top - 22) + // Magic 22...
		  ',width=' + detachedPos.width + ',height=' + detachedPos.height +
		  'location=no,menubar=no,resizable=yes,status=no,titlebar=yes,toolbar=no');
}