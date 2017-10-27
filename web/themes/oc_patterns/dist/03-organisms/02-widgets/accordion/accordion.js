'use strict';

(function ($, Drupal) {

  Drupal.behaviors.accordion = {
    attach: function attach(context, settings) {
      $(".accordion-item", context).once('accordion').each(function () {
        $('.accordion-header', this).click(function () {
          if ($(this).parent('.accordion-item.accord-active').length) {
            $('.accord-active').removeClass('accord-active').attr('aria-expanded', "false");;
          } else {
            $('.accord-active').removeClass('accord-active').attr('aria-expanded', "false");;
            $(this).parent('.accordion-item').addClass('accord-active').attr('aria-expanded', "true");;
          }
        });
      });
    }
  };
})(jQuery, Drupal);
//# sourceMappingURL=accordion.js.map
