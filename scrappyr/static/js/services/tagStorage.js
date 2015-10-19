/*global angular */
/*jslint nomen:true*/

/**
 * Services that persists and retrieves tags from the backend API.
 */
angular.module('scrappyr')
    .factory('tagStorage', function ($http, scrappyrUtils) {
        'use strict';

        var store = {
            tags: scrappyrUtils.createMappedArray(),

            remove: function (tag) {
                var originalTags = store.tags.copy();
                store.tags.remove(tag.id);

                return $http.delete('/api/tags/' + tag.id)
                    .then(function success() {
                        return store.tags;
                    }, function error() {
                        store.tags.update(originalTags);
                        return store.tags;
                    });
            },

            get: function () {
                $http.get('/api/tags')
                    .then(function (resp) {
                        store.tags.update(resp.data.tags);
                    });
            }
        };

        return store;
    });
