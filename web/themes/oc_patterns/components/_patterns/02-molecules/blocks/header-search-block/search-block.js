(function($, Drupal) {
//search toggle
Drupal.behaviors.searchToggle = {
	attach: function (context, settings) {
	 	$(".block-search-form-block").once('tSearch').each(function(){  
	 	$('.t-search', this).click(function(){
        	$(this).toggleClass('searching');
	 			$('#search-block-form').toggleClass('slideDown');
	 		});	
		});
	}
}
})(jQuery, Drupal);
