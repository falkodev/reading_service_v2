var subscribeView = function () {
	var result = {};
	result.languages = languages;
	result.account = ""; //account empty to fulfill "if" condition in accountTemplate in order to display labels for subscription (otherwise it would display labels for an existing account)
	return result;
}
