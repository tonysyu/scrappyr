import * as coreUI from '../../core-ui';


export function scrapDetailControllerFactory($scope, scrapStorage) {
    var ctrl = new coreUI.ScrapEditor(scrapStorage);
    // Watch changes in scrap *identity* and copy that as `originalScrap`.
    $scope.$watch('scrap', () => ctrl.updateOriginalScrap($scope.scrap));
    return ctrl;
}

scrapDetailControllerFactory.$inject = ['$scope', 'scrapStorage'];
