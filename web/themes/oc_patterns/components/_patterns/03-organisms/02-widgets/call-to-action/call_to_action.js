(function($, Drupal) {

//Slideup animation for cta content when on a background
Drupal.behaviors.ctaSlide = {
    attach: function (context, settings) {
      $(".paragraph--type--call-to-action > .widget-color,.paragraph--type--call-to-action > .image", context).once('contentSlide').each(function(){  
        
      //animate when the page scrolls down far enough
      $(window).load(function(){
        
        $(document).scroll(function() {
            randomEntrance();
        });
        function randomEntrance() {
          $('.paragraph--type--call-to-action > .widget-color,.paragraph--type--call-to-action > .image').each(function(){
            if($(document).scrollTop() + window.innerHeight > $(this).offset().top + 50)
            $(this).addClass('slideUp');
          });
        }
      });

      });
    }
}


})(jQuery, Drupal);