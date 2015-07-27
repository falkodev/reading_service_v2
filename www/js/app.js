/**
 * global variables
 */
var lang
var langList
var hash

function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
      return true;
  }
  else {
      return false;
  }
}

(function () {
  var slider = new PageSlider($('#tmplContent'))
  // browser language detection and load corresponding language file 
  lang = window.navigator.userLanguage || window.navigator.language
  lang.substr(0,2)
  lang = $.trim(lang)
  
  /**
   * [get languages file and determine what language to display - english by default if language not found]
   */
  $.ajax({
    url: 'assets/lang/langs.txt',
    async: false,
    complete: function(data)
    {
      $.each(data, function(k,v){
          if(k == 'responseText') {
            langList = v.split("\n")
            var found = false            
            $.each(langList, function(key, value){
              value = $.trim(value)
              if(lang == value) { found = true }                        
            }) 
            if(!found) { lang = 'en' }             
          }
      })
    }
  })

  $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
  
  /**
   * [analyzeHash : analyze hash and determine what view or template to request]
   */
  window.analyzeHash = function() {
    hash = window.location.hash.substr(1)
    var viewParams = {}
    if(!hash) {
      hash = 'home'
    }
    var activeMenu = hash + '_active'
    loadTemplate('menu', activeMenu)
    displayView(hash, viewParams)
  }
  
  //app init : first request
  analyzeHash()

  //every new request changes the hash
  $(window).on('hashchange', function(){
    analyzeHash() 
  })

  
  /**
   * [displayView : get the view corresponding to the hash, in order to load the associated template with context added by the view ]
   * @param  {[string]} hash [hash from the url]
   */
  function displayView(hash, viewParams) {
    var view   = "new " + hash + "View(viewParams)"
    var result = eval(view) 
    loadTemplate(hash, null, result)
  }
  

  /**
   * [loadTemplate : get a template, compile it with handblebars.js and return his html content]
   * @param  {tmpl_name  : template name [string]}
   * @param  {activeMenu : menu name - optional [string]}
   * @param  {result : additional context from the calling view - optional [object]}
   * @return {htmlContent [handlebars compiled function]}
   */
  function loadTemplate(tmpl_name, activeMenu, result) {
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
          if(activeMenu) { context[activeMenu] = 'active' } // case of menu loading 
          if(result) { 
            $.each(result, function(key, value){
                context[key] = value // add additional parameters to context
            })
          }
          // compile template
          var template = Handlebars.compile(data)
          var html     = template(context)
          html         = escapeLink(html)
          if(activeMenu) { $('#menuContent').html(html) } // case of menu loading
          else { slider.slidePage($('<div>').html(html)) }
        } 
    })
  }

  /**
   * [escapeLink : convert 'a href' links in readable content ]
   * @param  {[string]} str ['a' link to convert]
   * @return {[string]}     [link converted]
   */
  function escapeLink(str) {
    str = str.replace(new RegExp('&lt;', 'g'), '<')
    str = str.replace(new RegExp('&gt;', 'g'), '>')
    str = str.replace(new RegExp('&quot;', 'g'), '"')
    str = str.replace(new RegExp('&#x27;', 'g'), '\'')
    str = str.replace(new RegExp('{{{', 'g'), '')
    str = str.replace(new RegExp('}}}', 'g'), '')
    return str
  }
}());