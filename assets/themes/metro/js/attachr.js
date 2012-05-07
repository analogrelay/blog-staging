$(function() {
	$('[data-widget]').each(function() {
		var val = $(this).data('widget');
		var optstr = $(this).data('widget-options');
		var args = [];
		if(optstr) {
			args = JSON.parse(optstr);
		}
		if(val && $(this)[val]) {
			$(this)[val].call($(this), args);
		}
	});
});