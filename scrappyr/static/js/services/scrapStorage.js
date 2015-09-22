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

        function Map() {
            // Isolate data storage from methods.
            this.cache = {};
            this.length = 0;
        }

        Map.prototype.copy = function () {
            return angular.copy(this);
        };

        // Update from dictionary or Map.
        Map.prototype.update = function (cache) {
            if (cache instanceof Map) {
                cache = cache.cache;
            }
            angular.copy(cache, this.cache);
            this.length = Object.keys(this.cache).length;
        };

        Map.prototype.get = function (id) {
            return this.cache[id];
        };

        Map.prototype.set = function (id, value) {
            if (!this.cache.hasOwnProperty(id)) {
                this.length += 1;
            }
            this.cache[id] = value;
        };

        Map.prototype.remove = function (id) {
            if (this.cache.hasOwnProperty(id)) {
                this.length -= 1;
                delete this.cache[id];
            }
        };

        Map.prototype.all = function () {
            var id,
                list = [];

            for (id in this.cache) {
                if (this.cache.hasOwnProperty(id)) {
                    list.push(this.get(id));
                }
            }
            return list;
        };

        var store = {
            scraps: new Map(),
            tags: new Map(),

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
                $http.get('/api/tags')
                    .then(function (resp) {
                        store.tags.update(resp.data.tags);
                        console.log(store.tags);
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
