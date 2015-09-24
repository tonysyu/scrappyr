/*global angular */

angular.module('scrappyr')
    .directive('scrapsList', function () {
        "use strict";

        return {
            scope: {
                scraps: '='
            },
            templateUrl: '/static/templates/scraps-list.html'
        };
    });
