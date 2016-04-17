import {scrapDetailControllerFactory} from './controller';

class ScrapDetailView {
    constructor () {
        this.controller = scrapDetailControllerFactory;
        this.controllerAs = 'ctrl';
        this.templateUrl = '/static/src/ng-app/scrapDetailView/index.html';
        this.scope = {
            scrap: '='
        };
    }
}


export function scrapDetailViewFactory() {
    return new ScrapDetailView();
}
