/**
 * Created by JCloudYu on 11/11/15.
 * Dependency: jQuery, PromiseJS
 */
(function( $, Promise ) {
	"use strict";

	if ( !Promise )
		throw "This extension is dependent on PromiseJS! Please refer to https://www.promisejs.org.";

	if ( !$ )
		throw "This extension is dependent on jQuery! Please refer to https://jquery.com.";

	// region [ constants ]
	var RUN_STATE = {
		BOOT: 0,
		RUN: 1,
		WAIT: 2
	};
	// endregion



	var
	instMap		= {},
	instances	= {},
	execState	= RUN_STATE.BOOT,
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

})( window.jQuery, window.Promise );
