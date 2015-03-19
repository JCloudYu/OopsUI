/**
 * Created by JCloudYu on 3/19/15.
 */
(function () {
	window.htmlTextSize = (function() {

		return function( text, fontSize, parent )
		{
			var	dummy	= document.createElement('div'),
				attr	= { fontSize: fontSize + 'px', padding:'0', position:'absolute', lineHeight:'1', visibility:'hidden' };

			parent	= parent || document.body;

			for(var p in attr) dummy.style[p]= attr[p];

			dummy.appendChild(document.createTextNode(text));
			parent.appendChild(dummy);
			var fs = [dummy.offsetWidth,dummy.offsetHeight];
			parent.removeChild(dummy);

			return fs;
		};
	})();
})();
