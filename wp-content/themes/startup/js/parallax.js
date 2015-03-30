
// su dung function nay vi IE va firefox va Ipad khac nhau
function scrollableElement(els) {
	var elm = null; 
	jQuery.each(els, function(i, it) {
		var scrollElement = jQuery(it);
		if(scrollElement.scrollTop()) {
			if (scrollElement.scrollTop() > 0) {
				elm = it;
			} else {
				scrollElement.scrollTop(1);
				var isScrollable = scrollElement.scrollTop() > 0;
				scrollElement.scrollTop(0);
				if (isScrollable) {
					elm = it;
				}
			}
		}
	});
	return (elm) ? elm : jQuery(els.join()) ;
};

jQuery(document).ready(function(){
if (window.matchMedia("(orientation: portrait)").matches) {
  jQuery('body').removeClass('landscape').addClass('portrait');
  jQuery('.section').css('min-height', jQuery(window).height());
}

if (window.matchMedia("(orientation: landscape)").matches) {
  jQuery('body').removeClass('portrait').addClass('landscape');
}

	jQuery('#pages').append(jQuery('<div id="target"></div>'));
	var target = jQuery('#target');
	
	var a_menu = jQuery('#menu-main-menu').find('a');
	if(jQuery('#menu-main-menu').find('a.active').length == 0) {
		a_menu.eq(0).addClass('active');
	}
	window.RUNNING = false;
	
	function before(evt) {
	}
	function after(evt) {
	  //
		callback(evt);
	}
	
	
	function callback(evt) {
		var selected = jQuery(evt).attr('id');
		var current = jQuery('#menu-main-menu').find('a.active');
		if(current.length > 0 && current.attr('href').replace('#', '') === selected) {
			return;
		}
		var currentIndex = 0;
		a_menu.each(function(i) {
			if(current[0] === this) {
				currentIndex = i;
			}
		});
		a_menu.each(function(i) {
			var href = jQuery(this).attr('href').replace('#', '');
			if(selected === href) {
				var nextIndex = i;
				var x = (currentIndex > nextIndex) ? -1 : 1;
				var K = currentIndex;
				var T = window.setInterval(function() {
					if(K !== nextIndex) {
						//a_menu.eq(K).removeClass('active');
						a_menu.removeClass('active');
						K = K + x;
						a_menu.eq(K).addClass('active');
					} else {
						window.clearInterval(T);
					}
				}, 50);
			}
		});
	}
	
	jQuery('#menu-main-menu,.intro-logo,.button-toggle,.site-title,.more,.view-more ,.more-mobile,.arrow-more ').localScroll({duration: 1000, onBefore: before, onAfter : after});
	
	function onResize() {
		if(jQuery(window).height() < jQuery(window).width()) {
			jQuery('.section').css('min-height', jQuery(window).height());
		}
	}
	onResize();
	jQuery(window).on('resize', function() {
		if (window.matchMedia("(orientation: portrait)").matches) {
  jQuery('body').removeClass('landscape').addClass('portrait');
}

if (window.matchMedia("(orientation: landscape)").matches) {
  jQuery('body').removeClass('portrait').addClass('landscape');
}
		onResize();});

	var delta = 10;
	jQuery(window).on('scroll', function() {
		 var top = jQuery(scrollableElement(['html', 'body'])).scrollTop() + delta;
		 // check show/hide
		 var sections = jQuery('.section');
		 if(top <= sections.eq(1).offset().top) {
			 jQuery('#masthead').hide();
		 } else {
			 jQuery('#masthead').show();
		 }
		 //
			for(var i = 0; i < sections.length; ++i) {
				var t = sections.eq(i).offset().top + sections.eq(i).height();
				if(top <= (t - 72)) {
					target.stop().animate({
						'top' : '0px'
					}, 50, function() {
						callback(sections.eq(i));
					});
					break;
				}
			}
	});


})
