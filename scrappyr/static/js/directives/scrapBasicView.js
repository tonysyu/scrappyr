/*global angular*/

angular.module('scrappyr')
    .controller('scrapBasicViewCtrl', function ($scope, scrapStorage) {
        "use strict";

        function getEmptyScrap() {
            return {
                title: '',
                tags: []
            };
        }

        $scope.onTagChanged = function (scrap) {
            scrapStorage.put(scrap);
        };

        $scope.removeScrap = function (scrap) {
            scrapStorage.remove(scrap);
        };

    })
    .directive('scrapBasicView', function () {
        "use strict";

        return {
            controller: 'scrapBasicViewCtrl',
            templateUrl: '/static/templates/scrap-basic-view.html',
            scope: {
                scrap: '='
            }
        };
    });
