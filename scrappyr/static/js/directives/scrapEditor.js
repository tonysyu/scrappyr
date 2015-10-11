/*global angular*/

angular.module('scrappyr')
    .controller('scrapEditorCtrl', function ($scope, api) {
        "use strict";

        $scope.originalScrap = null;
        $scope.reverted = false;

        function revertToOriginalScrap(scrap) {
            angular.copy($scope.originalScrap, scrap);
        }

        function updateOriginalScrap(scrap) {
            $scope.originalScrap = angular.extend({}, scrap);
        }

        // Watch changes in scrap *identity* and copy that as `originalScrap`.
        $scope.$watch('scrap', function () {
            updateOriginalScrap($scope.scrap);
        });

        // TODO: Pass just the ID and tag list and have the backend update just
        // the tags.
        $scope.onTagChanged = function (scrap) {
            api.put(scrap);
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
                $scope.reverted = false;
                return;
            }

            scrap.title = scrap.title.trim();

            if (scrap.title === $scope.originalScrap.title) {
                $scope.isEditing = false;
                return;
            }

            api[scrap.title ? 'put' : 'remove'](scrap)
                .then(
                    function success() {
                        updateOriginalScrap(scrap);
                    },
                    function error() {
                        revertToOriginalScrap(scrap);
                    }
                )
                .finally(function () {
                    $scope.isEditing = true;
                });
        };

        $scope.revertEdits = function (scrap) {
            if (angular.isUndefined(scrap)) {
                return;
            }
            revertToOriginalScrap(scrap);
            $scope.isEditing = false;
            $scope.reverted = true;
        };
    })
    .directive('scrapEditor', function () {
        "use strict";

        return {
            controller: 'scrapEditorCtrl',
            templateUrl: '/static/templates/scrap-editor.html',
            scope: {
                scrap: '='
            }
        };
    });
