var dashboardView = function () {
	$.post("http://www.jwreading.com/ajax/getDailyText.php", 
	   { 'lang': lang }, function(data) {}).complete(function(data) {
	result = data['responseText'].trim();
	// console.log('result: ' + result);
	$('#dailyText').html(result);
});
}