var logoutView = function () {
	
    connectedUser = false;
    loggedOut = true;
    //clean every input
    userData = {};
    sessionStorage.setItem("sessionUserData","");
    $('input').val('');
    $('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    window.location.hash = '#login';
}