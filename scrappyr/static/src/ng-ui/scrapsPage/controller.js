/**
 * The controller for main scraps page.
 */
export class ScrapsPageController {
    constructor(store) {
        this._store = store;
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
        this._store.insert(this.newScrap)
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


function scrapsPageControllerFactory(store) {
    return new ScrapsPageController(store);
}
scrapsPageControllerFactory.$inject = ['store'];
export default scrapsPageControllerFactory;
