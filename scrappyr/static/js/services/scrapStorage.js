import 'angular'
import {createMappedArray} from '../scrappyrUtils';

/**
 * Services that persists and retrieves scraps from the backend API.
 */
class ScrapStorage {
    constructor($http) {
        this._http = $http;
        this.scraps = createMappedArray();
    }

    remove(scrap) {
        var originalScraps = this.scraps.copy();

        this.scraps.remove(scrap.id);

        var url = '/api/scraps/' + scrap.id;
        var success = () => this.scraps;
        var failure = () => {
            this.scraps.update(originalScraps);
            return this.scraps;
        };
        return this._http.delete(url).then(success, failure);
    }

    get() {
        this._http.get('/api/scraps')
            .then((resp) => { this.scraps.update(resp.data.scraps); });
    }

    insert(scrap) {
        var originalScraps = this.scraps.copy();

        var success = (resp) => {
            this.scraps.set(resp.data.id, resp.data);
            return this.scraps;
        };
        var failure = () => {
            this.scraps.update(originalScraps);
            return this.scraps;
        };
        return this._http.post('/api/scraps', scrap).then(success, failure);
    }

    put(scrap) {
        var originalScrap = angular.copy(scrap);

        var url = '/api/scraps/' + scrap.id;
        var success = (resp) => angular.extend(scrap, resp.data);
        var failure = () => angular.extend(scrap, originalScrap);
        return this._http.put(url, scrap).then(success, failure);
    }

    static scrapStorageFactory($http) {
        return new ScrapStorage($http);
    }
}

ScrapStorage.scrapStorageFactory.$inject = ['$http'];
export default ScrapStorage;
