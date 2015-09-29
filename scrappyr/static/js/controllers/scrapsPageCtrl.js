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

        $scope.$watch('scraps.length', function () {
            $scope.scrapsList = $scope.scraps.all();
        });

        $scope.onTagChanged = function (scrap) {
            store.put(scrap);
        };

        $scope.newScrap = getEmptyScrap();
        $scope.editedScrap = null;

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

    });
