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
        //this.templateUrl = '/static/src/ng-ui/scrapBasicView/index.html',
        this.template = '<div class="scrap-title" data-mathjax ng-bind-html="scrap.html_title"> </div> <button class="remove-scrap top-right glyphicon glyphicon-remove" ng-click="ctrl.removeScrap(scrap)"> </button>',
        this.scope = {
            scrap: '='
        };
    }
}

export function scrapBasicViewFactory() {
    return new ScrapBasicView();
}
