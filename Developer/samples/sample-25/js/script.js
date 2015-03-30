$(document).ready(function() {

    $('.content-23').each(function() {
        if(! isMobile.any())
            $(this).parallax('50%', 0.3, true);
        else
            $(this).css('background-attachment', 'initial');
    });
});
