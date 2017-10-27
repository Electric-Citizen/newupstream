'use strict';

(function ($) {
  //header-background
  Drupal.behaviors.bannerBackground = {
    attach: function attach(context, settings) {
      $(".field-use-as-background", context).once('bannerBackground').each(function () {
        if ($(this).text() == 'Background') {
          $('.block-region-top').addClass('background');
        }
        $(this).remove();
      });
    }
  };
})(jQuery);
//# sourceMappingURL=node.js.map
