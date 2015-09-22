var dashboardView = function () {
	
	$.post("http://www.jwreading.com/ajax/getDailyText.php", 
	   { 'lang': lang }, function(data) {}).complete(function(data) {
		result = data['responseText'].trim();
		// console.log('result: ' + result);
		$('#dailyText').html(result);
	});

    $.ajax({
        type: "GET",
        url: "http://www.jwreading.com/ajax/rss.php",
        dataType: 'html',
        data: {'lang' : lang },
        before: function() { $('#feed-rotator1').html("Chargement des actualités depuis jw.org"); },
        success: function(html){            	
        	var newsLength = $('.news', html).length;	  
        	var x = 1;
        	var y = 0;

        	function rotateNews(newsNumber, feedRotatorNumber) {
				var display = $('#news' + newsNumber, html);
				$.each(display, function(key, value){
		    		$.each(value, function(k, v){
		    			if(k == 'outerHTML') {
		    				var displayLink = $('a', display);
		    				$('#feed-rotator' + feedRotatorNumber).html(displayLink);
		    				return false;
		    			}
		    		});
		    	}); 
			}        
			
        	var interval = window.setInterval(function() {
        		y = 1;
				rotateNews(x, y); //feeding left feed rotator
				if(x == newsLength) { x = 0; }
				x++;
				y = 2;
				rotateNews(x, y); //feeding right feed rotator	
			}, 5000);   
        }
    });

	
}