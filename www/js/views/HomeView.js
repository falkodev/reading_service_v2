var homeView = function () {
    var result = {}
    var link = ''
    var i = 0

    /**
     * [on click on a language in homeTemplate, remove previous language and add new language in the view]
     */
    $('body').on('click', '.linkLang', function(e){
        i++
        if(i == 1) { //to prevent multiple calls at once, only one call is admitted
            var time = new Date();
            console.log("time:" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
            $('script[src="assets/lang/' + lang + '.js"]').remove() //remove previous language file
            lang = $(this).text().toLowerCase()
            lang = $.trim(lang)
            console.log('lang:' +lang)
            $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
            displayPage() // refreshes view
        }
      })

    $.ajax({
        url: 'assets/lang/langs.txt',
        async: false,
        complete: function(data)
        {
            // console.log('always ')
            $.each(data, function(k,v){
                if(k == 'responseText') {
                    // console.log(v)
                    var lines = v.split("\n")
                    var i = 0                    
                    $.each(lines, function(key, value){
                        if(i != 0) { link += ' | ' }                        
                        link += '<a class="linkLang">'+ value.toUpperCase() + '</a>'
                        i++
                    })                
                }
            })
        }
    })

    result.lang_links = link
    return result
}