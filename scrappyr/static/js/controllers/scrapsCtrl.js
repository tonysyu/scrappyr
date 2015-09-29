/*global angular */
/*jslint nomen: true*/

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the scrapStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('scrappyr')
    .controller('ScrapsCtrl', function ScrapsCtrl($scope, $routeParams, store) {
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
