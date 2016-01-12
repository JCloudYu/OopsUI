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
		async: function( callback, latency ){
			latency = latency || 0;
			if ( !oops.typing.isCallable( callback ) ) return;
			setTimeout( callback, latency );
		},
		util: {}
	}, false );

	propertyExpand( curr.util, {
		each: function( object, callable ){
			if ( !oops.typing.isCallable( callable ) ) return;
			if ( !oops.typing.isObject( object ) ) return;

			if ( oops.typing.isArray( object ) )
			{
				object.forEach(callable);
				return;
			}


			for ( var idx in object )
			{
				if ( !object.hasOwnProperty( idx ) ) continue;
				callable( object[idx], idx );
			}
		},
		limitExec: function( func, times ) {
			if ( !oops.typing.isCallable( func ) )
			return doNothing;

			times = times || 1;
			return function(){
				if ( times <= 0 ) return;

				times--;
				func.apply( null, arguments );
			};
		}
	}, true);



	window.oops = curr;
	(function(){
		// INFO: PuhState Extension
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
	function doNothing(){}
})(window);
