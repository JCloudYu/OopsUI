(function() {
	"use strict";

	oops.string = oops.string || {};
	oops.core.expand( oops.string, {
		repeat: function( token, times ){
			times = times || 0;
			token = oops.typing.isCallable(token) ? token : (function(token){ return function(){ return "" + token; } })(token);

			var collected = '', runner = 0;
			while ( runner++ < times ) collected += token( runner );

			return collected;
		},
		padding: function( target, length, stuffing ) {
			stuffing = stuffing || ' ';
			length -= target.toString().length;

			return oops.string.repeat( stuffing, length || 0 ) + target;
		}
	}, true);

})();
