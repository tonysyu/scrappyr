/*jslint nomen: true*/
/*global _, angular*/

import _ from 'underscore';

/**
 * The controller for tags page.
 */
angular.module('scrappyr')
    .controller('tagsPageCtrl', function ($scope, scrapStore, tagStore) {
        'use strict';
        $scope.scraps = scrapStore.scraps;
        $scope.tags = tagStore.tags;

        $scope.checkbox = {enabled: true};

        // Dict-like object which maps tag text to selection state.
        $scope.tagSelections = {};
        // Array of tag text for ng-repeat.
        $scope.selectedTags = [];

        $scope.removeTag = function (tag) {
            tagStore.remove(tag);
        };

        $scope.$watchCollection('tagSelections', function () {
            var name,
                tagList = [];

            for (name in $scope.tagSelections) {
                if ($scope.tagSelections.hasOwnProperty(name)) {
                    if ($scope.tagSelections[name] === true) {
                        tagList.push(name);
                    }
                }
            }
            $scope.selectedTags = tagList;

        });
    })
    .filter('hasTagInList', function () {
        "use strict";

        function tagObjectsToStrings(tagObjects) {
            if (!tagObjects) {
                return [];
            }
            return tagObjects.map(function (tag) { return tag.text; });
        }

        function createTagFilter(tagList) {
            return function (scrap) {
                var tags = tagObjectsToStrings(scrap.tags);
                return _.intersection(tags, tagList).length > 0;
            }
        }

        return function (scraps, tagList) {
            var scrapHasTagInList = createTagFilter(tagList);
            return scraps.filter(scrapHasTagInList);
        };
    });
