(function($, Drupal) {

//Swipebox script for lightbox images.
Drupal.behaviors.lightbox = {
    attach: function (context, settings) {
      $(".paragraph--type--lightbox-gallery", context).once('lightboxes').each(function(){  
        $(".swipebox", this).swipebox({
          loopAtEnd: true,
          hideBarsDelay : 12000
        });
        $(function(){
          $(document.body)
            .on('click touchend','#swipebox-slider .current img', function(e){
                return false;
            })
            .on('click touchend','#swipebox-slider .current', function(e){
                $('#swipebox-close').trigger('click');
            });
          });
      });
    }
}

//Fade-in class for lightboxes when in viewframe.
Drupal.behaviors.galleryFadeIn = {
  attach: function (context, settings) {
      $(".paragraph--type--lightbox-gallery", context).once('randomBoxes').each(function(){

      //animate when the page scrolls down far enough
      $(window).load(function(){
        
        $(document).scroll(function() {
            randomEntrance();
        });
        function randomEntrance() {
          $('.paragraph--type--lightbox-gallery').each(function(){
            if($(document).scrollTop() + window.innerHeight > $(this).offset().top + 50)
            $('.media-image.view-mode-large-thumb', this).addClass('randomEntrance');
          });
        }
      });
    });
  }
}

})(jQuery, Drupal);