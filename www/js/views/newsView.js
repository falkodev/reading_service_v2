var newsView = function () {
	$.ajax({
        type: "GET",
        url: "http://www.jwreading.com/ajax/rss.php",
        dataType: 'html',
        data: {'lang' : lang, 'full' : true },        
        success: function(html){            	
        	var newsLength = $('.news', html).length;	  
        	$('#feed').html(html);
    	}
    });	
}