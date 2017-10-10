(function($, Drupal) {
Drupal.behaviors.pageMenu = {
	attach: function (context, settings) {
	 	$(".block--system-menu.page-menu", context).once('page-menu').each(function(){  
	 		//need doc ready because active-class script fires after theme scripts
      $(document).ready(function(){
        $('.block--system-menu.page-menu > ul li').each(function(){
          
          //find active links and set the active trail
          $('.is-active', this).parentsUntil('.page-menu').addClass('active-trail expanded');

          //find nested lists and set their parents and expanders
          if(($('> ul', this).length) && (!$('.expander:first', this).length) ){
            $(this).addClass('parent').prepend('<span class="expander" aria-expanded="false"></span>');
          }

          //find active-trail li and add aria expanded role
          $('li.active-trail > .expander').attr('aria-expanded', "true");
        });
        //change expanded class and aria-roles on expander click
        $('.expander').click(function(){
          $(this).closest('li').toggleClass('expanded');
          if($(this).attr('aria-expanded') == 'false'){
            $(this).attr('aria-expanded', "true");
          }else{
            $(this).attr('aria-expanded', "false");
          }
        });
      });

	 		var menu_page = $('.block--system-menu.page-menu');
	 		var menu = $('.block--system-menu.page-menu > ul');

	 		//add a select list to the page menu for mobile
      $(window).on('resize',  _.debounce( pageMenuMobile, 100 )).trigger('resize');

      function pageMenuMobile(){
          var wwidth = $(window).width();
          
          //if we're at tablet or less
          if ((wwidth < 760) || ($('.node:not(.pl-spacer) .kermit').length)){

            //insert a select list if it doesn't already exist
            if(!$('.block--system-menu.page-menu select').length){
              $('<select />').appendTo('.block--system-menu.page-menu');

              //add a default first option to that select list
              $('<option />', {
                "value"   : "#",
                "text"    : "Go to Another Page"
              }).prependTo('.block--system-menu.page-menu select');


              // Populate the rest of the dropdown with menu items
              $('.block--system-menu.page-menu a').each(function() {
                var el = $(this);
                $('<option />', {
                  "value"   : el.attr("href"),
                  "text"    : el.text()
                }).appendTo('.block--system-menu.page-menu select');
              });

              //run select2 on page menu
              if(!$('.block--system-menu.page-menu .select2-container').length){
                $('.block--system-menu.page-menu select').select2();
              }

              //jump to the page when an item is selected
              $('.block--system-menu.page-menu').find('select').change(function() {
                window.location = $(this).find('option:selected').val();
              });

              //detach the page menu wrapper
              $('.block--system-menu.page-menu > ul').detach();

              
              
            }

          }else{
            //if we're on desktop, remove the select list and reattach the menu block wrapper if its not already there
            $('.block--system-menu.page-menu:not(.preserve)').find('select').remove();
            $('.block--system-menu.page-menu:not(.preserve)').find('.select2').remove();
            if(!$('.block--system-menu.page-menu > ul').length){
              $('.block--system-menu.page-menu').append(menu);
            }
          }
        }//end pageMenuMobile

 		});
	}
}
})(jQuery, Drupal);
