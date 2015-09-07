/*global angular */
/*jslint nomen:true*/

/**
 * Services that persists and retrieves scraps from localStorage or a backend
 * API if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('scrappyr')
    .factory('scrapStorage', function ($http, $injector) {
        'use strict';
        return $http.get('/api').then(function () {
            return $injector.get('api');
        });
    })

    .factory('api', function ($http) {
        'use strict';

        var store = {
            scraps: [],

            delete: function (scrap) {
                var originalScraps = store.scraps.slice(0);

                store.scraps.splice(store.scraps.indexOf(scrap), 1);

                return $http.delete('/api/scraps/' + scrap.id)
                    .then(function success() {
                        return store.scraps;
                    }, function error() {
                        angular.copy(originalScraps, store.scraps);
                        return originalScraps;
                    });
            },

            get: function () {
                return $http.get('/api/scraps')
                    .then(function (resp) {
                        angular.copy(resp.data.scraps, store.scraps);
                        return store.scraps;
                    });
            },

            insert: function (scrap) {
                var originalScraps = store.scraps.slice(0);

                return $http.post('/api/scraps', scrap)
                    .then(function success(resp) {
                        store.scraps.push(resp.data);
                        return store.scraps;
                    }, function error() {
                        angular.copy(originalScraps, store.scraps);
                        return store.scraps;
                    });
            },

            put: function (scrap) {
                var originalScraps = store.scraps.slice(0),
                    clientScrap = scrap,
                    i;

                return $http.put('/api/scraps/' + scrap.id, scrap)
                    .then(function success(resp) {
                        for (i = 0; i < store.scraps.length; i += 1) {
                            var scrap = store.scraps[i];
                            if (scrap.id === resp.data.id) {
                                break;
                            }
                        }
                        store.scraps[i] = resp.data;
                        return store.scraps;
                    }, function error() {
                        angular.copy(originalScraps, store.scraps);
                        return originalScraps;
                    });
            }
        };

        return store;
    });
