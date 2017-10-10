(function($, Drupal) {

Drupal.behaviors.revealWidget = {
  attach: function (context, settings) {
    $(".paragraph--type--reveal-group", context).once('reveal-it').each(function(){  
    	//add a class to kermit to let it know that it has reveal
        $('.kermit').addClass('hasReveal');

        //set intial reveal section classes 
        $('.field-reveal-sections > div:nth-of-type(1)').addClass('prep');
        $('.field-reveal-sections > div:nth-of-type(2)').addClass('fixed');
        $('.field-reveal-sections > div:nth-of-type(3)').addClass('next');

        $(window).scroll(function(){
        	//define the top and bottom of the screen
            var bottom_screen = $(window).scrollTop() + $(window).height();
            var top_screen = $(window).scrollTop();

            //find the first or previous reveal section
            $('.prep').each(function(){
            	//find the bottom of the section
                var bottom_prep = $(this).offset().top + $(this).height();
                //detect when the bottom of the section goes off screen
                if(bottom_prep < top_screen){
                  //$('.past').removeClass('past');

                  //leapfrog classes to make next section live and this one not
                  $(this).removeClass('prep').addClass('past');
                  $('.fixed').removeClass('fixed').addClass('prep');
                  $('.next').removeClass('next').addClass('fixed');
                  $('.fixed').next().addClass('next');
                }
            });
            //find each previous section
            $('.past').each(function(){
            	//find the bottom of the section
                var bottom_prep = $(this).offset().top + $(this).height();
                //detect if the bottom is scrolled back into view
                if(bottom_prep > top_screen){
                  //clean out all classes and reverse leap frog for scrolling back up the page
                  $('.field-reveal-sections > div').removeClass('prep fixed next');
                  $(this).next().addClass('fixed');
                  $('.fixed').next().addClass('next');
                  $(this).removeClass('past').addClass('prep');
                }
            }); 
        });
    });
  }
}


})(jQuery, Drupal);