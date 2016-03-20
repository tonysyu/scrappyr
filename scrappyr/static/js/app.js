/*global MathJax*/

/**
 * The main Scrappyr app module
 */
import 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-ui-tree';
import 'ng-tags-input';

import ScrappyrController from './controllers/scrappyrCtrl';
import scrapsPageControllerFactory from './controllers/scrapsPageCtrl';
import tagsPageControllerFactory from './tagsPage/tagsPageCtrl';
import mathjax from './directives/mathjax';
import scrapEscape from './directives/scrapEscape';
import scrapFocusFactory from './directives/scrapFocus';
import {scrapBasicViewFactory} from './directives/scrapBasicView';
import {scrapDetailViewFactory} from './scrapDetailView/directive';
import tagStorageFactory from './services/tagStorage';
import scrapStorageFactory from './services/scrapStorage';
import scrapHasTagInListFilterFactory from './tagsPage/scrapHasTagInList';


angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'ui.tree'])
    .controller('ScrappyrCtrl', ScrappyrController)
    .controller('scrapsPageCtrl', scrapsPageControllerFactory)
    .controller('tagsPageCtrl', tagsPageControllerFactory)
    .directive('mathjax', mathjax)
    .directive('scrapBasicView', scrapBasicViewFactory)
    .directive('scrapDetailView', scrapDetailViewFactory)
    .directive('scrapEscape', scrapEscape)
    .directive('scrapFocus', scrapFocusFactory)
    .factory('scrapStorage', scrapStorageFactory)
    .factory('tagStorage', tagStorageFactory)
    .filter('hasTagInList', scrapHasTagInListFilterFactory)
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


// Export controller for testing.
import {ScrapDetailViewController} from './scrapDetailView/controller';
export {ScrapDetailViewController};
