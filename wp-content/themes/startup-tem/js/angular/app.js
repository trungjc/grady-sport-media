'use strict';

// Declare app level module

angular.module('DMApp', [
    'DMApp.directives',
    'DMApp.controllers',
    'DMApp.services',
    'google-maps',
    'textAngular',
    'minicolors',
    'ui.slider'
    ]).config(['$interpolateProvider',
        function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    ]);