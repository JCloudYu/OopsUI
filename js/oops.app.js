/**
 * Created by JCloudYu on 11/11/15.
 * Dependency: jQuery, PromiseJS
 */
(function( window ) {
	"use strict";

	if ( !window.Promise ) __PROMISE_7_0_4( window );

	var
	// INFO: Constants
	RUN_STATE = { BOOT: 0, RUN: 1, WAIT: 2 },

	// INFO: System-wide variables
	instMap		= {},
	instances	= {},
	execState	= RUN_STATE.BOOT;

	/*
	dangling	= {
		pause: function( target ) {

				if ( !target )
				{
					oops.util.each( instances, function( inst ){
						if ( !inst.pause ) return;
						inst.pause();
					});

					execState = RUN_STATE.WAIT;
					$( oops.app ).trigger( "paused" );
				}
				else
				{
					var inst = instMap[ target ] || instances[ target ] || null;
					if ( !inst || !oops.typing.isCallable(inst.pause) ) return;

					inst.pause();
				}
			},
			resume: function( target ) {

				if ( !target )
				{
					oops.util.each( instances, function( inst ){
						if ( !inst.resume ) return;
						inst.resume();
					});

					execState = RUN_STATE.RUN;
					$( oops.app ).trigger( "resumed" );
				}
				else
				{
					var inst = instMap[ target ] || instances[ target ] || null;
					if ( !inst || !oops.typing.isCallable(inst.resume) ) return;

					inst.resume();
				}
			}
	};
	*/



	oops.app = oops.app || {};
	oops.core.expand( oops.app, {
		initiate: function(){
			return new Promise(function( fulfill ){
				oops.app.initiate = ___DO_NOTHING;
				oops.util.each( instances, function( inst ){
					if ( !inst.initiate ) return;
					oops.async(function(){inst.initiate()});
				});

				execState = RUN_STATE.RUN;
				oops.async( fulfill );
			});
		},
		instantiate: function( instanceId, generator ){
			if ( oops.typing.isCallable(instanceId) )
			{
				generator = instanceId;
				instanceId = undefined;
			}

			if ( !oops.typing.isCallable( generator ) ) return undefined;

			var kernelCtrl	= {}, inst;
			if ( !( inst = generator(kernelCtrl) ) )
				throw "Invalid instance object is returned!";


			var uniqueId = oops.util.randomStr( 32 );
			while( instances[uniqueId] ) uniqueId = oops.util.randomStr( 32 );
			instances[ uniqueId ] = inst;
			inst.id = uniqueId;



			oops.core.expand( kernelCtrl, ___KERNEL_OPERATOR( uniqueId ) );

			var instId = instanceId || null;
			if ( instId == "external" ) {
				console.log( "\"external\" is a reserved keyword! Ignoring..." );
				instId = null;
			}
			if ( instId ) instMap[ instId.toString() ] = inst;

			if ( execState > RUN_STATE.BOOT && inst.initiate )
				oops.async(function(){inst.initiate()});

			return ___INST_WRAPPER( inst );
		},
		tool: {}
	}, true );



	function ___INST_WRAPPER( inst ) {
		var _instance = inst;

		return {
			message: function( message ){
				oops.async(function(){
					if ( !_instance.message ) return;
					_instance.message( { system:false, content:message, target:null, source:"external" } );
				});
			},
			trigger: function( evtType, evtParam ){
				oops.async(function(){
					var
					evtParam = (oops.typing.isObject(evtParam)) ? evtParam : { param: evtParam },
					event = { type:evtType, system:false, target:null, source:"external" };

					oops.core.expand( event, evtParam, false );

					if ( !_instance.event ) return;
					_instance.event( event );
				});
			},
			pause: function(){
				if ( !_instance.pause ) return;
				_instance.pause();
			},
			resume: function(){
				if ( !_instance.resume ) return;
				_instance.resume();
			}
		};
	}
	function ___KERNEL_OPERATOR( refId ) {
		return {
			trigger: function( target, evtType, evtParam ) {
				if ( arguments.length == 0 ) return;
				if ( arguments.length == 1 )
				{
					evtType = target;
					evtParam = {};
					target = null;
				}
				else
				if ( arguments.length == 2 )
				{
					evtParam = evtType;
					evtType = target;
					target = null;
				}


				oops.async(function(){
					var event = { type:evtType, system:false, target:target, source:refId };
					evtParam = (oops.typing.isObject(evtParam)) ? evtParam : { param: evtParam };

					oops.core.expand( event, evtParam, false );

					if ( !target )
					{
						oops.util.each( instances, function( inst ){
							if ( !inst.event ) return;
							inst.event( event );
						});
					}
					else
					{
						var inst = instMap[ target ] || instances[ target ] || null;
						if ( !inst || !oops.typing.isCallable(inst.event) ) return;

						inst.event( event );
					}
				});
			},
			message: function( target, message ) {
				if ( arguments.length == 0 ) return;
				if ( arguments.length == 1 )
				{
					message = target;
					target = null;
				}

				oops.async(function(){
					var msg = { system:false, content:message, target:target, source:refId };

					if ( !target )
					{
						oops.util.each( instances, function( inst ){
							if ( !inst.message ) return;
							inst.message( msg );
						});
					}
					else
					{
						var inst = instMap[ target ] || instances[ target ] || null;
						if ( !inst || !oops.typing.isCallable(inst.message) ) return;

						inst.message( msg );
					}
				});
			}
		};
	}
	function ___DO_NOTHING(){}

	function __PROMISE_7_0_4( window ){
		var Promise = null;

		(function e( t, n, r ) {
			function s( o, u ) {
				if ( !n[ o ] ) {
					if ( !t[ o ] ) {
						var a = typeof require == "function" && require;
						if ( !u && a ) return a( o, !0 );
						if ( i ) return i( o, !0 );
						var f = new Error( "Cannot find module '" + o + "'" );
						throw f.code = "MODULE_NOT_FOUND", f;
					}
					var l = n[ o ] = {
						exports: {}
					};
					t[ o ][ 0 ].call( l.exports, function( e ) {
						var n = t[ o ][ 1 ][ e ];
						return s( n ? n : e );
					}, l, l.exports, e, t, n, r );
				}
				return n[ o ].exports;
			}

			var i = typeof require == "function" && require;
			for ( var o = 0; o < r.length; o++ ) s( r[ o ] );
			return s;
		})( {
			1: [ function( require, module, exports ) {
				"use strict";
				var asap = require( "asap/raw" );

				function noop() {}

				var LAST_ERROR = null;
				var IS_ERROR = {};

				function getThen( obj ) {
					try {
						return obj.then;
					} catch ( ex ) {
						LAST_ERROR = ex;
						return IS_ERROR;
					}
				}

				function tryCallOne( fn, a ) {
					try {
						return fn( a );
					} catch ( ex ) {
						LAST_ERROR = ex;
						return IS_ERROR;
					}
				}

				function tryCallTwo( fn, a, b ) {
					try {
						fn( a, b );
					} catch ( ex ) {
						LAST_ERROR = ex;
						return IS_ERROR;
					}
				}

				module.exports = Promise;
				function Promise( fn ) {
					if ( typeof this !== "object" ) {
						throw new TypeError( "Promises must be constructed via new" );
					}
					if ( typeof fn !== "function" ) {
						throw new TypeError( "not a function" );
					}
					this._37 = 0;
					this._12 = null;
					this._59 = [];
					if ( fn === noop ) return;
					doResolve( fn, this );
				}

				Promise._99 = noop;
				Promise.prototype.then = function( onFulfilled, onRejected ) {
					if ( this.constructor !== Promise ) {
						return safeThen( this, onFulfilled, onRejected );
					}
					var res = new Promise( noop );
					handle( this, new Handler( onFulfilled, onRejected, res ) );
					return res;
				};
				function safeThen( self, onFulfilled, onRejected ) {
					return new self.constructor( function( resolve, reject ) {
						var res = new Promise( noop );
						res.then( resolve, reject );
						handle( self, new Handler( onFulfilled, onRejected, res ) );
					} );
				}

				function handle( self, deferred ) {
					while ( self._37 === 3 ) {
						self = self._12;
					}
					if ( self._37 === 0 ) {
						self._59.push( deferred );
						return;
					}
					asap( function() {
						var cb = self._37 === 1 ? deferred.onFulfilled : deferred.onRejected;
						if ( cb === null ) {
							if ( self._37 === 1 ) {
								resolve( deferred.promise, self._12 );
							} else {
								reject( deferred.promise, self._12 );
							}
							return;
						}
						var ret = tryCallOne( cb, self._12 );
						if ( ret === IS_ERROR ) {
							reject( deferred.promise, LAST_ERROR );
						} else {
							resolve( deferred.promise, ret );
						}
					} );
				}

				function resolve( self, newValue ) {
					if ( newValue === self ) {
						return reject( self, new TypeError( "A promise cannot be resolved with itself." ) );
					}
					if ( newValue && (typeof newValue === "object" || typeof newValue === "function") ) {
						var then = getThen( newValue );
						if ( then === IS_ERROR ) {
							return reject( self, LAST_ERROR );
						}
						if ( then === self.then && newValue instanceof Promise ) {
							self._37 = 3;
							self._12 = newValue;
							finale( self );
							return;
						} else if ( typeof then === "function" ) {
							doResolve( then.bind( newValue ), self );
							return;
						}
					}
					self._37 = 1;
					self._12 = newValue;
					finale( self );
				}

				function reject( self, newValue ) {
					self._37 = 2;
					self._12 = newValue;
					finale( self );
				}

				function finale( self ) {
					for ( var i = 0; i < self._59.length; i++ ) {
						handle( self, self._59[ i ] );
					}
					self._59 = null;
				}

				function Handler( onFulfilled, onRejected, promise ) {
					this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
					this.onRejected = typeof onRejected === "function" ? onRejected : null;
					this.promise = promise;
				}

				function doResolve( fn, promise ) {
					var done = false;
					var res = tryCallTwo( fn, function( value ) {
						if ( done ) return;
						done = true;
						resolve( promise, value );
					}, function( reason ) {
						if ( done ) return;
						done = true;
						reject( promise, reason );
					} );
					if ( !done && res === IS_ERROR ) {
						done = true;
						reject( promise, LAST_ERROR );
					}
				}
			}, {
				"asap/raw": 4
			} ],
			2: [ function( require, module, exports ) {
				"use strict";
				var Promise = require( "./core.js" );
				module.exports = Promise;
				var TRUE = valuePromise( true );
				var FALSE = valuePromise( false );
				var NULL = valuePromise( null );
				var UNDEFINED = valuePromise( undefined );
				var ZERO = valuePromise( 0 );
				var EMPTYSTRING = valuePromise( "" );

				function valuePromise( value ) {
					var p = new Promise( Promise._99 );
					p._37 = 1;
					p._12 = value;
					return p;
				}

				Promise.resolve = function( value ) {
					if ( value instanceof Promise ) return value;
					if ( value === null ) return NULL;
					if ( value === undefined ) return UNDEFINED;
					if ( value === true ) return TRUE;
					if ( value === false ) return FALSE;
					if ( value === 0 ) return ZERO;
					if ( value === "" ) return EMPTYSTRING;
					if ( typeof value === "object" || typeof value === "function" ) {
						try {
							var then = value.then;
							if ( typeof then === "function" ) {
								return new Promise( then.bind( value ) );
							}
						} catch ( ex ) {
							return new Promise( function( resolve, reject ) {
								reject( ex );
							} );
						}
					}
					return valuePromise( value );
				};
				Promise.all = function( arr ) {
					var args = Array.prototype.slice.call( arr );
					return new Promise( function( resolve, reject ) {
						if ( args.length === 0 ) return resolve( [] );
						var remaining = args.length;

						function res( i, val ) {
							if ( val && (typeof val === "object" || typeof val === "function") ) {
								if ( val instanceof Promise && val.then === Promise.prototype.then ) {
									while ( val._37 === 3 ) {
										val = val._12;
									}
									if ( val._37 === 1 ) return res( i, val._12 );
									if ( val._37 === 2 ) reject( val._12 );
									val.then( function( val ) {
										res( i, val );
									}, reject );
									return;
								} else {
									var then = val.then;
									if ( typeof then === "function" ) {
										var p = new Promise( then.bind( val ) );
										p.then( function( val ) {
											res( i, val );
										}, reject );
										return;
									}
								}
							}
							args[ i ] = val;
							if ( --remaining === 0 ) {
								resolve( args );
							}
						}

						for ( var i = 0; i < args.length; i++ ) {
							res( i, args[ i ] );
						}
					} );
				};
				Promise.reject = function( value ) {
					return new Promise( function( resolve, reject ) {
						reject( value );
					} );
				};
				Promise.race = function( values ) {
					return new Promise( function( resolve, reject ) {
						values.forEach( function( value ) {
							Promise.resolve( value ).then( resolve, reject );
						} );
					} );
				};
				Promise.prototype[ "catch" ] = function( onRejected ) {
					return this.then( null, onRejected );
				};
			}, {
				"./core.js": 1
			} ],
			3: [ function( require, module, exports ) {
				"use strict";
				var rawAsap = require( "./raw" );
				var freeTasks = [];
				var pendingErrors = [];
				var requestErrorThrow = rawAsap.makeRequestCallFromTimer( throwFirstError );

				function throwFirstError() {
					if ( pendingErrors.length ) {
						throw pendingErrors.shift();
					}
				}

				module.exports = asap;
				function asap( task ) {
					var rawTask;
					if ( freeTasks.length ) {
						rawTask = freeTasks.pop();
					} else {
						rawTask = new RawTask();
					}
					rawTask.task = task;
					rawAsap( rawTask );
				}

				function RawTask() {
					this.task = null;
				}

				RawTask.prototype.call = function() {
					try {
						this.task.call();
					} catch ( error ) {
						if ( asap.onerror ) {
							asap.onerror( error );
						} else {
							pendingErrors.push( error );
							requestErrorThrow();
						}
					} finally {
						this.task = null;
						freeTasks[ freeTasks.length ] = this;
					}
				};
			}, {
				"./raw": 4
			} ],
			4: [ function( require, module, exports ) {
				(function( global ) {
					"use strict";
					module.exports = rawAsap;
					function rawAsap( task ) {
						if ( !queue.length ) {
							requestFlush();
							flushing = true;
						}
						queue[ queue.length ] = task;
					}

					var queue = [];
					var flushing = false;
					var requestFlush;
					var index = 0;
					var capacity = 1024;

					function flush() {
						while ( index < queue.length ) {
							var currentIndex = index;
							index = index + 1;
							queue[ currentIndex ].call();
							if ( index > capacity ) {
								for ( var scan = 0, newLength = queue.length - index; scan < newLength; scan++ ) {
									queue[ scan ] = queue[ scan + index ];
								}
								queue.length -= index;
								index = 0;
							}
						}
						queue.length = 0;
						index = 0;
						flushing = false;
					}

					var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
					if ( typeof BrowserMutationObserver === "function" ) {
						requestFlush = makeRequestCallFromMutationObserver( flush );
					} else {
						requestFlush = makeRequestCallFromTimer( flush );
					}
					rawAsap.requestFlush = requestFlush;
					function makeRequestCallFromMutationObserver( callback ) {
						var toggle = 1;
						var observer = new BrowserMutationObserver( callback );
						var node = document.createTextNode( "" );
						observer.observe( node, {
							characterData: true
						} );
						return function requestCall() {
							toggle = -toggle;
							node.data = toggle;
						};
					}

					function makeRequestCallFromTimer( callback ) {
						return function requestCall() {
							var timeoutHandle = setTimeout( handleTimer, 0 );
							var intervalHandle = setInterval( handleTimer, 50 );

							function handleTimer() {
								clearTimeout( timeoutHandle );
								clearInterval( intervalHandle );
								callback();
							}
						};
					}

					rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;
				}).call( this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {} );
			}, {} ],
			5: [ function( require, module, exports ) {
				if ( typeof Promise.prototype.done !== "function" ) {
					Promise.prototype.done = function( onFulfilled, onRejected ) {
						var self = arguments.length ? this.then.apply( this, arguments ) : this;
						self.then( null, function( err ) {
							setTimeout( function() {
								throw err;
							}, 0 );
						} );
					};
				}
			}, {} ],
			6: [ function( require, module, exports ) {
				var asap = require( "asap" );
				if ( typeof Promise === "undefined" ) {
					Promise = require( "./lib/core.js" );
					require( "./lib/es6-extensions.js" );
				}
				require( "./polyfill-done.js" );
			}, {
				"./lib/core.js"          : 1,
				"./lib/es6-extensions.js": 2,
				"./polyfill-done.js"     : 5,
				asap                     : 3
			} ]
		}, {}, [ 6 ] );
		//# sourceMappingURL=/polyfills/promise-7.0.4.js.map

		window.Promise = Promise;
	}
})( window );
