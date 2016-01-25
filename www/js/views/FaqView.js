var faqView = function () {
	$(document).on("click", ".questionTitle", function(){
      var str = $(this).attr('id');
      var pattern = /[0-9]+/;
      var id = str.match(pattern);
      $("#answer"+id).toggle("slow");
  	});
}