/**
 * Created by JCloudYu on 5/5/16.
 */
(function() {
	if ( !window.oops )
		throw "oops.js is required! Please refer to \"https://github.com/JCloudYu/OopsUI\" for latest version!";

	if ( !window.jQuery )
		throw "jQuery is required! Please refer to \"https://jquery.com\" for latest version";

	if ( !window.Promise )
		throw "Promise is required! Please refer to \"https://www.promisejs.org\" for latest version";


	oops.core.expand( window.oops, {
		_loadComp: function( componentName, basePath, anchor ) {
			return new Promise(function( fulfill, reject ){
				basePath = basePath || '/components';
				anchor	 = $( anchor || 'body' );

				var
				modulePath	= basePath + '/' + componentName + '/',
				anchorOp	= (anchor.prop( 'tagName' ) == 'body') ? anchor.append : anchor.before;

				$.getJSON( modulePath + 'component.json', function( descriptor ){
					var
					views	 = [], scripts = [], styles = [],
					comps	 = descriptor[ 'components' ] || [],
					promises = [];



					comps.forEach(function( comp ){
						if ( comp['view'] )	  views.push( modulePath + comp['view'] );
						if ( comp['script'] ) scripts.push( modulePath + comp['script'] );
						if ( comp['style'] )  styles.push( modulePath + comp['style'] );
					});



					$.unique(styles).forEach(function( stylePath ){
						var style = document.createElement( 'link' );

						style.type	= 'text/css';
						style.rel	= 'stylesheet';
						style.href	= stylePath;

						anchorOp.call( anchor, style );
					});
					$.unique(views).forEach(function( viewPath ){
						promises.push(new Promise(function(complete, failure){
							$.get( viewPath, function( htmlText ){
								$( htmlText ).each(function(idx, tag){
									anchorOp.call( anchor, $(tag) );
								});

								complete();
							}, 'text').fail(failure);
						}));
					});
					$.unique(scripts).forEach(function( scriptPath ){
						var script = document.createElement( 'script' );

						script.type	= 'text/javascript';
						script.src	= scriptPath;

						anchorOp.call( anchor, script );
					});

					if ( promises.length == 0 )
						promises.push(new Promise(function(fulfill){ fulfill(); }));

					Promise.all( promises ).then( fulfill ).catch( reject );
				}).fail( reject );
			});
		}
	}, true);
})();
