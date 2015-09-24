/*global angular */

/**
 * The controller for tags page.
 */

angular.module('scrappyr')
    .controller('tagsCtrl', function TagsCtrl($scope, store) {
        'use strict';
        $scope.scraps = store.scraps;
        $scope.tags = store.tags;
        $scope.scrapsList = [];

        $scope.$watch('scraps.length', function () {
            $scope.scrapsList = $scope.scraps.all();
        });
    });
