var accountView = function () {
	var result = {}

	// retrieve user data
	var sessionUserData = JSON.parse(sessionStorage.getItem("sessionUserData"))
 	// $.each(sessionUserData, function(k,v){
	// 	console.log("sessionUserData." + k + ": " + v)
	// })
	// add it to the template for handlebars compilation
	result.userData = sessionUserData
	result.account="account" //account not empty to fulfill "if" condition in accountTemplate in order to display labels for an existing account	

	/**
	 * [click on "Next step" button : hide current screen and show next one]
	 */
	$('body').on('click', '.btn-default', function(e){
    	e.preventDefault()

    	var currentScreen = $(this).parent().closest('div').attr('id')
    	var nextScreen = $(this).attr('data-next')
		var fct = nextScreen + "Display()" // function to load to display correctly the next screen
		
    	// alert('currentScreen: ' + currentScreen)
    	$('#' + currentScreen).hide()
    	$('#' + nextScreen).show()
    	eval(fct)
    })

    /**
	 * [click on "Back" button : hide current screen and show previous one]
	 */
	$('body').on('click', '.btn-inverse', function(e){
    	e.preventDefault()

    	var currentScreen = $(this).parent().closest('div').attr('id')
    	var previousScreen = $(this).attr('data-previous')

    	$('#' + currentScreen).hide()
    	$('#' + previousScreen).show()
    })

	/**
	 * [click on "Change password" button : display hidden confirmation field]
	 */
	$('body').on('click', '#changePassword', function(e){
        $('.passConfirm').slideDown(400)
        password = $('#passAccount').val()
        $('#passAccountConfirm').val('')
        $('#passAccount').val('')
        $('#passAccountConfirm').removeAttr('readonly')
        $('#passAccount').removeAttr('readonly')
    })

	/**
	 * [click on "Cancel change password" button : hide confirmation field]
	 */
    $('body').on('click', '#cancelChangePassword', function(e){
    	e.preventDefault()
    	$('.passConfirm').slideUp(400)
    	$('#passAccountConfirm').val(password)
        $('#passAccount').val(password)
        $('#passAccountConfirm').prop("readonly", true)
        $('#passAccount').prop("readonly", true)
    })

	/**
	 * [click on a switch button representing a day : show or hide the corresponding radio button]
	 */
	$('body').on('click', '.onoffswitch-checkbox', function(e){	
		toggleRadioButton(this.id)
	})

    /**
     * [popover mgmt]
     * 
     */
    $(document).on({
	    mouseenter: function () { //hover
	        $(this).popover('show')
	    },
	    click: function () {
	        $(this).popover('show')
	    },
	}, "#helpAccount")

    // click everywhere else than the "helpAccount" icon hides the popover
    $('body').on('click', function(e) {
        $('[data-toggle=popover]').each(function() {
            if (!$(this).is(e.target)) {            	
                $(this).popover('hide')
            }            
        })
    })
    /**
     * 
     * [end popover mgmt]
     */    


    /**
	 * [toggleRadioButton : show or hide the radio button corresponding to the chosen day]
	 * @param  {[string]} id [id of the switch button, that is to say the day]
	 */
	function toggleRadioButton(id){
		var lastChar = id.substr(id.length - 1)
		$("#radioAccount" + lastChar).toggle().prop('checked', false)
	}
	
    /**
     * [accountSecondDisplay : display second account screen and fill recorded days according to the user's parameters]
     */
    function accountSecondDisplay() {
    	$("input[type=checkbox].accountSwitch").each(function() {
     		var id = this.id
     		var element = id.substr(13) //withdraw 13 first letters equivalent to "toggleAccount" in the id of checkbox element
     		element = element.charAt(0).toLowerCase() + element.slice(1) //lowercase only the first letter to match variable from sessionUserData
     		var toggleAccount = 'sessionUserData.' + element
     		// console.log(toggleAccount + ': ' + eval(toggleAccount))
     		if(eval(toggleAccount) == 1) {
     			$(this).prop('checked', true) //checkbox displayed to "Yes"
     			toggleRadioButton(id)
     			var day = element.substr(element.length - 1)
     			// console.log("sessionUserData.firstDay: " + sessionUserData.firstDay + " day: " + day)
     			if(sessionUserData.firstDay == day) { $('#radioAccount' + day).prop('checked', true) }
     		}
     	})     
    }

    /**
     * [accountThirdDisplay : display second account screen and fill recorded days according to the user's parameters]
     */
    function accountThirdDisplay() {
    	// $('#' + timezone + '-li').parent().addClass('active-region'); 
    }
    
	return result
}