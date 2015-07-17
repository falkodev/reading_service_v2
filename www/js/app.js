(function () {
  var slider = new PageSlider($('#tmplContent'))
  // browser language detection and load corresponding language file 
  var lang = window.navigator.userLanguage || window.navigator.language
  lang = lang.substr(0,2)
  $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
  
  //routes determined by hash
  $(window).on('hashchange', function(){
    var hash = window.location.hash.substr(1)
    var activeMenu = hash + 'Active'
    loadTemplate('menu', activeMenu)
    loadTemplate(hash)
  });

  //default page when no hash
  loadTemplate('menu', 'homeActive') //default menu
  loadTemplate('home') //homepage
  

  /**
   * get a template, compile it with handblebars.js and return his html content
   * @param  {tmpl_name [string]}
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
          if(activeMenu != null) { $('#menuContent').html(html) } // case of menu loading
          else { slider.slidePage($('<div>').html(html)) }
        } 
    });
  }
}());