/*global MathJax*/

/**
 * The main Scrappyr app module
 */
import 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-ui-tree';
import 'ng-tags-input';

import * as directives from './directives';
import * as services from './services';
import {scrapBasicViewFactory} from './scrapBasicView/directive';
import {scrapDetailViewFactory} from './scrapDetailView/directive';

import scrappyrControllerFactory from './indexController';
import scrapsPageControllerFactory from './scrapsPage/controller';
import tagsPageControllerFactory from './tagsPage/controller';
import scrapHasTagInListFilterFactory from './tagsPage/scrapHasTagInList';


angular.module('scrappyr', ['ngRoute', 'ngSanitize', 'ngTagsInput', 'ui.tree'])
    .controller('ScrappyrCtrl', scrappyrControllerFactory)
    .controller('scrapsPageCtrl', scrapsPageControllerFactory)
    .controller('tagsPageCtrl', tagsPageControllerFactory)
    .directive('mathjax', directives.mathjax)
    .directive('scrapBasicView', scrapBasicViewFactory)
    .directive('scrapDetailView', scrapDetailViewFactory)
    .directive('scrapEscape', directives.scrapEscape)
    .directive('scrapFocus', directives.scrapFocusFactory)
    .factory('scrapStorage', services.scrapStorageFactory)
    .factory('tagStorage', services.tagStorageFactory)
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
                templateUrl: 'static/src/ng-ui/scrapsPage/index.html',
                resolve: {store: resolveScrapStorage}
            })
            .when('/tags', {
                controller: 'tagsPageCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'static/src/ng-ui/tagsPage/index.html',
                resolve: {
                    scrapStore: resolveScrapStorage,
                    tagStore: resolveTagStorage
                }
            })
            .otherwise({
                redirectTo: '/scraps'
            });
    });

