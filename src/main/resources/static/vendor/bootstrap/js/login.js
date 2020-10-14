$(function () {
	/*$("#sign_in").validate({
		rules : {
			email : {
				required : true,
				email : true
			},
			password : {
				required : true
			}
		},
		messages : {
			email : "Please enter a valid email address",
			password : "Please enter password"
		},
		errorElement : 'span',
		errorClass : 'help-inline',
		highlight : function (element) {
			$(element).parent().parent().addClass('error');
		},
		unhighlight : function (element) {
			$(element).parent().parent().removeClass('error');
		}
	});*/


	$('#glossary > ul').cycle({
		'pause' : true,
		'random' : true,
		'containerResize' : false,
		'slideResize' : false,
		'before' : function () {
			$(this).parent().animate({
				'height' : $(this).height()
			}, 1000);
		}
	});

	// Init reset form
	$('#btnReset').on('click', function (e) {
		e.preventDefault();
		var $modal = $('#reset').modal('show');
		$modal.find('input.email').val('');
		setTimeout(function () {
			$modal.find('input.email').focus();
		}, 500);

		var $button = $modal.find('button.btn-primary')
			.button('reset')
			.off('click.submit')
			.on('click.submit', function () {
				$button.button('loading').attr('disabled', 'disabled');
				$.ajax({
					'url' : '/reset/new',
					'type' : 'POST',
					'data' : {
						'email' : $modal.find('input.email').val()
					},
					'success' : function (data) {
						$button.button('complete');
						setTimeout(function () {
							$modal.modal('hide');
						}, 1000);
					},
					'complete' : function(xhr, status) {
						if (xhr.status === 404) {
							$button.button('notfound');
						} else if (xhr.status !== 204) {
							$button.button('error');
						}
						$button.removeAttr('disabled');
					}
				})
			});
	});
});