import * as core from '../../core';

function scrapStorageFactory($http) {
    return new core.ScrapStorage($http);
}

scrapStorageFactory.$inject = ['$http'];
export default scrapStorageFactory;
