(function(window) {
	"use strict";

	var
	prev = window.oops || null,
	curr = function(){};

	propertyExpand( curr, {
		core: {
			expand: propertyExpand
		},
		typing: {
			isObject: isObject,
			isCallable: function( value ){
				return (typeof value === 'function');
			},
			isArray: Array.isArray,
			isString: function( value ) { return (typeof value === 'string'); }
		},

		prev: function(){ return prev; },
		async: function( callback ){
			if ( !oops.typing.isCallable( callback ) ) return;
			setTimeout( callback, 0 );
		}
	}, false );



	window.oops = curr;
	(function(){
		var originalPushState = history.pushState || function(){};

		curr.core.expand( window.history, {
			pushState: function(state) {
				if (curr.typing.isCallable( window.onpushstate ))
					window.onpushstate({state: state, type:"pushstate"});

				return originalPushState.apply(history, arguments);
			},
			popState: function() {
				history.back();
			}
		});
	})();


	// INFO: Supportive functions
	function propertyExpand( target, source, overwrite ){
		overwrite = overwrite || false;

		if ( !isObject( source ) || !isObject( target ) ) return;

		for ( var prop in source )
		{
			if ( !source.hasOwnProperty( prop ) ) continue;
			if ( !overwrite && target.hasOwnProperty( prop ) ) continue;

			target[ prop ] = source[ prop ];
		}
	}
	function isObject( value, strict ) {
		var result = ( typeof value === 'object' );

		strict = strict || false;
		result = result || ( strict ? false : (typeof value === 'function'));
		result = result && ( strict ? !Array.isArray(value) : true );

		return !!( value && result );
	}
})(window);
