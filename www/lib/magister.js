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
    	var l = $('#tmplContent').css("left");
    	var w = $(window).width();
    	// console.log('l: ' + l + ' w: ' + w);
    	if(w < 768) {    		    		
    		if(l == "auto"|| l == "0px") {
	    		$('#tmplContent').css({"position":"relative", "left":"180px", "top":"-78px"});
	    		$('.navbar-toggle').css("left","160px");
	    		// console.log('left à 160 px');
	    	}
	    	else {
	    		$('#tmplContent').css({"position":"relative", "left":"0px", "top":"-78px"});
	    		$('.navbar-toggle').css("left","0px");
	    		// console.log('left à 0 px');
	    	}
    	}
    	else {
			$('#tmplContent').css({"position":"static", "left":"auto", "top":"auto"});
		}
		$('.mainmenu').css({"padding":"0px", "top":"-4px"});
		$('.dropdown-menu').css({"padding":" 30px 0 0 0"});
		// $('.navbar-toggle').css("margin"," 41px 0 0 0");
		// var d = $('.dropdown-menu').css("left");
		// console.log("dropdown-menu: " + d);
    });

    $(document).on( "click", function(){
    	var w = $(window).width();
    	if(w < 768) { 
	    	$('#tmplContent').css({"position":"relative", "left":"0px", "top":"-78px"});
	    	$('.navbar-toggle').css("left","0px");
			// console.log('left à 0 px');
		}
		else {
			$('#tmplContent').css({"position":"static", "left":"auto", "top":"auto"});
		}
		// var d = $('.dropdown-menu').css("left");
		// console.log("dropdown-menu: " + d);
		$('.mainmenu').css("padding","30px 0 0 0");
		$('.dropdown-menu').css({"padding":" 30px 0 0 0"});
		// $('.navbar-toggle').css("margin"," 0px 0 0 0");
    });
});