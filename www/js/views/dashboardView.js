var dashboardView = function () {
	//get daily text
	$.post("http://www.jwreading.com/ajax/getDailyText.php", 
	   { 'lang': lang }, function(data) {}).complete(function(data) {
		result = data['responseText'].trim();
		$('#dailyText').html(result);
	});

	//get rss feed
    $.ajax({
        type: "GET",
        url: "http://www.jwreading.com/ajax/rss.php",
        dataType: 'html',
        data: {'lang' : lang },        
        success: function(html){            	
        	var newsLength = $('.news', html).length;	  
        	var x = 1;
        	var y = 0;
        	var slider1 = new PageSlider($('#feed-rotator1')); //slide for left feed-rotator
        	var slider2 = new PageSlider($('#feed-rotator2')); //slide for right feed-rotator

        	function rotateNews(newsNumber, feedRotatorNumber) {
				var display = $('#news' + newsNumber, html); //get specific news to display
				$.each(display, function(key, value){
		    		$.each(value, function(k, v){
		    			if(k == 'outerHTML') {
		    				var displayLink = $('a', display); //get href link from this news
    						var sliderView = "slider" + feedRotatorNumber + ".slidePageFrom($('<div>').html(displayLink), 'right')";
    						var result = eval(sliderView); 
		    				return false;
		    			}
		    		});
		    	}); 
			}   

			var interval = window.setInterval(function() {
				if(y==0) { //first time 
        			$('#waitDiv').hide(); //when loading is done, hide the loading animation
        			y = 2; //feeding right feed rotator
        			rotateNews(x, y); 
    			} 
			}, 1000); // load animation during 1 second (enough to load rss feed)		     
			
        	var interval = window.setInterval(function() {
        		if(y == 1 || y == 2) {
        			y = 1;
					rotateNews(x, y); //feeding left feed rotator

					if(x == newsLength) { x = 0; }
					x++;
					y = 2;
					rotateNews(x, y); //feeding right feed rotator
				}					
			}, 5000); // display every news during 5 seconds		
        }
    });	

	//determine if user has a portion today, what portion it is and enable button to access the portion of the day if necessary
	var sessionUserData = JSON.parse(sessionStorage.getItem("sessionUserData")); // retrieve user data
	var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
	today++; //otherwise Sunday = 0
	var day = 'sessionUserData.day' + today;
	var dayConfig = eval(day); // today in the user config
	if(dayConfig) {
		//déterminer ici quel "jour" on est par rapport au 1er jour de lecture (reprendre logique PHP) puis déterminer quelle semaine prendre (l'actuelle ou la suivante) + gérer derniere semaine de l'année
		//lire dans la portion du jour (fichier html sur serveur) : déterminer que la portion va de "xx:xx à yy:yy"
		var nbJours = 0; 
		var beforeFirstCycleDay = 0;
		var numeroPortion=0;
		if(today == sessionUserData.firstDay) { numeroPortion = 1; }
		else {
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
		}
		// console.log('numeroPortion:' + numeroPortion);
		var semaineProchaine = 0;
		if(today >= sessionUserData.firstDay && beforeFirstCycleDay == 1) { semaineProchaine = 1; }
		
		var todayDate = new Date();
		var currentWeek = getWeek(todayDate);

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
	        	console.log(html);  
	        	data = JSON.parse(html); 
	        	$('#lecture').html(data['content']);
	        	var idFrom = $('input[value="' + data['from'] + '"]').parent().css("color", "red").attr('id'); 
	        	var idTo = $('input[value="' + data['to'] + '"]').parent().css("color", "red").attr('id'); 
	        	$('#' + idFrom).nextUntil('#' + idTo).css("color", "red");  
	        	location.hash = '#' + idFrom;
	        }
	    });	
	}

 	function getWeek(day) {
		var onejan = new Date(day.getFullYear(),0,1);
        var today = new Date(day.getFullYear(),day.getMonth(),day.getDate());
        var dayOfYear = ((today - onejan +1)/86400000);
        return Math.ceil(dayOfYear/7);
	}
}