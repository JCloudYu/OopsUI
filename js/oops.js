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
		chain: function(){
			var
			queue	= {},
			portal	= function( cate ) {
				if ( !queue[ cate ] ) return;



				var args = Array.prototype.slice.call( arguments, 1 );

				queue[ cate ].forEach(function( item ){
					var trigger = function(){
						item.cb.apply( null, args );
					};


					if ( !item.async )
					{
						trigger();
						return;
					}

					oops.async(trigger);
				});

				return portal;
			};

			oops.core.expand( portal, {
				on: function( cate, responder, async ){
					if ( !oops.typing.isCallable(responder) ) return;


					async = (arguments.length > 2) ? !!async : true;
					queue[ cate ] = queue[ cate ] || [];
					queue[ cate ].push({
						cb: responder,
						async: async
					});

					return portal;
				},
				fire: portal
			});

			return portal;
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
				originalPushState.apply( history, arguments );

				oops.async(function(){
					var event = document.createEvent( 'Event' );
					event.state = state;
					event.initEvent( 'pushstate', true, true );
					window.dispatchEvent( event );

					if ( curr.typing.isCallable( window.onpushstate ) )
						window.onpushstate( event );
				});
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
