var menuView = function () {
	var result = {};
	if(connectedUser) {
		result.connectedUser = connectedUser;
	}
	// if(mobileApp) {
	// 	result.mobileApp = mobileApp;
	// }
	return result;
}