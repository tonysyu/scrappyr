class ScrapBasicViewController {
    constructor(scrapStorage) {
        this._scrapStorage = scrapStorage;
    }

    removeScrap(scrap) {
        this._scrapStorage.remove(scrap);
    }
}

export function scrapBasicViewControllerFactory(scrapStorage) {
    return new ScrapBasicViewController(scrapStorage);
}

scrapBasicViewControllerFactory.$inject = ['scrapStorage'];


class ScrapBasicView {
    constructor() {
        this.controller = 'scrapBasicViewCtrl',
        this.controllerAs = 'ctrl',
        this.templateUrl = '/static/templates/scrap-basic-view.html',
        this.scope = {
            scrap: '='
        };
    }
}

export function scrapBasicViewFactory() {
    return new ScrapBasicView();
}
