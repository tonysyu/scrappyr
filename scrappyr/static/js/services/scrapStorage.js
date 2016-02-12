/*global angular */
/*jslint nomen:true*/

/**
 * Services that persists and retrieves scraps from the backend API.
 */
angular.module('scrappyr')
    .factory('scrapStorage', function ($http, scrappyrUtils) {
        'use strict';

        var store = {
            scraps: scrappyrUtils.createMappedArray(),

            remove: function (scrap) {
                var originalScraps = store.scraps.copy();

                store.scraps.remove(scrap.id);

                return $http.delete('/api/scraps/' + scrap.id)
                    .then(function success() {
                        return store.scraps;
                    }, function error() {
                        store.scraps.update(originalScraps);
                        return store.scraps;
                    });
            },

            get: function () {
                $http.get('/api/scraps')
                    .then(function (resp) {
                        store.scraps.update(resp.data.scraps);
                    });
            },

            insert: function (scrap) {
                var originalScraps = store.scraps.copy();

                return $http.post('/api/scraps', scrap)
                    .then(function success(resp) {

                        store.scraps.set(resp.data.id, resp.data);
                        return store.scraps;
                    }, function error() {
                        store.scraps.update(originalScraps);
                        return store.scraps;
                    });
            },

            put: function (scrap) {
                var originalScrap = angular.copy(scrap);

                return $http.put('/api/scraps/' + scrap.id, scrap)
                    .then(function success(resp) {
                        angular.extend(scrap, resp.data);
                    }, function error() {
                        angular.extend(scrap, originalScrap);
                    });
            }
        };

        return store;
    });
