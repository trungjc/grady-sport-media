/**
 * JavaScript code for all ui-kit components.
 * Use namespaces.
 */

window.isRetina = (function() {
    var root = ( typeof exports == 'undefined' ? window : exports);
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
    if (root.devicePixelRatio > 1)
        return true;
    if (root.matchMedia && root.matchMedia(mediaQuery).matches)
        return true;
    return false;
})();
//nextOrFirst? prevOrLast?
jQuery.fn.nextOrFirst = function(selector) { var next = this.next(selector); return (next.length) ? next : this.prevAll(selector).last(); }
jQuery.fn.prevOrLast = function(selector){ var prev = this.prev(selector); return (prev.length) ? prev : this.nextAll(selector).last(); }

//preload images
$.fn.preload=function(){this.each(function(){$("<img/>")[0].src=this})}

window.previewStartupKit = window.previewStartupKit || {};

previewStartupKit.hideCollapseMenu = function() {
    $('#previewHolder > .navbar-collapse').css({
        'z-index': 1
    });
    $('#previewHolder').removeClass('nav-visible');
    setTimeout(function() {
        $('#previewHolder > .navbar-collapse').addClass('collapse');
    }, 400)
}

previewStartupKit.initGoogleMap = function(holder) {
    function initialize() {
        $('.google-maps', holder).each(function() {
            var dataMap = $(this).data('map');
            var map = new google.maps.Map(this, {
                zoom: parseInt(dataMap.zoom, 10),
                scrollwheel: false,
                center: new google.maps.LatLng(dataMap.center.latitude, dataMap.center.longitude)
            });
        })
    }

    initialize();
};

previewStartupKit.videoValidator = function(data, callback, iframeId) {
    data.match(/(http|https):\/\/(player\.|www\.)?(vimeo\.com|youtu(be\.com|\.be))\/(video\/|embed\/|watch\?v=)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    var match = {
        provider: null,
        url: RegExp.$3,
        id: RegExp.$6
    }
    if(match.url == 'youtube.com' || match.url == 'youtu.be'){
        var request = $.ajax({
            url: 'http://gdata.youtube.com/feeds/api/videos/'+match.id,
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
                callback(match.provider, match.id, iframeId);
            } else {
                alert('Unable to locate a valid video ID');
                callback(match.provider, match.id, iframeId, true);
            }
        });
    }
};
previewStartupKit.embedVideo = function(provider, videoId, iframeId, failed) {
    var iframe = $('#templates #' + iframeId + ', #previewHolder #' + iframeId);
    if(provider === 'Vimeo') {
        iframe.attr('src', 'https://player.vimeo.com/video/' + videoId);
    }
    if(provider === 'YouTube') {
        iframe.attr('src', 'https://www.youtube.com/embed/' + videoId);
    }
};

/**
 *  Headers 
 * */
previewStartupKit.header = previewStartupKit.header || {};

previewStartupKit.header._inFixedMode = function(headerClass, previewHolder) {
    var navCollapse;
    if($(headerClass).parents("#previewHolder").length) {
        navCollapse = $(headerClass + ' .navbar-collapse', previewHolder).first().clone(true);
        navCollapse.attr('id', 'preview-' + headerClass.substr(1));
        $(previewHolder).append(navCollapse);
        $(headerClass + ' .navbar-toggle', previewHolder).on('click', function() {
            console.log('true');
            var $this = $(this);
            if($(previewHolder).hasClass('nav-visible')) {
                previewStartupKit.hideCollapseMenu();
            } else {
                $('.navbar-collapse#preview-' + headerClass.substr(1)).removeClass('collapse');
                setTimeout(function() {
                    $(previewHolder).addClass('nav-visible');
                }, 1)
                setTimeout(function() {
                    $('#previewHolder > .navbar-collapse').css({
                        'z-index': 101
                    });
                }, 400)
            }
            return false;
        });
    }
};

/* Header 1*/
previewStartupKit.header.header1 = function(previewHolder) {
    var sliderId = 'div[id^="pt-main"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);
        $(itemId, previewHolder).find('.control-prev').on('click', function() {
            pt.gotoPage(5, 'prev');
            return false;
        });
        $(itemId, previewHolder).find('.control-next').on('click', function() {
            pt.gotoPage(6, 'next');
            return false;
        });
    });

    $('.header-1-sub').each(function() {
        if ( $(sliderId, $(this)).children('.pt-page').length <= 1 ) {
            $('.controls', $(this)).hide();
        }
        else {
            $('.controls', $(this)).show();
        }
    });

    previewStartupKit.header._inFixedMode('.header-1', previewHolder);
};

/* Header 2*/
previewStartupKit.header.header2 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-2', previewHolder);
};

/* Header 3*/
previewStartupKit.header.header3 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-3', previewHolder);
};

/* Header 4*/
previewStartupKit.header.header4 = function(previewHolder) {};

/* Header 5*/
previewStartupKit.header.header5 = function(previewHolder) {
    $(window).resize(function() {
        var maxH = 0;
        $('.header-5-sub .pt-page', previewHolder).css('height', 'auto').each(function() {
            var h = $(this).outerHeight();
            if (h > maxH)
                maxH = h;
        }).css('height', maxH + 'px');
        $('.header-5-sub .page-transitions', previewHolder).css('height', maxH + 'px');
    });

    var navbar = $('.header-5 .navbar', previewHolder);
    $('.search', navbar).click(function() {
        if (!navbar.hasClass('search-mode')) {
            navbar.addClass('search-mode');
            setTimeout(function() {
                $('header .navbar .navbar-search input[type="text"]').focus();
            }, 1000);
        } else {

        }
        return false;
    });

    $('.close-search', navbar).click(function() {
        navbar.removeClass('search-mode');
        return false;
    });

    var sliderId = 'div[id^="h-5-pt-1"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);
        $(itemId, previewHolder).find('.pt-control-prev').on('click', function() {
            pt.gotoPage(5, 'prev');
            return false;
        });
        $(itemId, previewHolder).find('.pt-control-next').on('click', function() {
            pt.gotoPage(6, 'next');
            return false;
        });
    });

    $(window).resize();
    previewStartupKit.header._inFixedMode('.header-5', previewHolder);

    $('.header-5-sub').each(function() {
        if ( $(sliderId, $(this)).children('.pt-page').length <= 1 ) {
            $('.pt-control-prev, .pt-control-next', $(this)).hide();
        }
        else {
            $('.pt-control-prev, .pt-control-next', $(this)).show();
        }
    });
};

/* Header 6*/
previewStartupKit.header.header6 = function(previewHolder) {
    var iframe = $('.header-6-sub', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });
    previewStartupKit.header._inFixedMode('.header-6', previewHolder);
};

/* Header 7*/
previewStartupKit.header.header7 = function(previewHolder) {
    var iframe = $('.header-7-sub', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });

    $(window).resize(function() {
        var maxH = 0;
        $('.header-7-sub section', previewHolder).css('height', $(this).height() + 'px').each(function() {
            var h = $(this).outerHeight();
            if (h > maxH)
                maxH = h;
        }).css('height', maxH + 'px');
        $('.header-7-sub .page-transitions', previewHolder).css('height', maxH + 'px');
        var ctrlsHeight = $('.header-7-sub .pt-controls', previewHolder).height();
        $('.header-7-sub .pt-controls', previewHolder).hide();
        setTimeout(function() {
            $('.header-7-sub .pt-controls', previewHolder).css('margin-top', (-1) * (maxH) / 2 - ctrlsHeight + 'px');
            $('.header-7-sub .pt-controls', previewHolder).css('padding-bottom', (maxH) / 2 - ctrlsHeight + 'px').show();
        }, 100);
    });

    var sliderId = 'div[id^="h-7-pt-main"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);

        var controls = '';
        $(itemId + ' .pt-page', previewHolder).each(function(i) {
            if($(this).hasClass('pt-page-current')) {
                controls += '<li class="active"></li>';
            } else {
                controls += '<li></li>';
            }
        })
        $(itemId, previewHolder).parent().find('.pt-indicators').empty().append(controls);

        $(itemId, previewHolder).parent().find('.pt-indicators > *').on('click', function() {
            if ($(this).hasClass('active'))
                return false;

            var curPage = $(this).parent().children('.active').index();
            var nextPage = $(this).index();
            $('.header-7-sub').css('background-color',$('#h-7-pt-main').children('.pt-page').eq(nextPage).find('section').css('background-color'));
            var ani = 5;
            if (curPage < nextPage) {
                ani = 6;
            }

            pt.gotoPage(ani, nextPage);
            $(this).addClass('active').parent().children().not(this).removeClass('active');
            return false;
        });
    });

    $('.header-7-sub').each(function() {
        if ( $(sliderId, $(this)).children('.pt-page').length <= 1 ) {
            $('.pt-indicators', $(this)).hide();
        }
        else {
            $('.pt-indicators', $(this)).show();
        }
    });

    $(window).resize();
    previewStartupKit.header._inFixedMode('.header-7', previewHolder);
};

/* Header 8*/
previewStartupKit.header.header8 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-8', previewHolder);
};

/* Header 9*/
previewStartupKit.header.header9 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-9', previewHolder);
};

/* Header 10*/
previewStartupKit.header.header10 = function(previewHolder) {
    $('.header-10-sub .control-btn', previewHolder).on('click', function() {
        if ( $(this).closest('.dm-template').next().length ) {
            $.scrollTo($(this).closest('.dm-template').next(), {
                axis : 'y',
                duration : 500
            });
        }
        return false;
    });
    previewStartupKit.header._inFixedMode('.header-10', previewHolder);
};

/* Header 11*/
previewStartupKit.header.header11 = function(previewHolder) {
    var iframe = $('.header-11-sub', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });
    previewStartupKit.header._inFixedMode('.header-11', previewHolder);
};

/* Header 12*/
previewStartupKit.header.header12 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-12', previewHolder);
};

/* Header 13*/
previewStartupKit.header.header13 = function(previewHolder) {};

/* Header 14*/
previewStartupKit.header.header14 = function(previewHolder) {};

/* Header 15*/
previewStartupKit.header.header15 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-15', previewHolder);
};

/* Header 16*/
previewStartupKit.header.header16 = function(previewHolder) {
    var topMenu = 0,
        wpadminbar = 0;

    var sliderId = 'div[id^="h-16-pt-main"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);
        $(itemId, previewHolder).find('.pt-control-prev').on('click', function() {
            pt.gotoPage(2, 'prev');
            return false;
        });
        $(itemId, previewHolder).find('.pt-control-next').on('click', function() {
            pt.gotoPage(1, 'next');
            return false;
        });
    });

    $('.header-16-sub', previewHolder).each(function() {
        if ( $(sliderId, $(this)).children('.pt-page').length <= 1 ) {
            $('.pt-control-prev, .pt-control-next', $(this)).hide();
        }
        else {
            $('.pt-control-prev, .pt-control-next', $(this)).show();
        }
    });

    $('.header-16-sub .scroll-btn a', previewHolder).on('click', function(e) {
        if($(this).closest('.dm-template').next().length) {
            $.scrollTo($(this).closest('.dm-template').next(), {
                axis : 'y',
                duration : 500
            });
        }
        return false;
    });
    
    if($('.topMenu').length) {
        topMenu = $('.topMenu').outerHeight();
    }
    if($('#wpadminbar').length) {
        wpadminbar = $('#wpadminbar').outerHeight();
    }

    $(window).resize(function() {
        $('.header-16-sub', previewHolder).css('height', $(this).height() - topMenu - wpadminbar + 'px');
    });

    $(window).resize();

    previewStartupKit.header._inFixedMode('.header-16', previewHolder);
};

/* Header 17*/
previewStartupKit.header.header17 = function(previewHolder) {
    var sliderId = 'div[id^="h-17-pt-1"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);

        var controls = '';
        $(itemId + ' .pt-page', previewHolder).each(function(i) {
            if($(this).hasClass('pt-page-current')) {
                controls += '<li class="active"></li>';
            } else {
                controls += '<li></li>';
            }
        })
        $(itemId, previewHolder).parent().find('.pt-indicators').empty().append(controls);

        $(itemId, previewHolder).parent().find('.pt-indicators > *').on('click', function() {
            if ($(this).hasClass('active'))
                return false;

            var curPage = $(this).parent().children('.active').index();
            var nextPage = $(this).index();
            $('.header-7-sub').css('background-color',$('#h-7-pt-main').children('.pt-page').eq(nextPage).find('section').css('background-color'));
            var ani = 44;
            if (curPage < nextPage) {
                ani = 45;
            }

            pt.gotoPage(ani, nextPage);
            $(this).addClass('active').parent().children().not(this).removeClass('active');
            return false;
        });
    });

    $('.header-17-sub').each(function() {
        if ( $(sliderId, $(this)).children('.pt-page').length <= 1 ) {
            $('.pt-controls', $(this)).hide();
        }
        else {
            $('.pt-controls', $(this)).show();
        }
    });

    $(window).resize(function() {
        $('.header-17-sub .page-transitions', previewHolder).each(function() {
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

    $(previewHolder + ' #h-17-pt-1 img').each(function() {
        $(this).load(function() {
            $(window).resize();
        })
    });

    previewStartupKit.header._inFixedMode('.header-17', previewHolder);
};

/* Header 18*/
previewStartupKit.header.header18 = function(previewHolder) {
    $(window).resize(function() {
        maxH = $(window).height(); 
        $('.header-18 .page-transitions', previewHolder).css('height', maxH + 'px');
    });

    $(window).resize();

    var sliderId = 'div[id^="h-18-pt-main"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);
        $(itemId, previewHolder).find('.pt-control-prev').on('click', function() {
            pt.gotoPage(5, 'prev');
            return false;
        });
        $(itemId, previewHolder).find('.pt-control-next').on('click', function() {
            pt.gotoPage(6, 'next');
            return false;
        });
    });

    $('.header-18', previewHolder).each(function() {
        if ( $('.page-transitions', $(this)).children('.pt-page').length <= 1 ) {
            $('.pt-controls', $(this)).hide();
        }
        else {
            $('.pt-controls', $(this)).show();
        }
    });
};

/* Header 19*/
previewStartupKit.header.header19 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-19', previewHolder);
};

/* Header 20*/
previewStartupKit.header.header20 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-20', previewHolder);
};

/* Header 21*/
previewStartupKit.header.header21 = function(previewHolder) {
    maxH = $(window).height();
    if($('#wpadminbar').length){
        maxH = maxH - $('#wpadminbar').outerHeight();
    }
    if($('.topMenu').length){
        maxH = maxH - $('.topMenu').outerHeight();
    }
    if($('.navbar-fixed-top', previewHolder).length!=0){
        maxH = maxH - $('.navbar-fixed-top', previewHolder).outerHeight();
    }
    if($('.header-21', previewHolder).length!=0){
        maxH = maxH - $('.header-21', previewHolder).outerHeight();
    }
    if((maxH / 90) < 3){
        $('.header-21-sub .control-btn', previewHolder).css('bottom', 0);
    }
    $('.header-21-sub', previewHolder).height(maxH);
    $(window).resize();

    $('.header-21-sub .control-btn', previewHolder).on('click', function() {
        if($(this).closest('.dm-template').next().length) {
            $.scrollTo($(this).closest('.dm-template').next(), {
                axis : 'y',
                duration : 500
            });
        }
        return false;
    });
    previewStartupKit.header._inFixedMode('.header-21', previewHolder);
};

/* Header 22*/
previewStartupKit.header.header22 = function(previewHolder) {
    previewStartupKit.header._inFixedMode('.header-22', previewHolder);
};

/* Header 23*/
previewStartupKit.header.header23 = function(previewHolder) {
    var iframe = $('.header-23', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });
    previewStartupKit.attachBgVideo('bgVideoPreview', previewHolder);

    $('#play', previewHolder).off('click').on('click', function(evt) {
        var that = this,
            componentId = 'Header23Preview',
            videoContainer = $('#pPlayer' + componentId, previewHolder),
            videoSrc = videoContainer.attr('src');

        evt.preventDefault();
            $('.popup-video').addClass('shown').height($(window).height() - 132);
            $('body').css('overflow-y', 'hidden');
            $('.designmodo-wrapper, #previewHolder').height('100%').css('overflow-y', 'hidden');
            $('html, body').scrollTop(0);
        $('.popup-video, .mask', previewHolder).fadeIn('slow', function() {
            if(videoSrc.indexOf('youtube') !== -1) {
                if(videoSrc.indexOf('autoplay') == -1) {
                    videoContainer.attr('src', videoSrc + '?autoplay=1');
                }
            }
            if(videoSrc.indexOf('vimeo') !== -1) {
                $f($('#pPlayer' + componentId, previewHolder)[0]).api('play');
            }
        });
        $('.mask', previewHolder).on('click', function() {
            if(videoSrc.indexOf('youtube') !== -1) {
                videoContainer.attr('src', '');
                videoContainer.attr('src', videoSrc);
            }
            if(videoSrc.indexOf('vimeo') !== -1) {
                $f($('#pPlayer' + componentId, previewHolder)[0]).api('pause');
            }
            $('.popup-video, .mask', previewHolder).fadeOut('slow', function() {
                $('.popup-video', previewHolder).removeClass('shown');
                $('body').css('overflow-y', 'visible');
                $('.designmodo-wrapper, #previewHolder').height('auto').css('overflow-y', 'visible');
                $('html, body').scrollTop($('.header-23').offset().top);
            });
        });
    });
    previewStartupKit.header._inFixedMode('.header-23', previewHolder);
};

/* Video background  */
previewStartupKit.attachBgVideo = function(id, previewHolder, videoData) {
    var videoBgDiv = $('#' + id, previewHolder),
        videoObj = videoData || videoBgDiv.data('video');

    $('#bgVideo').find('video').remove();
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


/**
 *  Contents 
 * */

previewStartupKit.content = previewStartupKit.content || {};

/* Content 1*/
previewStartupKit.content.content1 = function(previewHolder) {
    var iframe = $('.content-1', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });
};

/* Content 2*/
previewStartupKit.content.content2 = function(previewHolder) {
    var iframe = $('.content-2', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });
};

/* Content 3*/
previewStartupKit.content.content3 = function(previewHolder) {};

/* Content 4*/
previewStartupKit.content.content4 = function(previewHolder) {};

/* Content 5*/
previewStartupKit.content.content5 = function(previewHolder) {};

/* Content 6*/
previewStartupKit.content.content6 = function(previewHolder) {};

/* Content 7*/
previewStartupKit.content.content7 = function(previewHolder) {};

/* Content 8*/
previewStartupKit.content.content8 = function(previewHolder) {};

/* Content 9*/
previewStartupKit.content.content9 = function(previewHolder) {};

/* Content 10*/
previewStartupKit.content.content10 = function(previewHolder) {
    $('div[id^="c-10_myCarousel"]', previewHolder).each(function() {
        var _this = $(this),
            itemId = '#' + _this.attr('id'),
            carouselContent = _this.find('.carousel-inner > div'),
            carouselIndicators = _this.find('.carousel-indicators > li');

        carouselContent.first().addClass('active');
        carouselIndicators.first().addClass('active');

        $('.carousel-control', _this).first().addClass('disabled').attr('href', '#');
        $('.carousel-control', _this).last().removeClass('disabled').attr('href', itemId);

        $(itemId, previewHolder).carousel();
    });
    $('.content-10', previewHolder).each(function() {
        console.log($(this));
        if ( $('.carousel', $(this)).find('.carousel-inner .item').length <= 1 ) {
            $('.carousel-indicators', $(this)).hide();
        }
        else {
            $('.carousel-indicators', $(this)).show();
        }
    });
};

/* Content 11*/
previewStartupKit.content.content11 = function(previewHolder) {};

/* Content 12*/
previewStartupKit.content.content12 = function(previewHolder) {};

/* Content 13*/
previewStartupKit.content.content13 = function(previewHolder) {};

/* Content 14*/
previewStartupKit.content.content14 = function(previewHolder) {};

/* Content 15*/
previewStartupKit.content.content15 = function(previewHolder) {};

/* Content 16*/
previewStartupKit.content.content16 = function(previewHolder) {
    $('.content-16 .control-btn', previewHolder).on('click', function() {
        if($(this).closest('.dm-template').next().length) {
            $.scrollTo($(this).closest('.dm-template').next(), {
                axis : 'y',
                duration : 500
            });
        }
        return false;
    });
};

/* Content 17*/
previewStartupKit.content.content17 = function(previewHolder) {
    // Carousel auto height
    $(window).resize(function() {
        $('div[id^="c-17_myCarousel"]', previewHolder).each(function() {
            var maxH = 0;
            $('.item', this).each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            });
            $('.carousel-inner', this).css('height', maxH + 'px');
        });
    });

    $('div[id^="c-17_myCarousel"]', previewHolder).each(function() {
        var _this = $(this),
            itemId = '#' + _this.attr('id'),
            carouselContent = _this.find('.carousel-inner > div'),
            carouselIndicators = _this.find('.carousel-indicators > li');

        carouselContent.first().addClass('active');
        carouselIndicators.first().addClass('active');

        $('.carousel-control', _this).first().addClass('disabled').attr('href', '#');
        $('.carousel-control', _this).last().removeClass('disabled').attr('href', itemId);

        $(itemId, previewHolder).carousel({
            interval : 4000
        });
    });

    $(window).resize();
};

/* Content 18*/
previewStartupKit.content.content18 = function(previewHolder) {
    // Carousel auto height
    $(window).resize(function() {
        $('div[id^="c-18_myCarousel"]', previewHolder).each(function() {
            var maxH = 0;
            $('.item', this).each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            });
            $('.carousel-inner', this).css('height', maxH + 'px');
        });
    });

    $('div[id^="c-18_myCarousel"]', previewHolder).each(function() {
        var _this = $(this),
            itemId = '#' + _this.attr('id'),
            carouselContent = _this.find('.carousel-inner > div'),
            carouselIndicators = _this.find('.carousel-indicators > li');

        carouselContent.first().addClass('active');
        carouselIndicators.first().addClass('active');

        $('.carousel-control', _this).first().addClass('disabled').attr('href', '#');
        $('.carousel-control', _this).last().removeClass('disabled').attr('href', itemId);

        $(itemId, previewHolder).carousel({
            interval : 600000
        });

        $(itemId, previewHolder).bind('slid.bs.carousel', function() {
            $('.carousel-control', this).removeClass('disabled').attr('href', itemId);
            if ($('.item.active', this).index() == 0) {
                $('.carousel-control.left', this).addClass('disabled').attr('href', '#');
            } else if ($('.item.active', this).index() == ($('.item', this).length - 1)) {
                $('.carousel-control.right', this).addClass('disabled').attr('href', '#');
            }
        });
        if ( $(this).find('.carousel-inner .item').length <= 1 ) {
            $('.controls', $(this)).hide();
        }
        else {
            $('.controls', $(this)).show();
        }
    });

    $(window).resize();
};

/* Content 19*/
previewStartupKit.content.content19 = function(previewHolder) {};

/* Content 20*/
previewStartupKit.content.content20 = function(previewHolder) {};

/* Content 21*/
previewStartupKit.content.content21 = function(previewHolder) {
    $(window).resize(function() {
        $('.content-21 .features', previewHolder).each(function() {
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

    $('.content-21 .features .features-header .box', previewHolder).click(function() {
        $(this).addClass('active').parent().children().not(this).removeClass('active');
        $(this).closest('.features').find('.features-body').removeClass('active').eq($(this).index()).addClass('active');
        return false;
    });
    $(window).resize();
};

/* Content 22*/
previewStartupKit.content.content22 = function(previewHolder) {
    (function(el) {
        if (isRetina) {
            $('.img img', el).each(function() {
                $(this).attr('src', $(this).attr('src').replace(/.png/i, '@2x.png'));
            });
        }

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
    })($('.content-22', previewHolder));
    $(window).resize();
};
/* Content 23*/
previewStartupKit.content.content23 = function(previewHolder) {
    $('.content-23 .control-btn', previewHolder).on('click', function() {
        if($(this).closest('.dm-template').next().length) {
            $.scrollTo($(this).closest('.dm-template').next(), {
                axis : 'y',
                duration : 500
            });
        }
        return false;
    });
};
/* Content 24*/
previewStartupKit.content.content24 = function(previewHolder) {
    $(window).resize(function() {
        $('.content-24 .features', previewHolder).each(function() {
            var maxH = 0;
            $('.features-body', this).css('height', 'auto').each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            }).css('height', maxH + 'px');
            $('.features-bodies', this).css('height', maxH + 'px');
        });
    });

    $('.content-24 .features .features-header .box', previewHolder).click(function() {
        $(this).addClass('active').parent().children().not(this).removeClass('active');
        $(this).closest('.features').find('.features-body').removeClass('active').eq($(this).index()).addClass('active');
        return false;
    });

    $(window).resize();

};
/* Content 25*/
previewStartupKit.content.content25 = function(previewHolder) {};
/* Content 26*/
previewStartupKit.content.content26 = function(previewHolder) {};
/* Content 27*/
previewStartupKit.content.content27 = function(previewHolder) {};
/* Content 28*/
previewStartupKit.content.content28 = function(previewHolder) {};
/* Content 29*/
previewStartupKit.content.content29 = function(previewHolder) {
    var iframe = $('.content-29', previewHolder).find('.embed-video').find('iframe');
    iframe.each(function() {
        var _this = $(this);
        previewStartupKit.videoValidator(_this.data('src'), previewStartupKit.embedVideo, _this.attr('id'));
    });
};
/* Content 30*/
previewStartupKit.content.content30 = function(previewHolder) {
    $(window).resize(function() {
        var boxes = $('.content-30 .col-sm-3', previewHolder);
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

    $(window).resize();

};
/* Content 31*/
previewStartupKit.content.content31 = function(previewHolder) {
    (function(el) {
        $(window).scroll(function() {
            if ($(window).width() > 480) {
                $('.row', el).each(function(idx) {
                    if ($(window).scrollTop() >= ($(this).offset().top - $(window).height() + $(window).height() / 2 + 100)) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            }
        });
        $(window).resize(function() {
            $('.page-transitions', el).each(function() {
                var maxH = 0;
                $('.pt-page', this).css('height', 'auto').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $(this).css('height', maxH + 'px');
            });
        });
        $('.page-transitions', el).each(function() {
            var pt = PageTransitions();
            pt.init(this);

            $('.pt-control-prev', this).on('click', function() {
                pt.gotoPage(68, 'prev');
                return false;
            });

            $('.pt-control-next', this).on('click', function() {
                pt.gotoPage(68, 'next');
                return false;
            });
        });
    })($('.content-31', previewHolder));

    $('.content-31', previewHolder).each(function() {
        $('.page-transitions').each(function() {
            if ( $(this).find('.pt-page').length <= 1 ) {
                $('.pt-controls', $(this)).hide();
            }
            else {
                $('.pt-controls', $(this)).show();
            }
        });
    });

    $(window).resize();
};

/* Content 32*/
previewStartupKit.content.content32 = function(previewHolder) {}

/* Content 33*/
previewStartupKit.content.content33 = function(previewHolder) {}

/* Content 34*/
previewStartupKit.content.content34 = function(previewHolder) {
    $(window).resize(function() {
        var maxH = 0;
        $('.content-34 section', previewHolder).each(function() {
            var h = $(this).outerHeight();
            if (h > maxH)
                maxH = h;
        });
        $('.content-34 .page-transitions', previewHolder).css('height', maxH + 'px');
        var ctrlsHeight = $('.content-34 .pt-controls', previewHolder).height();
        $('.content-34 .pt-controls', previewHolder).css('margin-top', (-1) * ctrlsHeight / 2 + 'px');
    });

    var sliderId = 'div[id^="content-34-pt-main"]',
        sliderItem = $(sliderId, previewHolder);
    sliderItem.each(function() {
        var pt = PageTransitions(),
            itemId = '#' + $(this).attr('id');
        pt.init(previewHolder + ' ' + itemId);

        var controls = '';
        $(itemId + ' .pt-page', previewHolder).each(function(i) {
            if($(this).hasClass('pt-page-current')) {
                controls += '<li class="active"></li>';
            } else {
                controls += '<li></li>';
            }
        })
        $(itemId, previewHolder).parent().find('.pt-indicators').empty().append(controls);

        $(itemId, previewHolder).parent().find('.pt-indicators > *').on('click', function() {
            if ($(this).hasClass('active')) {
                return false;
            }
            var curPage = $(this).parent().children('.active').index();
            var nextPage = $(this).index();
            var ani = 5;
            if (curPage < nextPage) {
                ani = 6;
            }
            pt.gotoPage(ani, nextPage);
            $(this).addClass('active').parent().children().not(this).removeClass('active');        
            return false;
        });
    });
    $('.content-34', previewHolder).each(function() {
        if ( $(sliderId, $(this)).find('.pt-page').length <= 1 ) {
            $('.pt-controls', $(this)).hide();
        }
        else {
            $('.pt-controls', $(this)).show();
        }
    });

    $(window).resize();
}

/* Content 35*/
previewStartupKit.content.content35 = function(previewHolder) {
    $('div[id^="content-35-pt-main-reg"]').each(function() {
        var _this = $(this),
            numberId = _this.attr('id').substring(23);
        if($(_this, previewHolder).length) {
            $(_this, previewHolder).bxSlider({
                'controls': false,
                'pagerCustom': previewHolder + ' .content-35-customPager-' + numberId,
                'adaptiveHeight': true,
                'infiniteLoop': false
            });
        }
        var pager = $('.content-35-customPager-' + numberId, previewHolder);
        pager.find($('.menuicon')).on('mouseenter', function(){
            $(this).parent().addClass('showmenu');
        })
        pager.on('mouseleave', function(){
            $(this).removeClass('showmenu');
        })
        pager.find($('.menuicon')).on('click', function(){
            var menu = $(this).parent();
            if(menu.hasClass('showmenu')) {
                menu.removeClass('showmenu');
            } else {
                menu.addClass('showmenu');
            }
        })
    });
    $('.content-35', previewHolder).each(function() {
        if ( $(this).find('.content-35-slider-item').length <= 1 ) {
            $('.content-35-customPager', $(this)).hide();
        }
        else {
            $('.content-35-customPager', $(this)).show();
        }
    });
}

/* Content 36*/
previewStartupKit.content.content36 = function(previewHolder) {}
/* Content 37*/
previewStartupKit.content.content37 = function(previewHolder) {}
/* Content 38*/
previewStartupKit.content.content38 = function(previewHolder) {
    //samples grid
    var samplesGrid = $('.samples-grid', previewHolder);
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
        },750);
    }
};

/**
 * Crews 
 */

previewStartupKit.crew = previewStartupKit.crew || {};

/* Crew 1*/
previewStartupKit.crew.crew1 = function(previewHolder) {};

/* Crew 2*/
previewStartupKit.crew.crew2 = function(previewHolder) {};
/* Crew 3*/
previewStartupKit.crew.crew3 = function(previewHolder) {};

/* Crew 4*/
previewStartupKit.crew.crew4 = function(previewHolder) {};


/**
 * Projects 
 */
previewStartupKit.projects = previewStartupKit.projects || {};

/* project-1 */
previewStartupKit.projects.projects1 = function(previewHolder) {
 // replace project img to background-image
    $('.projects-1 .project .photo img').each(function() {
        $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
    }); 
};

/* project-2 */
previewStartupKit.projects.projects2 = function(previewHolder) {};

/* project-3 */
previewStartupKit.projects.projects3 = function(previewHolder) {
    // replace project img to background-image
    $('.projects-3 .project .photo img').each(function() {
        $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
    });    
};

/* project-4 */
previewStartupKit.projects.projects4 = function(previewHolder) {};


/**
 * Footers 
 */
previewStartupKit.footer = previewStartupKit.footer || {};

/* Footer 1*/
previewStartupKit.footer.footer1 = function(previewHolder) {};

/* Footer 2*/
previewStartupKit.footer.footer2 = function(previewHolder) {};

/* Footer 3*/
previewStartupKit.footer.footer3 = function(previewHolder) {};

/* Footer 4*/
previewStartupKit.footer.footer4 = function(previewHolder) {};

/* Footer 5*/
previewStartupKit.footer.footer5 = function(previewHolder) {};

/* Footer 6*/
previewStartupKit.footer.footer6 = function(previewHolder) {};

/* Footer 7*/
previewStartupKit.footer.footer7 = function(previewHolder) {};

/* Footer 8*/
previewStartupKit.footer.footer8 = function(previewHolder) {};

/* Footer 9*/
previewStartupKit.footer.footer9 = function(previewHolder) {
    previewStartupKit.initGoogleMap(previewHolder + ' .footer-9-map');
};

/* Footer 10*/
previewStartupKit.footer.footer10 = function(previewHolder) {};

/* Footer 11*/
previewStartupKit.footer.footer11 = function(previewHolder) {};

/* Footer 12*/
previewStartupKit.footer.footer12 = function(previewHolder) {};

/* Footer 13*/
previewStartupKit.footer.footer13 = function(previewHolder) {};

/* Footer 14*/
previewStartupKit.footer.footer14 = function() {};

/* Footer 15*/
previewStartupKit.footer.footer15 = function(previewHolder) {};


/**
 * Contacts 
 */
previewStartupKit.contacts = previewStartupKit.contacts || {};

/* Contacts 1*/
previewStartupKit.contacts.contacts1 = function(previewHolder) {};

/* Contacts 2*/
previewStartupKit.contacts.contacts2 = function(previewHolder) {
    previewStartupKit.initGoogleMap(previewHolder + ' .contacts-2');
};
/* Contacts 3*/
previewStartupKit.contacts.contacts3 = function(previewHolder) {
    previewStartupKit.initGoogleMap(previewHolder + ' .contacts-3');
};

/* Contacts 4*/
previewStartupKit.contacts.contacts4 = function(previewHolder) {};

/* Contacts 5*/
previewStartupKit.contacts.contacts5 = function(previewHolder) {
    previewStartupKit.initGoogleMap(previewHolder + ' .contacts-5');
};

/**
 * Prices
 */
previewStartupKit.price = previewStartupKit.price || {};

/* Price 1*/
previewStartupKit.price.price1 = function(previewHolder) {};

/* Price 2*/
previewStartupKit.price.price2 = function(previewHolder) {};
/* Price 3*/
previewStartupKit.price.price3 = function(previewHolder) {};

/* Price 4*/
previewStartupKit.price.price4 = function(previewHolder) {};

/* Price 5*/
previewStartupKit.price.price5 = function(previewHolder) {};

/** 
 * Global part of startup-kit
 * */
previewStartupKit.init = function(previewHolder) {
    /* implementing headers */
    for (header in previewStartupKit.header) {
        headerNumber = header.slice(6);
        if (jQuery('.header-' + headerNumber).length != 0) {
            previewStartupKit.header[header](previewHolder);
        };
    }

    /* implementing contents */
    for (content in previewStartupKit.content) {
        contentNumber = content.slice(7);
        if (jQuery('.content-' + contentNumber).length != 0) {
            previewStartupKit.content[content](previewHolder);
        };
    }

    /* implementing contacts */
    for (contact in previewStartupKit.contacts) {
        contactNumber = contact.slice(8);
        if (jQuery('.contacts-' + contactNumber).length != 0) {
            previewStartupKit.contacts[contact](previewHolder);
        };
    }
    
    /* implementing projects */
    for (project in previewStartupKit.projects) {
        projectNumber = project.slice(7);
        if (jQuery('.projects-' + projectNumber).length != 0) {
            previewStartupKit.projects[project](previewHolder);
        };
    }

    /* implementing projects */
    for (price in previewStartupKit.price) {
        priceNumber = price.slice(5);
        if (jQuery('.price-' + priceNumber).length != 0) {
            previewStartupKit.price[price](previewHolder);
        };
    }

    /* implementing crew */
    for (crew in previewStartupKit.cres) {
        crewNumber = cres.slice(5);
        if (jQuery('.crew-' + crewNumber).length != 0) {
            previewStartupKit.crew[crew](previewHolder);
        };
    }

    /* implementing footers */
    for (footer in previewStartupKit.footer) {
        footerNumber = footer.slice(6);
        if (jQuery('.footer-' + footerNumber).length != 0) {
            previewStartupKit.footer[footer](previewHolder);
        };
    }

    /* ie fix images */
    if (/msie/i.test(navigator.userAgent)) {
        $('img').each(function() {
            $(this).css({
                width : $(this).attr('width') + 'px',
                height : 'auto'
            });
        });
    }

    // Focus state for append/prepend inputs
    $('.input-prepend, .input-append').on('focus', 'input', function() {
        $(this).closest('.control-group, form').addClass('focus');
    }).on('blur', 'input', function() {
        $(this).closest('.control-group, form').removeClass('focus');
    });

    // replace project img to background-image
    $('.project .photo img').each(function() {
        $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
    });

    $(window).resize(function() {
        if($(window).width() > 965) {
            previewStartupKit.hideCollapseMenu();
        }
    });

    $('.previewWrapper, .navbar-collapse a, .navbar-collapse button, .navbar-collapse input[type=submit]', previewHolder).on('click', function(e) {
        if($(previewHolder).hasClass('nav-visible')) {
            setTimeout(function(){
                previewStartupKit.hideCollapseMenu();
            }, 200)
        }
    });

    // Tiles
    var tiles = $('.tiles');

    // Tiles phone mode
    $(window).resize(function() {
        if ($(this).width() < 768) {
            if (!tiles.hasClass('phone-mode')) {
                $('td[class*="tile-"]', tiles).each(function() {
                    $('<div />').addClass(this.className).append($(this).contents()).appendTo(tiles);
                });

                tiles.addClass('phone-mode');
            }
        } else {
            if (tiles.hasClass('phone-mode')) {
                $('> [class*="tile-"]', tiles).each(function(idx) {
                    $('td[class*="tile-"]', tiles).eq(idx).append($(this).contents());
                    $(this).remove();
                });

                tiles.removeClass('phone-mode');
            }
        }
    });

    tiles.on('mouseenter', '[class*="tile-"]', function() {
        $(this).removeClass('faded').closest('.tiles').find('[class*="tile-"]').not(this).addClass('faded');
    }).on('mouseleave', '[class*="tile-"]', function() {
        $(this).closest('.tiles').find('[class*="tile-"]').removeClass('faded');
    });
}