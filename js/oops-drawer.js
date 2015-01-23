(function ($) {
	'use strict';
	var Drawer = function(element, options) {
			this.element = element;
		},
		prev = $.fn.drawer;

	Drawer.VERSION = "0.0.1";
	Drawer.DEFAULTS = {};

	Drawer.prototype.toggle	= function() { this.element.toggleClass('open'); };
	Drawer.prototype.open	= function() { this.element.addClass('open'); };
	Drawer.prototype.close	= function() { this.element.removeClass('open'); };



	// jQuery Plugin Definitions
	function batchExec(func) { this.each(function() { $(this).data('oops.drawer')[func](); }); }
	function jQueryPlugin(option) {
		this.toggle = function() {
			batchExec.call(this, 'toggle');
			return this;
		};
		this.open	= function() { batchExec.call(this, 'open'); return this; };
		this.close	= function() { batchExec.call(this, 'close'); return this; };

		return this.each(function () {
			var self	= $(this),
				drawer	= self.data('oops.drawer'),
				options = $.extend({}, Drawer.DEFAULTS, self.data(), typeof option == 'object' && option);

			if (!drawer) self.data('oops.drawer', (drawer = new Drawer(self, options)));
		});
	}

	$.fn.drawer = jQueryPlugin;
	$.fn.drawer.constructor = Drawer;
	$.fn.drawer.noConflict = function () { $.fn.drawer = prev; return this; };


	// INFO: Data API
	$(document).on('click.oops.drawer.data-api', '[data-toggle="oops.drawer"]', function (e) {
		var that		= $(this),
			target		= $(that.attr('data-target')),
			operation	= ("" + (that.attr('data-operation') || "toggle")).toLowerCase();

		if ( !$.inArray(operation, ['open', 'close', 'toggle']) ) return;

		if (that.is('a')) e.preventDefault();
		jQueryPlugin.call(target, {})[operation]();
	});

})(jQuery);
