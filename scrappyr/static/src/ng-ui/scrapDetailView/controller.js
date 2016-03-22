import 'angular';
import ScrapEditor from '../../core-ui/scrap-editor';


export function scrapDetailControllerFactory($scope, scrapStorage) {
    var ctrl = new ScrapEditor(scrapStorage);
    // Watch changes in scrap *identity* and copy that as `originalScrap`.
    $scope.$watch('scrap', () => ctrl.updateOriginalScrap($scope.scrap));
    return ctrl;
}

scrapDetailControllerFactory.$inject = ['$scope', 'scrapStorage'];
