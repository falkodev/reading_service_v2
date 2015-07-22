(function () {
  var slider = new PageSlider($('#tmplContent'))
  // browser language detection and load corresponding language file 
  var lang = window.navigator.userLanguage || window.navigator.language
  lang.substr(0,2)
  $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
  
  //app init : first request
  displayPage() 

  //every new request changes the hash
  $(window).on('hashchange', function(){
    displayPage() 
  })

  /**
   * [displayPage : analyze hash and determine what template to request]
   */
  function displayPage() {
    var hash = window.location.hash.substr(1)
    if(!hash) {
      hash = 'home'
    }
    var activeMenu = hash + '_active'
    loadTemplate('menu', activeMenu)
    if(hash == 'home') { 
      var lines = new HomeView() 
      $.each(lines, function(key, value){
          console.log("lines:" + value)
      })
      loadTemplate('home', null, lines) // charger un 3e parametre ds loadTemplate : tableau qui sera ajouté au contexte pr affichage des langues
    }
    else
    {
      loadTemplate(hash)
    }
  }

  /**
   * [on click on a language in homeTemplate, remove previous language and add new language in the view]
   */
  $(".linkLang").click(function()
  {
    $('script[src="assets/lang/' + lang + '.js"]').remove() //remove previous language file
    lang = $(this).text().toLowerCase()
    $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
    displayPage() // refreshes view
  })
  

  /**
   * [loadTemplate : get a template, compile it with handblebars.js and return his html content]
   * @param  {tmpl_name  : template name [string]}
   * @param  {activeMenu : menu name - optional [string]}
   * @return {htmlContent [handlebars compiled function]}
   */
  function loadTemplate(tmpl_name, activeMenu) {
    var tmpl_url = 'js/templates/' + tmpl_name + 'Template.html'
    var htmlContent
    var context = {}

    $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        async: false,
        success: function(data) {
          // find Handlebars expressions in nude template (before compilation)
          var i=0          
          var tab = data.split("{{")
          $.each(tab, function(key, value){
            if(i > 0) {
              var tab2 = value.split("}}")
              var expr = tab2[0]
              // build context for future Handlebars compilation
              context[expr] = eval(expr)
            }
            i++
          })
          if(activeMenu != null) { context[activeMenu] = 'active' } // case of menu loading 
          // compile template
          var template = Handlebars.compile(data)
          var html = template(context)
          html = escapeLink(html)
          if(activeMenu != null) { $('#menuContent').html(html) } // case of menu loading
          else { 
            slider.slidePage($('<div>').html(html)) 
            // return html
          }
        } 
    })
  }

  /**
   * [escapeLink : convert 'a href' links in readable content ]
   * @param  {[string]} str ['a' link to convert]
   * @return {[string]}     [link converted]
   */
  function escapeLink(str) {
    str = str.replace(new RegExp('{{{&lt;', 'g'), '<')
    str = str.replace(new RegExp('&gt;}}}', 'g'), '>')
    str = str.replace(new RegExp('&#x27;', 'g'), '\'')

    return str
  }
}());