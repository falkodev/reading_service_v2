var todayReadingView = function () {
	$(function($){
		$('#todayPortionValidate').hide();
		var sessionUserData = JSON.parse(localStorage.getItem("sessionUserData")); // retrieve user data
		var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
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
		        	var topIdFrom = $('#' + idFrom).offset().top; //where is the first verse of the portion in the page
		        	var margin = 100; // add 100px to show validate messages above this first verse
		        	if($(window).width() > 767) { margin = 200; }
		        	$('#notTodayValidate').hide();
		        	$('#todayPortionValidate').slideDown(400);
		        	
	        		$(document).ready(function(){
	        			$(".closeTip").click(function() {  // message "Today's portion is ..." can be removed by user when clicking on the cross
			  	 	        $(".tip").slideUp(400);
			   	    	});

	        			//click on "Display previous verses" button shows previous verses and displays "Hide previous verses" button
					    $('body').on('click', '#btnDisplayBefore', function(){
					    	$('#' + beforeFrom).removeClass('blurBefore'); 	
					    	$('#1').nextUntil('#' + beforeFrom).andSelf().show();      
					    	$('#btnDisplayBefore').fadeOut(function(){
					    		$('#btnHideBefore').fadeIn();
					    	});	
					    	window.location.replace('#' + beforeFrom); 		
					    });
					    //click on "Display next verses" button shows next verses and displays "Hide next verses" button
					    $('body').on('click', '#btnDisplayAfter', function(){
					    	$('#' + afterTo).removeClass('blurAfter'); 	
					    	$('#' + afterTo).nextUntil('#' + len).show();      	
					    	$('#btnDisplayAfter').fadeOut(function(){
					    		$('#btnHideAfter').fadeIn();
					    	});	
					    });
					    //click on "Hide previous verses" button hides previous verses and displays "Display previous verses" button
					    $('body').on('click', '#btnHideBefore', function(){
					    	$('#' + beforeFrom).addClass('blurBefore'); 	
					    	$('#1').nextUntil('#' + beforeFrom).andSelf().hide();      
					    	$('#btnHideBefore').fadeOut(function(){
					    		$('#btnDisplayBefore').fadeIn();
					    	});	
					    	window.location.replace('#' + beforeFrom); 	
					    });
					    //click on "Hide next verses" button hides next verses and displays "Display next verses" button
					    $('body').on('click', '#btnHideAfter', function(){
					    	$('#' + afterTo).addClass('blurAfter'); 	
					    	$('#' + afterTo).nextUntil('#' + len).hide();      
					    	$('#btnHideAfter').fadeOut(function(){
					    		$('#btnDisplayAfter').fadeIn();
					    	});	
					    	$('#' + len).before('<br><br>');					    	
					    });
					});
				}
				else {
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
}