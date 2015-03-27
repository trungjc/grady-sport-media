/**
 * JavaScript code for all ui-kit components.
 * Use namespaces.
 */

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

window.angularStartupKit = window.angularStartupKit || {};

/* Video background  */
angularStartupKit.attachBgVideo = function(id, videoData) {
    var videoBgDiv = $('#' + id),
        videoObj = videoData || videoBgDiv.data('video');
    
    videoBgDiv.find('video').remove();
    if (!isMobile.any() && videoBgDiv && videoObj) {
        var videobackground = new $.backgroundVideo(videoBgDiv, {
            "holder": "#" + id,
            "align" : "centerXY",
            "width" : videoObj.width || 0,
            "height": videoObj.height || 0,
            "path"  : sfBuildUri,
            "files" : videoObj.types
        });
    }
}

/* VideoValidator */
angularStartupKit.videoValidator = function(data, callback) {
    data.match(/(http|https):\/\/(player\.|www\.)?(vimeo\.com|youtu(be\.com|\.be))\/(video\/|embed\/|watch\?v=)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    var match = {
        provider: null,
        url: RegExp.$3,
        id: RegExp.$6
    }
    if(match.url == 'youtube.com' || match.url == 'youtu.be'){
        var request = $.ajax({
            url: 'https://gdata.youtube.com/feeds/api/videos/'+match.id,
            timeout: 5000,
            success: function(){
                match.provider = 'YouTube';
            }
        });
    }
    if(match.url == 'vimeo.com'){
        var request = $.ajax({
            url: 'https://vimeo.com/api/v2/video/'+match.id+'.json',
            timeout: 5000,
            dataType: 'jsonp',
            success: function(){
                match.provider = 'Vimeo';
            }
        });
    }
    if(request){
        request.always(function(){
            if(match.provider){
                callback(match.provider, match.id);
            } else {
                alert('Unable to locate a valid video ID');
                callback(match.provider, match.id, true);
            }
        });
    }
};

/**
 *  Headers 
 * */
angularStartupKit.header = angularStartupKit.header || {};


/* Header 1*/
angularStartupKit.header.header1 = function() {
    function init() {};

    function slider(id, activeItem) {
        var pt = PageTransitions(true),
            itemId = '#' + id;
        pt.init(itemId, activeItem);

        $(itemId).find('.prev').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(5, 'prev');
        });
        $(itemId).find('.next').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(6, 'next');
        });
    };

    return {
        init: init,
        slider: slider
    }
};

/* Header 2*/
angularStartupKit.header.header2 = function() {
    function init() {};

    return {
        init: init
    }
};

/* Header 3*/
angularStartupKit.header.header3 = function() {
    function init() {};

    return {
        init: init
    }
};

/* Header 4*/
angularStartupKit.header.header4 = function() {
    function init() {};

    return {
        init: init
    }
};

/* Header 5*/
angularStartupKit.header.header5 = function(preview) {

    function init() {
        $(window).resize(function() {
            var maxH = 0;
            setTimeout(function() {
                $('.header-5-sub .pt-page').css('height', 'auto').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $('.header-5-sub .page-transitions').css('height', maxH + 'px');
            }, 100);
        });
        var navbar = $('.header-5 .navbar');
        $('.search', navbar).click(function() {
            if (!navbar.hasClass('search-mode')) {
                navbar.addClass('search-mode');
                setTimeout(function() {
                    $('header .navbar .navbar-search input[type="text"]').focus();
                }, 1000);
            }
            return false;
        });
        $('.close-search', navbar).click(function() {
            navbar.removeClass('search-mode');
            return false;
        });        
    };

    function slider(id, activeItem) {
        var pt1 = PageTransitions(true),
            itemId = '#' + id;
        pt1.init(itemId, activeItem);
        $(itemId).find('.prev').off('click').on('click', function(e) {
            e.preventDefault();
            pt1.gotoPage(5, 'prev');
        });
        $(itemId).find('.next').off('click').on('click', function(e) {
            e.preventDefault();
            pt1.gotoPage(6, 'next');
        });
        $(window).resize();
    };

    return {
        init: init,
        slider: slider
    }
};

/* Header 6*/
angularStartupKit.header.header6 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 7*/
angularStartupKit.header.header7 = function(preview) {

    function init() {
        $(window).resize(function() {
            var maxH = 0;
            setTimeout(function() {
                $('.header-7-sub section').css('height', $(this).height() + 'px').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $('.header-7-sub .page-transitions').css('height', maxH + 'px');
                var ctrlsHeight = $('.header-7-sub .pt-controls').height();
                $('.header-7-sub .pt-controls').css('margin-top', (-1) * (maxH) / 2 - ctrlsHeight + 'px');
                $('.header-7-sub .pt-controls').css('padding-bottom', (maxH) / 2 - ctrlsHeight + 'px');
            },100);
        });
    };

    function slider(id, activeItem) {
        var pt = PageTransitions(true),
            itemId = '#' + id;
        pt.init(itemId, activeItem);

        var controls = '';

        $('.pt-page', itemId).each(function() {
            controls += '<li></li>';
        })

        $(itemId).find('.prev').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(5, 'prev');
        });
        $(itemId).find('.next').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(6, 'next');
        });

        $(window).resize();
    }

    return {
        init: init,
        slider: slider
    }
};

/* Header 8*/
angularStartupKit.header.header8 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 9*/
angularStartupKit.header.header9 = function() {

    function init() {
        $(window).resize(function() {
            var h = 0;
            $('body > section:not(.header-9-sub)').each(function() {
                h += $(this).outerHeight();
            });
            $('.sidebar-content').css('height', h + 'px');
        });
        $(window).resize();
    };

    return {
        init: init
    }
};

/* Header 10*/
angularStartupKit.header.header10 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 11*/
angularStartupKit.header.header11 = function() {

    function init() {
    }
    return {
        init: init
    }
};

/* Header 12*/
angularStartupKit.header.header12 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 13*/
angularStartupKit.header.header13 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 14*/
angularStartupKit.header.header14 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 15*/
angularStartupKit.header.header15 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 16*/
angularStartupKit.header.header16 = function(preview) {

    function init() {
        var topMenu = 0,
            wpadminbar = 0;
        if($('.topMenu').length) {
            topMenu = $('.topMenu').outerHeight();
        }
        if($('#wpadminbar').length) {
            wpadminbar = $('#wpadminbar').outerHeight();
        }
        $(window).resize(function() {
            $('.header-16-sub').css('height', $(this).height() - topMenu - wpadminbar + 'px');
        });
        $(window).resize().scroll();
    };

    function slider(id, activeItem) {
        var pt = PageTransitions(true),
            itemId = '#' + id;
        pt.init(itemId, activeItem);

        $(itemId).find('.prev').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(2, 'prev');
        });
        $(itemId).find('.next').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(1, 'next');
        });
    };

    return {
        init: init,
        slider: slider
    }
};

/* Header 17*/
angularStartupKit.header.header17 = function(preview) {

    function init() {
        $(window).resize(function() {
            $('.header-17-sub .page-transitions').each(function() {
                var maxH = 0;
                $('.pt-page', this).css('height', 'auto').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $(this).css('height', maxH + 'px');
                if(!$(this).hasClass('calculated')){
                    $(this).addClass('calculated');
                }
            });
        });
    };

    function slider(id, activeItem) {
        var pt = PageTransitions(true),
            itemId = '#' + id;
        pt.init(itemId, activeItem);

        var controls = '';
        $('.pt-page', itemId).each(function() {
            controls += '<li></li>';
        });
        $(itemId).parent().find('.pt-indicators').empty().append(controls);

        $(itemId).find('.prev').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(44, 'prev');
        });
        $(itemId).find('.next').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(45, 'next');
        });

        $('.next, .prev').on('click', function() {
            $(window).resize();
        });
    };

    return {
        init: init,
        slider: slider
    }

};

/* Header 18*/
angularStartupKit.header.header18 = function(preview) {

    function init() {
        $(window).resize(function() {
            maxH = $(window).height(); 
            $('.header-18 .page-transitions').css('height', maxH + 'px');
        });
    };

    function slider(id, activeItem) {
        var pt = PageTransitions(true),
            itemId = '#' + id;
        pt.init(itemId, activeItem);

        $(itemId).find('.prev').off('click').on('click', function() {
            pt.gotoPage(5, 'prev');
            return false;
        });

        $(itemId).find('.next').off('click').on('click', function() {
            pt.gotoPage(6, 'next');
            return false;
        });

        $(window).resize();
    };

    return {
        init: init,
        slider: slider
    }

};

/* Header 19*/
angularStartupKit.header.header19 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 20*/
angularStartupKit.header.header20 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 21*/
angularStartupKit.header.header21 = function() {

    function init() {
        maxH = $(window).height();
        if($('#wpadminbar').length){
            maxH = maxH - $('#wpadminbar').outerHeight();
        }
        if($('.topMenu').length){
            maxH = maxH - $('.topMenu').outerHeight();
        }
        if($('.navbar-fixed-top').length!=0){
            maxH = maxH - $('.navbar-fixed-top').outerHeight();
        }
        if($('.header-21').length!=0){
            maxH = maxH - $('.header-21').outerHeight();
        }
        if((maxH / 90) < 3){
            $('.header-21-sub .control-btn').css('bottom', 0);
        }
        $('.header-21-sub').height(maxH);
    };

    return {
        init: init
    }

};

/* Header 22*/
angularStartupKit.header.header22 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Header 23*/
angularStartupKit.header.header23 = function() {
    function init() {
        angularStartupKit.attachBgVideo('bgVideo');
        var isPlayed = false;
        $('#play').off('click').on('click', function(evt) {
            var that = this,
                componentId = 'Header23',
                videoContainer = $('#pPlayer' + componentId),
                videoSrc = videoContainer.attr('src');

            isPlayed = true;
            evt.preventDefault();
            $('.popup-video').addClass('shown').height($(window).height() - 132);
            $('body').css('overflow-y', 'hidden');
            $('.designmodo-wrapper, #previewHolder').height('100%').css('overflow-y', 'hidden');
            $('html, body').scrollTop(0);
            $(window).on('resize', function() {
                $('.popup-video').height($(window).height() - 132);
            });
            $('.popup-video, .mask').fadeIn('slow', function() {
                if(videoSrc.indexOf('youtube') !== -1) {
                    if(videoSrc.indexOf('autoplay') == -1) {
                        videoContainer.attr('src', videoSrc + '?autoplay=1');
                    }
                }
                if(videoSrc.indexOf('vimeo') !== -1) {
                    $f($('#pPlayer' + componentId)[0]).api('play');
                }
            });

            $('.mask').on('click', function() {
                isPlayed = false;
                if(videoSrc.indexOf('youtube') !== -1) {
                    videoContainer.attr('src', '');
                    videoContainer.attr('src', videoSrc);
                }
                if(videoSrc.indexOf('vimeo') !== -1) {
                    $f($('#pPlayer' + componentId)[0]).api('pause');
                }
                $('.popup-video, .mask').fadeOut('slow', function() {
                    $('.popup-video').removeClass('shown');
                    $('body').css('overflow-y', 'visible');
                    $('.designmodo-wrapper, #previewHolder').height('auto').css('overflow-y', 'visible');
                    $('html, body').scrollTop($('.header-23').offset().top);
                });
            });
        });
    };

    return {
        init: init
    }
};


/**
 *  Contents 
 * */

angularStartupKit.content = angularStartupKit.content || {};

angularStartupKit.content.contentCarouselInit = function(id, activeItem) {
    var carouselBlock = $(id),
        carouselContent = carouselBlock.find('.carousel-inner > div'),
        carouselIndicators = carouselBlock.find('.carousel-indicators > li');

    carouselContent.removeClass('active');
    carouselIndicators.removeClass('active');
    if(activeItem) {
        carouselContent.eq(activeItem).addClass('active');
        carouselIndicators.eq(activeItem).addClass('active');
    } else {
        carouselContent.first().addClass('active');
        carouselIndicators.first().addClass('active');
    }
};

angularStartupKit.content.updateCounter = function(_main, type) {
    var _pages = $(_main).find('.item'),
        page = _pages.filter('.active').index();

    if(type === "prev") {
        page -= 1;
    } else if(type === "next") {
        page += 1;
    }

    if (page < 0) {
      page = _pages.length - 1;
    } else if (page >= _pages.length) {
      page = 0;
    }

    if($(_main).closest('.dm-template').scope) {
      var scope = $(_main).closest('.dm-template').scope(),
          scopeId = $(_main).attr('dm-slider-archive');
      scope[scopeId + 'Flag'] = [];
      for(var i = 0; i < _pages.length; i++) {
        if(i === page) {
          scope[scopeId + 'Flag'].push(true)
        } else {
          scope[scopeId + 'Flag'].push(false)
        }
      }
      scope.$apply();
    }
};

/* Content 1*/
angularStartupKit.content.content1 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 2*/
angularStartupKit.content.content2 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 3*/
angularStartupKit.content.content3 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 4*/
angularStartupKit.content.content4 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 5*/
angularStartupKit.content.content5 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 6*/
angularStartupKit.content.content6 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 7*/
angularStartupKit.content.content7 = function() {
    
    function init() {};

    return {
        init: init
    }
};

/* Content 8*/
angularStartupKit.content.content8 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 9*/
angularStartupKit.content.content9 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 10*/
angularStartupKit.content.content10 = function(preview) {

    function init() {};

    function slider(id, activeItem) {
        var itemId = '#' + id;
        angularStartupKit.content.contentCarouselInit(itemId, activeItem);
        $(itemId).carousel();

        $(itemId).find('.next').off('click').on('click', function() {
            angularStartupKit.content.updateCounter(itemId, 'next');
            $(itemId).carousel('next');
            return false;
        });

        $(itemId).find('.prev').off('click').on('click', function() {
            angularStartupKit.content.updateCounter(itemId, 'prev');
            $(itemId).carousel('prev');
            return false;
        });
    }

    return {
        init: init,
        slider: slider
    }
};

/* Content 11*/
angularStartupKit.content.content11 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 12*/
angularStartupKit.content.content12 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 13*/
angularStartupKit.content.content13 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 14*/
angularStartupKit.content.content14 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 15*/
angularStartupKit.content.content15 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 16*/
angularStartupKit.content.content16 = function() {
    
    function init() {};

    return {
        init: init
    }
};

/* Content 17*/
angularStartupKit.content.content17 = function(preview) {

    function init() {
        $(window).resize(function() {
            $('div[id^="c-17_myCarousel"]').each(function() {
                var maxH = 0;
                $('.item', this).each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                });
                $('.carousel-inner', this).css('height', maxH + 'px');
            });
        });
    };

    function slider(id, activeItem) {
        var itemId = '#' + id;
        angularStartupKit.content.contentCarouselInit(itemId, activeItem);
        $(itemId).carousel({
            interval : 6000000
        });

        $(itemId).find('.next').off('click').on('click', function() {
            angularStartupKit.content.updateCounter(itemId, 'next');
            $(itemId).carousel('next');
            return false;
        });

        $(itemId).find('.prev').off('click').on('click', function() {
            angularStartupKit.content.updateCounter(itemId, 'prev');
            $(itemId).carousel('prev');
            return false;
        });

        $(window).resize();
    };

    return {
        init: init,
        slider: slider
    }
};

/* Content 18*/
angularStartupKit.content.content18 = function(preview) {

    function init() {
        $(window).resize(function() {
            $('div[id^="c-18_myCarousel"]').each(function() {
                var maxH = 0;
                $('.item', this).each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                });
                $('.carousel-inner', this).css('height', maxH + 'px');
            });
        });
    };

    function slider(id, activeItem) {
        var itemId = $('#' + id);
        angularStartupKit.content.contentCarouselInit(itemId, activeItem);
        itemId.carousel({
            interval : 6000000
        });

        $(itemId).find('.next').off('click').on('click', function() {
            angularStartupKit.content.updateCounter(itemId, 'next');
            $(itemId).carousel('next');
            return false;
        });

        $(itemId).find('.prev').off('click').on('click', function() {
            angularStartupKit.content.updateCounter(itemId, 'prev');
            $(itemId).carousel('prev');
            return false;
        });

        $(window).resize();
    };

    return {
        init: init,
        slider: slider
    }
};

/* Content 19*/
angularStartupKit.content.content19 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 20*/
angularStartupKit.content.content20 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 21*/
angularStartupKit.content.content21 = function() {

    function init() {
        $(window).resize(function() {
            $('.content-21 .features').each(function() {
                var maxH = 0;
                $('.features-body', this).css('height', 'auto').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $('.features-bodies', this).css('height', maxH + 'px');
                if(!$('.features-bodies', this).hasClass('calculated')){
                    $('.features-bodies', this).addClass('calculated');
                }
            });
        });

        $('.content-21 .features .features-header .box').click(function() {
            $(this).addClass('active').parent().children().not(this).removeClass('active');
            $(this).closest('.features').find('.features-body').removeClass('active').eq($(this).index()).addClass('active');
            return false;
        });

        $(window).resize();
    };

    return {
        init: init
    }
};

/* Content 22*/
angularStartupKit.content.content22 = function() {

    function init() {
        var el = $('.content-22');
        $(window).resize(function() {
            if (!el.hasClass('ani-processed')) {
                el.data('scrollPos', el.offset().top - $(window).height() + el.outerHeight() - parseInt(el.css('padding-bottom'), 10));
            }
        }).scroll(function() {
            if (!el.hasClass('ani-processed')) {
                if ($(window).scrollTop() >= el.data('scrollPos')) {
                    el.addClass('ani-processed');
                }
            }
        });

        $(window).resize();
    };

    return {
        init: init
    }
};
/* Content 23*/
angularStartupKit.content.content23 = function() {

    function init() {};

    return {
        init: init
    }
};
/* Content 24*/
angularStartupKit.content.content24 = function() {

    function init() {
        $(window).resize(function() {
            $('.content-24 .features').each(function() {
                var maxH = 0;
                $('.features-body', this).css('height', 'auto').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $('.features-bodies', this).css('height', maxH + 'px');
            });
        });

        $('.content-24 .features .features-header .box').click(function() {
            $(this).addClass('active').parent().children().not(this).removeClass('active');
            $(this).closest('.features').find('.features-body').removeClass('active').eq($(this).index()).addClass('active');
            return false;
        });

        $(window).resize();
    };

    return {
        init: init
    }
};
/* Content 25*/
angularStartupKit.content.content25 = function() {

    function init() {};

    return {
        init: init
    }

};
/* Content 26*/
angularStartupKit.content.content26 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Content 27*/
angularStartupKit.content.content27 = function() {
    
    function init() {};

    return {
        init: init
    }
};
/* Content 28*/
angularStartupKit.content.content28 = function() {

    function init() {};

    return {
        init: init
    }
};
/* Content 29*/
angularStartupKit.content.content29 = function() {

    function init() {};

    return {
        init: init
    }
};
/* Content 30*/
angularStartupKit.content.content30 = function() {

    function init() {
        $(window).resize(function() {
            var boxes = $('.content-30 .col-sm-3');
            for (var t = 0; t <= boxes.length; t++) {
                var descTop = $(boxes[t]).find('.description-top');
                if ($(window).width() <= 480) {
                    $(boxes[t]).find('.img').after(descTop);

                } else {
                    $(boxes[t]).find('.img').before(descTop);
                }
            }
        });
        $('.img img').each(function() {
            $(this).css('filter', 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale")');
        });
        $(window).resize()
    };

    return {
        init: init
    }
};
/* Content 31*/
angularStartupKit.content.content31 = function() {

    function init() {
        $(window).scroll(function() {
            if ($(window).width() > 480) {
                $('.row', '.content-31-inner').each(function(idx) {
                    if ($(window).scrollTop() >= ($(this).offset().top - $(window).height() + $(window).height() / 2 + 100)) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            }
        });
    };

    function slider(id, activeItem) {
        (function(el) {
            $(window).resize(function() {
                $(el).each(function() {
                    var maxH = 0;
                    $('.pt-page', this).css('height', 'auto').each(function() {
                        var h = $(this).outerHeight();
                        if (h > maxH)
                            maxH = h;
                    }).css('height', maxH + 'px');
                    $(this).css('height', maxH + 'px');
                });
            });
            $(el).each(function() {
                var pt = PageTransitions(true);
                pt.init(el, activeItem);
                $('.prev', this).off('click').on('click', function() {
                    pt.gotoPage(68, 'prev');
                    return false;
                });
                $('.next', this).off('click').on('click', function() {
                    pt.gotoPage(68, 'next');
                    return false;
                });
            });
            $(el).find('img').each(function() {
                $(this).load(function() {
                    setTimeout(function() {
                        $(window).resize();
                    }, 0)
                })
            })
        })($('#' + id));
    };

    return {
        init: init,
        slider: slider
    }
};

/* Content 32*/
angularStartupKit.content.content32 = function() {

    function init() {};

    return {
        init: init
    }
}

/* Content 33*/
angularStartupKit.content.content33 = function() {

    function init() {};

    return {
        init: init
    }
}

/* Content 34*/
angularStartupKit.content.content34 = function(preview) {
    
    function init() {
        $(window).resize(function() {
            var maxH = 0;
            $('.content-34 section').each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            });
            $('.content-34 .page-transitions').css('height', maxH + 'px');
            var ctrlsHeight = $('.content-34 .pt-controls').height();
            $('.content-34 .pt-controls').css('margin-top', (-1) * ctrlsHeight / 2 + 'px');
        });
    };

    function slider(id, activeItem) {
        var pt = PageTransitions(true),
            itemId = '#' + id;
        pt.init(itemId, activeItem);

        var controls = '';
        $('.pt-page', itemId).each(function() {
            controls += '<li></li>';
        })
        $(itemId).parent().find('.pt-indicators').empty().append(controls);

        $(itemId).find('.prev').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(5, 'prev');
        });
        $(itemId).find('.next').off('click').on('click', function(e) {
            e.preventDefault();
            pt.gotoPage(6, 'next');
        });

        $(window).resize();
    };

    return {
        init: init,
        slider: slider
    }
}

/* Content 35*/
angularStartupKit.content.content35 = function(preview) {
    function init() {};

    function slider(id, activeItem) {
        $('div[id^="content-35-pt-main-bxSlider"]').each(function() {
            var _this = $(this),
                dmTemplate = _this.closest('.dm-template'),
                pager = dmTemplate.find('.content-35-customPager'),
                slide;

            if( _this.length ) {
                var useCSSMode = true;
                if ( $('.edit-mode') ) {
                    useCSSMode = false;
                }
                slide = _this.bxSlider({
                    'controls': false,
                    'infiniteLoop': false,
                    'adaptiveHeight': true,
                    'useCSS': useCSSMode
                });
            }
            pager.find($('.menuicon')).on('mouseenter', function(){
                $(this).parent().addClass('showmenu');
            })
            pager.on('mouseleave', function(){
                $(this).removeClass('showmenu');
            })
            if(activeItem) {
                slide.goToSlide(activeItem);
                setActiveTab(activeItem)
            }
            $('.dm-controls .next', dmTemplate).off('click').on('click', function(e) {
                e.preventDefault();
                slide.goToNextSlide();
                updateSlide();
                setActiveTab(slide.getCurrentSlide())
            });

            $('.dm-controls .prev', dmTemplate).off('click').on('click', function(e) {
                e.preventDefault();
                slide.goToPrevSlide();
                updateSlide();
                setActiveTab(slide.getCurrentSlide())
            });

            function setActiveTab(active) {
                $(pager).find('a').each(function(index) {
                    var _el = $(this);
                    if(index != active) {
                        _el.removeClass('active')
                    } else {
                        _el.addClass('active')
                    }
                })
            };

            function updateSlide() {
                if(dmTemplate.scope) {
                    var scope = dmTemplate.scope(),
                        scopeId = dmTemplate.find('.content-35-slider').attr('dm-slider-archive');

                    scope[scopeId + 'Flag'] = [];
                    for(var i = 0; i < slide.getSlideCount(); i++) {
                        if(i === slide.getCurrentSlide()) {
                            scope[scopeId + 'Flag'].push(true)
                        } else {
                            scope[scopeId + 'Flag'].push(false)
                        }
                    }
                    scope.$apply();
                }
            }
        })

        $(window).resize();
    };

    return {
        init: init,
        slider: slider
    }
}

/* Content 36*/
angularStartupKit.content.content36 = function() {

    function init() {};

    return {
        init: init
    }
}
/* Content 37*/
angularStartupKit.content.content37 = function() {

    function init() {};

    return {
        init: init
    }
}
/* Content 38*/
angularStartupKit.content.content38 = function() {

    function init() {
        //samples grid
        var samplesGrid = $('.samples-grid');
        setTimeout(function () {
            samplesGrid.masonry({
                itemSelector: '.sample-box'
            });
        }, 0);

        $('.samples-holder').addClass('shown');
        $('.sample-box').addClass('visible');
        //can I see the real pixels?
        $('.samples-holder img').click(function () {
            var imgsrc = $(this).attr('src');
            var file = imgsrc.split('/');
            var filename = file[file.length - 1];
            var structure = $(this).data('structure');
            var path = imgsrc.split('/' + filename);
            path = path[0];
            showLargeImage(filename, path + '/', $(this), 'next', structure);
        });

        if (window.location.hash.indexOf(".samples-holder") != -1) {
            var id = window.location.hash;
            $(id).click();
        }

        $(document).keydown(function (e) {
            if (e.keyCode == 37) {
                $('.largeScreenshots .prev').click();
                return false;
            }
            if (e.keyCode == 39) {
                $('.largeScreenshots .next').click();
                return false;
            }
            if (e.keyCode == 38) {
                $('.largeScreenshots').clearQueue().animate({ scrollTop: $('.largeScreenshots').scrollTop() - 500 + "px"}, 250);
                return false;
            }
            if (e.keyCode == 40) {
                $('.largeScreenshots').clearQueue().animate({ scrollTop: $('.largeScreenshots').scrollTop() + 500 + "px"}, 250);
                return false;
            }
            if (e.keyCode == 27) {
                $('.close').click();
                return false;
            }
        });

        function showLargeImage(file, prefix, obj, direction, structure) {
            //dark screen, add elements
            if (!$('body').hasClass('largescreenshotsopened')) {
                $('body').addClass('noscroll').addClass('largescreenshotsopened').append('<div class="largeScreenshots"><div class="picHolder"><h1></h1><span></span><div class="imgHolder"><img/></div></div><div class="prev"></div><div class="next"></div><div class="close"></div></div>');
                $('.largeScreenshots .close, .largeScreenshots span').click(function (e) {
                    $('body').removeClass('noscroll').removeClass('largescreenshotsopened');
                    $('.largeScreenshots').remove();
                    window.location.hash = "/";
                });
            }

            //show me the image
            $('.largeScreenshots .imgHolder img').attr('src', prefix + file);
            $('.largeScreenshots .imgHolder img').ready(function (e) {
                $('.largeScreenshots').scrollTop(0);
                $('.largeScreenshots .imgHolder img');
                $('.largeScreenshots h1').text(obj.attr('alt'));

                window.location.hash=obj.attr('id');

                var speed = '0.75s cubic-bezier(.27,1.64,.32,.95)';
                $('.picHolder, .picHolder h1').css('-webkit-animation', direction + " " + speed).css('-moz-animation', direction + " " + speed).css('-ms-animation', direction + " " + speed).css("-o-animation", direction + " " + speed).css("animation", direction + " " + speed);
                setTimeout(function () {
                    $('.picHolder, .picHolder h1').removeAttr('style');
                }, 750);
            });

            //set nice position for arrows
            function setNicePosition(){
                var p = $(".largeScreenshots .picHolder");
                var position = p.position();
                var size = $('.largeScreenshots img').outerHeight();
                var scrolltop = $(".largeScreenshots").scrollTop()
                if (position.top+192> 0) {
                    $('.largeScreenshots .prev, .largeScreenshots .next').css('top', position.top+192).css('height', $(window).height() - position.top  - 192);
                } else if (scrolltop + $(window).height() > size+192+36) {
                    var posFromBottom = (scrolltop + $(window).height()) - (size+192+36);
                    $('.largeScreenshots .prev, .largeScreenshots .next').css('top', 0).css('height', $(window).height()-posFromBottom);
                } else {
                    $('.largeScreenshots .prev, .largeScreenshots .next').css('top', 0).css('height', $(window).height());
                }
            }
            setNicePosition()

            $('.largeScreenshots').scroll(function () {
                setNicePosition();
            });

            //preload pics
            var newObj = obj.parent().nextOrFirst('.samples-holder .sample-box').find('img');
            var imgsrc = newObj.attr('src');
            var file = imgsrc.split('/');
            var filename = file[file.length - 1];
            var path = imgsrc.split('/' + filename);
            path = path[0];
            $([path + '/' + filename]).preload();

            var newObj = obj.parent().prevOrLast('.samples-holder .sample-box').find('img');
            var imgsrc = newObj.attr('src');
            var file = imgsrc.split('/');
            var filename = file[file.length - 1];
            var path = imgsrc.split('/' + filename);
            path = path[0];
            $([path + '/' + filename]).preload();

            //get next picure and show next
            $('.largeScreenshots .prev,.largeScreenshots .next, .largeScreenshots .imgHolder img').unbind();
            setTimeout(function () {
                $('.largeScreenshots .prev').click(function () {
                    var newObj = obj.parent().prevOrLast('.samples-holder .sample-box').find('img');
                    var structure = obj.data('structure');
                    var imgsrc = newObj.attr('src');
                    var file = imgsrc.split('/');
                    var filename = file[file.length - 1];
                    var path = imgsrc.split('/' + filename);
                    path = path[0];

                    showLargeImage(filename, path + '/', newObj, "prev",structure);
                });

                $('.largeScreenshots .next, .largeScreenshots .imgHolder img').click(function () {

                    var newObj = obj.parent().nextOrFirst('.samples-holder .sample-box').find('img');
                    var structure = newObj.data('structure');
                    var imgsrc = newObj.attr('src');
                    var file = imgsrc.split('/');
                    var filename = file[file.length - 1];
                    var path = imgsrc.split('/' + filename);
                    path = path[0];

                    showLargeImage(filename, path + '/', newObj, "next",structure);
                });
            }, 750);

            //add swipe gesture for mobile
             if (isMobile.any()){
                 $('.largeScreenshots .imgHolder img').touchwipe({
                      wipeLeft: function() { $('.largeScreenshots .next').click(); },
                     wipeRight: function(){ $('.largeScreenshots .prev').click(); },
                     min_move_x: 20,
                      min_move_y: 20,
                     preventDefaultEvents: false
                 });
             }
        }
    };

    window.masonryInit = function(reload) {
        var samplesGrid = $('.samples-grid');
        if(reload) {
            samplesGrid.masonry('reloadItems');
        }
        setTimeout(function () {
            samplesGrid.masonry({
                itemSelector: '.sample-box'
            });
            setTimeout(function () {
                $('.sample-box').addClass('visible');
                init();
            }, 200);
        }, 500);
    };

    return {
        init: init,
        masonryInit: masonryInit
    }
};


/**
 * Prices 
 */
angularStartupKit.price = angularStartupKit.price || {};

/* Price 1*/
angularStartupKit.price.price1 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Price 2*/
angularStartupKit.price.price2 = function() {
    
    function init() {};

    return {
        init: init
    }
};

/* Price 3*/
angularStartupKit.price.price3 = function() {
    
    function init() {};

    return {
        init: init
    }
};

/* Price 4*/
angularStartupKit.price.price4 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Price 5*/
angularStartupKit.price.price5 = function() {
    
    function init() {};

    return {
        init: init
    }
};


/**
 * Projects 
 */
angularStartupKit.projects = angularStartupKit.projects || {};

/* project-1 */
angularStartupKit.projects.projects1 = function() {

    function init() {};

    return {
        init: init
    }
};

/* project-2 */
angularStartupKit.projects.projects2 = function() {

    function init() {};

    return {
        init: init
    }
};

/* project-3 */
angularStartupKit.projects.projects3 = function() {

    function init() {};

    return {
        init: init
    }
};

/* project-4 */
angularStartupKit.projects.projects4 = function() {
    
    function init() {};

    return {
        init: init
    }
};


/**
 * Contacts 
 */
angularStartupKit.contacts = angularStartupKit.contacts || {};

/* Contacts 1*/
angularStartupKit.contacts.contacts1 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Contacts 2*/
angularStartupKit.contacts.contacts2 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Contacts 3*/
angularStartupKit.contacts.contacts3 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Contacts 4*/
angularStartupKit.contacts.contacts4 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Contacts 5*/
angularStartupKit.contacts.contacts5 = function() {

    function init() {};

    return {
        init: init
    }
};


/**
 * Crews 
 */

angularStartupKit.crew = angularStartupKit.crew || {}

/* Crews 1*/
angularStartupKit.crew.crew1 = function() {

    function init() {
        $('.member .photo img', '[dm-template="crew.crew1"]').each(function() {
            $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
        });
    };

    return {
        init: init
    }
};

/* Crews 2*/
angularStartupKit.crew.crew2 = function() {

    function init() {
        $('.member .photo img', '[dm-template="crew.crew2"]').each(function() {
            $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
        });
    };

    return {
        init: init
    }
};

/* Crews 3*/
angularStartupKit.crew.crew3 = function() {

    function init() {
        $('.member .photo img', '[dm-template="crew.crew3"]').each(function() {
            $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
        });
    };

    return {
        init: init
    }
};

/* Crews 4*/
angularStartupKit.crew.crew4 = function() {

    function init() {
        $('.member .photo img', '[dm-template="crew.crew4"]').each(function() {
            $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
        });
    };

    return {
        init: init
    }
};


/**
 * Footers 
 */
angularStartupKit.footer = angularStartupKit.footer || {};

/* Footer 1*/
angularStartupKit.footer.footer1 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 2*/
angularStartupKit.footer.footer2 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 3*/
angularStartupKit.footer.footer3 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 4*/
angularStartupKit.footer.footer4 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 5*/
angularStartupKit.footer.footer5 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 6*/
angularStartupKit.footer.footer6 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 7*/
angularStartupKit.footer.footer7 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 8*/
angularStartupKit.footer.footer8 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 9*/
angularStartupKit.footer.footer9 = function() {

    function init() {};

    return {
        init: init
    }
    
};

/* Footer 10*/
angularStartupKit.footer.footer10 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 11*/
angularStartupKit.footer.footer11 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 12*/
angularStartupKit.footer.footer12 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 13*/
angularStartupKit.footer.footer13 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 14*/
angularStartupKit.footer.footer14 = function() {

    function init() {};

    return {
        init: init
    }
};

/* Footer 15*/
angularStartupKit.footer.footer15 = function() {

    function init() {};

    return {
        init: init
    }
};