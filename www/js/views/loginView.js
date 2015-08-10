var loginView = function () {
	var result = {};
	
	/**
	 * [click on "forgotten password" link displays form to regenerate password]
	 */
	$('body').on('click', '#forgottenPass', function(e){
        e.preventDefault();
		$("#forgottenValidate").hide();
		$('#forgottenInput').val($('#loginInput').val());
		$('#loginDiv').hide();
		$('#forgottenDiv').show();
	});

	/**
	 * [click on "back" link displays again the login form]                                                                              
	 */
	$('body').on('click', '#backToLogin', function(e){
		e.preventDefault();
		$('#forgottenDiv').hide();
		$('#loginDiv').show();
	});

	/**
	 * [submit "forgotten password" form : test if email address is valid and ask for a new password]
	 */
	$('body').on('click', '#forgottenBtn', function(e){
		e.preventDefault();
		$(".validate").hide();
		var email = $('#forgottenInput').val();
		if (validateEmail(email) == false) {
			$("#forgottenValidate").slideDown(400);
		}
		else {
			$.post("http://www.jwreading.com/ajax/sendNewPassword.php", 
				   { 'email': email, 'lang': lang }, function(data) {}).complete(function(data) {
				result = data['responseText'].trim();
				if(result == "OK"){
					$("#forgottenSuccess").slideDown(400);
				}
				else {
					$("#forgottenFail").slideDown(400);
				}
			});
		}
	});

	/**
	 * [submit "login" form]
	 */
	$('body').on('click', '#loginBtn', function(e){
        $(".validate").hide();
        e.preventDefault();
        var timer;
        $.ajax({
            type: "POST",
            url: "http://www.jwreading.com/ajax/login.php",
            beforeSend: function() { 
            	// if(timer) { clearTimeout(timer); }
            	timer = setTimeout(function()
		        {
		            $('#loginDiv').hide();
            		$('#waitDiv').show(); 
		        },
		        200); // if ajax request takes more than 200ms, display loading animation         	
            },
            timeout: 2000, 
            data: "loginInput=" + $("#loginInput").val() + "&pwdInput=" + $("#pwdInput").val(),
            success: function(msg) {
                if (msg[0] == '1') //correct credentials : login done
                {                
                    userData = JSON.parse(msg.substr(1));
                    sessionStorage.setItem("sessionUserData", JSON.stringify(userData));
                    window.location.hash = '#dashboard';
                    connectedUser = true;
                    loggedOut = false;
                }
                else if (msg == '0') //wrong password
                { $("#pwdValidate").slideDown(400); }
                else if (msg == '-1') // email address does not exist in DB
                { $("#emailValidate").slideDown(400); }
                else //every other login problem
                { $("#loginValidate").slideDown(400); }
            },
            error: function() {
            	$("#connectionValidate").slideDown(400);
            },
            complete: function() { 
            	clearTimeout(timer);
            	$('#waitDiv').hide();  
            	$('#loginDiv').show();
            }
        }); 
    });

	/**
	 * [call "login" form submitting hitting Enter key on login input or password input]
	 */
	$('body').on('keyup', '.loginForm', function(e){
		if(e.keyCode == 13){
			$("#loginBtn").click();
		}
	});

	$(function($){
		// alert("loggedOut: " + loggedOut);
		if(loggedOut) {  $("#logoutValidate").slideDown(400); }	
	});

	return result;
}