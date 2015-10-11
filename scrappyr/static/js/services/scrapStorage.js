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

        // createMappedArray
        //
        // Create an array where elements can be accessed by id.
        // The returned array has `get`, `set`, and `remove` methods for
        // quickly accessing/modifying elements by id.
        //
        // Using an array model (as opposed to deriving an array)
        // is preferred for uses of ng-repeat, but access-by-id is fast
        // and convenient for modifications.
        function createMappedArray() {
            var array = [],
                indexMap = {};  // Map from element ID to array index.

            array.copy = function () {
                return angular.copy(this);
            };

            // Update with values from another array.
            // Note that the order of the new array is ignored.
            array.update = function (other) {
                var i, element;
                for (i = 0; i < other.length; i += 1) {
                    element = other[i];
                    this.set(element.id, element);
                }
            };

            array.get = function (id) {
                return this[indexMap[id]];
            };

            array.set = function (id, value) {
                if (!indexMap.hasOwnProperty(value.id)) {
                    indexMap[value.id] = this.length;
                }
                this[indexMap[value.id]] = value;
            };

            array.remove = function (id) {
                var i, index = indexMap[id];

                Array.prototype.splice.call(this, index, 1);

                for (i = index; i < this.length; i += 1) {
                    indexMap[this[i].id] -= 1;
                }

            };

            // TODO: Override native methods to ensure integrity of `indexMap`.

            array.concat = function () { throw "`concat` not implemented"; };
            array.pop = function () { throw "`pop` not implemented"; };
            array.push = function () { throw "`push` not implemented"; };
            array.reverse = function () { throw "`reverse` not implemented"; };
            array.sort = function () { throw "`sort` not implemented"; };
            array.splice = function () { throw "`splice` not implemented"; };
            array.shift = function () { throw "`shift` not implemented"; };
            array.unshift = function () { throw "`unshift` not implemented"; };

            return array;
        }

        var store = {
            scraps: createMappedArray(),
            tags: createMappedArray(),

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
                        angular.extend(scrap, resp.data);
                        return store.scraps;
                    }, function error() {
                        // FIXME: Update only the element that was changed?
                        store.scraps.update(originalScraps);
                        return store.scraps;
                    });
            }
        };

        return store;
    });
