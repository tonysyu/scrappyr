import {createMappedArray} from '../scrappyrUtils';

/**
 * Service that persists and retrieves tags from the backend API.
 */
class TagStorage {
    constructor($http) {
        this._http = $http;
        this.tags = createMappedArray();
    }

    remove(tag) {
        var originalTags = this.tags.copy();
        this.tags.remove(tag.id);

        var success = () => this.tags;
        var failure = () => {
            this.tags.update(originalTags);
            return this.tags;
        }
        return this._http.delete('/api/tags/' + tag.id).then(success, failure);
    }

    get() {
        return this._http.get('/api/tags')
            .then((response) => this.tags.update(response.data.tags));
    }
}

function tagStorageFactory($http){
    return new TagStorage($http);
}

tagStorageFactory.$inject = ['$http'];
export default tagStorageFactory;
