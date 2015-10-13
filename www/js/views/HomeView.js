var homeView = function () {
    var result = {};
    var link = '';

    /**
     * [on click on a language in homeTemplate, remove previous language and add new language in the view]
     */
    $('body').off('click').on('click', '.linkLang', function(e){
        $('script[src="assets/lang/' + lang + '.js"]').remove(); //remove previous language file
        lang = $(this).text().toLowerCase();
        lang = $.trim(lang);
        localStorage.setItem("lang", lang);       
        $('body').append('<script src="assets/lang/' + lang + '.js"></script>');
        analyzeHash(); // refreshes view
      })

    /**
     * [create an html line of links to display languages in homeView]
     */
    var i = 0;                    
    $.each(langList, function(key, value){
        value = $.trim(value);
        if(i != 0) { link += ' | '; }  
        if(localStorage.getItem("lang") == value) { link += value.toUpperCase(); }        
        else { link += '<a class="linkLang">'+ value.toUpperCase() + '</a>'; }
        i++;
    })  

    result.lang_links = link; // will be added in the context for handlebars compilation
    return result;
}