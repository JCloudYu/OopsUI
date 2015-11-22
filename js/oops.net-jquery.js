/**
 * Created by JCloudYu on 9/6/15.
 * Dependency: jQuery
 */
(function( $ ) {
	"use strict";

	if ( !$ )
		throw "This extension is dependent on jQuery! Please refer to https://jquery.com.";

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

				return $.ajax({
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

})( window.jQuery );
