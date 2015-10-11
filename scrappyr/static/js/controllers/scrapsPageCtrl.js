/*global angular */

/**
 * The controller for main scraps page.
 */
angular.module('scrappyr')
    .controller('scrapsPageCtrl', function ($scope, $routeParams, store) {
        'use strict';

        function getEmptyScrap() {
            return {
                title: '',
                tags: []
            };
        }

        $scope.scraps = store.scraps;

        $scope.newScrap = getEmptyScrap();
        $scope.selectedScrap = null;

        $scope.addScrap = function () {
            $scope.newScrap.title =  $scope.newScrap.title.trim();

            if (!$scope.newScrap.title) {
                return;
            }

            $scope.saving = true;
            store.insert($scope.newScrap)
                .then(function success() {
                    $scope.newScrap = getEmptyScrap();
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.editScrap = function (scrap) {
            // FIXME: Remove isEditing?
            $scope.isEditing = true;
            $scope.selectedScrap = scrap;
        };

    });
