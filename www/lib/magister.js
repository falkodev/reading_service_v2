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
    } );
});