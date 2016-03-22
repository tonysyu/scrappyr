import TagStorage from '../../core/tagStorage';

function tagStorageFactory($http){
    return new TagStorage($http);
}

tagStorageFactory.$inject = ['$http'];
export default tagStorageFactory;
