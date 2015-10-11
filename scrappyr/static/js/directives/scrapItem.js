/*global angular*/

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

    })
    .directive('scrapItem', function () {
        "use strict";

        return {
            controller: 'scrapItemCtrl',
            templateUrl: '/static/templates/scrap-item.html',
            scope: {
                scrap: '='
            }
        };
    });
