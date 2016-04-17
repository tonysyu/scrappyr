import * as core from '../../core';

function tagStorageFactory($http){
    return new core.TagStorage($http);
}

tagStorageFactory.$inject = ['$http'];
export default tagStorageFactory;
