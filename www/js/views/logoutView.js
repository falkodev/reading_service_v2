var logoutView = function () {
	
    connectedUser = false;
    loggedOut = true;
    //clean every input
    userData = {};
    localStorage.setItem("sessionUserData","");
    $('input').val('');
    $('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    window.referrer = '';
    window.location.hash = '#login';
}