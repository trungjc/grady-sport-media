jQuery(function(){
	var   jQuerynav = jQuery( '#nav' )
	  , aRules = [];

	jQuery( '.section' ).each( function(){
		var  jQuerythis = jQuery( this )
		  , sTitle = jQuerythis.attr( 'data-nav' ) || jQuerythis.find( 'h2:first' ).text()
		  ,    sId = jQuerythis.attr( 'id' ).split( '-' ).pop()
		  ;

		aRules.push( 'body.section-' + sId + ' #nav li.' + sId + ' a');
		jQuerynav.append( '<li class="' + sId + '"><h1><span>' + sTitle + '</span></h1><a href="#' + sId + '">' + sId + '</a></li>' )
	} );

	jQuery( '<style>' + aRules.join( ', ' ) + '{ background : url( images/grey-pink-dot.png ) 0 100% no-repeat; }</style>' ).appendTo( jQuery( 'head' ) );

	jQuerynav
		.on( 'click', 'a', function(){
			scrollToSection( jQuery( this ).attr( 'href' ).substr( 1 ) );
		} )
		.on( 'mouseenter', 'li', function(){
			jQuery( this ).find( 'h1' ).stop().show().animate({ opacity:1, duration: 100, left: 30 }, { queue: false });
		} )
		.on( 'mouseleave', 'li', function(){
			var self = this;
			jQuery( this ).find( 'h1' ).stop().animate({ opacity:0, duration: 100, left: 15 }, { queue: false, complete : function(){ jQuery( this ).hide(); } });
		});

	jQuery( 'body' ).on( 'click', 'a', function( ev ){
		var href = this.getAttribute( 'href' ) || '';
		if( href.indexOf( '#' ) === 0 ){
			console.log(this);
			ev.preventDefault();
			scrollToSection( href.substr( 1 ) );
		}
	} );
});
