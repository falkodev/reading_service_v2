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
    // Switch section
    $("a", '.menu').click(function()
    {
        if (!$(this).hasClass('active')) {
            current_item = this;
            // close all visible divs with the class of .section
            $('.section:visible').fadeOut(section_hide_time, function() {
                // console.log("id menu : " + $(current_item).attr('href'));
                $('a', '.mainmenu').removeClass('active');
                $(current_item).addClass('active');
                var new_section = $($(current_item).attr('href'));
                new_section.fadeIn(section_show_time);
            });
        }
        if ($(this).attr('href') == "#subscribe") {
            $("#subscribeFirst").show();
            $("#subscribeSecond").hide();
            $("#subscribeThird").hide();
            $('#subscribeConfirm').hide();
        }
        else if ($(this).attr('href') == "#login") {
            $("#loginValidate").hide();
            $("#loginValidate").html();
            $("#contentLogin").show("slow");
        }
        else if ($(this).attr('href') == "#logout") {
            $('.section:visible').fadeOut(section_hide_time, function() {
                $('a', '.mainmenu').removeClass('active');
                $('#login').addClass('active');
                $('#accountFirst').hide();
                $('#accountSecond').hide();
                $('#accountThird').hide();
                $('#messageConfirm').hide();
                $('#menuLogin').attr('href', '#login');
                $('ul.displayNone').css('display', 'none');
                $('#login').fadeIn(section_show_time);
                if(lang == 'fr') $('#loginValidate').html('Vous avez bien été déconnecté');
                else $('#loginValidate').html('You have been logged out');
                $("#loginValidate").slideDown(400);
                //clean every input
                $(':input').val('');
                $('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');

                $.ajax({
                    type: "POST",
                    url: "ajax/logout.php",
                    data: "",
                    success: function(msg) {
                    }
                });
            });
        }
        return false
    });
});