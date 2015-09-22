/*global angular */

/**
 * The controller for tags page.
 */

angular.module('scrappyr')
    .controller('tagsCtrl', function ScrapCtrl($scope, store) {
        'use strict';
        var tags = $scope.tags = store.tags;
    });
