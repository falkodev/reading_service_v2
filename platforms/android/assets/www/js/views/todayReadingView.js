var todayReadingView = function () {
	$(function($){
		$('#todayPortionValidate').hide();
		sessionUserData = JSON.parse(localStorage.getItem("sessionUserData")); // retrieve user data
		var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
		if(today == 0) { today = 7; }//otherwise Sunday = 0
		var data = checkIfPortion();
		/**
		 * [get weekly reading and display today's portion if applicable]
		 */
		$.ajax({
	        type: "GET",
	        url: "http://www.jwreading.com/ajax/getContents.php",
	        dataType: 'html',
	        beforeSend: function() {
            	timer = setTimeout(function()
		        {
		            $('#weekReading').hide();
            		$('#waitDiv').show();
		        },
		        200); // if ajax request takes more than 200ms, display loading animation
            },
            timeout: 10000,
	        data: data,
	        success: function(html){
	        	data = JSON.parse(html); // data contains informations about the first and last verses of today's portion and the whole content of the weekly reading
	        	$('#todayPortionFrom').html(data['from']);
	        	$('#todayPortionTo').html(data['to']);
	        	$('#weekReading').html(data['content']);

    			day = 'sessionUserData.day' + today;
				dayConfig = eval(day); // today in the user config
	        	if(dayConfig == 1) { //if today is a reading day for the user
	        		var len = $('span.anchor').length;
	        		//color in pure white every verse of the portion and in orange every verse number pointing to an anchor (hence a biblical research)
					var idFrom = $('input[value="' + data['from'] + '"]').parent().css({"color":"#fff","font-weight":"500" }).attr('id');
		        	var idTo = $('input[value="' + data['to'] + '"]').parent().css({"color":"#fff","font-weight":"500" }).attr('id');
		        	$('#' + idFrom).nextUntil('#' + idTo).css({"color":"#fff","font-weight":"500" });
		        	$('input').prev('a').css({"color":"#FB7900","font-weight":"500" });

		        	if(idFrom != 1) { //if not the first portion of the week, display the "Display previous verses" button and blur previous verse
		        		var beforeFrom = parseInt(idFrom) - 1;
		        		$('#1').nextUntil('#' + beforeFrom).andSelf().hide();
		        		$('#'  + beforeFrom).addClass('blurBefore');
		        		$('#' + beforeFrom).after($('#btnDisplayBefore').show());
	        			$('#' + beforeFrom).after($('#btnHideBefore'));
	        			$('#btnHideBefore').before('<br><br>');
	        			$('#btnDisplayBefore').after('<br><br>');
		        	}
		        	if(idTo != len - 1) { //if not last portion of the week, display the "Display next verses" button and blur next verse
		        		var afterTo = parseInt(idTo) + 1;
		        		$('#' + afterTo).addClass('blurAfter');
		        		$('#' + afterTo).nextUntil('#' + len).hide();
		        		$('#' + idTo).after('<br><br>');
		        		$('#' + len).before('<br><br>');
	        			$('#' + afterTo).before($('#btnDisplayAfter').show());
	        			$('#' + afterTo).before($('#btnHideAfter'));
	        			$('#btnHideAfter').after('<br><br>');
		        	}
		        	$('#notTodayValidate').hide();
		        	$('#todayPortionValidate').slideDown(400);

	        		$(document).ready(function(){
	        			$(".closeTip").click(function() {  // message "Today's portion is ..." can be removed by user when clicking on the cross
			  	 	        $(".tip").slideUp(400);
			   	    	});

	        			//click on "Display previous verses" button shows previous verses and displays "Hide previous verses" button
					    $('body').on('click', '#btnDisplayBefore', function(){
					    	$('#' + beforeFrom).removeClass('blurBefore');
					    	$('#1').nextUntil('#' + beforeFrom).andSelf().fadeIn();
					    	$('#btnDisplayBefore').fadeOut(function(){
					    		$('#btnHideBefore').fadeIn();
					    	});
					    	document.getElementById(beforeFrom).scrollIntoView();
					    	return false;
					    });
					    //click on "Display next verses" button shows next verses and displays "Hide next verses" button
					    $('body').on('click', '#btnDisplayAfter', function(){
					    	$('#' + afterTo).removeClass('blurAfter');
					    	$('#' + afterTo).nextUntil('#' + len).fadeIn();
					    	$('#btnDisplayAfter').fadeOut(function(){
					    		$('#btnHideAfter').fadeIn();
					    	});
					    });
					    //click on "Hide previous verses" button hides previous verses and displays "Display previous verses" button
					    $('body').on('click', '#btnHideBefore', function(e){
					    	$('#' + beforeFrom).addClass('blurBefore');
					    	$('#1').nextUntil('#' + beforeFrom).andSelf().fadeOut();
					    	$('#btnHideBefore').fadeOut(function(){
					    		$('#btnDisplayBefore').fadeIn();
					    	});
					    	document.getElementsByClassName("title")[0].scrollIntoView();
					    	return false;
					    });
					    //click on "Hide next verses" button hides next verses and displays "Display next verses" button
					    $('body').on('click', '#btnHideAfter', function(){;
					    	$('#' + afterTo).addClass('blurAfter');
					    	$('#' + afterTo).nextUntil('#' + len).fadeOut();
					    	$('#btnHideAfter').fadeOut(function(){
					    		$('#btnDisplayAfter').fadeIn();
					    	});
					    	$('#' + len).before('<br><br>');
					    });
					});
				}
				else {
					$('input').prev('a').css({"color":"#FB7900","font-weight":"500" });
					$('#todayPortionValidate').hide();
					$('#notTodayValidate').slideDown(400); //if no portion for today, alert the user
				}
	        },
	        error: function() {
            	window.location.reload(true);
            },
            complete: function() {
            	clearTimeout(timer);
            	$('#waitDiv').hide();
            	$('#weekReading').show();
            }
	    });
	});

	/**
	 * [Replace anchor behavior : keep hash at 'todayReading' and jump to the requested link on the page, typically a research on a verse]
	 */
	$('body').on('click', 'a:not(.menu)', function(){
		href = this.href.split('#'); //get href of the link
		if (document.getElementById(href[1]) != null) {
			document.getElementById(href[1]).scrollIntoView(); //find element targeted by href and jump to it
			return false; //stop propagation (and disable normal anchor behavior, that is to say change the hash)
		}
	});


	/**
	 * [Zoom in / zoom out mgmt]
	 */
	$('body').on('click', '#zoomIn', function(){
		var size = parseInt($('#weekReading').css('font-size')) + 1;
		$('#weekReading').css({'font-size': size + 'px'});
	});

	$('body').on('click', '#zoomOut', function(){
		var size = parseInt($('#weekReading').css('font-size')) - 1;
		$('#weekReading').css({'font-size': size + 'px'});
	});

	/**
	 * [End zoom in / zoom out mgmt]
	 */

	/**
	 * [checkIfPortion : checks if portion today and which one according to user data]
	 * @return {[array]} [language, week and filename to download]
	 */
	function checkIfPortion() {
	    var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
	    var sessionUserData = JSON.parse(localStorage.getItem("sessionUserData")); // retrieve user data
	    if(today == 0) { today = 7; }//otherwise Sunday = 0
	    var day;
	    var dayConfig;
	    var totalDays = 0;
	    var beforeFirstCycleDay = 0;
	    var portionNumber=0;

	    //find what "day" it is compared to the first reading day
	    for(var i=1;i<8;i++)
	    {
	      day = 'sessionUserData.day' + i;
	      dayConfig = eval(day);

	      if(dayConfig == 1)
	      {
	        totalDays++;
	        if(i < sessionUserData.firstDay) { beforeFirstCycleDay = 1; }

	        //2 possibles cases :
	        //1st case :  if current day is greater than the "first" day of the cycle, count current day + days greater than the "first" day + days smaller than the current day
	        if(today > sessionUserData.firstDay && i <= today && i >= sessionUserData.firstDay) { portionNumber++; }
	        //2nd case : if current day is smaller than the "first" day of the cycle, count current day + days smaller than the current day + days greater than the "first" day + "first" day
	        else if(today < sessionUserData.firstDay && ( (i <= today) || (i >= sessionUserData.firstDay)) ) { portionNumber++; }
	      }
	    }
	    if(today == sessionUserData.firstDay) { portionNumber = 1; }
	    var nextWeek = 0;
	    if(today >= sessionUserData.firstDay && beforeFirstCycleDay == 1) { nextWeek = 1; } //find what week (current or next one) to look for

	    var todayDate = new Date();
	    var currentWeek = getWeekNumber(todayDate); //find current week number

	    if(nextWeek == 1) {
	      if(currentWeek == 53) { currentWeek = "01"; }
	      else { currentWeek++; }
	    }
	    if(currentWeek < 10) { currentWeek = "0" + currentWeek; }

	    var file =  totalDays + "" + portionNumber;
	    var data = {'lang' : sessionUserData.readingLang, 'week' : currentWeek, 'file' : file };
	    return data;
	}

	/**
	 * [getWeekNumber : for a given date, get the ISO week number]
	 * @param  {[date]} d [date]
	 * @return {[int]}   [week number]
	 */
	function getWeekNumber(d) {
     	var target = new Date(d.valueOf()),
          dayNumber = (d.getUTCDay() + 6) % 7,
          firstThursday;

        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setUTCMonth(0, 1);

        if (target.getUTCDay() !== 4) {
            target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
        }

        return Math.ceil((firstThursday - target) /  (7 * 24 * 3600 * 1000)) + 1;
  	}
}
