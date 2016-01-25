jQuery(document).ready(function($) {
  /***** menu *****/
  $(document).on("click", ".navbar-toggle", function(){
  	var w = $(window).width();
    var h = $(window).height() - 2;
  	if(w < 1025) {
      $('#menu-width').css('height', h);
  		if(!$('#tmplContent').hasClass("menu-open")) {
        $('#tmplContent').addClass("menu-open");
        if(w > 768) { //animation sliding menu
          if(w==769) { $('#menu-width').css('left', '-1.7em'); }
          else {
            //formula : (window.width - 770px)*0.028 + position for 770px (that is to say 1.7em)
            var menuPosition = w - 770;
            menuPosition = menuPosition * 0.028;
            menuPosition = menuPosition + 1.7;
            $('#menu-width').css('left', '-' + menuPosition + 'em');
          }
        } else { //under 768px
          $('#menu-width').css('left', '-1.2em');
        }
    	}
    	else {
    		$('#tmplContent').removeClass("menu-open");
        $('#menu-width').css('left', '-23em');
    	}
  	}
    else { $('#menu-width').css('left', ''); }
  });

  $(document).on("click", function(){
  	var w = $(window).width();
  	if(w < 1025) {
  		$('#tmplContent').removeClass("menu-open");
      $('#menu-width').css('left', '-23em');
	  }
    else { $('#menu-width').css('left', ''); }
  });
  /***** end menu *****/
});
