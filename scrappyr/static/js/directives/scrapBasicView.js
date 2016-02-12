/*global angular*/

angular.module('scrappyr')
    .controller('scrapBasicViewCtrl', function (scrapStorage) {
        "use strict";

        function getEmptyScrap() {
            return {
                title: '',
                tags: []
            };
        }

        this.removeScrap = function (scrap) {
            scrapStorage.remove(scrap);
        };

    })
    .directive('scrapBasicView', function () {
        "use strict";

        return {
            controller: 'scrapBasicViewCtrl',
            controllerAs: 'ctrl',
            templateUrl: '/static/templates/scrap-basic-view.html',
            scope: {
                scrap: '='
            }
        };
    });
