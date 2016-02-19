/*global angular, MathJax*/

/**
 * The main Scrappyr app module
 *
 * @type {angular.Module}
 */
var angular = require('angular');
require('angular-route');
require('angular-sanitize');
require('angular-ui-tree');
require('ng-tags-input');

angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'scrappyrUtils', 'ui.tree'])
    .config(function ($routeProvider) {
        'use strict';

        MathJax.Hub.Config({
            skipStartupTypeset: true
        });

        function resolveScrapStorage($http, scrapStorage) {
            if (scrapStorage.scraps.length === 0) {
                scrapStorage.get();
            }
            return scrapStorage;
        }

        function resolveTagStorage($http, tagStorage) {
            if (tagStorage.tags.length === 0) {
                tagStorage.get();
            }
            return tagStorage;
        }

        var scrapsConfig = {
                controller: 'scrapsPageCtrl',
                templateUrl: 'static/views/scraps.html',
                resolve: {store: resolveScrapStorage}
            },
            tagsConfig = {
                controller: 'tagsPageCtrl',
                templateUrl: 'static/views/tags.html',
                resolve: {
                    scrapStore: resolveScrapStorage,
                    tagStore: resolveTagStorage
                }
            };

        $routeProvider
            .when('/scraps', scrapsConfig)
            .when('/tags', tagsConfig)
            .otherwise({
                redirectTo: '/scraps'
            });
    });

require('./scrappyrUtils');
require('./controllers/scrappyrCtrl');
require('./controllers/scrapsPageCtrl');
require('./controllers/tagsPageCtrl');
require('./directives/mathjax');
require('./directives/scrapBasicView');
require('./directives/scrapDetailView');
require('./directives/scrapEscape');
require('./directives/scrapFocus');
require('./services/scrapStorage');
require('./services/tagStorage');
