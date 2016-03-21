import _ from 'underscore';

/**
 * Return filter function that returns scraps whose tags intersect a tags list.
 */
export default function scrapHasTagInListFilterFactory() {
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
}
