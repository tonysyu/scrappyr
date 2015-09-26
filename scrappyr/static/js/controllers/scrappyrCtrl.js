/*global angular */

/**
 * The main controller for the app.
 */

angular.module('scrappyr')
    .controller('ScrappyrCtrl', function ScrappyrCtrl($scope, $location) {
        'use strict';

        $scope.isActive = function (viewLocation) {
            var value = viewLocation === $location.path();
            return value;
        };
    });
