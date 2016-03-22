import ScrapStorage from '../../core/scrap-storage';

function scrapStorageFactory($http) {
    return new ScrapStorage($http);
}

scrapStorageFactory.$inject = ['$http'];
export default scrapStorageFactory;
