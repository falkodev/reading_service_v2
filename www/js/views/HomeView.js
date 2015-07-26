var homeView = function (viewParams) {
    var result = {}
    var link = ''
    var k = 0

    /**
     * [on click on a language in homeTemplate, remove previous language and add new language in the view]
     */
    $('body').on('click', '.linkLang', function(e){
        if(k == 0) { //to prevent multiple calls at once, only one call is admitted
            $('script[src="assets/lang/' + lang + '.js"]').remove() //remove previous language file
            lang = $(this).text().toLowerCase()
            lang = $.trim(lang)
            $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
            analyzeHash() // refreshes view
        }
        k++
      })

    /**
     * [create an html line of links to display languages in homeView]
     */
    var i = 0                    
    $.each(langList, function(key, value){
        value = $.trim(value)
        if(i != 0) { link += ' | ' }  
        if(lang == value) { link += value.toUpperCase() }        
        else { link += '<a class="linkLang">'+ value.toUpperCase() + '</a>' }
        i++
    })  

    result.lang_links = link
    return result
}