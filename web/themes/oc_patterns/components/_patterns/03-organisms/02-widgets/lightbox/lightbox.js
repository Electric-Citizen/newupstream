(function($, Drupal) {

//Swipebox script for lightbox images.
Drupal.behaviors.lightbox = {
	attach: function (context, settings) {
		$(".paragraph--type--lightbox-gallery", context).once('lightboxes').each(function(){  
			$('.featherlight-gal', this).featherlightGallery({
				previousIcon: '<',
				nextIcon: '>',
				galleryFadeIn: 300,
				openSpeed: 300
			});
		});
	}
}

//Fade-in class for lightboxes when in viewframe.
Drupal.behaviors.galleryFadeIn = {
	attach: function (context, settings) {
		$(".paragraph--type--lightbox-gallery", context).once('randomBoxes').each(function(){
			//animate when the page scrolls down far enough
			$(window).on("load", function(){
				randomEntrance();
				$(document).scroll(function() {
					randomEntrance();
				});
				function randomEntrance() {
					$('.paragraph--type--lightbox-gallery').each(function(){
						if($(document).scrollTop() + window.innerHeight > $(this).offset().top + 50){
							$('.media-image.view-mode-large-thumb', this).addClass('randomEntrance');
						}
					});
				}
			});
		});
	}
}

})(jQuery, Drupal);