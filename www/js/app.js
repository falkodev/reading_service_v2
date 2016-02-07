/******* Only mobile ********/
// phonegap/cordova event "deviceready" use for mobile
document.addEventListener("deviceready", onDeviceReady, false);

/**
 * [onDeviceReady schedule notifications]
 */
function onDeviceReady() {
  if(connectedUser && sessionUserData.modeApp) {
    // alert('onDeviceReady');
    //if user requested to be alerted when it's time to read a new portion
    // check and schedule notifications for week's portions and if necessary for daily texts

    var day   = new Date().getDate();
    var month = new Date().getMonth();
    var year  = new Date().getFullYear();
    var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
    if(today == 0) { today = 7; }//otherwise Sunday = 0

    for(var i=1;i<8;i++)
    {
      readingDay = 'sessionUserData.day' + i;
      dayConfig = eval(readingDay);
      if(dayConfig == 1) { // schedule notification for bible reading
        next_time = getNextWeekDay(new Date(year, month, day, sessionUserData.time_displayed, 00, 00), i);
        cordova.plugins.notification.local.schedule({
          id: i,
          title: notification_bible_reading_title,
          text: notification_bible_reading_text,
          at: next_time,
          data: {reading:true} // used to redirect user on the reading page
        });
        // alert('alert num ' + i + ' bible reading: ' + next_time);
      }
      if(sessionUserData.dailyComment == 1) { // schedule notification for daily text
        t = i + 7;
        next_time = getNextWeekDay(new Date(year, month, day, sessionUserData.time_displayed, 00, 00), i);
        cordova.plugins.notification.local.schedule({
          id: t,
          title: notification_daily_comment_title,
          text: notification_daily_comment_text,
          at: next_time
        });
        // alert('alert num ' + t + ' daily comment: ' + next_time);
      }
    }

    // when clicking on a notification in the notification center
    cordova.plugins.notification.local.on("click", function (notification) {
      if(notification.data == '{"reading":true}') { //lecture
        window.location.hash = '#todayReading';
      }
    });
  }
}

/**
 * [getNextWeekDay : calculate when next weekday will occur]
 * @param  {[date]} now [today's date]
 * @param  {[int]}  d   [day of the week to calculate]
 * @return {[type]}     [date of the next week day asked]
 */
function getNextWeekDay(now, d){
    if(d > now.getDay()) var x = d- now.getDay();
    else var x= ((7+d)-now.getDay())
    now.setDate( now.getDate() + x );
    return now;
}
/******* End only mobile ********/

(function () {

  /**
   * global variables
   */
  window.lang;
  window.langList;
  window.hash;
  window.connectedUser = false;
  window.sessionUserData;
  window.loggedOut = false;
  window.referrer = '';

  slider = new PageSlider($('#tmplContent'));

  // browser language detection and load corresponding language file
  if(localStorage.getItem("lang")) { lang = localStorage.getItem("lang"); }
  else {
    lang = window.navigator.userLanguage || window.navigator.language;
    lang = lang.substr(0,2);
    lang = $.trim(lang);
    localStorage.setItem("lang", lang);
  }

  //detect if previously loaded account
  if(localStorage.getItem("sessionUserData")) {
    sessionUserData = JSON.parse(localStorage.getItem("sessionUserData"));
    connectedUser = true;
  }

  /**
   * [get languages file and determine what language to display - english by default if language not found]
   */
  $.ajax({
    url: 'http://jwreading.com/ajax/getMinifiedContent.php',
    data: {file: 'assets/lang/langs.txt'},
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
            });
            if(!found) { lang = 'en'; }
          }
      });
    }
  });

   /**
   * [displayLang : remove current language file and load new one]
   */
  window.displayLang = function() {
    $('.lang').remove(); // remove previous lang
    loadLang();
  }

  //get the default language file
  displayLang();
  window.languages = [{lang:'fr', name:lang_fr}, 
                      {lang:'en', name:lang_en}, 
                      {lang:'it', name:lang_it}, 
                      {lang:'es', name:lang_es}, 
                      {lang:'de', name:lang_de},
                      {lang:'ro', name:lang_ro}];
  
  init();                 
  
  function init() {
  /**
   * [displayView : get the view corresponding to the asked element, in order to load the associated template with context added by the view ]
   */
  window.displayView = function(element, activeMenu) {    
    $.ajax({
      url: 'http://jwreading.com/ajax/getMinifiedContent.php',
      method: 'get',
      data: {view: element, menu: activeMenu},
      dataType: 'json',
      async: false,
      success: function(data) {
        var js = data['minifiedJs'];
        var tmpl = data['minifiedTmpl'];
        var menuJs = data['minifiedMenuJs'];
        var tmplMenu = data['minifiedMenuTmpl'];

        $('.view').remove(); // remove previous view
        var appendString = '<script class="view">' + js + '</script>';// add new view in body
        if (typeof MSApp !== "undefined" && MSApp) {
          MSApp.execUnsafeLocalFunction(function() { $('body').append(appendString); });
        } else {
          $('body').append(appendString);
        }

        var appendString = '<script class="view">' + menuJs + '</script>';// add new view in body
        if (typeof MSApp !== "undefined" && MSApp) {
          MSApp.execUnsafeLocalFunction(function() { $('body').append(appendString); });
        } else {
          $('body').append(appendString);
        }

        loadTemplate(element, tmpl, tmplMenu, activeMenu);
      },
      error: function () {
        $('#tmplContent').html('Internet connection problem');
      }
    });
  }

  /**
   * [analyzeHash : analyze hash and determine what view or template to request]
   */
  window.analyzeHash = function() {
    hash = window.location.hash.substr(1);
    if(!hash) { hash = 'dashboard'; }
    hash = checkNeedLogin(hash);
    var activeMenu = hash + '_active';
    displayView(hash, activeMenu); //load view corresponding to the hash and menu
  }

  if(!localStorage.firstTimeOver) { // first time
    displayView('firstTime', null);
  }
  else {
    analyzeHash();
  }

  //every new request changes the hash
  $(window).on('hashchange', function(){
    analyzeHash();
  });

  // on small screens (made for mobile screens), hide menu when scrolling in order not to display menu above content and trouble reading comfort
 setInterval(function(){
    if($('#resize').length) { //only on todayReading page (zoomIn, zoomOut)
        if(isElementInViewport($('.title'))) {
          $('#resize').fadeIn();
        } else {
          $('#resize').fadeOut();
        }
    }
    if(window.innerWidth < 768) {
      if(isElementInViewport($('.title'))) {
        $('.navbar-toggle').fadeIn();
      } else {
        $('.navbar-toggle').fadeOut();
      }
    } else {
      $('.navbar-toggle').show(); // for large screens, always show the menu
    }
  }, 1000 );


  /**
   * [loadTemplate       : get a template, compile it with handblebars.js and add his html content to the DOM]
   * @param  {element    : hash}
   * @param  {tmpl       : minified template to compile to display view}
   * @param  {tmplMenu   : minified template to compile to display menu - optional}
   * @param  {activeMenu : menu name - optional}
   */
  function loadTemplate(element, tmpl, tmplMenu, activeMenu) {
    var displaySubscribe = false;
    //determine if subscribe view is calling
    if(element == 'subscribe') {
      displaySubscribe = true;
      element = 'account';
      // attach account behaviour to subscribe view
      var attach = new accountView();
    }

    if (typeof sessionUserData !== "undefined" && sessionUserData) { var userData = sessionUserData; } //for accountView
    //if subscribe view is calling, all "account_" occurrences will be replaced by "subscribe_" occurrences in order to use the account template for the subscribing process
    if(displaySubscribe) { tmpl = tmpl.replace(new RegExp('{{account_', 'g'), '{{subscribe_'); }

    var context = buildContext(tmpl);
    var contextMenu = buildContext(tmplMenu);

    var view   = "new " + element + "View()";
    var result = eval(view); 
    var resultMenu = new menuView(); 

    if(activeMenu) { contextMenu[activeMenu] = 'active'; } // case of menu loading

    var html = compileTemplate(tmpl, context, result);
    var menuHtml = compileTemplate(tmplMenu, contextMenu, resultMenu);
    
    if(activeMenu) { $('#menuContent').html(menuHtml); } // case of menu loading
    if(element == 'firstTime') { $('#tmplContent').html(html); }
    else { slider.slidePage($('<div>').html(html)); }
    if(loggedOut) {
      $("#logoutValidate").show();
      loggedOut = false;
    }
  }

  /**
   * [buildContext    : create context that will be used for Handlebars compilation]
   * @param  {tmpl    : minified template to compile}
   * @return {context : object containing handlebars expression to transform during compilation}
   */
  function buildContext(tmpl) {
    var context = {};
    var i = 0;
    // find Handlebars expressions in nude template (before compilation)
    var tab = tmpl.split("{{");
    $.each(tab, function(key, value){
      if(i > 0) {
        var cond = value.substr(0,4);
        //avoid built-in helpers (if, else, each, ...), partials ({{> xxx}}) and raw blocks ({{{xxx}}})
        if(value[0] != "#" && value[0] != "/" && value[0] != ">" && value[0] != "{" && value[0] != "!" && cond != "else") {
          var tab2 = value.split("}}");
          var expr = tab2[0];
          // build context for future Handlebars compilation
          context[expr] = eval(expr);
        } 
      }
      i++;
    });
    return context;
  }

  /**
   * [compileTemplate : compile template with context through Handlebars.js]
   * @param  {tmpl    : minified template to compile}
   * @param  {context : object containing handlebars expression to transform during compilation}
   * @param  {result  : behavior attached to view}
   * @return {html    : compiled html to load into DOM}
   */
  function compileTemplate(tmpl, context, result) {
    if(result) {
      $.each(result, function(key, value){
        context[key] = value; // add additional parameters to context
      });
    }
    var template = Handlebars.compile(tmpl);
    var html     = template(context);
    html         = escapeLink(html);

    return html;
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
   * [checkNeedLogin : check if the page to display needs the user to be connected]
   * @param  {[string]} page [hash of the page called]
   * @return {[string]}      [redirect to login page if necessary]
   */
  function checkNeedLogin(page)
  {
    var arrayNeedLogin = ['dashboard', 'todayReading', 'account'];
    referrer = page; // referrer updated in order to know after login where to redirect the user
    if(arrayNeedLogin.indexOf(page) > -1 && !window.connectedUser) { //if the page called is in the array of pages needing a connected user and if the user is not connected
      page = 'login'; // redirect the user to the login page
    }
    return page;
  }

  /**
   * [isElementInViewport : check if element is visible in view port]
   * @param  {[DOM element]}  el ['title' element]
   * @return {Boolean}
   */
  function isElementInViewport(el)
  {
    el = el[0];
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
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

  }
}());

/**
* [loadLang : add the js file containing the i18n translation matching the language]
*/
function loadLang() {
    $.ajax({
      url: 'http://jwreading.com/ajax/getMinifiedContent.php',
      data: {lang: lang},
      async: false,
      complete: function(data)
      {
        var lang_elements = '';
        $.each(data, function(k,v){
          if(k == 'responseText') {
            el = v.split("\\r\\n");
            $.each(el, function(key, value){
              lang_elements += value + ';';
            });
          }
        });
        var js_lang = eval(lang_elements);
        var appendString = '<script class="lang">' + js_lang + '</script>';

        if (typeof MSApp !== "undefined" && MSApp) {
          MSApp.execUnsafeLocalFunction(function() { $('body').append(appendString); });
        } else {
          $('body').append(appendString);
        }
      }
    });
  }
