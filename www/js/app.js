document.addEventListener("deviceready", onDeviceReady, false);

function getNextWeekDay(now,d){
    if(d > now.getDay()) var x = d- now.getDay();
    else var x= ((7+d)-now.getDay())
    now.setDate( now.getDate() + x );
    return now;
}


function onDeviceReady() {
  // alert('entree onDeviceReady');
  if(connectedUser && sessionUserData.modeApp && referrer != 'account') { //if user requested to be alerted when it's time to read a new portion
    // checker ici si jour de lecture et faire 2e alerte pr texte du jour
    // si oui, on execute le reste
    var day   = new Date().getDate();
    var month = new Date().getMonth();
    var year  = new Date().getFullYear();
    next_time = new Date(year, month, day, 20, 40, 00);
    // alert('next_time: ' + next_time);
    var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
    if(today == 0) { today = 7; }//otherwise Sunday = 0

    // var now = new Date();

    // var nextMonday = getNextWeekDay(new Date(year, month, day, 20, 40, 00),1); // 0 = Sunday, 1 = Monday, ...
    // var nextSaturday = getNextWeekDay(new Date(),6);
    // var nextSunday = getNextWeekDay(new Date(),0);
    // // var secondNextMonday = getNextWeekDay(new Date(now.getTime() + ( 7 *24 * 60 * 60 * 1000)),1);
    // alert(nextMonday+ ' - '+nextSaturday+ ' - '+nextSunday);

    for(var i=1;i<8;i++)
    {
      readingDay = 'sessionUserData.day' + i;
      dayConfig = eval(readingDay); 

      if(dayConfig == 1) { 
        next_time = getNextWeekDay(new Date(year, month, day, 6, 30, 00),i);
        cordova.plugins.notification.local.schedule({
          id: i,
          title: "Nouvelle lecture de la Bible",
          text: "La portion du jour est prête",
          at: next_time,
          data: {reading:true}
        }); 
        alert('next_time: ' + next_time);
      }
    }

    // day = 'sessionUserData.day' + today;
    // dayConfig = eval(day); // today in the user config
    // if(dayConfig == 1) { 
    //   cordova.plugins.notification.local.schedule({
    //     id: 1,
    //     title: "Nouvelle lecture de la Bible",
    //     text: "La portion du jour est prête",
    //     at: next_time,
    //     data: {reading:true}
    //   }); 
    // }
    
    cordova.plugins.notification.local.on("click", function (notification) {
      if(notification.data == '{"reading":true}') { //lecture
        window.location.hash = '#todayReading';
      }
    });
  }
}

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
  window.mobileApp = false;

  var slider = new PageSlider($('#tmplContent'));

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
  });

  $('body').append('<script src="assets/lang/' + lang + '.js"></script>');

  /**
   * [displayView : get the view corresponding to the asked element, in order to load the associated template with context added by the view ]
   */
  window.displayView = function(element, activeMenu) { 
    var view   = "new " + element + "View()";
    var result = eval(view);
    var displaySubscribe = false;
    //determine if subscribe view is calling 
    if(element == 'subscribe') { 
      displaySubscribe = true;
      element = 'account'; 
      // attach account behaviour to subscribe view
      var attach = new accountView();
    }
    loadTemplate(element, activeMenu, result, displaySubscribe); 
  }
  
  /**
   * [analyzeHash : analyze hash and determine what view or template to request]
   */
  window.analyzeHash = function() {
    hash = window.location.hash.substr(1);
    if(!hash) { hash = 'dashboard'; }
    hash = checkNeedLogin(hash);
    var activeMenu = hash + '_active';
    displayView('menu', activeMenu); //load menu
    displayView(hash, null); //load view corresponding to the hash
  }

  if (window.location.protocol == 'file:') { 
    mobileApp = true;    
    if(!localStorage.firstTimeOver) { // first time
      displayView('firstTime', null);
    }
    else { 
      analyzeHash();
    }
  } else {
    //app init : first request
    analyzeHash();
  }

  //every new request changes the hash
  $(window).on('hashchange', function(){
    analyzeHash();
  });

  // on small screens (made for mobile screens), hide menu when scrolling in order not to display menu above content and trouble reading comfort
 setInterval(function(){
    if($('#resize').length) { //only on todayReading page (zoomIn, zoomOut)
      if(window.innerWidth < 1036) {
        if(isElementInViewport($('.title'))) {
          $('#resize').fadeIn();
        } else {
          $('#resize').fadeOut();
        }
      } else {
        $('#resize').show();
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
   * [loadTemplate : get a template, compile it with handblebars.js and add his html content to the DOM]
   * @param  {tmpl_name  : template name [string]}
   * @param  {activeMenu : menu name - optional [string]}
   * @param  {result : additional context from the calling view - optional [object]}
   * @param  {displaySubscribe : if subscribe view is calling, display account template with subscribe labels - optional [boolean]}
   */
  function loadTemplate(tmpl_name, activeMenu, result, displaySubscribe) {
    var tmpl_url = 'js/templates/' + tmpl_name + 'Template.html';
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
          else {  
            if(tmpl_name == 'firstTime') { $('#tmplContent').html(html); }         
            else { slider.slidePage($('<div>').html(html)); }
            if(loggedOut) { 
              $("#logoutValidate").show();
              loggedOut = false;
            }
          }
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

  window.checkIfPortion = function() {
    var today = new Date().getDay(); // day of the week for today (Monday = 1, Tuesday = 2, ...)
    var sessionUserData = JSON.parse(localStorage.getItem("sessionUserData")); // retrieve user data
    if(today == 0) { today = 7; }//otherwise Sunday = 0
    var day;
    var dayConfig;
    var totalDays = 0; 
    var beforeFirstCycleDay = 0;
    var portionNumber=0;
    
    //find what "day" it is compared to the first reading day
    for(var i=1;i<8;i++)
    {
      day = 'sessionUserData.day' + i;
      dayConfig = eval(day); 

      if(dayConfig == 1) 
      {
        totalDays++;
        if(i < sessionUserData.firstDay) { beforeFirstCycleDay = 1; }
        
        //2 possibles cases : 
        //1st case :  if current day is greater than the "first" day of the cycle, count current day + days greater than the "first" day + days smaller than the current day
        if(today > sessionUserData.firstDay && i <= today && i >= sessionUserData.firstDay) { portionNumber++; }
        //2nd case : if current day is smaller than the "first" day of the cycle, count current day + days smaller than the current day + days greater than the "first" day + "first" day
        else if(today < sessionUserData.firstDay && ( (i <= today) || (i >= sessionUserData.firstDay)) ) { portionNumber++; }
      }
    }
    if(today == sessionUserData.firstDay) { portionNumber = 1; }
    var nextWeek = 0;
    if(today >= sessionUserData.firstDay && beforeFirstCycleDay == 1) { nextWeek = 1; } //find what week (current or next one) to look for

    var todayDate = new Date();
    var currentWeek = getWeekNumber(todayDate); //find current week number

    if(nextWeek == 1) { 
      if(currentWeek == 53) { currentWeek = "01"; }
      else { 
        currentWeek++; 
        if(currentWeek < 10) { currentWeek = "0" + currentWeek; }
      }
    }

    var file =  totalDays + "" + portionNumber;
    var data = {'lang' : sessionUserData.readingLang, 'week' : currentWeek, 'file' : file };
    return data;
  }

  // For a given date, get the ISO week number
  function getWeekNumber(d) {
      // Copy date so don't modify original
      d = new Date(+d);
      d.setHours(0,0,0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      // Get first day of year
      var yearStart = new Date(d.getFullYear(),0,1);
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
      // Return week number
      return weekNo;
  }
}());