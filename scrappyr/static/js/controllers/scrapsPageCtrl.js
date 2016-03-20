/**
 * The controller for main scraps page.
 */
class ScrapsPageController {
    constructor($scope, $routeParams, store) {
        this.scraps = store.scraps;
        this.newScrap = this._getEmptyScrap();
        this.selectedScrap = null;
    }

    addScrap() {
        this.newScrap.title =  this.newScrap.title.trim();

        if (!this.newScrap.title) {
            return;
        }

        this.saving = true;
        store.insert(this.newScrap)
            .then(() => { this.newScrap = this._getEmptyScrap(); })
            .finally(() => { this.saving = false; });
    };

    selectScrap(scrap) {
        this.selectedScrap = scrap;
    }

    _getEmptyScrap() {
        return {
            title: '',
            tags: []
        };
    }
}


function scrapsPageControllerFactory($scope, $routeParams, store) {
    return new ScrapsPageController($scope, $routeParams, store);
}
scrapsPageControllerFactory.$inject = ['$scope', '$routeParams', 'store'];
export default scrapsPageControllerFactory;
