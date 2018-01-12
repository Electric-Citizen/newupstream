(function($, Drupal) {

Drupal.behaviors.admin_bkimage = {
	attach: function (context, settings) {
		$(".field--name-field-oc-widgets", context).once('style').each(function(){  
			$(document).ajaxComplete(function() {
				$('.field--name-field-background-style').each(function(){
					var styler = $(this);
					var chosen = $('select', this).find("option:selected").val();
					if(chosen != 'image'){
						styler.next('.field--name-field-background-image').hide();
					}else{
						styler.next('.field--name-field-background-image').show();
					}
					$(this).find('select').change(function(){
						//alert('changed');
						var choice = $(this).find("option:selected").val();
						if(choice == 'image'){
							styler.next('.field--name-field-background-image').show();
						}else{
							styler.next('.field--name-field-background-image').hide();
						}
					});
				});
			});
		});
	}
};

Drupal.behaviors.admin_bannerBack = {
	attach: function (context, settings) {
		$(".field--name-field-use-as-background", context).once('hasImage').each(function(){  

			$('.field--name-field-use-as-background').each(function(){
				if(($('input:checked', this).length) && (!$('#ief-entity-table-edit-field-banner-entities').length)){
					$(this).prepend('<div class="custom-warning">Make sure you add a banner to use as the background.</div>');
					setTimeout(function() {
						$('.custom-warning').remove();
					}, 6000);
				}
				$('input', this).change(function(){
					$('.custom-warning').remove();
					if((this.checked) && (!$('#ief-entity-table-edit-field-banner-entities').length)){
						$('.field--name-field-use-as-background').prepend('<div class="custom-warning">Make sure you add a banner to use as the background.</div>');
						setTimeout(function() {
							$('.custom-warning').remove();
						}, 3000);
					}
				});
			});
		
		});
	}
};




})(jQuery, Drupal);