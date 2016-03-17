/*global angular*/

angular.module('scrappyr')
    .controller('scrapDetailViewCtrl', function ($scope, scrapStorage) {
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

        return {
            isEditing: false,
            // TODO: Pass just the ID and tag list and have the backend update
            // just the tags.
            onTagChanged: function (scrap) {
                scrapStorage.put(scrap);
            },

            editScrap: function (scrap) {
                this.isEditing = true;
            },

            saveEdits: function (scrap) {
                scrap.title = scrap.title.trim();
                if (scrap.title === $scope.originalScrap.title) {
                    this.isEditing = false;
                    return;
                }

                scrapStorage[scrap.title ? 'put' : 'remove'](scrap)
                    .then(
                        () => updateOriginalScrap(scrap),
                        () => revertToOriginalScrap(scrap)
                    )
                    .finally(() => { this.isEditing = false; });
            },

            revertEdits: function (scrap) {
                if (angular.isUndefined(scrap)) {
                    return;
                }
                revertToOriginalScrap(scrap);
                this.isEditing = false;
            },
        };
    })
    .directive('scrapDetailView', function () {
        "use strict";

        return {
            controller: 'scrapDetailViewCtrl',
            controllerAs: 'ctrl',
            templateUrl: '/static/templates/scrap-detail-view.html',
            scope: {
                scrap: '='
            }
        };
    });
