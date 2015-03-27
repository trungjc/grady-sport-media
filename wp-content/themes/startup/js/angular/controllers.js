'use strict';

/* Controllers */

angular.module('DMApp.controllers', ['angularFileUpload'])
    .controller('DMCtrl', ['$scope', 'layoutModel',
        function($scope, layoutModel) {
            $scope.save = function() {
                layoutModel.save().success(function() {
                    $scope.$broadcast('scope-was-saved');
                    for(var i in $scope.arrayChanges) {
                        $scope.arrayChanges[i].changed = false;
                    }
                });
            };
            $scope.arrayChanges = [];
            $scope.shownCustomizer = [];

            $scope.$on('scope-was-loaded', function(event, data) {
                var templates = angular.element('[component-id]', '#templates'),
                    templatesArray = [],
                    position = 0;
                angular.forEach(templates, function(value, key){
                    templatesArray.push(angular.element(value).attr('component-id'));
                });
                for(var i = 0; i < templatesArray.length; i++) {
                    if(templatesArray[i] == data.id) {
                        position = i;
                        break;
                    }
                }
                $scope.arrayChanges.splice(position, 0, data);
            });

            $scope.reorderBlocks = function() {
                var templates = angular.element('[component-id]', '#templates'),
                    templatesArray = [];

                angular.forEach(templates, function(value, key){
                    templatesArray.push(angular.element(value).attr('component-id'));
                });

                function sortFunction(a, b) {
                    var indexA = templatesArray.indexOf(a['id']);
                    var indexB = templatesArray.indexOf(b['id']);
                    if(indexA < indexB) {
                        return -1;
                    }else if(indexA > indexB) {
                        return 1;
                    }else{
                        return 0;       
                    }
                }
                $scope.arrayChanges.sort(sortFunction);
            };

            $scope.$on('scope-was-changed', function(event, data) {
                for(var i = 0; i < $scope.arrayChanges.length; i++) {
                    if($scope.arrayChanges[i].id === data.id) {
                        $scope.arrayChanges[i].changed = data.changed;
                    }
                }
            });

            $scope.$on('scope-was-removed', function(event, data) {
                for(var i = 0; i < $scope.arrayChanges.length; i++) {
                    if($scope.arrayChanges[i].id === data) {
                        $scope.arrayChanges.splice(i, 1);
                    }
                }
            });

            $scope.$on('add-customizer', function(event, data) {
                $scope.shownCustomizer.push(data);
                $scope.$apply();
            });

            $scope.$on('remove-customizer', function(event, data) {
                $scope.shownCustomizer.pop();
                $scope.$apply();
            });

            $scope.$watchCollection('shownCustomizer', function(newNames, oldNames) {
                if(newNames.length) {
                    angular.element('[data-customizer-serial=' + newNames[newNames.length-1] + ']').css({
                        'top': 430,
                        'left': 1960
                    }).show().addClass('in');
                }
                if(oldNames.length) {
                    angular.element('[data-customizer-serial=' + oldNames[oldNames.length-1] + ']').removeClass('in').hide();
                }
            });
        }
    ])
    .controller('FileUploadCtrl', ['$scope', '$element', '$upload',
        function($scope, $element, $upload) {
            $scope.onFileSelect = function($files, imageWidth) {
                //$files: an array of files selected, each file has name, size, and type.
                var count = 0;
                $scope.dmStoreMediaData.dataFiles = [];

                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    $scope.upload = $upload.upload({
                        url: themeUri + '/async-upload.php', //upload.php script, node.js route, or servlet url
                        // method: 'POST',
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {
                            max_width: imageWidth
                        },
                        file: file, // or list of files: $files for html5 only
                        /* set the file formData name ('Content-Desposition'). Default is 'file' */
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                        //formDataAppender: function(formData, key, val){}
                    }).progress(function(evt) {
                        //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        var extArr = config.file.type.split('/'),
                            format = extArr[extArr.length - 1];

                        $scope.dmStoreMediaData.dataFiles.push({
                            dataUrl: data.result,
                            format: format
                        });

                        count++;

                        if(count === $files.length) {
                            $scope.dmStoreMediaData.uploaded = true;
                        };

                        if(data.error) {
                            alert("Error occurred: (" + data.error.code + ") " + data.error.message);
                        };
                    }).error(function(data, status, headers, config) {
                        alert("Error occurred: " + (status == 413 ? "Your HTTP server does not allow to upload large files." : "HTTP Error number" + status + "."));
                    });
                    //.error(...)
                    //.then(success, error, progress); 
                    //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
                }
                /* alternative way of uploading, send the file binary with the file's content-type.
               Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
               It could also be used to monitor the progress of a normal http post/put request with large data*/
                // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
            };
        }
    ]);
