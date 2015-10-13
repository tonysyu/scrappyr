/*global angular, MathJax*/

/**
 * The main Scrappyr app module
 *
 * @type {angular.Module}
 */
angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'scrappyrUtils'])
    .config(function ($routeProvider) {
        'use strict';

        MathJax.Hub.Config({
            skipStartupTypeset: true
        });

        function resolveScrapStorage($http, scrapStorage) {
            scrapStorage.get();
            return scrapStorage;
        }

        var scrapsConfig = {
                controller: 'scrapsPageCtrl',
                templateUrl: 'static/views/scraps.html',
                resolve: {store: resolveScrapStorage}
            },
            tagsConfig = {
                controller: 'tagsPageCtrl',
                templateUrl: 'static/views/tags.html',
                resolve: {store: resolveScrapStorage}
            };

        $routeProvider
            .when('/scraps', scrapsConfig)
            .when('/tags', tagsConfig)
            .otherwise({
                redirectTo: '/scraps'
            });
    });
