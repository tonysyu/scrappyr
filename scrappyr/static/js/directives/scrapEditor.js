/*global angular*/

angular.module('scrappyr')
    .controller('scrapEditorCtrl', function ($scope, api) {
        "use strict";

        $scope.originalScrap = null;

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

        $scope.editScrap = function (scrap) {
            $scope.isEditing = true;
        };

        $scope.saveEdits = function (scrap) {
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
                    $scope.isEditing = false;
                });
        };

        $scope.revertEdits = function (scrap) {
            if (angular.isUndefined(scrap)) {
                return;
            }
            revertToOriginalScrap(scrap);
            $scope.isEditing = false;
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
