var contactView = function () {
	/**
	 * [form submit on contact view : send mail]
	 */
	$('body').on('submit', '#contactForm', function(e){
		e.preventDefault();
		$("#msgContactValidate").slideUp(200);
		$("#emailContactValidate").slideUp(200);
		var email = $('#emailContact').val();
		var msg = $('#msgContact').val();
		if (validateEmail(email) == false) {
			$("#emailContactValidate").slideDown(400);
		}
		else if (!$.trim(msg)) {
			$("#msgContactValidate").slideDown(400);
		}
		else {
			$.post($(this).attr("action"), { data : $(this).serializeArray() }, function(data) {}).complete(function() {
					$(':input','#contactForm') // empty inputs
					  .removeAttr('checked')
					  .removeAttr('selected')
					  .not(':button, :submit, :reset, :hidden, :radio, :checkbox')
					  .val('');
					$("#msgContactSent").slideDown(400); //display success message
				});
		}
	});
}

