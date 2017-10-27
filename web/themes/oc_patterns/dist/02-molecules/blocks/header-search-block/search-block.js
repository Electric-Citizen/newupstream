'use strict';

(function ($, Drupal) {
	//search toggle
	Drupal.behaviors.searchToggle = {
		attach: function attach(context, settings) {
			$(".block-search-form-block").once('tSearch').each(function () {
				$('.t-search', this).click(function () {
					$(this).toggleClass('searching');
					$('#search-block-form').toggleClass('slideDown');
				});
			});
		}
	};
})(jQuery, Drupal);
//# sourceMappingURL=search-block.js.map
