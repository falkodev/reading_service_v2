var loginView = function () {
	/**
	 * [click on "forgotten password" link displays form to regenerate password]
	 */
	$('body').on('click', '#forgottenPass', function(e){
        e.preventDefault()
		$("#forgottenValidate").hide()
		$('#forgottenInput').val($('#loginInput').val())
		$('#loginDiv').hide()
		$('#forgottenDiv').show()
	})

	/**
	 * [click on "back" link displays again the login form]                                                                              
	 */
	$('body').on('click', '#backToLogin', function(e){
		e.preventDefault()		
		$('#forgottenDiv').hide()
		$('#loginDiv').show()
	})

	/**
	 * [submit "forgotten password" form : test if email address is valid and ask for a new password]
	 */
	$('body').on('click', '#forgottenBtn', function(e){
		e.preventDefault()
		$(".validate").hide()
		var email = $('#forgottenInput').val()
		if (validateEmail(email) == false) {
			$("#forgottenValidate").slideDown(400)
		}
		else {
			$.post("http://www.jwreading.com/ajax/sendNewPassword.php", 
				   { 'email': email, 'lang': lang }, function(data) {}).complete(function(data) {
				result = data['responseText'].trim()
				if(result == "OK"){
					$("#forgottenSuccess").slideDown(400)
				}
				else {
					$("#forgottenFail").slideDown(400)
				}
			})
		}
	})

	$('body').on('click', '#loginBtn', function(e){
        $("#loginValidate").slideUp(400);
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://www.jwreading.com/ajax/login.php",
            data: "loginInput=" + $("#loginInput").val() + "&pwdInput=" + $("#pwdInput").val(),
            success: function(msg) {
                if (msg[0] == '1')
                {
					// $('#msg').val(msg);
                    // $('#loginForm').submit();                
                    var userData = JSON.parse(msg.substr(1))
                    // $.each(userData, function(key, value){
                    // 	console.log("userData[" + key + "]: " + value)
                    // })
                    
                    // var result = new accountView(userData)

                }
                else if (msg == '0')
                {
                    if(lang == 'fr') $("#loginValidate").html("Le mot de passe est incorrect");
					else $("#loginValidate").html("The password is wrong");
                    $("#loginValidate").slideDown(400);
                }
                else if (msg == '-1')
                {
                    if(lang == 'fr') $("#loginValidate").html("Cette adresse email n'est pas enregistrée. Vous pouvez vous créer un compte avec le menu \"Inscription\"");
                    else $("#loginValidate").html("This email address is not registered as an account. You can create one with the \"Subscribe\" menu");
					$("#loginValidate").slideDown(400);
                }
                else
                {
                    if(lang == 'fr') $("#loginValidate").html("Adresse email ou mot de passe incorrect");
                    else $("#loginValidate").html("The email address or the password is wrong");
					$("#loginValidate").slideDown(400);
                }
            }
        }) 
    });	

	$('body').on('keyup', '.loginForm', function(e){
		if(e.keyCode == 13){
			$("#loginBtn").click();
		}
	});
}