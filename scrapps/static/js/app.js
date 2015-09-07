/*global angular */

/**
 * The main Scrapps app module
 *
 * @type {angular.Module}
 */
angular.module('scrapps', ['ngRoute', 'ngSanitize'])
    .config(function ($routeProvider) {
        'use strict';

        var routeConfig = {
            controller: 'ScrapCtrl',
            templateUrl: 'static/views/main.html',
            resolve: {
                store: function (scrapStorage) {
                    return scrapStorage.then(function (module) {
                        // Fetch the scraps data in the background.
                        module.get();
                        return module;
                    });
                }
            }
        };

        $routeProvider
            .when('/', routeConfig)
            .otherwise({
                redirectTo: '/'
            });
    });
