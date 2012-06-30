$(document).ready(function() {
//	var xhr2 = $.ajax({
//		'username': 'usuario',
//		'password': 'password',
//		'url': "http://planner/www/jsonLogin.php",
//		'async': async,
//		'type': "GET",
//		'success': function(data, status, xhr){
//
//		},
//		'error': function(xhr, textStatus, errorThrown){
//			if(error)
//				error(errorThrown);
//		}
//	});

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

					localStorage.setItem('localSession',myData.token);
					tasksString = myData.tasks;
					stringTasks = JSON.stringify(myData.tasks);
					stringTimelines = JSON.stringify(myData.timelines);

					localStorage.setItem('backTasks',stringTasks);
					localStorage.setItem('backTimelines',stringTimelines);

					window.location.href = 'manager.html';
				}else{
					alert("wrong data");
				};

			});
	});

});