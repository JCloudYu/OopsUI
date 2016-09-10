(function () {
	"use strict";

	oops.util = oops.util || {};
	oops.core.expand( oops.util, {
		htmlTextSize: function( text, fontSize, parent ) {

			var	dummy = document.createElement('div'),
				attr  = { fontSize: fontSize + 'px', padding:'0', position:'absolute', lineHeight:'1', visibility:'hidden' };

			parent	= parent || document.body;

			for(var p in attr) dummy.style[p]= attr[p];

			dummy.appendChild(document.createTextNode(text));
			parent.appendChild(dummy);
			var fs = [dummy.offsetWidth,dummy.offsetHeight];
			parent.removeChild(dummy);

			return fs;
		},
		lockScroll: function( lockKey ) {
			if (window.addEventListener) // older FF
				window.addEventListener('DOMMouseScroll', oops.util.eventEater, false);
			window.onwheel = oops.util.eventEater; // modern standard
			window.onmousewheel = document.onmousewheel = oops.util.eventEater; // older browsers, IE
			window.ontouchmove  = oops.util.eventEater; // mobile
			document.onkeydown  = __EAT_SCROLL_KEYS;
		},
		releaseScroll: function() {
			if ( window.removeEventListener ) window.removeEventListener('DOMMouseScroll', oops.util.eventEater, false);
			window.onmousewheel = document.onmousewheel = null;
			window.onwheel = null;
			window.ontouchmove = null;
			document.onkeydown = null;
		},
		eventEater: function(e) {
			e = e || window.event;
			if ( e.preventDefault ) e.preventDefault();
			e.returnValue = false;
		},
		randomStr: function( length, candidates ) {
			candidates = candidates || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

			var text = "";
			while( text.length < length )
				text += candidates.charAt(Math.floor(Math.random() * candidates.length));

			return text;
		}
	}, true );

	oops.core.expand( window, {
		round10: function( value, exp ) {
			return decimalAdjust( 'round', value, exp );
		},
		floor10: function( value, exp ) {
			return decimalAdjust( 'floor', value, exp );
		},
		ceil10: function( value, exp ) {
			return decimalAdjust( 'ceil', value, exp );
		}
	}, false );



	var __scrollKeys = {37: 1, 38: 1, 39: 1, 40: 1};
	function __EAT_SCROLL_KEYS(e) {
		if ( !__scrollKeys [e.keyCode] ) return;

		oops.util.eventEater( e );
		return false;
	}
	function decimalAdjust( type, value, exp ) {
			// If the exp is undefined or zero...
			if ( typeof exp === 'undefined' || +exp === 0 )
				return Math[ type ]( value );

			value = +value; exp = +exp;

			if ( isNaN( value ) || !(typeof exp === 'number' && exp % 1 === 0) )
				return NaN;

			value = value.toString().split( 'e' );
			value = Math[ type ]( +(value[ 0 ] + 'e' + (value[ 1 ] ? (+value[ 1 ] - exp) : -exp)) );
			// Shift back
			value = value.toString().split( 'e' );
			return +(value[ 0 ] + 'e' + (value[ 1 ] ? (+value[ 1 ] + exp) : exp));
		}
})();
