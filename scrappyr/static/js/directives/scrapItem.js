/*global angular */

angular.module('scrappyr')
    .controller('scrapItemCtrl', function ($scope, api) {
        "use strict";

        function getEmptyScrap() {
            return {
                title: '',
                tags: []
            };
        }

        $scope.onTagChanged = function (scrap) {
            api.put(scrap);
        };

        $scope.removeScrap = function (scrap) {
            api.remove(scrap);
        };

        $scope.editScrap = function (scrap) {
            $scope.isEditing = true;
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
                $scope.isEditing = false;
                return;
            }

            api[scrap.title ? 'put' : 'remove'](scrap)
                .then(function success() {}, function error() {
                    scrap.title = $scope.originalScrap.title;
                })
                .finally(function () {
                    $scope.isEditing = false;
                });
        };

        $scope.revertEdits = function (scrap) {
            api.scraps.set(scrap.id, $scope.originalScrap);
            $scope.isEditing = false;
            $scope.originalScrap = getEmptyScrap();
            $scope.reverted = true;
        };
    })
    .directive('scrapItem', function () {
        "use strict";

        return {
            controller: 'scrapItemCtrl',
            scope: {
                scrap: '='
            },
            templateUrl: '/static/templates/scrap-item.html'
        };
    });
