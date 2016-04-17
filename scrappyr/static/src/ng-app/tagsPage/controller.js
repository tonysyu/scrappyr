import * as coreUI from '../../core-ui';

function tagsPageControllerFactory($scope, scrapStore, tagStore) {
    var ctrl = new coreUI.TagsPageController(scrapStore, tagStore);
    $scope.$watchCollection(() => ctrl.tagSelections,
                            ctrl.updateTagSelections.bind(ctrl));
    return ctrl;
}
tagsPageControllerFactory.$inject = ['$scope', 'scrapStore', 'tagStore']
export default tagsPageControllerFactory;
