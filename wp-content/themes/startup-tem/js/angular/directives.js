'use strict';

/* Directives */
angular.module('DMApp.directives', ['angularFileUpload'])
    .directive('dmTemplate', ['$compile', function($compile) {
        return {
            scope: true,
            controller: function($scope, $element, $attrs, templateModel, layoutModel, $http) {
                var initScope;
                $scope.id = $attrs.componentId;
                $scope.$emit('scope-was-loaded', {
                    id: $scope.id,
                    changed: false
                });
                $http(
                    getReguest('component.model.get', {
                        component_id: $scope.id
                    })
                ).then(function(data) {
                    populateData(data);
                    invokeExtInit($attrs.dmTemplate);
                    initScope = angular.copy($scope.data);
                });

                $scope.removeTemplate = function() {
                    $scope.$emit('scope-was-removed', $scope.id);
                    layoutModel.removeTemplate($scope.id);
                    $scope.$destroy();
                };

                $scope.findById = function() {
                    return layoutModel.findById($scope.id);
                };

                $scope.$watch('data', function(newNames, oldNames) {
                    if(newNames && oldNames) {
                        if(angular.equals(initScope, newNames)) {
                            $scope.$emit('scope-was-changed', {
                                id: $scope.id,
                                changed: false
                            });
                        } else {
                            $scope.$emit('scope-was-changed', {
                                id: $scope.id,
                                changed: true
                            });
                        }
                    }
                }, true);

                $scope.$on('scope-was-saved', function(event, args) {
                    initScope = angular.copy($scope.data);
                });

                function getReguest(methodName, paramsName) {
                    return {
                        url: ajaxurl,
                        method: "POST",
                        params: {
                            action: 'sf_api',
                            method: methodName
                        },
                        data: JSON.stringify({ params: paramsName }).replace(new RegExp('../../../../..', 'g'), '---gddyworkaround---')
                    }
                };

                function populateData(data) {
                    layoutModel.addTemplate(templateModel.create($scope.id, data.data.result));
                    $scope.data = layoutModel.findById($scope.id);
                };

                function invokeExtInit(id) {
                    var array = id.split('.'),
                        parentName = array[0],
                        componentId = array[1];

                    if(parentName === 'custom') {
                        var subArray = componentId.split('_'),
                            subParentName = subArray[0],
                            subComponentId = subArray[1];

                        window.previewStartupKit[subParentName][subComponentId]('.custom-block');
                    } else {
                        $scope.extInit = window.angularStartupKit[parentName][componentId]();
                        setTimeout(function() {
                            $scope.extInit.init();
                        }, 0)
                    }
                }
            }
        };
    }])
    .directive('dmContenteditable', ['$compile', function($compile) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {
                element.bind("click", function(e) {
                    e.preventDefault();
                });

                element.attr("contenteditable", true);

                function read() {
                    ngModel.$setViewValue(element.html());
                }

                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || "");
                };

                element.bind("keydown", function(e) {
                    if (e.keyCode == 13) {
                        document.execCommand('insertHTML', false, '<br><br>');
                        return false;
                    }
                });

                element.bind("blur keyup change", function(e) {
                    scope.$apply(read);
                });
            }
        };
    }])
    .directive('dmUploadMedia', ['$compile', 'widgetIcons', function($compile, widgetIcons) {
        return {
            scope: {
                dmUploadMedia: '=',
                dmUploadType: '@'
            },
            link: function($scope, $element, $attrs) {
                if($scope.dmUploadType === 'image' || $scope.dmUploadType === 'masonry') {
                    var imageWidth = $attrs.width*2 || 1200
                }
                var uploadFile = '',
                    typeFile = '<input class="dm-custom-file" type="file" ng-file-select="onFileSelect($files, ' + imageWidth + ')" accept="image/jpeg, image/pjpeg, image/png, image/x-png, image/gif, image/svg+xml, video/mp4, video/ogg, video/webm" /><span class="dm-custom-file-cover"></span>';

                if($attrs['dmMultipleUpload'] !== undefined) {
                    typeFile = '<input class="dm-custom-file" type="file" ng-file-select="onFileSelect($files, ' + imageWidth + ')" multiple accept="image/jpeg, image/pjpeg, image/png, image/x-png, image/gif, image/svg+xml, video/mp4, video/ogg, video/webm" /><span class="dm-custom-file-cover"></span>';
                }

                uploadFile = '<div class="dm-upload-media ' + (($scope.dmUploadType === 'video') ? 'video' : '') + '" ng-controller="FileUploadCtrl">' +
                                '<i class="dm-widget-icon">' +
                                    widgetIcons.getIcon(($scope.dmUploadType === 'video') ? 'video' : 'image') +
                                '</i>' + typeFile + 
                             '</div>';

                $element.prepend($compile(uploadFile)($scope));
                
                $element.find('.dm-custom-file-cover')
                    .on('mouseenter', function() {
                        angular.element(this).parent().addClass('hover');
                    })
                    .on('mouseleave', function() {
                        angular.element(this).parent().removeClass('hover');
                    })
                    .on('click', function() {
                        $element.find('input').click();
                    });
            },
            controller: function($scope, $element) {
                $scope.dmStoreMediaData = {
                    uploaded: false,
                    dataFiles: []
                };
                $scope.$watch('dmStoreMediaData.uploaded', function(newValue, oldValue) {
                    if($scope.dmStoreMediaData.uploaded) {
                        if($scope.dmUploadType === 'video') {
                            for(var k = 0; k < $scope.dmStoreMediaData.dataFiles.length; k++) {
                                if($scope.dmStoreMediaData.dataFiles[k].format in $scope.dmUploadMedia.types) {
                                    $scope.dmUploadMedia.types[$scope.dmStoreMediaData.dataFiles[k].format] = $scope.dmStoreMediaData.dataFiles[k].dataUrl
                                }
                            }
                            angularStartupKit.attachBgVideo('bgVideo', $scope.dmUploadMedia);
                        } else if($scope.dmUploadType === 'masonry') {
                            for(var k = 0; k < $scope.dmStoreMediaData.dataFiles.length; k++) {
                                $scope.dmUploadMedia.push({
                                    "image": $scope.dmStoreMediaData.dataFiles[k].dataUrl,
                                    "title": "",
                                    "uploaded": true
                                })
                            }
                        } else {
                            $scope.dmUploadMedia = $scope.dmStoreMediaData.dataFiles[0].dataUrl;
                        }
                        $scope.dmStoreMediaData.uploaded = false;
                    }
                });
            }
        }
    }])
    .directive('dmRemoveMedia', ['$compile', 'widgetIcons', function($compile, widgetIcons) {
        return {
            scope: {
                dmRemoveMedia: '='
            },
            link: function(scope, element) {
                var removeFile = '<div class="dm-remove-media">' +
                                '<i class="dm-widget-icon" ng-click="removeFile()">' +
                                    widgetIcons.getIcon('trash') +
                                '</i>' +
                             '</div>';
                element.prepend($compile(removeFile)(scope));
            },
            controller: function($scope, $element) {
                $scope.removeFile = function() {
                    var isConfirmed = confirm('Are you sure you want to delete this image?');

                    if ( isConfirmed ) {
                        var imgUrl = '../../../img/1x1.png',
                            origUrl = $scope.dmRemoveMedia;

                        $scope.dmRemoveMedia = imgUrl;

                        apiCall(
                            'attachement.delete', 
                            {
                                attachement_url : origUrl
                            },
                            function() {
                                updateControls(hasDifferences());
                            },
                            function(code, msg) {
                                if ( code != 247614 ) {
                                    $scope.dmRemoveMedia = origUrl;
                                    updateControls(hasDifferences());
                                    alert(msg);
                                }
                                else {
                                }
                            }
                        );
                    }
                }
            }
        }
    }])
    .directive('dmOpacity', ['$compile', function($compile) {
        return {
            scope: {
                dmOpacity: '=',
                dmGradient: '='
            },
            link: function(scope, element, attrs) {
                element.addClass('dm-slider-holder');
                scope.$watch('dmGradient', function(newValue, oldValue) {
                    if(newValue) {
                        scope.gradient = {
                            "background": "linear-gradient(to right, #fff 0%, " + newValue + " 100%)"
                        };
                    }
                });
                var opacity = '<div ui-slider min="0" max="1" step="0.01" use-decimals ng-model="dmOpacity" dm-convert-opacity ng-style="gradient"></div>';
                element.prepend($compile(opacity)(scope));
            }
        }
    }])
    .directive('dmConvertOpacity', ['$compile', function($compile) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                function convert(item) {
                    if(item != undefined) {
                        return 1 - item;
                    }
                }
                ngModel.$parsers.push(convert);
                ngModel.$formatters.push(convert);
            }
        }
    }])
    .directive('dmBgColor', ['$compile', function($compile) {
        return {
            link: function(scope, element, attrs) {
                var bgColor = '<input minicolors type="text" ng-model="' + attrs.dmBgColor + '" />';
                element.prepend($compile(bgColor)(scope));
                element.wrap('<div class="dm-control-button dm-minicolor"></div>');
            }
        }
    }])
    .directive('dmMap', ['$compile', function($compile) {
        return {
            scope: {
                dmMap: '='
            },
            link: function(scope, element, attrs) {
                scope.googleMap = {};
                scope.$watch('dmMap', function(newValue, oldValue) {
                    if(newValue && !angular.element('#' + scope.dmMap.id).length) {
                        scope.dmMap.zoom = parseInt(scope.dmMap.zoom, 10);
                        var googleMap = '<google-map id="[[ dmMap.id ]]" control="googleMap" center="dmMap.center" zoom="dmMap.zoom" draggable="true"></google-map>';
                        element.prepend($compile(googleMap)(scope));
                    }
                });
                scope.$watchCollection('googleMap', function(newValue, oldValue) {
                    if(newValue['getGMap']) {
                        google.maps.event.trigger(scope.googleMap.getGMap(), 'resize');
                    }
                });
            }
        }
    }])
    .directive('dmEditUrl', ['$compile', 'URLValidator', 'toggleWidget', 'widgetIcons', function($compile, URLValidator, toggleWidget, widgetIcons) {
        return {
            scope: {
                dmEditUrl: '='
            },
            link: function($scope, $element, $attrs) {
                var inputForm = '<div class="dm-edit-url ' + ($attrs.dmEditUrlType || '') + '" ng-class="{show: active}">' +
                                    '<a ng-click="open()" class="dm-edit-url-toggle">' +
                                        '<i class="dm-widget-icon">' +
                                            widgetIcons.getIcon($attrs.dmEditUrlType || 'url') +
                                        '</i>' +
                                    '</a>' +
                                    '<div class="dm-edit-url-input">' +
                                        '<input placeholder="' + (($attrs.dmMasonryTitle) ? 'Edit a Title' : 'Enter a Link') + '" class="dm-create-link" ng-keyup="keyupEvent($event)" type="text" />' +
                                    '</div>' +
                                '</div>';

                $element.prepend($compile(inputForm)($scope));

                var inputEl = $element.find('.dm-create-link:first'),
                    savedUrl = inputEl.val(),
                    intervalId,
                    customizerParent = $element.closest('.dm-popover'),
                    arrow = customizerParent.find('.arrow'),
                    template = $element.closest('.dm-template');

                $scope.$on('init-customizer', function() {
                    $scope.active = false;
                    $scope.$apply();
                });

                angular.element('body').on('click', function (e) {
                    if($(e.target).parents('.dm-popover').length === 0) {
                        $scope.active = false;
                        $element.closest('.dm-popover').removeClass('focus in').hide();
                        _clearInterval();
                        toggleWidget.hide();
                        $scope.$apply();
                    }
                });

                function _clearInterval() {
                    if(intervalId) {
                        clearInterval(intervalId);
                    }
                }

                $scope.open = function() {
                    var leftPosition = customizerParent.offset().left - template.offset().left;
                    $scope.active = true;
                    inputEl.closest('.dm-popover').addClass('focus');

                    _clearInterval();

                    intervalId = setInterval(function() {
                        if(leftPosition + $element.outerWidth() > template.width()) {
                            customizerParent.css({
                                'left': 'auto',
                                'right': 5 + 'px'
                            })
                            arrow.css({
                                'left': leftPosition - (template.width() - $element.outerWidth()) + 20
                            })
                        } else {
                            customizerParent.css({
                                'left': customizerParent.offset().left - template.offset().left + 'px',
                                'right': 'auto'
                            })
                        }
                    }, 50);
                    setTimeout(function() {
                        _clearInterval();
                    }, 400)

                    inputEl.val('');
                    setTimeout(function() {
                        inputEl.focus().val($scope.dmEditUrl);
                    }, 0)
                };

                $scope.keyupEvent = function (e) {
                    if (e.keyCode == 27) {
                        $scope.active = false;
                        $element.find('.dm-create-link').val(savedUrl);
                        $element.closest('.dm-popover').removeClass('focus in').hide();
                        _clearInterval();
                    }
                    if (e.keyCode == 13) {
                        $scope.active = false;
                        $scope.dmEditUrl = $element.find('.dm-create-link').val();
                        $element.closest('.dm-popover').removeClass('focus in').hide();
                        _clearInterval();
                    }
                };
            }
        }
    }])
    .directive('dmRemoveMasonry', ['$compile', 'widgetIcons', function($compile, widgetIcons) {
        return {
            scope: {
                dmRemoveMasonry: '=',
                dmRemoveMasonryItem: '='
            },
            link: function($scope, $element) {
                var removeFile = '<div class="dm-remove-masonry">' +
                                '<i class="dm-widget-icon" ng-click="removeMasonry()">' +
                                    widgetIcons.getIcon('trash') +
                                '</i>' +
                             '</div>';
                $element.prepend($compile(removeFile)($scope));

                $scope.removeMasonry = function() {
                    var confirmRemoval = confirm('Are you sure you want to remove this image?');
                    if ( confirmRemoval ) {
                        var index = $scope.dmRemoveMasonry.indexOf($scope.dmRemoveMasonryItem);
                        $scope.dmRemoveMasonry.splice(index, 1);
                        $element.closest('.dm-popover').remove();
                        masonryInit();
                    }
                }
            },
        }
    }])
    .directive('dmSlider', ['$compile', 'widgetIcons', function($compile, widgetIcons) {
        return {
            scope: {
                dmSlider: '@',
                dmSliderModel: '=',
                dmSliderArchive: '@'
            },
            link: function($scope, $element, $attrs) {
                $element.attr('id', $scope.dmSlider);
                $element.addClass('dm-carousel-holder');
                var parentScope = $element.closest('.dm-template').scope(),
                    flagName = $scope.dmSliderArchive + 'Flag',
                    slideName = $scope.dmSliderArchive + 'Slide';

                parentScope[flagName] = [];
                parentScope[slideName] = {};

                $scope.$watchCollection('$parent["' + flagName + '"]', function(newValue, oldValue) {
                    var counter = [];
                    if(newValue) {
                        for(var i = 0; i < newValue.length; i++) {
                            if(newValue[i]) {
                                parentScope[slideName] = $scope.dmSliderModel[i];
                                counter.push('<span class="active"></span>');
                            } else {
                                counter.push('<span></span>');
                            }
                        }
                        $element.find('.dm-carousel-counter').empty().append(counter.join('\n\n'));
                    }
                });

                var slideControls = '<div class="dm-controls dm-carousel">' +
                                        '<div class="btn-group">' +
                                            '<a class="dm-control-button prev">' +
                                                '<i class="dm-widget-icon">' +
                                                    widgetIcons.getIcon('prev') +
                                                '</i>' +
                                            '</a>' +
                                            '<div class="dm-control-button dm-carousel-hide">' +
                                                '<a ng-click="addSlide()" class="dm-carousel-add" href="#">' +
                                                    '<i class="dm-widget-icon">' +
                                                        widgetIcons.getIcon('add') +
                                                    '</i> Add slide</a>' +
                                                '<div class="dm-carousel-counter"></div>' +
                                                '<a ng-click="removeSlide()" class="dm-carousel-remove" href="#">' +
                                                    '<i class="dm-widget-icon">' +
                                                        widgetIcons.getIcon('remove') +
                                                    '</i> Remove slide</a>' +
                                            '</div>' +
                                            '<a class="dm-control-button next">' +
                                                '<i class="dm-widget-icon">' +
                                                    widgetIcons.getIcon('next') +
                                                '</i>' +
                                            '</a>' +
                                        '</div>' +
                                    '</div>';

                $element.append($compile(slideControls)($scope));
                
                $scope.$watch('dmSliderModel', function(newValue, oldValue) {
                    if ( newValue && newValue.length <= 1 ) {
                        $element.find('.dm-carousel').addClass('showAlways');
                        if ( !$element.closest('.header-16-sub').length ) {
                            $element.closest('.dm-template').find('.pt-control-prev, .pt-control-next, .controls, .pt-indicators, .carousel-indicators, .content-35-customPager').css({visibility: 'hidden'});
                        }
                        else {
                            $element.closest('.dm-template').find('.pt-controls').hide();
                        }
                    }
                    else if ( newValue && newValue.length > 1 ) {
                        $element.find('.dm-carousel').removeClass('showAlways');
                        if ( !$element.closest('.header-16-sub').length ) {
                            $element.closest('.dm-template').find('.pt-control-prev, .pt-control-next, .controls, .pt-indicators, .carousel-indicators, .content-35-customPager').css({visibility: 'visible'});
                        }
                        else {
                            $element.find('.pt-controls').show();
                        }
                    }
                });

                $scope.addSlide = function() {
                    var newItem = angular.copy(parentScope[slideName]);
                    newItem['generated'] = true;
                    $scope.dmSliderModel.push(newItem);
                    if ( $scope.dmSliderModel.length > 1 ) {
                        $element.find('.dm-carousel').removeClass('showAlways');
                        if ( !$element.closest('.header-16-sub').length ) {
                            $element.closest('.dm-template').find('.pt-control-prev, .pt-control-next, .controls, .pt-indicators, .carousel-indicators, .content-35-customPager').css({visibility: 'visible'});
                        }
                        else {
                            $element.find('.pt-controls').show();
                        }
                    }
                };

                $scope.removeSlide = function() {
                    var sliderFlagArray = parentScope[flagName];
                    if(sliderFlagArray.length > 1) {
                        var isConfirmed = confirm('Are you sure you want to remove this slide?');
                        if ( isConfirmed ) {
                            for(var i = 0; i < sliderFlagArray.length; i++) {
                                if(sliderFlagArray[i]) {
                                    $scope.dmSliderModel.splice(i, 1);
                                    sliderFlagArray.splice(i, 1);
                                    setTimeout(function() {
                                        $scope.$parent.extInit.slider($scope.dmSlider);
                                    }, 0);
                                    if ( $scope.dmSliderModel.length <= 1 ) {
                                        $element.find('.dm-carousel').addClass('showAlways');
                                        if ( !$element.closest('.header-16-sub').length ) {
                                            $element.find('.pt-control-prev, .pt-control-next, .controls, .pt-indicators, .carousel-indicators, .content-35-customPager').css({visibility: 'hidden'});
                                        }
                                        else {
                                            console.log($scope.dmSliderModel);
                                            $element.find('.pt-controls').hide();
                                        }
                                    }
                                }
                            }
                            sliderFlagArray[0] = true;
                        }
                    }
                };
            },
            controller: function($scope, $element, $attrs) {
                this.getId = function() {
                    return $scope.dmSlider;
                }
                this.getArchive = function() {
                    return $scope.dmSliderArchive;
                }
            }
        };
    }])
    .directive('dmSliderRepeat', ['$compile', function($compile) {
        return {
            require: '^dmSlider',
            link: function($scope, $element, $attrs, $ctrl) {
                var dmSliderId = $ctrl.getId(),
                    dmSliderArchive = $ctrl.getArchive(),
                    parentScope = $element.closest('.dm-template').scope(),
                    flagName = dmSliderArchive + 'Flag';

                if($scope.$first) {
                    parentScope[flagName].push(true);
                } else if($scope.$last && $scope.slide.generated) {
                    for(var i = 0; i < parentScope[flagName].length; i++) {
                        parentScope[flagName][i] = false
                    }
                    parentScope[flagName].push(true);
                } else {
                    parentScope[flagName].push(false);
                }

                if($scope.$last) {
                    if($scope.slide.generated) {
                        setTimeout(function() {
                            $scope.extInit.slider(dmSliderId, $scope.$index);
                            delete $scope.slide.generated;
                        }, 0)
                    } else {
                        setTimeout(function() {
                            $scope.extInit.slider(dmSliderId);
                        }, 0)
                    }
                };
            }
        };
    }])
    .directive('dmMasonry', [function() {
        return {
            controller: function($scope, $element, $attrs) {
                if($scope.item.uploaded) {
                    delete $scope.item.uploaded;
                    setTimeout(function() {
                        $scope.extInit.masonryInit(true);
                    }, 0)
                } else if($scope.$last) {
                    setTimeout(function() {
                        $scope.extInit.masonryInit();
                    }, 0)
                };
            }
        };
    }])
    .directive('dmSrc', [function() {
        return {
            link: function(scope, element, attrs) {
                element.attr('src', attrs.dmSrc);
            }
        }
    }])
    .directive('dmChangeIcon', ['$compile', 'URLValidator', 'toggleWidget', 'widgetIcons', 'simpleIcons', function($compile, URLValidator, toggleWidget, widgetIcons, simpleIcons) {
        return {
            scope: {
                dmChangeIcon: '=',
                dmChangeIconUrl: '=',
            },
            link: function($scope, $element, $attrs) {
                var iconsSet = '<div class="dm-icons-holder">' +
                                    '<input type="text" class="icons-search" placeholder="Search" ng-model="filterIcons">' +
                                    '<span class="clear-filter" ng-click="clearFilter()">Clear</span>' +
                                   '<div ng-repeat="icon in icons | filter: filterIcons" ng-class="{active: dmChangeIcon == icon.name}" ng-click="pick(icon.name)" class="dm-control-button">' +
                                       '<i class="dm-widget-icon" ng-mouseenter="changePlaceholder(icon.name)" dm-insert-icon="icon.name" dm-insert-icon-type="simple"></i>' +
                                   '</div>' +
                               '</div>' +
                               '<div class="dm-icon-link-holder" ng-class="{addLink: addLink}">' +
                                    '<div class="dm-icon-link">' +
                                        '<i class="dm-widget-icon">' +
                                            widgetIcons.getIcon('url') +
                                        '</i>' +
                                    '</div>' +
                                    '<input class="dm-create-link" placeholder="" type="text" ng-keyup="keyupEvent($event)" />' +
                                    '<a class="icon-submit">' +
                                        widgetIcons.getIcon('submit') +
                                    '</a>' +
                               '</div>';
                $element.prepend($compile(iconsSet)($scope));

                var inputEl = $element.find('.dm-create-link:first'),
                    inputSubmit = $element.find('.icon-submit'),
                    inputFilter = $element.find('.icons-search'),
                    savedUrl = inputEl.val(),
                    customizerParent = $element.closest('.dm-popover'),
                    template = $element.closest('.dm-template'),
                    templates = angular.element('#templates'),
                    clearBtn = $element.find('.clear-filter');

                $scope.$on('init-customizer', function() {
                    $scope.$apply();
                });

                $scope.pick = function(icon) {
                    var iconName = icon;
                    $scope.dmChangeIcon = icon;
                    inputEl.closest('.dm-popover').addClass('focus');
                    $scope.dmChangeIconUrl = '';
                    inputEl.attr('placeholder', 'Enter URL');

                    iconName = icon.substr(icon.indexOf('fui-') + 4);
                    iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

                    var idElement = customizerParent.attr('data-customizer-serial'),
                        hoveredEl = angular.element('[data-customizer="' + idElement + '"]');

                    $scope.addLink = true;
                        
                    setTimeout(function() {
                        var topPosition = hoveredEl.offset().top - customizerParent.height() - template.offset().top - 12;
                        if ( template.offset().top - templates.offset().top + topPosition < 52 ) {
                            customizerParent.removeClass('top').addClass('bottom');
                            topPosition = hoveredEl.offset().top - template.offset().top + hoveredEl.outerHeight();
                        } else {
                            customizerParent.removeClass('bottom').addClass('top');
                        }

                        inputEl.focus().val($scope.dmChangeIconUrl);
                        customizerParent.css({
                            'top': topPosition
                        });
                    }, 0);
                };

                $scope.clearFilter = function() {
                    $scope.filterIcons = '';
                    var idElement = customizerParent.attr('data-customizer-serial'),
                        hoveredEl = angular.element('[data-customizer="' + idElement + '"]');

                    setTimeout(function() {
                        var topPosition = hoveredEl.offset().top - customizerParent.height() - template.offset().top - 12;
                        if ( template.offset().top - templates.offset().top + topPosition < 52 ) {
                            customizerParent.removeClass('top').addClass('bottom');
                            topPosition = hoveredEl.offset().top - template.offset().top + hoveredEl.outerHeight();
                        } else {
                            customizerParent.removeClass('bottom').addClass('top');
                        }

                        customizerParent.css({
                            'top': topPosition
                        });
                    }, 0);
                    clearBtn.hide();
                };

                angular.element('body').on('click', function (e) {
                    if ( $(e.target).parents('.dm-popover').length === 0 ) {
                        inputFilter.attr('placeholder', 'Search');
                        $element.closest('.dm-popover').removeClass('focus in').hide();
                        toggleWidget.hide();
                        $scope.addLink = false;
                        $scope.$apply();
                    }
                });

                $scope.changePlaceholder = function(icon) {
                    var iconName = icon.substr(icon.indexOf('fui-') + 4);

                    iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
                    inputFilter.attr('placeholder', iconName);
                };

                inputFilter.on('keyup', function() {
                    var idElement = customizerParent.attr('data-customizer-serial'),
                        hoveredEl = angular.element('[data-customizer="' + idElement + '"]');

                    setTimeout(function() {
                        var topPosition = hoveredEl.offset().top - customizerParent.height() - template.offset().top - 12;
                        if ( template.offset().top - templates.offset().top + topPosition < 52 ) {
                            customizerParent.removeClass('top').addClass('bottom');
                            topPosition = hoveredEl.offset().top - template.offset().top + hoveredEl.outerHeight();
                        } else {
                            customizerParent.removeClass('bottom').addClass('top');
                        }

                        customizerParent.css({
                            'top': topPosition
                        });
                    }, 0);

                    if ( inputFilter.val() ) {
                        clearBtn.show();
                    }
                    else {
                        clearBtn.show();
                    }
                });

                $scope.keyupEvent = function (e) {
                    if ( e.keyCode == 27 ) {
                        eraseData();
                    }
                    if (e.keyCode == 13 && !$(e.currentTarget).val()) {
                        eraseData();
                    }
                    else if ( e.keyCode == 13 ) {
                        saveData();
                    }
                    if ( inputEl.val() ) {
                        inputSubmit.addClass('valid');
                    }
                    else {
                        inputSubmit.removeClass('valid');
                    }
                };

                angular.element('.icon-submit').on('click', function() {
                    if ( !inputEl.val() ) {
                        return false;
                    }
                    else {
                        saveData();
                        $scope.$apply();
                    }
                    return false;
                });

                $scope.no = function() {
                    eraseData();
                };

                $scope.save = function() {
                    saveData();
                };

                function eraseData() {
                    inputFilter.attr('placeholder', 'Search');
                    $scope.addlink = false;
                    $element.find('.dm-create-link').val(savedUrl);
                    $element.closest('.dm-popover').removeClass('focus in').hide();
                };

                function saveData() {
                    inputFilter.attr('placeholder', 'Search');
                    $scope.addlink = false;
                    $scope.dmChangeIconUrl = $element.find('.dm-create-link').val();
                    $element.closest('.dm-popover').removeClass('focus in').hide();
                };

                $element.on('click', function() {
                    return false;
                });
            },
            controller: function($scope, $element, $attrs) {
                $scope.icons = simpleIcons.allIcons();
            }
        };
    }])
    .directive('dmSocialBtns', ['$compile', 'URLValidator', 'toggleWidget', 'widgetIcons', 'socialIcons', function($compile, URLValidator, toggleWidget, widgetIcons, socialIcons) {
        return {
            scope: {
                dmSocialBtns: '='
            },
            link: function($scope, $element, $attrs) {
                var iconsSet = '<div class="dm-social-holder">' +
                                    '<input type="text" class="icons-search" placeholder="Search" ng-model="filterSocialIcons">' +
                                    '<span class="clear-filter" ng-click="clearFilter()">Clear</span>' +
                                   '<div ng-repeat="icon in icons | filter: filterSocialIcons" ng-class="setClass(icon.name)" ng-click="pick(icon.name)" class="dm-control-button">' +
                                        '<i class="dm-widget-icon" ng-mouseenter="changePlaceholder(icon.name)" dm-insert-icon="icon.name" dm-insert-icon-type="social"></i>' +
                                   '</div>' +
                               '</div>' +
                               '<div class="dm-icon-link-holder" ng-class="{addLink: addLink}">' +
                                    '<div class="dm-icon-link">' +
                                        '<i class="dm-widget-icon">' +
                                            widgetIcons.getIcon('url') +
                                        '</i>' +
                                    '</div>' +
                                    '<input class="dm-create-link" placeholder="" type="text" ng-keyup="keyupEvent($event)" />' +
                                    '<a class="icon-submit">' +
                                        widgetIcons.getIcon('submit') +
                                    '</a>' +
                               '</div>';

                $element.prepend($compile(iconsSet)($scope));

                var inputEl = $element.find('.dm-create-link:first'),
                    inputFilter = $element.find('.icons-search'),
                    customizerParent = $element.closest('.dm-popover'),
                    template = $element.closest('.dm-template'),
                    defaultWidth = customizerParent.outerWidth(),
                    templates = angular.element('#templates'),
                    clearBtn = $element.find('.clear-filter');

                $scope.$on('init-customizer', function() {
                    $scope.$apply();
                });

                $scope.setClass = function(icon) {
                    if ( $scope.dmSocialBtns ) {
                        for ( var i = 0; i < $scope.dmSocialBtns.length; i++ ) {
                            if ( $scope.dmSocialBtns[i].name == icon ) {
                                if ( $scope.dmSocialBtns[i].url ) {
                                    return "active"
                                }
                                else {
                                    return "active selected"
                                }
                            }
                        }
                    }
                };

                $scope.changePlaceholder = function(icon) {
                    var iconName = icon.substr(icon.indexOf('fui-') + 4);

                    iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
                    inputFilter.attr('placeholder', iconName);
                };

                $scope.pick = function(icon) {
                    var present = false,
                        iconName = icon;

                    inputEl.next().removeClass('valid');

                    iconName = icon.substr(icon.indexOf('fui-') + 4);
                    iconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
                    
                    $scope.thisLink = '';
                    $scope.thisUrl = '';
                    $scope.thisIcon = icon;

                    for ( var i = 0; i < $scope.dmSocialBtns.length; i++ ) {
                        if ( $scope.dmSocialBtns[i].name == icon ) {
                            present = true;
                            $scope.thisLink = i;
                        }
                    }

                    if ( $scope.prevIcon != undefined && $scope.prevIcon != icon ) {
                        for ( var i = 0; i < $scope.dmSocialBtns.length; i++ ) {
                            if ( $scope.dmSocialBtns[i].name == $scope.prevIcon ) {
                                $scope.thisPrevLink = i;
                            }
                        }
                        if ( $scope.thisPrevLink ) {
                            $scope.dmSocialBtns.splice($scope.thisPrevLink, 1);
                        }
                        $scope.addLink = false;
                    }

                    if ( $scope.dmSocialBtns[$scope.thisLink] ) {
                        $scope.thisUrl = $scope.dmSocialBtns[$scope.thisLink].url;
                    }

                    if ( !present ) {
                        $scope.addLink = true;
                        $scope.dmSocialBtns.push({
                            "name": icon,
                            "url": ''
                        });
                        inputEl.closest('.dm-popover').addClass('focus');
                        inputEl.val('');
                        setTimeout(function() {
                            inputEl.focus().attr('placeholder', 'Enter ' + iconName + ' URL');
                        }, 0);
                    }
                    else {
                        $scope.dmSocialBtns.splice($scope.thisLink, 1);
                        $scope.addLink = false;
                    }
                    var idElement = customizerParent.attr('data-customizer-serial'),
                        hoveredEl = angular.element('[data-customizer="' + idElement + '"]');

                    setTimeout(function() {
                        var topPosition = hoveredEl.offset().top - customizerParent.height() - template.offset().top - 12;
                        if ( template.offset().top - templates.offset().top + topPosition < 52 ) {
                            customizerParent.removeClass('top').addClass('bottom');
                            topPosition = hoveredEl.offset().top - template.offset().top + hoveredEl.outerHeight();
                        } else {
                            customizerParent.removeClass('bottom').addClass('top');
                        }

                        customizerParent.css({
                            'top': topPosition
                        });
                    }, 0);
                    $scope.prevIcon = icon;
                };

                inputFilter.on('keyup', function() {
                    var idElement = customizerParent.attr('data-customizer-serial'),
                        hoveredEl = angular.element('[data-customizer="' + idElement + '"]');

                    setTimeout(function() {
                        var topPosition = hoveredEl.offset().top - customizerParent.height() - template.offset().top - 12;
                        if ( template.offset().top - templates.offset().top + topPosition < 52 ) {
                            customizerParent.removeClass('top').addClass('bottom');
                            topPosition = hoveredEl.offset().top - template.offset().top + hoveredEl.outerHeight();
                        } else {
                            customizerParent.removeClass('bottom').addClass('top');
                        }

                        customizerParent.css({
                            'top': topPosition
                        });
                    }, 0);

                    if ( inputFilter.val() ) {
                        clearBtn.show();
                    }
                    else {
                        clearBtn.hide();
                    }
                });

                angular.element('body').on('click', function (e) {
                    if ( $(e.target).parents('.dm-popover').length === 0 ) {
                        if ( $('.dm-social-btns').is(':visible') ) {
                            for ( var i = 0; i < $scope.dmSocialBtns.length; i++ ) {
                                if ( $scope.dmSocialBtns[i].name == $scope.thisIcon ) {
                                    $scope.thisLink = i;
                                }
                            }
                            $scope.dmSocialBtns.splice($scope.thisLink, 1);
                        }
                        inputFilter.attr('placeholder', 'Search');
                        eraseData();
                        toggleWidget.hide();
                        $scope.addLink = false;
                        $scope.$apply();
                    }
                });

                $scope.clearFilter = function() {
                    $scope.filterSocialIcons = '';
                    var idElement = customizerParent.attr('data-customizer-serial'),
                        hoveredEl = angular.element('[data-customizer="' + idElement + '"]');

                    setTimeout(function() {
                        var topPosition = hoveredEl.offset().top - customizerParent.height() - template.offset().top - 12;
                        if ( template.offset().top - templates.offset().top + topPosition < 52 ) {
                            customizerParent.removeClass('top').addClass('bottom');
                            topPosition = hoveredEl.offset().top - template.offset().top + hoveredEl.outerHeight();
                        } else {
                            customizerParent.removeClass('bottom').addClass('top');
                        }

                        customizerParent.css({
                            'top': topPosition
                        });
                    }, 0);
                    clearBtn.hide();
                };

                inputEl.on('keyup', function() {
                    var gap = 0;

                    if ( inputEl.val() ) {
                        inputEl.next().addClass('valid');
                    }
                    else {
                        inputEl.next().removeClass('valid');
                    }
                });

                $scope.keyupEvent = function (e) {
                    if ( e.keyCode == 27 ) {
                        $scope.addLink = false;
                        eraseData();
                    }
                    if ( e.keyCode == 13 && !$(e.currentTarget).val() ) {
                        for ( var i = 0; i < $scope.dmSocialBtns.length; i++ ) {
                            if ( $scope.dmSocialBtns[i].name == $scope.thisIcon ) {
                                $scope.thisLink = i;
                            }
                        }
                        $scope.dmSocialBtns.splice($scope.thisLink, 1);
                        eraseData();
                    }
                    else if ( e.keyCode == 13 && $(e.currentTarget).val() ) {
                        $scope.addLink = false;
                        saveData();
                    }
                };

                angular.element('.icon-submit').on('click', function() {
                    if ( !inputEl.val() ) {
                        return false;
                    }
                    else {
                        $scope.addLink = false;
                        saveData();
                        $scope.$apply();
                    }
                    return false;
                });

                $scope.save = function() {
                    saveData();
                };

                function eraseData() {
                    inputFilter.attr('placeholder', 'Search');
                    $element.closest('.dm-popover').removeClass('focus in').hide();
                }

                function saveData() {
                    inputFilter.attr('placeholder', 'Search');
                    $scope.prevIcon = undefined;
                    $scope.dmSocialBtns[$scope.dmSocialBtns.length - 1].url = $element.find('.dm-create-link').val();
                    $element.closest('.dm-popover').removeClass('focus in').hide();
                }
            },
            controller: function($scope, $element, $attrs) {
                $scope.icons = socialIcons.allIcons()
            }
        };
    }])
    .directive('dmInsertIcon', ['$compile', 'socialIcons', 'simpleIcons', function($compile, socialIcons, simpleIcons) {
        return {
            scope: {
                dmInsertIcon: '='
            },
            link: function($scope, $element, $attrs) {
                var iconHtml;
                if($attrs.dmInsertIconType === 'simple') {
                    iconHtml = simpleIcons.getIcon($scope.dmInsertIcon);
                }
                if($attrs.dmInsertIconType === 'social') {
                    iconHtml = socialIcons.getIcon($scope.dmInsertIcon);
                }
                $element.append($compile(iconHtml)($scope));
            }
        };
    }])
    .directive('dmExternalNav', ['$compile', 'widgetIcons', function($compile, widgetIcons) {
        return {
            scope: {
                dmExternalNav: '@'
            },
            link: function($scope, $element, $attrs) {
                var linkExternalNav = '<a href="[[ dmExternalNav ]]" target="_blank" class="dm-goto-external-nav">' +
                                            '<span class="dm-goto-external-nav-icon">' +
                                                '<i class="dm-widget-icon">' +
                                                    widgetIcons.getIcon('new-window') +
                                                '</i>' +
                                            '</span>' +
                                            '<span class="dm-goto-external-nav-text">Edit Menu <i>(New Window)</i></span>' +
                                        '</a>';
                
                $element.prepend($compile(linkExternalNav)($scope));

                $element.closest('.dm-popover').addClass('dm-external-nav')
            }
        };
    }])
    .directive('dmVideo', ['$compile', function($compile) {
        return {
            scope: {
                dmVideo: '='
            },
            link: function($scope, $element, $attrs) {
                var iframe = '<iframe id="' + $attrs.id + '" width="' + ($attrs.width || '100%') + '" height="' + ($attrs.height || '100%') + '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
                $element.attr('id', '');
                $element.append($compile(iframe)($scope));
            },
            controller: function($scope, $element, $attrs) {
                $scope.$watch('dmVideo', function(newNames, oldNames) {
                    if(newNames) {
                        window.angularStartupKit.videoValidator(newNames, function(provider, id, failed) {
                            if(provider === 'Vimeo') {
                                $element.find('iframe').attr('src', 'https://player.vimeo.com/video/' + id);
                            }
                            if(provider === 'YouTube') {
                                $element.find('iframe').attr('src', 'https://www.youtube.com/embed/' + id);
                            }
                            if(failed) {
                                $scope.dmVideo = oldNames;
                                $scope.$apply();
                            }
                        });
                    }
                });
            }
        };
    }])
    .directive('customizer', ['$compile', 'toggleWidget', function($compile, toggleWidget) {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: '<div class="dm-controls">' +
                          '<div class="dm-popover-top-space"></div>' +
                          '<div class="arrow"></div>' +
                          '<div class="btn-group" ng-transclude></div>' +
                          '<div class="dm-popover-bottom-space"></div>' +
                      '</div>',
            link: function(scope, element, attrs) {
                var serial = Math.floor(Math.random() * 10000000000000000),
                    customizerParent = element.parent(),
                    template = element.closest('.dm-template'),
                    templates = angular.element('#templates'),
                    popoverSpace = 5;
                
                customizerParent.attr('data-customizer', serial);
                element.attr('data-customizer-serial', serial);
                template.append(element);

                customizerParent.on('mouseenter', function() {
                    var idElement = angular.element(this).attr('data-customizer'),
                        allCustomizer = angular.element('[data-customizer-serial], [data-popover-serial]'),
                        leftPosition = customizerParent.offset().left - template.offset().left,
                        rightPosition = 'auto',
                        popoverWidth = element.outerWidth(),
                        templateWidth = template.width(),
                        item = angular.element('[data-customizer-serial="' + idElement + '"]'),
                        arrow = item.find('.arrow'),
                        topPosition = customizerParent.offset().top - element.height() - template.offset().top - 12;

                    window.getSelection().removeAllRanges();
                    allCustomizer.each(function() {
                        var _this = angular.element(this);
                        if(_this.is(':visible')){
                            _this.scope().$broadcast('init-customizer');
                        }
                        _this.removeClass('in').removeClass('focus').removeClass('toRight').hide();
                    });

                    if ( customizerParent.find('.dm-social-btns') || customizerParent.find('.dm-change-icon') ) {
                        if ( template.offset().top - templates.offset().top + topPosition < 200 ) {
                            item.removeClass('top').addClass('bottom');
                            topPosition = customizerParent.offset().top - template.offset().top + customizerParent.outerHeight();
                        } else {
                            item.removeClass('bottom').addClass('top');
                        }
                    }
                    else {
                        if ( template.offset().top - templates.offset().top + topPosition < 12 ) {
                            item.removeClass('top').addClass('bottom');
                            topPosition = customizerParent.offset().top - template.offset().top + customizerParent.outerHeight();
                        } else {
                            item.removeClass('bottom').addClass('top');
                        }
                    }

                    if ( item.find('.dm-social-btns').length && item.hasClass('top') ) {
                        topPosition -= 120
                    }

                    toggleWidget.show();

                    if ( leftPosition + popoverWidth + popoverSpace > templateWidth ) {
                        leftPosition = leftPosition - popoverWidth + customizerParent.outerWidth();
                        item.addClass('toRight');
                        arrow.css({
                            'left': 'auto',
                            'right': 20
                        });
                    } else {
                        arrow.css({
                            'left': 20,
                            'right': 'auto'
                        });
                    }

                    if ( element.hasClass('dm-image') ) {
                        var imgWrapper = $('img', customizerParent);

                        if ( !imgWrapper.is(':visible') ) {
                            imgWrapper = customizerParent;
                        }

                        customizerParent.addClass('hover');
                        leftPosition = imgWrapper.width() / 2 + imgWrapper.offset().left - element.width() / 2;
                        if ( template.offset().left - templates.offset().left + leftPosition < 100 ) {
                            leftPosition = customizerParent.offset().left;
                        }
                        arrow.css({
                            left: element.width() / 2 - 10,
                            right: 'auto'
                        });
                    }

                    if ( item.hasClass('dm-external-nav') ) {
                        if(!item.hasClass('toRight'))
                        leftPosition += customizerParent.outerWidth() / 2 - item.outerWidth() / 2;
                    }

                    item.on('mouseleave', function() {
                        if(!item.hasClass('focus')) {
                            toggleWidget.hide();
                            angular.element(this).hide().removeClass('in');
                        }
                        if ( customizerParent.hasClass('custom-img') ) {
                            customizerParent.removeClass('hover');
                        }
                    });

                    item.show().addClass('in').on('mouseenter', function() {
                            toggleWidget.show();
                            angular.element(this).show().addClass('in');
                        });
                    setTimeout(function() {
                        if ( leftPosition + item.outerWidth() > $(window).width() ) {
                            leftPosition = 'auto';
                            //rightPosition = $(window).width() - ($(window).width() - customizerParent.outerWidth());
                            rightPosition = $(window).width() - (customizerParent.offset().left + customizerParent.outerWidth());
                            arrow.css({left: 'auto', right: 20});
                        }
                        else {
                            arrow.css({left: 20, right: 'auto'});
                        }
                        item.css({
                            'top': topPosition,
                            'left': leftPosition,
                            'right': rightPosition
                        });
                    }, 0);
                    
                });
                customizerParent.on('mouseleave', function(e) {
                    var idElement = angular.element(this).attr('data-customizer'),
                        el = angular.element('[data-customizer-serial="' + idElement + '"]');

                    if(!el.hasClass('focus')) {
                        toggleWidget.hide();
                        el.removeClass('in').hide();
                    }

                    setTimeout(function() {
                        if ( customizerParent.hasClass('custom-img') && !el.hasClass('in') ) {
                            customizerParent.removeClass('hover');
                        }
                    },100);
                });
            }
        };
    }])
    .directive('changefont', ['fontsFactory', function(fontsFactory) {
        return {
            restrict: 'E',
            controller: function($scope) {
                fontsFactory.getFonts().success(function(data) {
                    $scope.fonts = data;
                    $scope.googleFonts = $scope.fonts.family.googleFonts;
                    $scope.fontlinks = '';
                    for ( var key in $scope.googleFonts ) {
                        var family = key.replace(' ', '+');
                        $scope.fontlinks += "<link href='https://fonts.googleapis.com/css?family=" + family + ":400,700' rel='stylesheet' type='text/css'>"
                    }
                    $('changefont').html($scope.fontlinks);
                });
            }
        }
    }]);
