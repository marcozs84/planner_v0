$(document).ready(function() {
	$('#btnOpenDeveloperForm').button().click(function() {

		var username = $.trim($('#username').val());
		var password = $.trim($('#password').val());

//		alert(username);

		$.ajax({
			type: "POST",
			url: "http://planner/www/jsonLogin.php",
			data: {
				username: username,
				password: password
					 }
			}).done(function( msg ) {
				alert( "Data Saved: " + msg );
				var myData = JSON.parse(msg);

				if(myData.loginResult == "TRUE"){

					if(myData.token == undefined || myData.token == '' || myData.token == 'null'){
						alert('Authentication failed.');
						return false;
					}

					localStorage.setItem('localSession',myData.token);
					stringTasks = JSON.stringify(myData.tasks);
					stringTimelines = JSON.stringify(myData.timelines);
					stringProjects = JSON.stringify(myData.projects);
					stringResources = JSON.stringify(myData.resources);

					localStorage.setItem('backTasks',stringTasks);
					localStorage.setItem('backTimelines',stringTimelines);
					localStorage.setItem('backProjects',stringProjects);
					localStorage.setItem('backResources',stringResources);

					window.location.href = 'manager.html';
				}else{
					alert("wrong data");
				};

			});
	});

});