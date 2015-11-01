/*global angular */

angular.module('scrappyrUtils', [])
    .factory('scrappyrUtils', function ($http) {
        'use strict';

        var utils = {};

        // createMappedArray
        //
        // Create an array where elements can be accessed by id.
        // The returned array has `get`, `set`, and `remove` methods for
        // quickly accessing/modifying elements by id.
        //
        // Using an array model (as opposed to deriving an array)
        // is preferred for uses of ng-repeat, but access-by-id is fast
        // and convenient for modifications.
        utils.createMappedArray = function createMappedArray() {
            var array = [],
                indexMap = {};  // Map from element ID to array index.

            function rebuildIndexMap() {
                var i;
                indexMap = {};

                for (i = 0; i < array.length; i += 1) {
                    indexMap[array[i].id] -= 1;
                }

            }

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
                array.splice(index, 1);
            };

            array.splice = function (start, length) {
                var i,
                    newItems = Array.prototype.slice.call(arguments, 2),
                    shiftCount = newItems.length - (length || 0);

                // Shift the index for all *later* array elements.
                for (i = start; i < this.length; i += 1) {
                    indexMap[this[i].id] += shiftCount;
                }
                // Insert new elements into indexMap.
                for (i = 0; i < newItems.length; i += 1) {
                    indexMap[newItems[i].id] = start + i;
                }
                return Array.prototype.splice.apply(this, arguments);
            };

            // TODO: Override native methods to ensure integrity of `indexMap`.

            array.concat = function () { throw "`concat` not implemented"; };
            array.pop = function () { throw "`pop` not implemented"; };
            array.push = function () { throw "`push` not implemented"; };
            array.reverse = function () { throw "`reverse` not implemented"; };
            array.sort = function () { throw "`sort` not implemented"; };
            array.shift = function () { throw "`shift` not implemented"; };
            array.unshift = function () { throw "`unshift` not implemented"; };

            return array;
        };

        return utils;
    });
