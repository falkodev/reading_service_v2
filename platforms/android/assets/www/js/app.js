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
  
  var slider = new PageSlider($('#tmplContent'));
  //routes determined by hash
  $(window).on('hashchange', function(){
    var hash = window.location.hash.substr(1);
    var activeMenu = hash + 'Active';
    loadMenu(activeMenu);
    slider.slidePage($('<div>').load( 'js/templates/' + hash + 'Template.html'));
  });

  //default page when no hash
  $('#tmplContent').load('js/templates/homeTemplate.html');
  // $('#tmplContent').html(loadTemplate('home'));
  loadMenu('homeActive');
  
  /**
   * call the menu template and set the active menu (with handlebars.js)
   * @param  {activeMenu [string]}
   */
  function loadMenu(activeMenu)
  {
    var loaded = loadTemplate('menu');
    // var data = { [activeMenu] : 'active' };
    var obj = {};
    obj[activeMenu] = 'active';
    var data=[];
    data.push(obj);
    // $.each(data[0], function(k, v){
    //   console.log('data[' + k + ']:' + v);
    // });
    // var data = { 'homeActive' : 'active' };
    $('#menuContent').html(loaded(data[0]));
  }

  /**
   * get a template, compile it with handblebars.js and return his html content
   * @param  {tmpl_name [string]}
   * @return {htmlContent [handlebars compiled function]}
   */
  function loadTemplate(tmpl_name) {
    var tmpl_url = 'js/templates/' + tmpl_name + 'Template.html';
    var htmlContent;
    $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        async: false,
        success: function(data) {
            htmlContent = Handlebars.compile(data);
        } 
    });
    return htmlContent;
  }
}());