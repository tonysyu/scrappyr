/*global angular*/

angular.module('scrappyr')
    .controller('scrapBasicViewCtrl', function ($scope, api) {
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
