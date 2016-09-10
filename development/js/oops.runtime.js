/**
 * Created by JCloudYu on 01/11/16.
 */
(function() {
	"use strict";

	console.log(
		"%coops.runtime has be isolated as PumpJS.\nPlease refer to\n%chttps://github.com/JCloudYu/PumpJS%c\nfor latest versions!",
		"color:#F00;", "color:#F00; font-size:1.5em;", "color:#F00;"
	);



	// INFO: Constants
	var
	ID_CANDIDATES = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	CANDIDATE_LEN = ID_CANDIDATES.length,




	// INFO: System-wide variables
	instMap		= {},
	instances	= {},

	basicId		= (function(){
		var id = '', count = 5;
		while ( count-- > 0 )
			id += ID_CANDIDATES.charAt( (CANDIDATE_LEN * Math.random()) | 0 );
		return id;
	})(),
	idRunner	= [ 0 ],



	// INFO: Internal APIs
	___fireEvent = function( src, dest, type, args, async ) {

		if ( !dest )
		{
			oops.util.each( instances, function( inst )
			{
				if ( !async )
				{
					inst.__fireEvent( { type:type, target:null, source:src }, args );
					return;
				}

				oops.async(function(){ inst.__fireEvent( { type:type, target:null, source:src }, args ); });
			});
		}
		else
		{
			var inst;
			if ( !(inst = ___getInstance( dest )) ) return;


			if ( !async )
			{
				inst.__fireEvent( { type:type, target:dest, source:src }, args );
				return;
			}

			oops.async(function(){ inst.__fireEvent( { type:type, target:dest, source:src }, args ); });
		}
	},
	___registerEvent = function( srcId, type, cb, async ) {
		srcId	= srcId || '';
		type	= type || null;
		cb		= oops.typing.isCallable(cb) ? cb : null;
		async	= (arguments.length > 2) ? !!async : true;


		var _interface = instances[ srcId ];
		if ( !_interface || !type || !cb ) return false;

		_interface.__regEvent( type, cb, async );
		return true;
	},
	___getInstance = function( targetId ) {
		return instMap[ targetId ] || instances[ targetId ] || null;
	},
	___getInstInterface = function( targetId ) {
		var inst = ___getInstance( targetId );
		return (!inst) ? null : inst._interface;
	},




	// INFO: Instance Generator
	__INTERFACE_WRAPPER	= function() {
		var evtQueues = {};

		return {
			__fireEvent: function( event, args ) {
				var evtTypes = [ '*', event.type ];

				evtTypes.forEach(function( evtType )
				{
					var queue = evtQueues[evtType];
					if ( !oops.typing.isArray(queue) ) return;

					oops.util.each(queue, function( desc ){
						var doEvt = function(){
							desc.cb( event, args );
						};
						if ( !desc.async )
						{
							doEvt();
							return;
						}

						oops.async(doEvt);
					});
				});
			},
			__regEvent: function( eventType, callback, async ) {
				eventType.split( ',' ).forEach(function( type ){
					if ( !evtQueues.hasOwnProperty( type ) )
						evtQueues[ type ] = [];

					evtQueues[ type ].push({ cb: callback, async: async });
				});
			}
		};
	},
	__KERNEL_JUNCTION	= function( uniqueId ) {
		return {
			getId: function(){ return uniqueId; },
			on: function( eventType, callback, async ) {
				var
				args	= Array.prototype.slice.call( arguments ),
				events  = [], params = [],
				paramMode = false;


				while ( args.length > 0 )
				{
					var arg = args.shift();

					if ( !paramMode && !oops.typing.isCallable( arg ) )
						events.push( arg );
					else
					{
						paramMode = paramMode || true;
						params.push( arg );
					}
				}

				params.unshift( (events.length > 0) ? events.join( ',' ) : null );
				params.unshift( uniqueId );

				___registerEvent.apply( null, params );
				return this;
			},
			fire: function( eventType, args, async ) {
				async = async || false;
				___fireEvent( uniqueId, null, eventType, args, async );
				return this;
			},
			fireTarget: function( target, eventType, args, async ) {
				async = async || false;
				___fireEvent( uniqueId, target, eventType, args, async );
				return this;
			}
		};
	},
	__INSTANTIATOR		= function( instanceId, interfaceGenerator ) {

		// INFO: Parameter normalization
		if ( oops.typing.isCallable(instanceId) )
		{
			interfaceGenerator = instanceId;
			instanceId = undefined;
		}



		// INFO: Request linker for instance's api interface
		// INFO: Expose kernel interface to linker, wrap up and register api interface
		var
		hasLinker	= oops.typing.isCallable( interfaceGenerator ),
		linkFunc	= hasLinker ? interfaceGenerator : ___DO_NOTHING,
		uniqueId	= ___GENERATE_INST_ID(),
		junction	= __KERNEL_JUNCTION( uniqueId );

		instances[uniqueId] = __INTERFACE_WRAPPER();
		instances[uniqueId]._interface = linkFunc(junction) || {};



		// INFO: Hook the generated instance onto global instance map
		var instId = instanceId || null;
		if ( instId ) instMap[ instId ] = instances[uniqueId];


		return hasLinker ? undefined : junction;
	};



	oops.runtime = oops.runtime || {};
	oops.core.expand( oops.runtime, {
		instantiate: __INSTANTIATOR,
		fire: function( eventType, args, async ) {
			async = async || false;
			___fireEvent( null, null, eventType, args, async );
			return this;
		},
		fireTarget: function( target, eventType, args, async ){
			async = async || false;
			___fireEvent( null, target, eventType, args, async );
			return this;
		},
		instance: ___getInstInterface,
		tool: {}
	}, true );


	function ___DO_NOTHING() {}
	function ___GENERATE_INST_ID() {
		var uniqueId = "", i = 0, val = 0, carriage = 1;

		while( carriage > 0 )
		{
			val = idRunner[ i ] + carriage;
			if ( val >= CANDIDATE_LEN )
			{
				idRunner[ i ] = val - CANDIDATE_LEN;
				idRunner[ i + 1 ] = idRunner[ i + 1 ] || 0;
				carriage = 1;
			}
			else
			{
				idRunner[ i ] = val;
				break;
			}

			i++;
		}



		for ( i=0; i<idRunner.length; i++ )
			uniqueId = ID_CANDIDATES.charAt( idRunner[i] ) + uniqueId;

		return basicId + uniqueId;
	}
})();
