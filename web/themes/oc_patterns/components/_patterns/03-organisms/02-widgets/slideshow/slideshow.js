(function($, Drupal) {

//Swipebox script for lightbox images.
Drupal.behaviors.slideshow = {
    attach: function (context, settings) {
      $(".paragraph--type--slideshow", context).once('slider').each(function(){  
        $('.field-oc-image-multi', this).slick({
          adaptiveHeight: true,
          autoplay: true,
          autoplaySpeed: 5000
        });
      });
    }
}

})(jQuery, Drupal);