var firstTimeView = function () {
    var result = {};
    var link = '<div style="margin-bottom: 50px">';

    // $(document).ready(function(){
    //     var speed = 1000;
    //     var offsetContent = $("#content").offset(); //position de la boite "content"
    //     var offsetWidth = $("#content").outerWidth();
    //     var offsetRight = offsetContent.left + offsetWidth;
    //     $("#content").hide();
    //     $("#topbar").offset({left: offsetContent.left, top: offsetContent.top});
    //     $("#topbar").animate({width: offsetWidth}, speed,
    //             function() {
    //                 $("#rightbar").offset({top: offsetContent.top, left: offsetRight - 1});
    //                 var offsetHeight = $("#content").outerHeight();
    //                 $("#rightbar").animate({height: offsetHeight + 1}, speed,
    //                         function() {
    //                             offsetRight = $(window).width() - offsetRight;
    //                             $("#bottombar").css({top: offsetHeight + offsetContent.top - 1, right: offsetRight});
    //                             $("#bottombar").animate({width: offsetWidth}, speed,
    //                                     function() {
    //                                         var offsetBottom = $(window).height() - offsetHeight - offsetContent.top - 1;
    //                                         //console.log("total height : " + $(window).height() + " offsetContent top : " + offsetContent.top + " offsetBottom : " + offsetBottom);
    //                                         $("#leftbar").css({top: "auto", bottom: offsetBottom, left: offsetContent.left});
    //                                         $("#leftbar").animate({height: offsetHeight}, speed,
    //                                                 function() {
    //                                                     $("#content").fadeIn(speed);
    //                                                     $("#topbar").fadeOut(speed);
    //                                                     $("#leftbar").fadeOut(speed);
    //                                                     $("#bottombar").fadeOut(speed);
    //                                                     $("#rightbar").fadeOut(speed);
    //                                                 });
    //                                     });
    //                         });
    //             });
    // });

    
    /**
     * [on click on a language in homeTemplate, remove previous language and add new language in the view]
     */
    $('body').off().on('click', '.linkLang', function(e){
        $('script[src="assets/lang/' + lang + '.js"]').remove(); //remove previous language file
        lang = $(this).children().attr('data-lang');
        lang = $.trim(lang);
        localStorage.setItem("lang", lang);       
        $('body').append('<script src="assets/lang/' + lang + '.js"></script>');
        displayView('firstTime', null); // refreshes view
    }); 

    /**
     * [create an html line of buttons to display languages in dashboard]
     */
    var i = 0;                    
    $.each(langList, function(key, value){
        value = $.trim(value);
        if(value == "fr") { displayLang = "Français"; }
        else { displayLang = "English"; }
        if(localStorage.getItem("lang") == value) { link += '<div class="row"><button class="btn btn-lg btn-default btn-orange btn-width" data-lang="'+ value +'">' + displayLang + ' <i class="fa fa-check-square"></i></button></div>'; }        
        else { link += '<div class="row"><a class="linkLang"><button class="btn btn-lg btn-default btn-width" data-lang="'+ value +'">'+ displayLang + '</button></a></div>'; }
        i++;
    });  
    link += '</div>';
    result.lang_links = link; // will be added in the context for handlebars compilation
    return result;
}