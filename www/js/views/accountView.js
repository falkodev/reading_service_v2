var accountView = function () {
	var result = {}
	result.userData = userData
	result.account="account" //account not empty to fulfill "if" condition in accountTemplate in order to display labels for an existing account

	$('body').on('click', '#changePassword', function(e){
        $('.passConfirm').slideDown(400)
        password = $('#passAccount').val()
        $('#passAccountConfirm').val('')
        $('#passAccount').val('')
        $('#passAccountConfirm').removeAttr('readonly')
        $('#passAccount').removeAttr('readonly')
    })

    $('body').on('click', '#cancelChangePassword', function(e){
    	e.preventDefault()
    	$('.passConfirm').slideUp(400)
    	$('#passAccountConfirm').val(password)
        $('#passAccount').val(password)
        $('#passAccountConfirm').prop("readonly", true)
        $('#passAccount').prop("readonly", true)
    })

	return result
}
