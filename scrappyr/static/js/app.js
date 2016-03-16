/*global angular, MathJax*/

/**
 * The main Scrappyr app module
 *
 * @type {angular.Module}
 */
import 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-ui-tree';
import 'ng-tags-input';

import ScrappyrController from './controllers/scrappyrCtrl';
import ScrapsPageController from './controllers/scrapsPageCtrl';
import mathjax from './directives/mathjax';
import scrapEscape from './directives/scrapEscape';
import TagStorage from './services/tagStorage';
import ScrapStorage from './services/scrapStorage';


angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'ui.tree'])
    .controller('ScrappyrCtrl', ScrappyrController)
    .controller('scrapsPageCtrl', ScrapsPageController)
    .directive('mathjax', mathjax)
    .directive('scrapEscape', scrapEscape)
    .factory('scrapStorage', ScrapStorage.scrapStorageFactory)
    .factory('tagStorage', TagStorage.tagStorageFactory)
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


require('./controllers/tagsPageCtrl');
require('./directives/scrapBasicView');
require('./directives/scrapDetailView');
require('./directives/scrapFocus');
require('./services/scrapStorage');
