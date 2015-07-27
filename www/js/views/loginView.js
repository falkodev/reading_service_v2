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

	$('body').on('click', '#forgottenBtn', function(e){
		e.preventDefault()
		$(".validate").hide()
		var email = $('#forgottenInput').val()
		if (validateEmail(email) == false) {
			$("#forgottenValidate").slideDown(400)
		}
		else {
			$.post($(this).attr("action"), { 'email': email, 'lang': lang }, function(data) {}).complete(function(result) {
				// alert("result")
				result = result.trim()
				if(result == "OK"){
					$("#forgottenSuccess").slideDown(400)
				}
				else {
					$("#forgottenFail").slideDown(400)
				}
			})
		}
	})
}