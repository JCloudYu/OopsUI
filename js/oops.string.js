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
		padding: function( number, length, token ) {
			token = token || ' ';
			length -= number.toString().length;
			token = ( length > 0 ) ? new Array( length + 1 ).join( token ) : "";

			return token + number;
		}
	}, true);

})();
