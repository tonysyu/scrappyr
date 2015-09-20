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

        function ScrapStore() {
            // Isolate data storage from methods.
            this.cache = {};
            this.length = 0;
        }

        ScrapStore.prototype.copy = function () {
            return angular.copy(this);
        };

        ScrapStore.prototype.update = function (scrapsCache) {
            if (scrapsCache instanceof ScrapStore) {
                scrapsCache = scrapsCache.cache;
            }
            angular.copy(scrapsCache, this.cache);
            this.length = Object.keys(this.cache).length;
        };

        ScrapStore.prototype.get = function (id) {
            return this.cache[id];
        };

        ScrapStore.prototype.set = function (id, value) {
            if (!this.cache.hasOwnProperty(id)) {
                this.length += 1;
            }
            this.cache[id] = value;
        };

        ScrapStore.prototype.remove = function (id) {
            if (this.cache.hasOwnProperty(id)) {
                this.length -= 1;
                delete this.cache[id];
            }
        };

        ScrapStore.prototype.all = function () {
            var id,
                scrapList = [];

            for (id in this.cache) {
                if (this.cache.hasOwnProperty(id)) {
                    scrapList.push(this.get(id));
                }
            }
            return scrapList;
        };

        var store = {
            scraps: new ScrapStore(),

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
                return $http.get('/api/scraps')
                    .then(function (resp) {
                        store.scraps.update(resp.data.scraps);
                        return store.scraps;
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
                var originalScraps = store.scraps.copy(),
                    clientScrap = scrap,
                    i;

                return $http.put('/api/scraps/' + scrap.id, scrap)
                    .then(function success(resp) {
                        store.scraps.set(resp.data.id, resp.data);
                        return store.scraps;
                    }, function error() {
                        store.scraps.update(originalScraps);
                        return store.scraps;
                    });
            }
        };

        return store;
    });
