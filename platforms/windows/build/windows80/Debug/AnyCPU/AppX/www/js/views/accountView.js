var accountView = function () {
	var result = {};
    userData = '';
    if(connectedUser) {        
    	// retrieve user data
    	// sessionUserData = JSON.parse(localStorage.getItem("sessionUserData"));
        // $.each(sessionUserData, function(k,v){
    	// 	console.log("sessionUserData." + k + ": " + v)
    	// })
        
        /******* sessionUserData structure *******/
        // id 
        // password
        // firstDay
        // day1
        // day2
        // day3
        // day4
        // day5
        // day6
        // day7
        // dailyComment
        // name
        // readingLang
        // commentLang
        // time_displayed
        // time_cities
        // time_utc
        // time_zone
        // time_id
        // modeEmail
        // modeApp
        // email
        /******* end sessionUserData structure *******/
        
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
     * [submit form : save data]
     */
    $('body').on('submit', '#accountForm', function(e) {
        e.preventDefault();
        if(hash == "account" && $('#accountTimeId').val()=='') { $('#accountTimeId').val(sessionUserData.time_id); } 
        var formData = $("input[name!=passAccount]input[name!=passAccountConfirm]", this).serialize() + "&lang=" + localStorage.getItem("lang"); //every input except password fields
        if(hash == "account") { formData += "&accountId=" + sessionUserData.id; } 
        $.ajax(
        {
            type:'post',
            url: 'http://www.jwreading.com/ajax/saveData.php',
            data:formData,
            beforeSend:function()
            {
                timer = setTimeout(function()
                {
                    $('#waitDiv').show(); 
                },
                200); // if ajax request takes more than 200ms, display loading animation   
            },            
            timeout: 10000,
            success:function(result)
            {
                if(hash == "account") { // existing account
                    if(result.substr(0,2) == 'OK') { 
                        localStorage.removeItem("sessionUserData");
                        sessionUserData = '';
                        userData = JSON.parse(result.substr(2)); //new parameters received from PHP script become user data
                        localStorage.setItem("sessionUserData", JSON.stringify(userData));
                        sessionUserData = JSON.parse(localStorage.getItem("sessionUserData"));
                        $('#successAccountValidate').slideDown(400);                       
                        $('#errorAccountValidate').hide();
                        $('#successCreateValidate').hide();
                    } else { //error while saving
                        $('#errorAccountValidate').slideDown(400);
                        $('#successAccountValidate').hide();
                        $('#successCreateValidate').hide();
                    }
                } else { // new account
                    if(result.substr(0,2) == 'OK') {
                        msg = JSON.parse(result.substr(2)); //display some info to the user like the generated password for ex
                        $('#subscribeName').html(msg[1]);
                        $('#subscribeMail').html(msg[2]);
                        $('#subscribeDays').html(msg[3]);
                        $('#subscribePass').html(msg[5]);

                        $('#successCreateValidate').siblings().hide(); // hide every element but the displayed message
                        $('#successCreateValidate').parents().siblings().hide();
                        $('#menuContent').show(); //show menu
                        $('.title').show(); // show title 
                        $('#successCreateValidate').slideDown(400); // show message
                    } else { //error while saving
                        $('#errorAccountValidate').slideDown(400);
                        $('#successAccountValidate').hide();
                        $('#successCreateValidate').hide();
                    }
                }
            },
            error:function()
            {
                $('#errorAccountValidate').slideDown(400);
                $('#successAccountValidate').hide();
            },
            complete:function(html)
            {
                clearTimeout(timer);
                $('#waitDiv').hide();  
            }
        });
    });

    /**
     * ["Login" button displayed in message after saving data]
     */
    $('body').on('click', '#goToLogin', function(e){
        e.preventDefault();
        window.location.hash = '#login';
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
            data: {lang: localStorage.getItem("lang")}, 
            success: function(data) {
            	$('#account-addresses').hide();
                $('#account-addresses').html(data);
                if(connectedUser) { $('#' + sessionUserData.time_zone + '-li').parent().addClass('active-region'); }//highlight the world region saved in user parameters
                else { 
                    $('#europe-li').parent().addClass('active-region'); //by default, highlight europe zone
                    $('#accountTimeId').val(66);
                } 
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
            $('#accountTimeId').val($(this).val());
	    });

	    // $(".closeTip").click(function() {      
	    //     $(this).parent().slideUp(400);
	    // });   
        $(".closeTip").on('touchstart click',function (){
            $(this).parent().slideUp(400);
        });     
	});
	/**
	 * [end world map mgmt]
	 */
    
    $(document).ready(function(){
        var mapLoaded = $('#account-map-continents').hasClass('css-map-container');
        // console.log('class chargée:' + mapLoaded);
        if(!mapLoaded) {
            window.location.reload(true);
        } 
        $('.choix').attr('lang', localStorage.getItem("lang"));
    });

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
                        else {
                            $("#subscribeTip1").show();
                            $("#toggleAccountModeEmail").prop('checked', true); 
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
        var countMode = $("input[type=checkbox].accountMode:checked").length;
        // console.log('count : ' + count);        
        if (count != 1) {
            $("#dayValidate").slideDown(400);
        } else if (countMode < 1){
            $("#modeValidate").slideDown(400);
        } else {
            returnValue = true;
            var elementReading = 'Fr';
            var elementComment = 'Fr';
        	if(hash == "account") {
            	elementReading = sessionUserData.readingLang;
            	elementReading = elementReading.charAt(0).toUpperCase() + elementReading.slice(1); //uppercase the first letter to match the element name on the next line
            	
            	elementComment = sessionUserData.commentLang;
            	elementComment = elementComment.charAt(0).toUpperCase() + elementComment.slice(1);

                $("#tipAccount").show();
            } 
            else if(hash == "subscribe") { $("#subscribeTip2").show(); }
            $("#radioAccountLangReading" + elementReading).prop('checked', true);
            $("#radioAccountLangText" + elementComment).prop('checked', true); 
        }
        return returnValue;
    }
    
	return result;
}
