(function() {
	"use strict";

	oops.string = oops.string || {};
	oops.core.expand( oops.string, {
		purgeHtml: function( html ){
			return html.replace(/[\u00A0-\u99999<>\&]/gim, function(i) {
				 return '&#'+i.charCodeAt(0)+';';
			});
		},
		restoreHtml: (function(){
			var container = document.createElement( "textarea" );
			return function( inputText ) {
				container.innerHTML = inputText;
				return container.value;
			};
		})(),



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
		},
		strtr: function( source, replacements ) {
			var result = source, value, regex;
			for ( var search in replacements )
			{
				if ( !replacements.hasOwnProperty( search ) ) continue;

				value = replacements[ search ];
				regex = new RegExp( search, 'g' );

				result = result.replace( regex, value );
			}
			return result;
		}
	}, true);

})();
