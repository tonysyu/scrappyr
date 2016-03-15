/*global angular */

/**
 * The controller for main scraps page.
 */


class ScrapsPageController {
    constructor($scope, $routeParams, store) {

        function getEmptyScrap() {
            return {
                title: '',
                tags: []
            };
        }

        $scope.scraps = store.scraps;

        $scope.newScrap = getEmptyScrap();
        $scope.selectedScrap = null;

        $scope.addScrap = function () {
            $scope.newScrap.title =  $scope.newScrap.title.trim();

            if (!$scope.newScrap.title) {
                return;
            }

            $scope.saving = true;
            store.insert($scope.newScrap)
                .then(function success() {
                    $scope.newScrap = getEmptyScrap();
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.selectScrap = function (scrap) {
            $scope.selectedScrap = scrap;
        };
    }
}


ScrapsPageController.$inject = ['$scope', '$routeParams', 'store'];
export default ScrapsPageController;
