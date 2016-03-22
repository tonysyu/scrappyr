import _ from 'underscore';

// createMappedArray
//
// Create an array where elements can be accessed by id.
// The returned array has `get`, `set`, and `remove` methods for
// quickly accessing/modifying elements by id.
//
// Using an array model (as opposed to deriving an array)
// is preferred for uses of ng-repeat, but access-by-id is fast
// and convenient for modifications.
export function createMappedArray() {
    var array = [],
        indexMap = {};  // Map from element ID to array index.

    function rebuildIndexMapBruteForce() {
        var i;
        indexMap = {};

        for (i = 0; i < array.length; i += 1) {
            indexMap[array[i].id] = i;
        }
    }

    function rebuildIndexMap(start, length, deletedItems, addedItems) {
        var i, newID,
            shiftCount = addedItems.length - (length || 0);

        deletedItems.forEach(function (item) {delete indexMap[item.id]});

        // Shift the index for all *later* array elements.
        for (i = start; i < array.length; i += 1) {
            // shiftCount is negative when only deleting elements.
            indexMap[array[i].id] += shiftCount;
        }

        // Insert new elements into indexMap.
        for (i = 0; i < addedItems.length; i += 1) {
            newID = addedItems[i].id;
            indexMap[newID] = start + i;
        }
    }

    array.copy = function () {
        return _.clone(this);
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
            // If ID is new, add it as the last item in the array.
            indexMap[value.id] = this.length;
        }
        this[indexMap[value.id]] = value;
    };

    array.remove = function (id) {
        var i, index = indexMap[id];
        array.splice(index, 1);
    };

    array.splice = function (start, length) {
        var deletedItems, addedItems;

        addedItems = Array.prototype.slice.call(arguments, 2);
        deletedItems = Array.prototype.splice.apply(this, arguments);
        rebuildIndexMap(start, length, deletedItems, addedItems);

        return deletedItems;
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
}
