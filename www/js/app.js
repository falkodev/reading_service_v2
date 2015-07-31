(function () {
  /**
   * global variables
   */
  window.lang;
  window.langList;
  window.hash;
  window.userData = '';

  var slider = new PageSlider($('#tmplContent'));
  // browser language detection and load corresponding language file 
  lang = window.navigator.userLanguage || window.navigator.language;
  lang.substr(0,2);
  lang = $.trim(lang);

  
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
            langList = v.split("\n");
            var found = false;          
            $.each(langList, function(key, value){
              value = $.trim(value);
              if(lang == value) { found = true; }                        
            }) 
            if(!found) { lang = 'en'; }             
          }
      })
    }
  })

  $('body').append('<script src="assets/lang/' + lang + '.js"></script>');
  
  /**
   * [analyzeHash : analyze hash and determine what view or template to request]
   */
  window.analyzeHash = function() {
    hash = window.location.hash.substr(1);
    if(!hash) {
      hash = 'home';
    }
    var activeMenu = hash + '_active';
    loadTemplate('menu', activeMenu, null, false);
    displayView();
  }
  
  //app init : first request
  analyzeHash();

  //every new request changes the hash
  $(window).on('hashchange', function(){
    analyzeHash();
  });

  
  /**
   * [displayView : get the view corresponding to the hash, in order to load the associated template with context added by the view ]
   */
  function displayView() {
    var view   = "new " + hash + "View()";
    var result = eval(view);
    var displaySubscribe = false;

    //determine if subscribe view is calling    
    if(hash == 'account' && result) { 
      $.each(result, function(key, value){
          if(key == 'account' && value == '') { displaySubscribe = true; }
      })
    }

    loadTemplate(hash, null, result, displaySubscribe);
  }
  

  /**
   * [loadTemplate : get a template, compile it with handblebars.js and return his html content]
   * @param  {tmpl_name  : template name [string]}
   * @param  {activeMenu : menu name - optional [string]}
   * @param  {result : additional context from the calling view - optional [object]}
   * @param  {displaySubscribe : if subscribe view is calling, display account template with subscribe labels - optional [boolean]}
   * @return {htmlContent [handlebars compiled function]}
   */
  function loadTemplate(tmpl_name, activeMenu, result, displaySubscribe) {
    var tmpl_url = 'js/templates/' + tmpl_name + 'Template.html';
    var htmlContent;
    var context = {};

    $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        async: false,
        success: function(data) {          
          var i=0  ;    

          //if subscribe view is calling, all "account_" occurrences will be replaced by "subscribe_" occurrences in order to use the account template for the subscribing process
          if(displaySubscribe) { data = data.replace(new RegExp('{{account_', 'g'), '{{subscribe_'); }

          // find Handlebars expressions in nude template (before compilation)  
          var tab = data.split("{{");
          $.each(tab, function(key, value){
            if(i > 0) {
              var cond = value.substr(0,4);
              //avoid built-in helpers (if, else, each, ...), partials ({{> xxx}}) and raw blocks ({{{xxx}}})
              if(value[0] != "#" && value[0] != "/" && value[0] != ">" && value[0] != "{" && cond != "else") { 
                var tab2 = value.split("}}");
                var expr = tab2[0];
                // build context for future Handlebars compilation
                context[expr] = eval(expr);
              }
            }
            i++;
          });

          if(activeMenu) { context[activeMenu] = 'active'; } // case of menu loading 
          if(result) { 
            $.each(result, function(key, value){
                context[key] = value; // add additional parameters to context
            });
          }          
          // $.each(context, function(key, value){
          //     console.log("context[" + key + "]: " + value)
          // })
          // console.log("-------------fin context------------")
          // compile template
          var template = Handlebars.compile(data);
          var html     = template(context);
          html         = escapeLink(html);
          if(activeMenu) { $('#menuContent').html(html); } // case of menu loading
          else { slider.slidePage($('<div>').html(html)); }
        } 
    });
  }

  /**
   * [escapeLink : convert 'a href' links in readable content ]
   * @param  {[string]} str ['a' link to convert]
   * @return {[string]}     [link converted]
   */
  function escapeLink(str) {
    str = str.replace(new RegExp('&lt;', 'g'), '<');
    str = str.replace(new RegExp('&gt;', 'g'), '>');
    str = str.replace(new RegExp('&quot;', 'g'), '"');
    str = str.replace(new RegExp('&#x27;', 'g'), '\'');
    str = str.replace(new RegExp('{{{', 'g'), '');
    str = str.replace(new RegExp('}}}', 'g'), '');
    return str;
  }

  /**
   * [validateEmail : test if email address is valid]
   * @param  {[string]} sEmail [email address to validate]
   * @return {[boolean]} [response if is valid or not]
   */
  window.validateEmail = function(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
  }
}());