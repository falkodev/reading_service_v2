var accountView = function () {
	var result = {}

	var sessionUserData = JSON.parse(sessionStorage.getItem("sessionUserData"))
 	// $.each(sessionUserData, function(k,v){
	// 	console.log("sessionStorage.userData." + k + ": " + v)
	// })
	result.userData = sessionUserData
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

    $('body').on('click', '#accountFirstBtn', function(e){
     	e.preventDefault()
     	$("#accountFirst").hide()
        $("#accountSecond").show()
        
        $("input[type=checkbox].accountSwitch").each(function() {
     		var id = this.id
     		var element = id.substr(13) //withdraw 13 first letters equivalent to "toggleAccount" in the id of checkbox element
     		element = element.charAt(0).toLowerCase() + element.slice(1) //lowercase only the first letter to match variable from sessionUserData
     		var toggleAccount = 'sessionUserData.' + element
     		// console.log(toggleAccount + ': ' + eval(toggleAccount))
     		if(eval(toggleAccount) == 1) {
     			$(this).prop('checked', true) //checkbox displayed to "Yes"
     			var lastChar = id.substr(id.length - 1)
     			$("#radioAccount" + lastChar).show() // display the radio button on the same line as the checkbox
     		}
     	})
     })

    // $("input[type=checkbox].accountSwitch").click(function() {
    //     $("input[type=checkbox].accountSwitch").each(
    //             function() {
    //                 var id = $(this).attr("id");
    //                 var lastChar = id.substr(id.length - 1);
    //                 //console.log('checkbox ' + id);
    //                 if ($(this).is(":checked"))
    //                 {
    //                     $("#radioAccount" + lastChar).show();
    //                     if($(this).attr("id")== 'toggleAccountDailyText')
    //                     {
    //                         $('#hiddenAccountDailyComment').val(1);
    //                     }
    //                     else {
    //                         $('#hiddenAccount' + lastChar).val(1);
    //                     }
    //                 }
    //                 else
    //                 {
    //                     if($(this).attr("id")== 'toggleAccountDailyText')
    //                     {
    //                         $('#hiddenAccountDailyComment').val(0);
    //                     }
    //                     else {
    //                         $("#radioAccount" + lastChar).hide();
    //                         $("#radioAccount" + lastChar).attr('checked', false);
    //                         $('#hiddenAccount' + lastChar).val(0);
    //                     }
    //                 }
    //             });
    // });

    $('body').on('click', '#backToAccountFirstBtn', function(e){
        $("#accountFirst").show()
        $("#accountSecond").hide()
        $('#accountThird').hide()
        return false;
    });
    
	return result
}
