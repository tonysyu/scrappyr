import TagsPageController from '../../core-ui/tags-page-controller';

function tagsPageControllerFactory($scope, scrapStore, tagStore) {
    var ctrl = new TagsPageController(scrapStore, tagStore);
    $scope.$watchCollection(() => ctrl.tagSelections,
                            ctrl.updateTagSelections.bind(ctrl));
    return ctrl;
}
tagsPageControllerFactory.$inject = ['$scope', 'scrapStore', 'tagStore']
export default tagsPageControllerFactory;
