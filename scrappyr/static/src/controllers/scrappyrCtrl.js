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


export default function scrappyrControllerFactory($scope, $location) {
    return new ScrappyrController($scope, $location);
}
scrappyrControllerFactory.$inject = ['$scope', '$location'];
