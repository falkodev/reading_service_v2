var dashboardView = function () {
	//get daily text
	$.post("http://www.jwreading.com/ajax/getDailyText.php", 
	   { 'lang': localStorage.getItem("lang") }, function(data) {}).complete(function(data) {
		result = data['responseText'].trim();
		$('#dailyText').html(result);
	});

	//get rss feed
    $.ajax({
        type: "GET",
        url: "http://www.jwreading.com/ajax/rss.php",
        dataType: 'html',
        data: {'lang' : localStorage.getItem("lang") },        
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
}