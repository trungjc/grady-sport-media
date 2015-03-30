jQuery(function(){
	var aBackgrounds = jQuery( 'section > .bg' )
	  ,     jQuerycontent = jQuery( '#content' )
	  ;

	function measureBackgrounds(){
		var i, l, oData, jQueryitem, jQuerysection, fRW, fRH;

		for( i=0, l=aBackgrounds.length; i<l; i++ ){
			jQueryitem    = aBackgrounds.eq(i);
			oData    = jQueryitem.data();
			jQuerysection = jQueryitem.parent();
			jQuerysection.appendTo( jQuerycontent );

			if( !oData.width ){
				oData.width  = jQueryitem.width();
				oData.height = jQueryitem.height();
			}

			fRW = jQuerysection.width()  / oData.width;
			fRH = jQuerysection.height() / oData.height;

			jQueryitem.css( { width: 'auto', height: 'auto' } ).css( fRW > fRH ? 'width' : 'height', '100%' );

			jQuerysection.detach();
		}
	}

	jQuery( window ).bind( 'post-resize-anim', measureBackgrounds );
});