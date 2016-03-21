/*global MathJax*/

/**
 * The main Scrappyr app module
 */
import 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-ui-tree';
import 'ng-tags-input';

import mathjax from './directives/mathjax';
import scrapEscape from './directives/scrapEscape';
import scrapFocusFactory from './directives/scrapFocus';
import tagStorageFactory from './services/tagStorage';
import scrapStorageFactory from './services/scrapStorage';
import {scrapBasicViewFactory} from './scrapBasicView/directive';
import {scrapDetailViewFactory} from './scrapDetailView/directive';

import scrappyrControllerFactory from './controllers/scrappyrCtrl';
import scrapsPageControllerFactory from './scrapsPage/controller';
import tagsPageControllerFactory from './tagsPage/controller';
import scrapHasTagInListFilterFactory from './tagsPage/scrapHasTagInList';


angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'ui.tree'])
    .controller('ScrappyrCtrl', scrappyrControllerFactory)
    .controller('scrapsPageCtrl', scrapsPageControllerFactory)
    .controller('tagsPageCtrl', tagsPageControllerFactory)
    .directive('mathjax', mathjax)
    .directive('scrapBasicView', scrapBasicViewFactory)
    .directive('scrapDetailView', scrapDetailViewFactory)
    .directive('scrapEscape', scrapEscape)
    .directive('scrapFocus', scrapFocusFactory)
    .factory('scrapStorage', scrapStorageFactory)
    .factory('tagStorage', tagStorageFactory)
    .filter('scrapHasTagInList', scrapHasTagInListFilterFactory)
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

        $routeProvider
            .when('/scraps', {
                controller: 'scrapsPageCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'static/src/scrapsPage/index.html',
                resolve: {store: resolveScrapStorage}
            })
            .when('/tags', {
                controller: 'tagsPageCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'static/src/tagsPage/index.html',
                resolve: {
                    scrapStore: resolveScrapStorage,
                    tagStore: resolveTagStorage
                }
            })
            .otherwise({
                redirectTo: '/scraps'
            });
    });


// Export controllers for testing.
import {ScrapDetailViewController} from './scrapDetailView/controller';
export {ScrapDetailViewController};
import {ScrapsPageController} from './scrapsPage/controller';
export {ScrapsPageController};
