var menuView = function () {
	var result = {};
	if(connectedUser) {
		result.connectedUser = connectedUser;
	}
	return result;
}