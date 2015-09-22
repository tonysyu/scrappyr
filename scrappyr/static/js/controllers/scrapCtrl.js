/*global angular */
/*jslint nomen: true*/

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the scrapStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('scrappyr')
    .controller('ScrapCtrl', function ScrapCtrl($scope, $routeParams, store) {
        'use strict';

        function getEmptyScrap() {
            return {
                title: '',
                tags: []
            };
        }

        var scraps = $scope.scraps = store.scraps;

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

        $scope.editScrap = function (scrap) {
            $scope.editedScrap = scrap;
            // Clone the original scrap to restore it on demand.
            $scope.originalScrap = angular.extend({}, scrap);
        };

        $scope.saveEdits = function (scrap, event) {
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                // Scrap edits were reverted: Don't save.
                $scope.reverted = null;
                return;
            }

            scrap.title = scrap.title.trim();

            if (scrap.title === $scope.originalScrap.title) {
                $scope.editedScrap = null;
                return;
            }

            store[scrap.title ? 'put' : 'remove'](scrap)
                .then(function success() {}, function error() {
                    scrap.title = $scope.originalScrap.title;
                })
                .finally(function () {
                    $scope.editedScrap = null;
                });
        };

        $scope.revertEdits = function (scrap) {
            scraps.set(scrap.id, $scope.originalScrap);
            $scope.editedScrap = null;
            $scope.originalScrap = getEmptyScrap();
            $scope.reverted = true;
        };

        $scope.removeScrap = function (scrap) {
            store.remove(scrap);
        };

        $scope.saveScrap = function (scrap) {
            store.put(scrap);
        };

    });
