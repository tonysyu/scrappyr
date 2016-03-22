export class ScrapBasicViewController {
    constructor(scrapStorage) {
        this._scrapStorage = scrapStorage;
    }

    removeScrap(scrap) {
        this._scrapStorage.remove(scrap);
    }
}

function scrapBasicViewControllerFactory(scrapStorage) {
    return new ScrapBasicViewController(scrapStorage);
}

scrapBasicViewControllerFactory.$inject = ['scrapStorage'];


class ScrapBasicView {
    constructor() {
        this.controller = scrapBasicViewControllerFactory,
        this.controllerAs = 'ctrl',
        this.templateUrl = '/static/src/ng-ui/scrapBasicView/index.html',
        this.scope = {
            scrap: '='
        };
    }
}

export function scrapBasicViewFactory() {
    return new ScrapBasicView();
}
