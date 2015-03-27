//code
$(document).ready(function(e) {

    //SETTINGS
    var originalLayout = [],
        menuOpened;

    var draggableParams = {
        connectToSortable: "#templates",
        addClasses: false,
        helper: "clone",
        appendTo: 'body',
        distance: 50,
        drag: function(event, ui) {
            setTimeout(function() {
                $('div.placeholder').attr('style', 'height: 100px');
            }, 50);
            $(window).mousemove(function(event) {
                var windowY = event.pageY - $(window).scrollTop();
                var windowX = event.pageX;
                $('.ui-draggable-dragging').css('top', $(window).scrollTop() + windowY - 50).css('left', windowX - 50).css('width', '100px!important');
            });
        }
    };

    //Make Blocks Sotrable
    var sortableParams = {
        opacity: 0.75,
        placeholder: "placeholder",
        revert: 300,
        distance: 10,
        handle: '.fake-draggable',
        refreshPositions: true,
        start: function(event, ui) {
            $('.placeholder').height(ui.item.context.clientHeight);
        },
        receive: function(event, ui) {
            $('[data-component-id=' + ui.item.data('component-id') + '], [data-name]', '#templates').hide();
            if(ui.item.data('component-id')) {
                addTemplate(ui.item, 'draggable');
            }
            if(ui.item.data('name')) {
                generateTemplate(ui.item.data('name'), 'draggable');
            }
            window.templateScreenshot = ui.item[0].childNodes[1].src;
        }
    };
    
    var blocks = [{
        "type": "header",
        "count": "22",
        "name": "Headers"
    }, {
        "type": "content",
        "count": "37",
        "name": "Content"
    }, {
        "type": "price",
        "count": "4",
        "name": "Price Tables"
    }, {
        "type": "projects",
        "count": "3",
        "name": "Projects"
    }, {
        "type": "contacts",
        "count": "4",
        "name": "Contacts"
    }, {
        "type": "crew",
        "count": "3",
        "name": "Crew"
    }, {
        "type": "footer",
        "count": "14",
        "name": "Footer"
    }];

    function getComponentId() {
        $('#existingBlocks').addClass('loading');
        apiCall(
            'components.get', 
            {}, 
            function(components) {
                var myBlocksRows = [];
                $('#myBlocks').remove();
                if(components.length) {
                    $('#subMenu').append('<div id="myBlocks"></div>');
                    for(var k = 0; k < components.length; k++) {
                        myBlocksRows.push('<div data-component-id="' + components[k].id + '"><img data-src="' + components[k].thumb + '"></div>');
                    }
                    $('#myBlocks').append(myBlocksRows.join('\n\n'));
                }
                checkVisibleTemplate();
                menuInit();
                $('#existingBlocks').removeClass('loading');
            }
        );
    }

    function myBlocksLazyInit() {
        var menu = $('#subMenu'),
            parentHeight = menu.innerHeight();

        menu.on('scroll', function() {
            if(menu.find('#myBlocks').is(':visible')) {
                var images = $('img[data-src]', '#subMenu #myBlocks');
                for(var i = 0; i < images.length; i++) {
                    var currentImg = $(images[i]);
                    if(currentImg.position().top <= parentHeight) {
                        currentImg.attr('src', currentImg.data('src')).removeAttr('data-src');
                    } else {
                        return false;
                    }
                }
            }
        });

        menu.scroll();
    }

    function menuInit() {
        $('#sideMenu #existingBlocks').menuAim({
            activate: function(event) {
                if (!$('#sideMenu').hasClass('disabled')) {
                    $("#subMenu").removeClass('invisible');
                    $("#sideMenu div.selected").removeClass('selected');
                    $(event).addClass('selected');
                    var currentItem = $(event).data('menu-item');
                    $('#subMenu').scrollTop(0);
                    $('#subMenu > div.visible').removeClass('visible');
                    $('#subMenu > div#' + currentItem).addClass('visible');
                    myBlocksLazyInit();
                }
            },
            exitMenu: function() {
                return true;
            }
        });
        $('img').on('dragstart', function(event) {
            event.preventDefault();
        });
        $("#subMenu #myBlocks > div").draggable(draggableParams).off('click').on('click', function() {
            window.templateScreenshot = $(this).find('img').attr('src');
            addTemplate($(this));
        });
    };

    function mainMenuInit() {
        $('#sideMenu > ul').not('#existingBlocks').menuAim({
            activate: function(event) {
                if (!$('#sideMenu').hasClass('disabled')) {
                    $("#subMenu").removeClass('invisible');
                    $("#sideMenu div.selected").removeClass('selected');
                    $(event).addClass('selected');
                    var currentItem = $(event).data('menu-item');
                    $('#subMenu').scrollTop(0);
                    $('#subMenu > div.visible').removeClass('visible');
                    $('#subMenu > div#' + currentItem).addClass('visible');
                }
            },
            exitMenu: function() {
                return true;
            }
        });
        $('img').on('dragstart', function(event) {
            event.preventDefault();
        });
        $("#subMenu > div").not('#myBlocks').find('div').draggable(draggableParams).off('click').on('click', function() {
            generateTemplate($(this).data('name'));
            window.templateScreenshot = $(this).find('img').attr('src');
        });
        $('#templates').droppable({
            drop: function(event, ui) {
                ui.draggable.addClass('draggable-invisible');
            }
        });
        $("#templates").sortable(sortableParams);
    };

    getComponentId();
    setTimeout(function() {
        mainMenuInit();
    }, 0)

    function checkVisibleTemplate() {
        $('#myBlocks').children().each(function() {
            if($(this).css('display') == 'block') {
                $('[data-menu-item="myBlocks"]', '#existingBlocks').show();
                return false;
            } else {
                $('[data-menu-item="myBlocks"]', '#existingBlocks').hide();
            }
        })
    };

    //Create Submenu From Array 
    var blocksRows = [];
    blocks.forEach(function(element) {
        $('#subMenu').append('<div id="'+element.type+'"></div>');
        for (i = 0; i <= element.count; i++) {
            var elNum = i + 1;
            blocksRows.push('<div data-name="'+element.type+'.'+element.type+elNum+'"><span>'+element.type+' #'+elNum+'</span><img src="'+ sfBuildUri +'common-files/img/generator/'+element.type+'-'+elNum+'.jpg"></div>');
        }
        $('#subMenu div#'+element.type).append(blocksRows.join('\n\n'));
        blocksRows = [];
    });

    //Menu Here
    $("#menu").on("mouseleave", function() {
        $("#subMenu").addClass('invisible');
    });

    //Toggle sidebar
    $('.dm-toggle').click(function() {
        $('body').toggleClass('preview');
        setTimeout(function() {
            $('#sideMenu').toggleClass('noHover');
        },330);
    });

    function addTemplate(el, type, isReset, elPos) {
        var componentId = el.data('component-id');

        var templates = $('#templates');

        if ( templates.children().length > 0 ) {
            if ( type != 'draggable' ) {
                templates.append('<div class="fake-template"><img src="' + templateScreenshot + '"></div>');

                var lastTemplate = templates.children().last().prev(),
                    scrollTop = lastTemplate.offset().top + lastTemplate.outerHeight() - 132;
                if ( !isReset ) {
                    $('html, body').animate({scrollTop: scrollTop}, 500);
                }
            }
            else {
                var originalItem = '';
                if ( !isReset ) {
                    originalItem = $('[data-component-id=' + componentId + '], [data-name]', '#templates');
                }
                else if ( isReset && elPos ) {
                    originalItem = elPos;
                }

                originalItem.after('<div class="fake-template"><img src="' + templateScreenshot + '"></div>');

                var scrollTop = $('.fake-template').offset().top - 132;
                if ( !isReset ) {
                    $('html, body').animate({scrollTop: scrollTop}, 500);
                }
            }
        }
        else {
            templates.append('<div class="fake-template"><img src="' + templateScreenshot + '"></div>');
        }

        apiCall(
            'component.template.get', 
            {
                component_id: componentId
            },
            function(template) {
                var htmlTemplate = template.html,
                    cssTemplate = template.css;
                if (type === 'draggable') {
                    var originalItem = '';
                    if ( !isReset ) {
                        originalItem = $('[data-component-id=' + componentId + '], [data-name]', '#templates');
                    }
                    else if ( isReset && elPos ) {
                        originalItem = elPos;
                    }
                    $(htmlTemplate).insertAfter($('.fake-template'));
                    if ( !isReset ) {
                        originalItem.remove();
                    }
                } else {
                    $('#templates').append(htmlTemplate);
                }

                var addedBlock = $('[component-id=' + componentId + ']', '#templates');
                addedBlock.addClass('tempHidden');

                appendStyles(function() {
                    $('#templates').injector().invoke(function($compile) {
                        var scope = $('#templates').scope();
                        $compile(addedBlock)(scope);
                    });
                    settingsBlock();
                    $('[data-component-id=' + componentId + ']', '#subMenu').hide();

                    if ( !isReset ) {
                        $('.fake-template + *').css({marginTop: - $('.fake-template').height(), opacity: 0});
                        setTimeout(function() {
                            $('.fake-template').fadeOut(500);
                            $('.fake-template + *').animate({opacity: 1}, 500);
                            $('.fake-template + *').css({marginTop: 0});
                            $('.fake-template').remove();
                            checkVisibleTemplate();
                            $('#subMenu').addClass('invisible');
                            $('body').removeClass('preview');
                            $('#sideMenu').addClass('noHover');
                        }, 500);
                    }
                    else {
                        $('.fake-template').remove();
                        $('.template-reset-holder').remove();
                        checkVisibleTemplate();
                    }
                });
            }
        );
    };

    function generateTemplate(templateId, type, isReset, elPos) {
        var isReset = isReset;
        apiCall(
            'component.create',
            {template_id: templateId},
            function(componentId) {
                var newElement = $('<div data-component-id="' + componentId + '"></div>');
                if(type === 'draggable') {
                    addTemplate(newElement, 'draggable', isReset, elPos);
                } else {
                    addTemplate(newElement, 'non-draggable', isReset, elPos);
                }
            }
        );
    };

    function settingsBlock() {
        $('.dm-template', '#templates').each(function() {
            var settingsBtn = '<div class="dm-controls dm-settingsBlock-holder" data-html2canvas-ignore>' +
                                    '<div class="dm-control-button">' +
                                        '<i class="dm-widget-icon">' +
                                            '<svg width="16px" height="16px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">' +
                                                '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">' +
                                                    '<g id="Main-Component-Parameters" sketch:type="MSArtboardGroup" transform="translate(-1382.000000, -129.000000)" fill="#FFFFFF">' +
                                                        '<g id="Group-2" sketch:type="MSLayerGroup" transform="translate(1382.000000, 129.000000)">' +
                                                            '<g id="trash-24" sketch:type="MSShapeGroup">' +
                                                                '<g id="Remove-Component-3">' +
                                                                    '<path d="M19.72575,9.301875 C19.353125,9.246875 18.953,8.908625 18.8375,8.54975 L18.2765,7.19125 C18.101875,6.857125 18.14175,6.334625 18.37,6.032125 L19.27475,4.824875 C19.503,4.522375 19.48375,4.043875 19.232125,3.760625 L18.238,2.76375 C17.956125,2.512125 17.474875,2.49425 17.172375,2.721125 L15.9665,3.628625 C15.662625,3.854125 15.1415,3.89675 14.806,3.72075 L13.448875,3.161125 C13.08725,3.047 12.747625,2.6455 12.69675,2.270125 L12.48225,0.776875 C12.428625,0.402875 12.078,0.064625 11.70125,0.026125 C11.70125,0.026125 11.468875,0 10.99725,0 C10.525625,0 10.29325,0.026125 10.29325,0.026125 C9.9165,0.064625 9.5645,0.402875 9.51225,0.776875 L9.29775,2.270125 C9.2455,2.6455 8.90725,3.047 8.545625,3.161125 L7.1885,3.72075 C6.854375,3.89675 6.33325,3.854125 6.03075,3.628625 L4.822125,2.721125 C4.521,2.492875 4.03975,2.512125 3.7565,2.76375 L2.76375,3.757875 C2.5135,4.041125 2.49425,4.521 2.721125,4.8235 L3.62725,6.03075 C3.854125,6.33325 3.895375,6.85575 3.719375,7.189875 L3.15975,8.54975 C3.04425,8.908625 2.644125,9.246875 2.270125,9.301875 L0.776875,9.51225 C0.4015,9.56725 0.06325,9.917875 0.02475,10.294625 C0.02475,10.294625 0,10.528375 0,11 C0,11.471625 0.02475,11.70675 0.02475,11.70675 C0.064625,12.082125 0.402875,12.43275 0.776875,12.486375 L2.270125,12.698125 C2.644125,12.75175 3.04425,13.091375 3.15975,13.45025 L3.72075,14.80875 C3.89675,15.14425 3.8555,15.664 3.628625,15.9665 L2.7225,17.175125 C2.495625,17.479 2.440625,17.890125 2.6015,18.088125 C2.761,18.286125 3.221625,18.777 3.223,18.777 C3.223,18.77975 3.378375,18.921375 3.56675,19.091875 C3.755125,19.265125 4.522375,19.504375 4.824875,19.2775 L6.0335,18.37275 C6.336,18.1445 6.857125,18.10325 7.19125,18.27925 L8.545625,18.8375 C8.90725,18.954375 9.2455,19.353125 9.29775,19.7285 L9.51225,21.22175 C9.5645,21.594375 9.9165,21.93675 10.291875,21.97525 C10.291875,21.97525 10.525625,22 10.99725,22 C11.468875,22 11.70125,21.97525 11.70125,21.97525 C12.076625,21.93675 12.428625,21.59575 12.48225,21.22175 L12.69675,19.7285 C12.747625,19.353125 13.085875,18.954375 13.448875,18.8375 L14.804625,18.27925 C15.140125,18.10325 15.66125,18.1445 15.965125,18.37 L17.17375,19.2775 C17.477625,19.504375 17.95475,19.485125 18.239375,19.23625 L19.2335,18.24075 C19.48375,17.9575 19.501625,17.477625 19.273375,17.175125 L18.368625,15.9665 C18.140375,15.664 18.1005,15.14425 18.275125,14.80875 L18.836125,13.45025 C18.951625,13.09 19.35175,12.75175 19.724375,12.698125 L21.217625,12.486375 C21.59025,12.43275 21.929875,12.082125 21.96975,11.70675 C21.96975,11.70675 21.9945,11.473 21.9945,11 C21.9945,10.528375 21.96975,10.294625 21.96975,10.294625 C21.929875,9.917875 21.591625,9.56725 21.217625,9.51225 L19.72575,9.301875 L19.72575,9.301875 Z M11,15.125 C8.723,15.125 6.875,13.277 6.875,11 C6.875,8.7209375 8.723,6.875 11,6.875 C13.2749375,6.875 15.125,8.723 15.125,11 C15.125,13.277 13.277,15.125 11,15.125 L11,15.125 Z" id="Shape-2"></path>' +
                                                                '</g>' +
                                                            '</g>' +
                                                        '</g>' +
                                                    '</g>' +
                                                '</g>' +
                                            '</svg>' +
                                        '</i>' +
                                    '</div>' +
                                    '<div class="dm-settingsBlock-listHolder">'+
                                        '<ul class="dm-settingsBlock-list">' +
                                            '<li>' +
                                                '<a href="#" class="dm-editing-template">Edit HTML/CSS</a>' +
                                            '</li>' +
                                            '<li>' +
                                                '<a href="#" class="dm-reset-template">Reset</a>' +
                                            '</li>' +
                                            '<li>' +
                                                '<a href="#" class="dm-remove-template">Remove</a>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>'
                                '</div>';
            if (!$('.dm-settingsBlock-holder', $(this)).length) {
                $(settingsBtn).prependTo($(this));
            }
        });

        // Trash Objects
        $('.dm-remove-template').off('click').on('click', function(e) {
            e.preventDefault();
            var isConfirmed = confirm('Are you sure you want to remove this block?');
            if ( isConfirmed ) {
                var template = $(this).closest('[component-id]');
                var dataComponentId = template.attr('component-id');
                $('[data-component-id=' + dataComponentId + ']', '#subMenu').show();
                template.scope().removeTemplate();
                template.remove();
                appendStyles();
                updateControls(hasDifferences());
                checkVisibleTemplate();
            }
        });

        // Inline Editing
        $('.dm-editing-template').off('click').on('click', function(e) {
            e.preventDefault();
            var componentId = $(this).closest('.dm-template').attr('component-id');
            $(this).closest('.dm-template').addClass('editing-template');
            $('body').removeClass('preview');
            apiCall(
                'component.template.get', 
                {
                    component_id: componentId,
                    pure_html: true
                },
                function(template) {
                    createEditingPage(template, componentId);
                }
            );
        })
    };

    function createEditingPage(template, oldComponentId) {
        var editingHolder = $('#editingHolder'),
            editingCSSHolder = $('#editingCSSHolder'),
            editingHTMLHolder = $('#editingHTMLHolder'),
            editingCSS = $('<div id="editingCSS"></div>'),
            editingHTML = $('<div id="editingHTML"></div>'),
            editingBack = $('#editingBack'),
            editingDiscard = $('#editingDiscard'),
            editingSave = $('#editingSave'),
            startCSS = '',
            startHTML = '',
            hasChangedCSS = false,
            hasChangedHTML = false,
            editorCSS,
            editorHTML;

        $('#editingCSS, #editingHTML').remove();
        textChanged();

        editingHTML.empty().html(template.html);
        var _el = $('.dm-template', editingHTML),
            classAttr = {
                'class': _el.attr('class')
            },
            removedParent = _el.unwrap();

        $(editingCSSHolder).append(editingCSS);
        $(editingHTMLHolder).append(editingHTML);

        editingCSS.empty().text(template.css);
        editingHTML.empty().text(removedParent.html());
        startCSS = editingCSS.text();
        startHTML = editingHTML.text();

        editorCSS = ace.edit("editingCSS");
        editorCSS.getSession().setMode("ace/mode/css");
        editorCSS.getSession().setUseWorker(false);
        editorCSS.setOption("wrap", 120);
        editorCSS.renderer.setShowPrintMargin(false);
        editorCSS.setOption("hScrollBarAlwaysVisible", false);
        editorCSS.find('needle',{
            backwards: false,
            wrap: false,
            caseSensitive: false,
            wholeWord: false,
            regExp: false
        });
        editorCSS.findNext();
        editorCSS.findPrevious();

        editorHTML = ace.edit("editingHTML");
        editorHTML.getSession().setMode("ace/mode/html");
        editorHTML.getSession().setUseWorker(false);
        editorHTML.setOption("wrap", 120);
        editorHTML.renderer.setShowPrintMargin(false);
        editorHTML.setOption("hScrollBarAlwaysVisible", false);
        editorHTML.find('needle',{
            backwards: false,
            wrap: false,
            caseSensitive: false,
            wholeWord: false,
            regExp: false
        });
        editorHTML.findNext();
        editorHTML.findPrevious();

        editingHolder.show();
        leaveHomeScreen('editing');

        editorCSS.on('input', function() {
            hasChangedCSS = (startCSS !== editorCSS.getValue()) ? true : false;
            textChanged();
        });

        editorHTML.on('input', function() {
            hasChangedHTML = (startHTML !== editorHTML.getValue()) ? true : false;
            textChanged();
        });

        editingBack.off('click').on('click', function(e) {
            e.preventDefault();
            removeEditors();
            editingHolder.hide();
            backToHomeScreen();
            $('html, body').scrollTop($('.editing-template').offset().top);
            $('.editing-template').removeClass('editing-template');
        });

        editingDiscard.off('click').on('click', function(e) {
            e.preventDefault();
            editorCSS.getSession().setValue(startCSS);
            editorHTML.getSession().setValue(startHTML);
            hasChangedCSS = false;
            hasChangedHTML = false;
            textChanged();
        });

        editingSave.off('click').on('click', function(e) {
            e.preventDefault();

            if(!$(this).hasClass('disabled')) {
                $('#loader-container').addClass('saving');
                var saveCSS = editorCSS.getSession().getValue(),
                    saveHTML = editorHTML.getSession().getValue(),
                    customTemplateId = template.id;

                if(!template.is_custom) {
                    var serial = Math.floor(Math.random() * 10000000000000000),
                        templateName = template.id.split('.'),
                        customTemplateId = 'custom.' + templateName[0] + '_' + templateName[1] + '_' + serial;
                }

                if($('#renderHtml').length) {
                    $('#renderHtml').remove();
                }
                $('body').append('<div id="renderHtml"></div>');
                $('#renderHtml').append(saveHTML);

                var renderHtml = $('#renderHtml');
                renderHtml.children().wrapAll('<div class="dm-template"></div>')
                renderHtml.find('.dm-template')
                    .attr('component-id', '{{ component_id }}')
                    .attr('dm-template', customTemplateId)
                    .addClass(classAttr.class + ' custom-block');

                saveHTML = renderHtml.html();
                renderHtml.remove();

                apiCall(
                    'template.save', 
                    {
                        template_id: customTemplateId,
                        html: saveHTML,
                        css: saveCSS
                    },
                    function(data) {
                        if(data === true) {
                            apiCall(
                                'component.create', 
                                {
                                    template_id: customTemplateId
                                },
                                function(data) {
                                    replaceBlock(data, oldComponentId, customTemplateId);
                                    var int = setInterval(function() {
                                        if ( $('[dm-template="' + customTemplateId + '"]').length ) {
                                            if ( $('[dm-template="' + customTemplateId + '"]').offset().top ) {
                                                $('html, body').scrollTop($('[dm-template="' + customTemplateId + '"]').offset().top);
                                                $('.editing-template').removeClass('editing-template');
                                                setTimeout(function() {
                                                    clearInterval(int);
                                                }, 1000);
                                            }
                                        }
                                    }, 10);
                                }
                            );
                        }
                    },
                    function(code, msg) { 
                        alert(msg); 
                        $('#loader-container').removeClass('saving');
                    }
                );
            }
        });

        function replaceBlock(newComponentId, oldComponentId, customTemplateId) {
            apiCall(
                'component.template.get', 
                {
                    component_id: newComponentId
                },
                function(template) {
                    $('[data-component-id=' + oldComponentId + ']', '#subMenu').show();
                    $('[component-id="' + oldComponentId + '"]').scope().removeTemplate();
                    $('[component-id="' + oldComponentId + '"]').replaceWith(template.html);

                    var addedBlock = $('[component-id=' + newComponentId + ']', '#templates');
                    addedBlock.addClass('tempHidden');

                    appendStyles(function() {
                        $('#templates').injector().invoke(function($compile) {
                            var scope = $('#templates').scope();
                            $compile(addedBlock)(scope);
                        });
                        settingsBlock();
                        updateControls(hasDifferences());
                        checkVisibleTemplate();
                        removeEditors();
                        editingHolder.hide();
                        backToHomeScreen();
                    });
                }
            );
        };

        function removeEditors() {
            editorCSS.destroy();
            $(editorCSS.container).remove();
            editorHTML.destroy();
            $(editorHTML.container).remove();
        };

        function textChanged() {
            if ( hasChangedCSS || hasChangedHTML ) {
                editingDiscard.parent().show();
                editingSave.removeClass('disabled');
            } else {
                editingDiscard.parent().hide();
                editingSave.addClass('disabled');
            }
        }
    }

    settingsBlock();

    function makeScreenshots(items, callback) {
        var images = [],
            counter = 0,
            arrayChanges = $('body').scope().arrayChanges,
            existingBlocks = [];

        $('[data-component-id]', '#subMenu').each(function() {
            existingBlocks.push($(this).attr('data-component-id'));
        });

        for(var i = 0; i < arrayChanges.length; i++) {
            (function(l) {
                var el = $('[component-id="' + arrayChanges[l].id + '"]', '#templates');
                images[l] = {
                    id: arrayChanges[l].id
                };

                if ( ( $.inArray(arrayChanges[l].id, existingBlocks) === -1) || arrayChanges[l].changed ) {
                    html2canvas(el, {
                        proxy: themeUri + 'html2canvasproxy.php',
                        onrendered: function(canvas) {
                            counter++;
                            var previewWidth = 620;
                            var extra_canvas = document.createElement('canvas');
                                extra_canvas.setAttribute('width', previewWidth);
                                extra_canvas.setAttribute('height', canvas.height * previewWidth / canvas.width);
                            var ctx = extra_canvas.getContext('2d');
                                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, previewWidth, canvas.height * previewWidth / canvas.width);
                            var dataURL = extra_canvas.toDataURL("image/jpeg");
                            images[l].thumb = dataURL;

                            if(counter == arrayChanges.length) {
                                callback(images);
                            }
                        },
                        useCORS: true
                    });
                } else {
                    counter++;
                    images[l].thumb = $('[data-component-id="' + arrayChanges[l].id + '"]', '#subMenu').find('img').data('src');

                    if(counter == arrayChanges.length) {
                        callback(images);
                    }
                }
            })(i);
        }

        if(!arrayChanges.length) {
            callback(images);
        }
    };

    function createReorderPage(images) {
        var holder = $('<div id="reorderHolder"></div>'),
            blocks = [],
            cache,
            initLayout = [];

        var sortableParams = {
            opacity: 0.75,
            placeholder: "placeholder",
            revert: 300,
            distance: 10,
            refreshPositions: true,
            start: function(event, ui) {
                $('.placeholder').height(ui.item.context.clientHeight);
            },
            update: function() {
                checkChanges();
            }
        };

        if($('#reorderHolder').length) {
            $('#reorderHolder').remove();
        };

        for(var i = 0; i < images.length; i++) {
            blocks.push('<div data-reorder-component-id="' + images[i].id + '" class="reorder-item"><img src="' + images[i].thumb + '" /></div>');
            initLayout.push(images[i].id);
        };
        leaveHomeScreen('reorder');
        $('body').append(holder);
        $('#reorderHolder').append(blocks.join('\n\n'));
        $("#reorderHolder").sortable(sortableParams);
        cache = $("#reorderHolder").html();
        updateReorderControls(false);

        $('#reorderBack').off('click').on('click', function(e) {
            e.preventDefault();
            backToHomeScreen();
        });

        $('#reorderDiscard').off('click').on('click', function(e) {
            e.preventDefault();
            updateReorderControls(false);
            $("#reorderHolder").html(cache).sortable("refresh");
        });

        $('#reorderSave').off('click').on('click', function(e) {
            e.preventDefault();
            var reorderedArr = [],
                items = $('[component-id]', '#templates');;

            if(!$(this).hasClass('disabled')) {
                $('.reorder-item', '#reorderHolder').each(function() {
                    reorderedArr.push(+$(this).data('reorder-component-id'));
                });
                for(var i = 0; i < reorderedArr.length; i++) {
                    $('#templates').append(items.filter('[component-id="' + reorderedArr[i] + '"]'));
                }
                $('body').scope().reorderBlocks();
                updateControls(hasDifferences());
                backToHomeScreen();
            }
        });

        function checkChanges() {
            var components = $('.reorder-item', '#reorderHolder'),
                reorderLayout = [],
                changed = false;

            components.each(function() {
                reorderLayout.push($(this).data('reorder-component-id'))
            });

            for(var i = 0; i < reorderLayout.length; i++) {
                if(reorderLayout[i] != initLayout[i]) {
                    changed = true;
                    break;
                }
            }
            updateReorderControls(changed);
        };
    };

    function updateReorderControls(show) {
        if(show) {
            $('#reorderSave').removeClass('disabled');
            $('#reorderDiscard').css({
                'display': 'block'
            });
        } else {
            $('#reorderSave').addClass('disabled');
            $('#reorderDiscard').hide();
        }
    };

    // Reorder Blocks
    $('#reorderBlocks').on('click', function(e) {
        e.preventDefault();

        var components = [];
        $('body').removeClass('preview').addClass('reorder-mode');

        $('[component-id]', '#templates').each(function() {
            components.push(+$(this).attr('component-id'));
        });

        if ( !components.length ) {
            alert('There are no blocks to reorder!');
            return false;
        }

        makeScreenshots(components, function(images) {
            createReorderPage(images);
        });
    });

    // === Post title changing
    function postTitleChange() {
            var title = $('#postTitle');
            
            title.init = '';

        title.on('focus', function() {
            title.init = title.val();
        });
        title.on('keyup', function() {
            title.changed = title.val();
            if ( title.init != title.changed ) {
                updateControls(true);
            }
            else {
                updateControls(hasDifferences());
            }
        });
    }
    postTitleChange();

    // Save layout
    $('#saveChanges').on('click', function(e) {
        e.preventDefault();
        // Save page title
        apiCall(
            'post.title.set', 
            {
                post_id: currentPostId,
                title: $('#postTitle').val()
            },
            function(result) {
                if (result) {
                    document.title = $('#postTitle').val();
                }
            }
        );

        var saveData = [],
            components = [],
            counter = 0;

        $('[component-id]', '#templates').each(function() {
            components.push(+$(this).attr('component-id'));
        });

        if ( !components.length ) {
            alert('You cannot save an empty page!');
            return false;
        }

        if(!$(this).hasClass('disabled')) {
            $('body').removeClass('preview');
            $('#loader-container').addClass('saving');

            setTimeout(function() {
                makeScreenshots(components, function(images) {
                    imagesRendered(images);
                });
            }, 500);
        }

        function imagesRendered(saveData) {
            apiCall(
                'layout.save', 
                {
                    layout_id: currentLayoutId,
                    components: saveData
                },
                function(layoutId) {
                    $('body').scope().save();
                    getComponentId();
                    getOriginalLayout();
                    updateControls(hasDifferences());
                }
            );
        }
    });

    // Discard all changes
    $('body').on('click', '#discardChanges, .dm-reset-template', function(e) {
        var btn = $(e.target);
        e.preventDefault();
        window.templateScreenshot = '';
        apiCall(
            'layout.components.get',
            {layout_id: currentLayoutId},
            function(components) {
                var restoreTemplates = components,
                    tmpBlocks = [],
                    itemHtml;

                if ( btn.get(0).className != 'dm-reset-template' ) {
                    var compExists = true;
                    $('[component-id]', '#templates').each(function() {
                        var $this = $(this);
                        $this.scope().removeTemplate();
                        $this.remove();
                    });
                }
                else {
                    var isConfirmed = confirm('Are you sure you want to reset this block?');
                    if ( isConfirmed ) {
                        var comp = btn.closest('[component-id]'),
                            compId = comp.attr('component-id'),
                            compExists = false;

                    comp.after('<div class="template-reset-holder"/>');
                    $('.template-reset-holder').height(comp.outerHeight());
                    comp.scope().removeTemplate();
                        comp.remove();
                        $.each(components, function() {
                            if ( $(this)[0].id == compId ) {
                                restoreTemplates = $(this);
                                compExists = true;
                            }
                        });
                    }
                }

                $('[data-component-id]', '#myBlocks').show();

                if ( btn.get(0).className == 'dm-reset-template' ) {
                    var compTemplate = comp.attr('dm-template');

                    if ( comp.hasClass('custom-block') ) {
                        compTemplate = compTemplate.substr(compTemplate.indexOf('custom') + 7).replace('_', '.').split('_', 1)[0];
                    }
                }

                if ( compExists ) {
                    for(var i = 0; i < restoreTemplates.length; i++) {
                        tmpBlocks.push('<div id="temp-' + restoreTemplates[i]['id'] + '"></div>');
                    }
                }
                else {
                    restoreTemplates = {
                        0: {
                            id: compId,
                            template_id: comp.attr('dm-template')
                        },
                        length: 1
                    };
                    tmpBlocks.push('<div id="temp-' + compId + '"></div>');
                }
                if ( btn.get(0).className != 'dm-reset-template' ) {
                    $('#templates').append(tmpBlocks.join('\n\n'));
                }
                else {
                    generateTemplate(compTemplate, 'draggable', true, $('.template-reset-holder'));
                    return false;
                }
                for(var k = 0; k < restoreTemplates.length; k++) {
                    (function(t) {
                        apiCall(
                            'component.template.get', 
                            {component_id: restoreTemplates[t]['id']},
                            function(template) {
                                var htmlTemplate = template.html,
                                    cssTemplate = template.css;
                                $(htmlTemplate).insertAfter('#temp-' + restoreTemplates[t]['id'], '#templates');
                                $('#temp-' + restoreTemplates[t]['id'],'#templates').remove();
                                var addedBlock = $('[component-id=' + restoreTemplates[t]['id'] + ']', '#templates');
                                addedBlock.addClass('tempHidden');
                                $('[data-component-id=' + restoreTemplates[t]['id'] + ']', '#myBlocks').hide();
                                appendStyles(function() {
                                    $('#templates').injector().invoke(function($compile) {
                                        var scope = $('#templates').scope();
                                        $compile(addedBlock)(scope);
                                    });
                                    settingsBlock();
                                    checkVisibleTemplate();
                                });
                            }
                        );
                    })(k);
                }

                if(components.length === 0) {
                    updateControls(false);
                }
            }
        );
    });

    $('#previewLayout').on('click', function(e) {
        e.preventDefault();
        $('#previewMenu > .title').html($('#postTitle').val());
        $('body').removeClass('preview');
        $('#sideMenu').addClass('noHover');
        var layoutsArray = [],
            components = $('[component-id]', '#templates'),
            componentIdArray = [];

        components.each(function() {
            var $this = $(this),
                sendObj = {};

            sendObj.template_id = $this.attr('dm-template');
            if($this.scope().findById) {
                sendObj.model = $this.scope().findById()
            }
            layoutsArray.push(sendObj);
        });

        if ( !components[0] ) {
            alert('There are no blocks to preview!');
            return false;
        }

        apiCall(
            'layout.preview.get', 
            {components: layoutsArray},
            function(html) {
                createPreviewPage(html, layoutsArray);
                $('.custom-img img').each(function() {
                    var imgText = $(this).attr('src');

                    if ( imgText.indexOf('1x1.png') > -1 ) {
                        $(this).addClass('removed-image');
                    }
                });
           }
        );
    });

    function createPreviewPage(html, layoutsArray) {
        var holder = $('<div id="previewHolder"><div class="previewWrapper"></div></div>');

        if($('#previewHolder').length) {
            $('#previewHolder').remove();
        };
        leaveHomeScreen('preview');
        $('body').append(holder);
        $('#previewHolder .previewWrapper').append(html);

        window.previewStartupKit.init('#previewHolder');

        $('#previewBack').off('click').on('click', function(e) {
            e.preventDefault();

            $('.dm-template', '#templates').each(function() {
                if($(this).attr('dm-template') === 'header.header23') {
                    angularStartupKit.attachBgVideo('bgVideo', $(this).scope().data.bg_video);
                }
            })
            backToHomeScreen();
        });
    }

    function leaveHomeScreen(typeOfPage) {
        $('.designmodo-wrapper').css({position: 'fixed', opacity: 0, left: 0, top: 0, right: 0, zIndex: -1});
        $('#menu').hide();
        $('#startMenu').addClass('disabledMenu');
        $('#' + typeOfPage + 'Menu').removeClass('disabledMenu');
        setTimeout(function() {
            $(window).resize();
        },500);
        window.scrollTo(0,0);
    };

    function backToHomeScreen() {
        $('#previewMenu, #reorderMenu, #editingMenu').addClass('disabledMenu');
        $('#loader-container').removeClass('saving');
        $('#startMenu').removeClass('disabledMenu');
        $('.designmodo-wrapper').css({position: 'relative', opacity: 1, zIndex: 2});
        $('.designmodo-wrapper').css({marginLeft: 0});
        $('body').removeClass('reorder-mode');
        setTimeout(function() {
            $('#menu').show();
        }, 500);
        $('#previewHolder, #reorderHolder').remove();

        $(window).resize();
    };

    function getOriginalLayout() {
        originalLayout = [];
        $('[component-id]', '#templates').each(function() {
            originalLayout.push($(this).attr('component-id'));
        });
    };

    getOriginalLayout();

    window.updateControls = function(show) {
        if(show) {
            $('#saveChanges').removeClass('disabled');
            $('#discardChanges').parent().show();
        } else {
            $('#saveChanges').addClass('disabled')
            $('#loader-container').removeClass('saving');
            $('#discardChanges').parent().hide();
        }
    };

    window.hasDifferences = function() {
        var arrayChanges = $('body').scope().arrayChanges;

        if(Object.keys(arrayChanges).length !== originalLayout.length) {
            return true;
        } else {
            for(var k = 0; k < arrayChanges.length; k++) {
                if(arrayChanges[k].changed || arrayChanges[k].id !== originalLayout[k]) {
                    return true;
                }
            }
        }
        return false;
    };

    function appendStyles(callback) {
        var componentIds = $('.dm-template', '#templates'),
            cssArray = [],
            hrefCSS;

        $.each(componentIds, function() {
            cssArray.push(+$(this).attr('component-id'));
        });

        if(cssArray.length) {
            apiCall(
                'component.css.get',
                {
                    component_ids: cssArray,
                    format: 'json'
                }, 
                function(css) {
                    if($('#initCSSFile').length) {
                        $('#initCSSFile').remove();
                    }
                    $('#mainCSSFile').empty().append(css);
                    $.each(componentIds, function() {
                        $(this).removeClass('tempHidden');
                    });
                    if(callback) {
                        callback();
                    }
                }
            );
        }
    };

    $('body').scope().$watch('arrayChanges', function(newNames) {
        updateControls(hasDifferences());
    }, true);

    $(window).bind('beforeunload',function() {
        if(hasDifferences()) {
            return 'Please save you changes before leaving.';
        }
    });

    $('body').on('click', function (e) {
        if($(e.target).parents('#menu').length === 0) {
            $('#subMenu').addClass('invisible');
            $('#sideMenu').addClass('noHover');
            $('body').removeClass('preview');
        }
    });
});

// additional functions
$.fn.preload = function() {
    this.each(function() {
        $('<img/>')[0].src = this;
    });
}
$.fn.exists = function() {
    return this.length > 0;
}
//extend for draggable
var oldMouseStart = $.ui.draggable.prototype._mouseStart;
$.ui.draggable.prototype._mouseStart = function(event, overrideHandle, noActivation) {
    this._trigger("beforeStart", event, this._uiHash());
    oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
};

/**
 * Call API method
 * @param String method
 * @param PlainObject data
 * @param Function success
 * @param Function failure
 */
function apiCall(method, data, success, failure) {
    var defaultSuccess = function(result) { console.log(result); };
    var defaultFailure = function(code, msg) { console.error("API failed: %s: %s", code, msg); };
    success = typeof success !== 'undefined' ? success : defaultSuccess;
    failure = typeof failure !== 'undefined' ? failure : defaultFailure;
    
    $.ajax({
        url: ajaxurl,
        method: 'POST',
        data: {
            action: 'sf_api',
            method: method,
            params: JSON.stringify(data).replace(new RegExp('../../../../..', 'g'), '---gddyworkaround---')
        },
        dataType: 'json',
        success: function(response) {
            if ('result' in response) {
                success(response.result);
            } else if ('error' in response) {
                failure(response.error.code, response.error.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            failure(textStatus, errorThrown);
        }
    });
}

jQuery(function($) {

    $('body').on('mouseenter', '.dm-template', function() {
        var template = $(this),
            templateTools = $('.dm-controls', template),
            templateHeight = template.outerHeight();

        if ( templateHeight < 90 && !templateTools.hasClass('alignMiddle') ) {
            templateTools.addClass('alignMiddle');
        }
    });

    $('body').on('mouseenter', '.dm-control-button:not(".dm-toggle")', function() {
        var button = $(this),
            template = button.closest('.dm-template'),
            wrapper = $('.designmodo-wrapper'),
            templateTop = template.offset().top + template.height() - 132,
            wrapperHeight = wrapper.height() - 170;

        if ( templateTop >= wrapperHeight && template.height() < 170 ) {
            $('.dm-settingsBlock-listHolder', template).addClass('showTop');
        }
        else {
            $('.dm-settingsBlock-listHolder', template).removeClass('showTop');
        }
    });

    $('body').on('click', '.dm-carousel-add, .dm-carousel-remove', function(e) {
        e.preventDefault();
    });
    $('.dm-carousel-hide').on('mouseenter', function() {
        var width = $(this).find('a').first().outerWidth() + $(this).find('a').last().outerWidth();
        $(this).stop().animate({width: width}, 250);
    });
    $('.dm-carousel-hide').on('mouseleave', function() {
        var width = $(this).find('.dm-carousel-counter').outerWidth();
        $(this).stop().animate({width: width},250);
    });

    $('.custom-img img').each(function() {
        var imgText = $(this).attr('src');

        if ( imgText.indexOf('1x1.png') > -1 ) {
            $(this).addClass('removed-image');
        }
    });

});
