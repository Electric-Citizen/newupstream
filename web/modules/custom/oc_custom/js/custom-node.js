(function($, Drupal) {

Drupal.behaviors.admin_bkimage = {
  attach: function (context, settings) {

  	 $(".field--name-field-oc-widgets", context).once('style').each(function(){  
  	 		$(document).ajaxComplete(function() {
  	 			$('.field--name-field-background-style').each(function(){
  	 				var styler = $(this);
  	 				var chosen = $('select', this).find("option:selected").val()
  	 				if(chosen != 'image'){
  	 					styler.next('.field--name-field-background-image').hide();
  	 				}else{
  	 					styler.next('.field--name-field-background-image').show();
  	 				}
  	 				$(this).find('select').change(function(){
  	 					//alert('changed');
  	 					var choice = $(this).find("option:selected").val()
  	 					if(choice == 'image'){
  	 						styler.next('.field--name-field-background-image').show();
  	 					}else{
  	 						styler.next('.field--name-field-background-image').hide();
  	 					}
  	 				});
  	 			});
  	 		});

        //send help when multiple paragraphs are on a page
        $(document).ajaxComplete(function(){
            var count = $('.paragraphs-preview').length;
            if(count > 5){
              if(!$('.reminder.collapsy').length){
                $('body').append('<div class="reminder collapsy"><span class="close"></span>When using multiple paragraphs with layout options to create your page, its helpful to use the \'Preview\' mode to view the page.</div>');
                $('.collapsy').delay(1000).animate({right: "+=400px"}, 500, "linear");
                //$('.collapsy').delay(7000).animate({right: "-=400px"}, 500, "linear");
                $('.collapsy').click(function(){
                  $(this).stop(true,true).fadeOut(200);
                });
              }
            }
        });
	 });
  }
};

// Drupal.behaviors.scrollOpen = {
//   attach: function (context, settings) {

//     $(".field--name-field-widgets", context).once('scrollOpen').each(function(){  
//       $('.paragraphs-dropbutton-wrapper input.field-add-more-submit').mousedown(function(){
//           $(document).ajaxComplete(function(){
//             if(!$(this).parent('.ajax-new-content').length){
//               $('html, body').animate({
//                 scrollTop: $(".field--name-field-widgets .draggable:last").offset().top - 100
//               }, 'slow');
//             }
//           });
//       });
//    });
//   }
// };


})(jQuery, Drupal);