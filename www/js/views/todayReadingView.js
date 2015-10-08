var todayReadingView = function () {
	$(function($){
		var sessionUserData = JSON.parse(sessionStorage.getItem("sessionUserData")); // retrieve user data
		var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
		// console.log('today: ' + today);
		if(today == 0) today = 7; //otherwise Sunday = 0
		var day;
		var dayConfig;
		//déterminer ici quel "jour" on est par rapport au 1er jour de lecture (reprendre logique PHP) puis déterminer quelle semaine prendre (l'actuelle ou la suivante) + gérer derniere semaine de l'année
		//lire dans la portion du jour (fichier html sur serveur) : déterminer que la portion va de "xx:xx à yy:yy"
		var nbJours = 0; 
		var beforeFirstCycleDay = 0;
		var numeroPortion=0;
		
		for(var i=1;i<8;i++)
		{
			day = 'sessionUserData.day' + i;
			dayConfig = eval(day); 

			if(dayConfig == 1) 
			{
				nbJours++;
				if(i < sessionUserData.firstDay) { beforeFirstCycleDay = 1; }
				
				//2 cas de figure : 
				//1er cas :  si le jour actuel est plus grand que le "premier" jour du cycle, il faut prendre en compte le jour actuel + les jours à la fois plus grands que le "premier" jour et plus petits que le jour actuel
				if(today > sessionUserData.firstDay && i <= today && i >= sessionUserData.firstDay) { numeroPortion++; }
				//2e cas : si le jour actuel est plus petit que le "premier" jour du cycle, il faut prendre en compte le jour actuel + les jours plus petits que le jour actuel + les jours plus grands que le "premier" jour + le "premier" jour
				else if(today < sessionUserData.firstDay && ( (i <= today) || (i >= sessionUserData.firstDay)) ) { numeroPortion++; }
			}
		}
		if(today == sessionUserData.firstDay) { numeroPortion = 1; }
		// console.log('numeroPortion:' + numeroPortion + ' nbJours:' + nbJours);
		var semaineProchaine = 0;
		if(today >= sessionUserData.firstDay && beforeFirstCycleDay == 1) { semaineProchaine = 1; }

		var todayDate = new Date();
		var currentWeek = getWeekNumber(todayDate);

		if(semaineProchaine == 1) { 
			if(currentWeek == 53) { currentWeek = "01"; }
			else { 
				currentWeek++; 
				if(currentWeek < 10) { currentWeek = "0" + currentWeek; }
			}
		}
		// console.log('week ' + currentWeek);	

		var file = 	nbJours + "" + numeroPortion;
		$.ajax({
	        type: "GET",
	        url: "http://www.jwreading.com/ajax/getContents.php",
	        dataType: 'html',
	        data: {
	        	'lang' : sessionUserData.readingLang,
	        	'week' : currentWeek,
	        	'file' : file },        
	        success: function(html){ 
	        	// console.log(html);  
	        	data = JSON.parse(html); 
	        	$('#todayPortionFrom').html(data['from']);
	        	$('#todayPortionTo').html(data['to']);
	        	$('#weekReading').html(data['content']);
    			day = 'sessionUserData.day' + today;
				dayConfig = eval(day); // today in the user config
	        	if(dayConfig == 1) {
	        		var len = $('span.anchor').length;	 
	        		// console.log('len:' + len);       		
	        		// len = len - 3;
					var idFrom = $('input[value="' + data['from'] + '"]').parent().css({"color":"#fff","font-weight":"500" }).attr('id'); 
		        	$('input[value="' + data['from'] + '"]').prev('a').css({"color":"#fff","font-weight":"600" }); 
		        	var idTo = $('input[value="' + data['to'] + '"]').parent().css({"color":"#fff","font-weight":"500" }).attr('id'); 
		        	$('input[value="' + data['to'] + '"]').prev('a').css({"color":"#fff","font-weight":"600" }); 
		        	$('#' + idFrom).nextUntil('#' + idTo).css({"color":"#fff","font-weight":"500" }).find('a').css({"color":"#fff","font-weight":"600" }); 
		        	
		        	if(idFrom != 1) { 
		        		var beforeFrom = parseInt(idFrom) - 1;
		        		$('#1').nextUntil('#' + beforeFrom).andSelf().hide(); 
		        		$('#'  + beforeFrom).addClass('blurBefore'); 
		        		$('#' + beforeFrom).after($('#btnDisplayBefore').show());
	        			$('#' + beforeFrom).after($('#btnHideBefore'));
	        			$('#btnHideBefore').before('<br><br>');
	        			$('#btnDisplayBefore').after('<br><br>');
		        	}  
		        	if(idTo != len) { 
		        		var afterTo = parseInt(idTo) + 1;
		        		$('#' + afterTo).addClass('blurAfter'); 		        				   
		        		$('#' + afterTo).nextUntil('#' + len).hide();      
		        		$('#' + idTo).after('<br><br>');
		        		$('#' + len).before('<br><br>');
	        			$('#' + afterTo).before($('#btnDisplayAfter').show());
	        			$('#' + afterTo).before($('#btnHideAfter'));
	        			$('#btnHideAfter').after('<br><br>');
		        	}
		        	var topIdFrom = $('#' + idFrom).offset().top;
		        	var margin = 100;
		        	$('#resize').hide();
		        	if($(window).width() > 767) { margin = 200; $('#resize').show();}
		        	// $('#todayPortionValidate').css({'top':topIdFrom - margin}); 
		        	$('#todayPortionValidate').slideDown(400);
		        	
	        		$(document).ready(function(){
	        			$(".closeTip").click(function() {      
			  	 	        $(".tip").slideUp(400);
			   	    	});

					    $('body').on('click', '#btnDisplayBefore', function(){
					    	$('#' + beforeFrom).removeClass('blurBefore'); 	
					    	$('#1').nextUntil('#' + beforeFrom).andSelf().show();      
					    	$('#btnDisplayBefore').hide();
					    	$('#btnHideBefore').show();	 
					    	window.location.replace('#' + beforeFrom); 		
					    });
					    $('body').on('click', '#btnDisplayAfter', function(){
					    	$('#' + afterTo).removeClass('blurAfter'); 	
					    	$('#' + afterTo).nextUntil('#' + len).show();      	
					    	$('#btnDisplayAfter').fadeOut(function(){
					    		$('#btnHideAfter').fadeIn();
					    	});	
					    });
					    $('body').on('click', '#btnHideBefore', function(){
					    	$('#' + beforeFrom).addClass('blurBefore'); 	
					    	$('#1').nextUntil('#' + beforeFrom).andSelf().hide();      
					    	$('#btnDisplayBefore').show();
					    	$('#btnHideBefore').hide();	
					    	window.location.replace('#' + beforeFrom); 	
					    });
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
					$('#notTodayValidate').slideDown(400);
				}
	        }
	    });	
	});		

	$('body').on('click', '#zoom', function(){
		var size = parseInt($('#weekReading').css('font-size')) + 1;
		$('#weekReading').css({'font-size': size + 'px'});
	});

	$('body').on('click', '#dezoom', function(){
		var size = parseInt($('#weekReading').css('font-size')) - 1;
		$('#weekReading').css({'font-size': size + 'px'});
	});

	//  For a given date, get the ISO week number
    function getWeekNumber(d) {
	    // Copy date so don't modify original
	    d = new Date(+d);
	    d.setHours(0,0,0);
	    // Set to nearest Thursday: current date + 4 - current day number
	    // Make Sunday's day number 7
	    d.setDate(d.getDate() + 4 - (d.getDay()||7));
	    // Get first day of year
	    var yearStart = new Date(d.getFullYear(),0,1);
	    // Calculate full weeks to nearest Thursday
	    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
	    // Return week number
	    return weekNo;
	}
}