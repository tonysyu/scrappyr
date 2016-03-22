import 'angular';
import ScrapDetailController from '../../core-ui/scrap-detail-controller';


// Angular factory for ScrapDetailViewController.
export function scrapDetailControllerFactory($scope, scrapStorage) {
    var ctrl = new ScrapDetailController(scrapStorage);
    // Watch changes in scrap *identity* and copy that as `originalScrap`.
    $scope.$watch('scrap', () => ctrl.updateOriginalScrap($scope.scrap));
    return ctrl;
}

scrapDetailControllerFactory.$inject = ['$scope', 'scrapStorage'];
