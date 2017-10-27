'use strict';

(function ($, Drupal) {
  /* distinguish video from other oc media */
  Drupal.behaviors.ocMediaEmbedded = {
    attach: function attach(context, settings) {
      $('.oc-media .field-media-video-embed-field', context).once('isVideo').each(function () {
        $(this).closest('.oc-media').addClass('has-video');
      });
    }
  };
})(jQuery, Drupal);
//# sourceMappingURL=media.js.map
