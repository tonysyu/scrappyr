/*global angular */

/**
 * The main controller for the app.
 */

angular.module('scrappyr')
    .controller('ScrappyrCtrl', function ScrapCtrl($scope, $location) {
        'use strict';

        $scope.isActive = function (viewLocation) {
            var value = viewLocation === $location.path();
            console.log(value, viewLocation, $location.path());
            return value;
        };
    });
