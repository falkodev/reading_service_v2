var subscribeView = function () {
	hash = 'account'; //global variable hash modified in order to load the account template (same structure as an existing account)

	var result = {};
	result.account=""; //account empty to fulfill "if" condition in accountTemplate in order to display labels for subscription (otherwise it would display labels for an existing account)
	return result;
}
