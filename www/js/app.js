(function () {
  // // default route
  // router.addRoute('', function() {
  //   displayTemplate('homeTemplate');
  // });

  // // others routes
  // var path = ['home','faq'];
  // path.forEach(function(entry) {
  //     router.addRoute(entry, function() {
  //       displayTemplate(entry + 'Template');
  //     });
  // });

  // router.start();
  
  // browser language detection and load corresponding language file 
  var lang = window.navigator.userLanguage || window.navigator.language
  lang = lang.substr(0,2)
  $('body').append('<script src="assets/lang/' + lang + '.js"></script>')
  
  var slider = new PageSlider($('#tmplContent'))
  //routes determined by hash
  $(window).on('hashchange', function(){
    var hash = window.location.hash.substr(1)
    var activeMenu = hash + 'Active'
    loadMenu(activeMenu)
    slider.slidePage($('<div>').html(loadTemplate(hash)))
  });

  //default page when no hash
  slider.slidePage($('<div>').html(loadTemplate('home')))
  loadMenu('homeActive')
  
  /**
   * call the menu template and set the active menu (with handlebars.js)
   * @param  {activeMenu [string]}
   */
  function loadMenu(activeMenu)
  {
    var loaded = loadTemplate('menu')
    var obj = {}
    obj[activeMenu] = 'active'
    obj['homeTitle'] = homeTitle
    obj['faqTitle'] = faqTitle
    obj['contactTitle'] = contactTitle
    var data=[]
    data.push(obj)
    $('#menuContent').html(loaded(data[0]))
  }

  /**
   * get a template, compile it with handblebars.js and return his html content
   * @param  {tmpl_name [string]}
   * @return {htmlContent [handlebars compiled function]}
   */
  function loadTemplate(tmpl_name) {
    var tmpl_url = 'js/templates/' + tmpl_name + 'Template.html'
    var htmlContent
    $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        async: false,
        success: function(data) {
            htmlContent = Handlebars.compile(data)
        } 
    });
    return htmlContent
  }
}());