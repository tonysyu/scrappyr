/*global angular*/

/**
 * The controller for tags page.
 */

class TagsPageController {
    constructor($scope, scrapStore, tagStore) {
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
    }
}


function tagsPageControllerFactory($scope, scrapStore, tagStore) {
    new TagsPageController($scope, scrapStore, tagStore);
}
tagsPageControllerFactory.$inject = ['$scope', 'scrapStore', 'tagStore']
export default tagsPageControllerFactory;
