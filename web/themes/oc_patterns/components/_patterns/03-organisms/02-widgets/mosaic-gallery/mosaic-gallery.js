(function($, Drupal) {

//Slideup animation for cta content when on a background
Drupal.behaviors.masonryGallery = {
    attach: function (context, settings) {
      $(".paragraph--type--mosaic-gallery", context).once('masonryGallery').each(function(){  
          $('.field-mosaic-tiles').masonry({
            // options
            horizontalOrder: false,
            percentPosition: true,
            columnWidth: '.grid-sizer',
            itemSelector: '.paragraph--type--tile-image',         
            gutter: 0
          });
      });
    }
}


})(jQuery, Drupal);