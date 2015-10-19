var firstTimeView = function () {
    var result = {};
    var link = '<div style="margin-bottom: 50px">';

    $(document).ready(function(){
        var speed = 800;
        var offsetContent = $("#content1").offset(); //position de la boite "content"
        var offsetWidth = $("#content1").outerWidth();
        var offsetRight = offsetContent.left + offsetWidth;
        $("#content1").hide();
        $("#topbar").offset({left: offsetContent.left, top: offsetContent.top});
        $("#topbar").animate({width: offsetWidth}, speed,
                function() {
                    $("#rightbar").offset({top: offsetContent.top, left: offsetRight - 1});
                    var offsetHeight = $("#content1").outerHeight();
                    $("#rightbar").animate({height: offsetHeight + 1}, speed,
                            function() {
                                offsetRight = $(window).width() - offsetRight - 16;
                                $("#bottombar").css({top: offsetHeight - 1, right: offsetRight});
                                $("#bottombar").animate({width: offsetWidth - 1}, speed,
                                        function() {
                                            var offsetBottom = $(window).height() - offsetHeight - offsetContent.top - 1;
                                            offsetBottom = 0;
                                            console.log("total height : " + $(window).height() + " offsetContent top : " + offsetContent.top + " offsetBottom : " + offsetBottom);
                                            $("#leftbar").css({left: offsetContent.left, top: "auto", bottom: offsetBottom });
                                            $("#leftbar").animate({height: offsetHeight }, speed, 
                                                function() {
                                                        $("#topbar").fadeOut(speed);
                                                        $("#leftbar").fadeOut(speed);
                                                        $("#bottombar").fadeOut(speed);
                                                        $("#rightbar").fadeOut(speed, function() {
                                                            $("#content1").fadeIn(speed);
                                                        });                                                                                                                   
                                            });
                                });
                    });
        });
    });

    
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

    $('body').on('click', '#firstTimeNextBtn', function(e){
        var heightContent1 = $("#content1").height(); 
        var topContent1 = $("#content1").offset().top; 
        var marginTopContent1 = $("#content1").css('margin-top');
        var windowHeight = $(window).height();
        var marginTopContent2 = marginTopContent1.substr(0, marginTopContent1.length - 2);
        marginTopContent2 = parseInt(marginTopContent2) + 100;
        var newPosition = heightContent1 + topContent1 + 45;
        // console.log('marginTopContent1:' + marginTopContent1 + ' marginTopContent2:' + marginTopContent2 + ' newPosition:' + newPosition);
        $('#content2').css({'margin-top': windowHeight}).css('visibility','visible');
        $(function () {
            $("#content1").animate({'margin-top': -newPosition}, 1200);
            $("#content2").animate({'margin-top': marginTopContent2}, 1500, function(){
                $("#content1").css('visibility','hidden');
            });
        });
        localStorage.setItem("firstTimeOver", true);
    });

    $('body').on('click', '#firstTimePreviousBtn', function(e){
        $('#content1').css('visibility','visible');
        $(function () {
            $("#content1").animate({'margin-top': 0}, 1500, function(){
                $("#content2").css('visibility','hidden');
            });
        });
        localStorage.removeItem("firstTimeOver");
    });

    return result;
}