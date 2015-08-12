// global. currently active menu item 
var current_item = 0;

// few settings
var section_hide_time = 800;
var section_show_time = 800;

var password;
var lang;
var size;

// jQuery stuff
jQuery(document).ready(function($) {
    $(document).on( "click", ".questionTitle", function(){
        var str = $(this).attr('id');
        var pattern = /[0-9]+/;
        var id = str.match(pattern);        
        $("#answer"+id).toggle("slow");
    });

    $(document).on( "click", ".navbar-toggle", function(){
    	var w = $(window).width();
    	if(w < 768) {    		    		
    		if(!$('#tmplContent').hasClass("menu-open")) {
    			$('#tmplContent').addClass("menu-open");
	    	}
	    	else {
	    		$('#tmplContent').removeClass("menu-open");
	    	}
    	}
  //   	else {
		// 	$('#tmplContent').css({"position":"static", "left":"auto", "top":"auto"});
		// }
    });

    $(document).on( "click", function(){
    	var w = $(window).width();
    	if(w < 768) { 
    		$('#tmplContent').removeClass("menu-open");
		}
		// else {
		// 	$('#tmplContent').css({"position":"static", "left":"auto", "top":"auto"});
		// }
    });
});