import TagStorage from '../../core/tag-storage';

function tagStorageFactory($http){
    return new TagStorage($http);
}

tagStorageFactory.$inject = ['$http'];
export default tagStorageFactory;
