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
                // FIXME: Add actual logic here.
                console.log(tag.id, tag.text);
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
