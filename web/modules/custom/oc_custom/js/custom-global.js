(function($, Drupal) {

/* Apply select2*/
Drupal.behaviors.mobileSelect = {
  attach: function (context, settings) {
      $("select", context).once('selects').each(function(){  
      //if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
        $( 'form:not(.entity-embed-dialog) select,.sg-pattern-example select' ).select2({
          placeholder: "Select an option"
        });
      //}
    });
  }
};


})(jQuery, Drupal);