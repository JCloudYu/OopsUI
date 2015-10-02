(function(window) {
	"use strict";

	var
	prev = window.oops || null,
	curr = function(){};
	curr.prev	= function(){ return prev; };
	curr.typing = {
		isObject: function( value, strict ){
			var result = ( typeof value === 'object' );

        	strict = strict || false;
        	result = result || ( strict ? false : (typeof value === 'function'));
        	result = result && ( strict ? !Array.isArray(value) : true );

			return !!( value && result );
		},
		isCallable: function( value ){
			return (typeof value === 'function');
		},
		isArray: Array.isArray,
		isString: function( value ) { return (typeof value === 'string'); }
	};
	curr.core	= {
		expand: function( target, source, overwrite ){
			overwrite = overwrite || false;

			if ( !curr.typing.isObject( source ) || !curr.typing.isObject( target ) ) return;

			for ( var prop in source )
			{
				if ( !source.hasOwnProperty( prop ) ) continue;
				if ( !overwrite && target.hasOwnProperty( prop ) ) continue;

				target[ prop ] = source[ prop ];
			}
		}
	};

	window.oops = curr;
})(window);
