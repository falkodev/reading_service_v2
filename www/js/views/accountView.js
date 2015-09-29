var accountView = function () {
	var result = {};
    if(connectedUser) {
    	// retrieve user data
    	var sessionUserData = JSON.parse(sessionStorage.getItem("sessionUserData"));
        // 	$.each(sessionUserData, function(k,v){
    	// 	console.log("sessionUserData." + k + ": " + v)
    	// })
        
        // add it to the template for handlebars compilation
    	result.userData = sessionUserData;
    	result.account="account"; //account not empty to fulfill "if" condition in accountTemplate in order to display labels for an existing account	
    } 
    
	/**
	 * [click on "Next step" button : hide current screen and show next one]
	 */
	$('body').off().on('click', '.account-next', function(e){
    	e.preventDefault();
        $('.validate').slideUp(200);
    	var currentScreen = $(this).parent().closest('div').attr('id');
    	var nextScreen = $(this).attr('data-next');
		var fct = nextScreen + "Display()"; // function to load to display correctly the next screen
        if (typeof fct != "undefined") { 
            var returnValue = eval(fct);
            if(returnValue) {
                $('#' + currentScreen).hide();
                $('#' + nextScreen).show();
            }
        }
    });

    /**
	 * [click on "Back" button : hide current screen and show previous one]
	 */
	$('body').on('click', '.account-previous', function(e){
    	e.preventDefault();

    	var currentScreen = $(this).parent().closest('div').attr('id');
    	var previousScreen = $(this).attr('data-previous');

    	$('#' + currentScreen).hide();
    	$('#' + previousScreen).show();
    });

	/**
	 * [click on "Change password" button : display hidden confirmation field]
	 */
	$('body').on('click', '#changePassword', function(e){
        $('.passConfirm').slideDown(400);
        password = $('#passAccount').val();
        $('#passAccountConfirm').val('');
        $('#passAccount').val('');
        $('#passAccountConfirm').removeAttr('readonly');
        $('#passAccount').removeAttr('readonly');
    });

	/**
	 * [click on "Cancel change password" button : hide confirmation field]
	 */
    $('body').on('click', '#cancelChangePassword', function(e){
    	e.preventDefault();
    	$('.passConfirm').slideUp(400);
    	$('#passAccountConfirm').val(password);
        $('#passAccount').val(password);
        $('#passAccountConfirm').prop("readonly", true);
        $('#passAccount').prop("readonly", true);
    });

    /**
     * [click on "Save modification" button : save new password]
     */
    $('body').on('click', '#recordChangePassword', function() {
        $(".validate").hide();
        if ($('#passAccount').val() == '') { $("#changePasswordEmptyValidate").slideDown(400); }
        else if ($('#passAccount').val().length < 4) { $("#changePasswordLengthValidate").slideDown(400); }
        else if ($('#passAccount').val() != $('#passAccountConfirm').val()) { $("#changePasswordMatchValidate").slideDown(400); }
        else {
            var id = sessionUserData.id;
            var pass = $('#passAccount').val();
            $.post('http://www.jwreading.com/ajax/changePassword.php', {'pass': pass, 'id': id}, function(data) {
            }).done(function(result) {
                result = result.trim();
                if (result == '0' || result == 'fail') {
                    $("#changePasswordFailValidate").slideDown(400);
                }
                else {
                    var res = result.split('OK.');
                    $('.passConfirm').slideUp(400);
                    password = res[1];
                    $('#passAccount').val(password);
                    $('#passAccountConfirm').prop("readonly", true);
                    $('#passAccount').prop("readonly", true);
                    $("#changePasswordSuccessValidate").slideDown(400);
                }
            });
        }
    });

	/**
	 * [click on a switch button representing a day : show or hide the corresponding radio button]
	 */
	$('body').on('click', '.onoffswitch-checkbox', function(e){	
		toggleRadioButton(this.id);
	});

    /**
     * [popover mgmt]
     * 
     */
    $(document).on({
	    mouseenter: function () { //hover
	        $(this).popover('show');
	    },
	    click: function () {
	        $(this).popover('show');
	    },
	}, "#helpAccount");

    // click everywhere else than the "helpAccount" icon hides the popover
    $('body').on('click', function(e) {
        $('[data-toggle=popover]').each(function() {
            if (!$(this).is(e.target)) {            	
                $(this).popover('hide');
            }            
        });
    });
    /**
     * 
     * [end popover mgmt]
     */    
    
    
	/**
	 * [world map mgmt]
	 */
    $(function($){
    	if ($(window).width() < 768) { size = 540; }
    	else { size = 960; }

	    $('#account-map-continents').cssMap({
	        'size' : size, 
	        'onClick' : function(e){ // click on the map hides the map and shows the button "Display map" and the UTC table corresponding to the clicked zone
                $(".account-select-utc").find('option').removeAttr("selected"); //utc selection removed
	            $('#account-map-continents').hide('slow');
                $('#subscribeTip').hide();
	            $('#displayAccountMap').show();
	            $('#account-addresses').show();	             		   		
	        },   
	        agentsListId : '#account-addresses',
	        loadingText : '', 
	    });

	    // when view is loaded, get timezones data and store it hidden
	    $.ajax({
            type: "POST",
            url: "http://www.jwreading.com/ajax/getTimezones.php",
            data: {lang: lang}, 
            success: function(data) {
            	$('#account-addresses').hide();
                $('#account-addresses').html(data);
                if(connectedUser) { $('#' + sessionUserData.time_zone + '-li').parent().addClass('active-region'); }//highlight the world region saved in user parameters
            }
        });

	    // click on "Display map" button hides the button and shows the map again
	    $('#displayAccountMap').click(function(){
	    	$('#displayAccountMap').hide(function(){
	    		$('#account-map-continents').show('slow');
	    	})
	        	        
	    });	     

	    // when time is selected, hides the UTC table and displays the map again
        $('body').on('change', '.account-select-utc',  function() {
	        $('.list-header').hide();
	        $('.list-utc').hide();
	        $('.list-expl').hide();
	        $('#displayAccountMap').trigger('click');
	        $("#timezoneAccountValidate").hide();
	        $('#tipAccount').hide();
	        $('#account-selected-time').html($('select').children(':selected').text());
	        $('#account-selected-utc').html($(this).data('utc'));
	        $('#account-select-phrase').slideDown(400);	     
	    });

	    $(".closeTip").click(function() {      
	        $(".tip").slideUp(400);
	    });
	});
	/**
	 * [end world map mgmt]
	 */

    /**
	 * [toggleRadioButton : show or hide the radio button corresponding to the chosen day]
	 * @param  {[string]} id [id of the switch button, that is to say the day]
	 */
	function toggleRadioButton(id){
		var lastChar = id.substr(id.length - 1);
		$("#radioAccount" + lastChar).toggle().prop('checked', false);
	}
	
    /**
     * [accountSecondDisplay : display second account screen and fill recorded days according to the user's parameters]
     */
    function accountSecondDisplay() {
        var email = $('#emailAccount').val();
        var accountId;        
        var returnValue = false;
        var params;

        if(hash == "account") { accountId = sessionUserData.id; }  

    	if ($.trim(email).length == 0) {
            $("#emailEmptyValidate").slideDown(400);
        }
        else if (validateEmail(email) == false) {
            $("#emailIncorrectValidate").slideDown(400);
        }
        else {
            //ajax function call with callback (result) to check if the email address already exists
            $.ajax({
                type: 'POST',
                url: 'http://www.jwreading.com/ajax/checkEmail.php',
                data: {'email': email, 'account': accountId},
                async:false,
                success: function(result) {
                    result = result.trim();
                    if (result == '1') {
                        $("#emailExistingValidate").slideDown(400);
                    }
                    else {  
                        if(hash == "account") {  	                        	        
                            $("input[type=checkbox].accountSwitch").each(function() {
                                var id = this.id;
                                var element = id.substr(13); //withdraw 13 first letters equivalent to "toggleAccount" in the id of checkbox element
                                element = element.charAt(0).toLowerCase() + element.slice(1); //lowercase only the first letter to match variable from sessionUserData
                                var toggleAccount = 'sessionUserData.' + element;
                                if(eval(toggleAccount) == 1) {
                                    $(this).prop('checked', true); //checkbox displayed to "Yes"
                                    toggleRadioButton(id);
                                    var day = element.substr(element.length - 1);
                                    if(sessionUserData.firstDay == day) { $('#radioAccount' + day).prop('checked', true); }
                                }
                            });
                        }
                        returnValue = true;
                    }
                }
            });
        }
        return returnValue;
    }

    /**
     * [accountThirdDisplay : display second account screen and fill recorded days according to the user's parameters]
     */
    function accountThirdDisplay() {
        var returnValue = false;
        var count = $("input[type=radio].accountSwitch:checked").length;
        // console.log('count : ' + count);
        
        if (count != 1) {
            $("#dayValidate").slideDown(400);
        } else {
            returnValue = true;
            var elementReading = 'Fr';
            var elementComment = 'Fr';
        	if(hash == "account") {
            	elementReading = sessionUserData.readingLang;
            	elementReading = elementReading.charAt(0).toUpperCase() + elementReading.slice(1); //uppercase the first letter to match the element name on the next line
            	
            	elementComment = sessionUserData.commentLang;
            	elementComment = elementComment.charAt(0).toUpperCase() + elementComment.slice(1);
            } 
            $("#radioAccountLangReading" + elementReading).prop('checked', true);
            $("#radioAccountLangText" + elementComment).prop('checked', true); 
        }
        return returnValue;
    }
    
	return result;
}
