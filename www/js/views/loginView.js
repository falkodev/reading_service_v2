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
				   { 'email': email, 'lang': localStorage.getItem("lang") }, function(data) {}).complete(function(data) {
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
        e.preventDefault();
        $(".validate").hide();
        
        var timer;
        $.ajax({
            type: "POST",
            url: "http://www.jwreading.com/ajax/login.php",
            beforeSend: function() { 
            	timer = setTimeout(function()
		        {
		            $('#loginDiv').hide();
            		$('#waitDiv').show(); 
		        },
		        200); // if ajax request takes more than 200ms, display loading animation         	
            },
            timeout: 10000, 
            data: "loginInput=" + $("#loginInput").val() + "&pwdInput=" + $("#pwdInput").val(),
            success: function(msg) {
                if (msg[0] == '1') //correct credentials : login done
                {                
                    var data = JSON.parse(msg.substr(1));
                    localStorage.setItem("sessionUserData", JSON.stringify(data));
                    connectedUser = true;
                    loggedOut = false;
                    if(referrer != '' && referrer != 'login') {	
						window.location.reload(); //for a page needing a connected user, the displayed page is the login page, but the real hash (in the browser) is the previously called page. so a refresh is enough to hide the login page and display the previously called page				
                    }
                    else { 
                    	window.location.hash = '#dashboard'; //default page to display after login
                    }                      
                }
                else if (msg == '0') //wrong password
                { $("#pwdValidate").slideDown(400); }
                else if (msg == '-1') // email address does not exist in DB
                { $("#emailValidate").slideDown(400); }
                else //every other login problem
                { $("#loginValidate").slideDown(400); }
            },
            error: function() {
            	$("#connectionValidate").slideDown(400); // no internet connection
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

	return result;
}