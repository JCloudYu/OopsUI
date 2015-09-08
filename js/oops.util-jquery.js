/**
 * Created by JCloudYu on 9/6/15.
 */
(function( $ ) {
	"use strict";

	oops.core.expand( oops, {
		overlay: (function(){
			var body	= $( 'body' ),
				overlay	= $( 'div[data-controller="oops"][data-role="overlay"]' );

			if ( overlay.length < 1 )
				overlay = $( '<div data-role="overlay" data-controller="oops"></div>' ).appendTo( body );

			return function( status ){
				var open = ( arguments.length > 0 ) ? status : (body.attr('data-state') !== "overlaid");
				if ( open )
				{
					body.attr( 'data-state', "overlaid" );
				}
				else
				{
					body.attr( 'data-state', "" );
					overlay.empty();
				}
			};
		})()
	}, true );


	oops.net = oops.net || {};
	oops.core.expand( oops.net, (function(){
		var ajax = {};
		[ "get", "post", "put", "delete", "patch" ].forEach(function( method ){
			ajax[ method ] = function( url, data, callback, type ) {
				// Shift arguments if data argument was omitted
				if ( oops.typing.isCallable( data ) ) {
					type = type || callback;
					callback = data;
					data = undefined;
				}

				return jQuery.ajax({
					url: url,
					type: method,
					dataType: type,
					data: data,
					success: callback
				});
			};
		});

		return ajax;
	})(), true );

})( jQuery );
