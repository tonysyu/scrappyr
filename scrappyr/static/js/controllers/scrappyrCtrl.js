/**
 * The main controller for the app.
 */
class ScrappyrController {
    constructor($scope, $location) {
        $scope.isActive = function (viewLocation) {
            var value = viewLocation === $location.path();
            return value;
        };
    }
}

ScrappyrController.$inject = ['$scope', '$location'];
export default ScrappyrController;
