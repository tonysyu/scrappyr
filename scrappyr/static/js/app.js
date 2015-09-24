/*global angular */

/**
 * The main Scrappyr app module
 *
 * @type {angular.Module}
 */
angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput'])
    .config(function ($routeProvider) {
        'use strict';

        function resolveScrapStorage(scrapStorage) {
            return scrapStorage.then(function (module) {
                // Fetch the scraps data in the background.
                module.get();
                return module;
            });
        }

        var scrapsConfig = {
                controller: 'ScrapsCtrl',
                templateUrl: 'static/views/scraps.html',
                resolve: {store: resolveScrapStorage}
            },
            tagsConfig = {
                controller: 'tagsCtrl',
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
