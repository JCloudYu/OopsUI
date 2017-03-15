/**
 * Created by JCloudYu on 11/22/15.
 * Dependency: jQuery, PromiseJS
 */
(function( $, Promise ) {
	"use strict";

	if ( !Promise )
		throw "This extension is dependent on PromiseJS! Please refer to https://www.promisejs.org.";

	if ( !$ )
		throw "This extension is dependent on jQuery! Please refer to https://jquery.com.";


	(function(){
		var
		viewport = null,
		mediaQueryList = window.matchMedia("(orientation: portrait)");

		oops.core.expand( oops.app.tool, {
			layoutUI:function(){
				___CALC_VIEWPORT_SIZE();
				$( '.stage' ).each(function(){
					var
					self = $( this ),
					baseWidth	= self.data( 'base-width' ) || viewport.width,
					baseHeight	= Math.ceil( baseWidth * viewport.ratioInv ),
					scaleRatio	= viewport.width / baseWidth;

					self.css({
						width:	baseWidth,
						height:	baseHeight,
						webkitTransformOrigin: "0 0 0",
						transformOrigin: "0 0 0",
						webkitTransform: oops.string.strtr( 'scale3d( :scale, :scale, 1 )', { ':scale':scaleRatio  } ),
						transform: oops.string.strtr( 'scale3d( :scale, :scale, 1 )', { ':scale':scaleRatio  } )
					})
					.attr({
						'data-scale': scaleRatio
					});
				});
			}
		}, true );

		function ___CALC_VIEWPORT_SIZE() {
			var
			viewportWidth	= $( window ).width(),
			viewportHeight	= $( window ).height();

			viewport = {
				orientation: (mediaQueryList.matches) ? 'portrait' : 'landscape',
				width: viewportWidth,
				height: viewportHeight,
				ratio: viewportWidth / viewportHeight,
				ratioInv: viewportHeight / viewportWidth
			};
		}
	})();

})( window.jQuery, window.Promise );
