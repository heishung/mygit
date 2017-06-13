(function($){
  Drupal.behaviors.owl_carousel_formatter = {
  attach: function( context, settings ) {
    //
    // OWL Carousel uses a lot of "===" and seems to break if pagination is set to 1 or 'true' instead of a real boolean.
    // so we have to sanitize it, this kind of pains me, of course right now any value that would need to be a numeric one or zero would sort of break.
    // @todo move this sanitization (can it work for the true/false stuff? to HOOK_js_alter)
    //
    for( var key in settings.owl_carousel_formatter ){
      var val = settings.owl_carousel_formatter[key];
      if( val === 1 || val === 0 ){
        settings.owl_carousel_formatter[key] = Boolean( val );
      }
    };
    console.log( settings.owl_carousel_formatter );
    var carousel = $( '.owl-carousel-formatter:not(.instantiated)', context );
    carousel.each( function(){
      $(this).owlCarousel( settings.owl_carousel_formatter );
      $(this).addClass( 'instantiated' );
    })
  }
}
}(jQuery));
