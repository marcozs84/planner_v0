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
		
		var xhr = $.ajax({
			  type: "POST",
			  url: "http://planner/www/jsonLogin.php",
			  data: {
				  username: username, 
				  password: password 
					 }
			}).done(function( msg ) {
			  alert( "Data Saved: " + msg );
			  var myData = JSON.parse(msg);
//			  var myData = eval(msg);
//			  alert(myData.loginResult);
			  
			  if(myData.loginResult == "TRUE"){
				  
				  localStorage.setItem('localSession',myData.token);
				  tasksString = myData.tasks;
  				  taskOStringify = JSON.stringify(myData.tasks);
//  				  taskObject = JSON.parse(myData.tasks);
  				  
				  localStorage.setItem('backTasks',taskOStringify);
				  chrome.extension.getBackgroundPage().backTasks = myData.tasks;
				  
				  window.location.href = 'manager.html';
//				  chrome.extension.sendRequest({redirect: "manager.html"});
			  }else{
				  alert("wrong data");
			  };
			  
			});
	});

});