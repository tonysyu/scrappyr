/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngSanitize'])
    .config(function ($routeProvider) {
        'use strict';

        var routeConfig = {
            controller: 'TodoCtrl',
            templateUrl: 'static/views/main.html',
            resolve: {
                store: function (todoStorage) {
                    return todoStorage.then(function (module) {
                        // Fetch the todo records in the background.
                        module.get();
                        return module;
                    });
                }
            }
        };

        $routeProvider
            .when('/', routeConfig)
            .when('/:status', routeConfig)
            .otherwise({
                redirectTo: '/'
            });
    });
