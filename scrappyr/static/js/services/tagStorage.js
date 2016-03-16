/*global angular */
/*jslint nomen:true*/

import {createMappedArray} from '../scrappyrUtils';

/**
 * Services that persists and retrieves tags from the backend API.
 */
class TagStorage {
    constructor($http) {
        this._http = $http;
        this.tags = createMappedArray();
    }

    remove(tag) {
        var originalTags = this.tags.copy();
        this.tags.remove(tag.id);

        var success = () => { return this.tags; };
        var failure = () => {                       // failure
            this.tags.update(originalTags);
            return this.tags;
        }
        return this._http.delete('/api/tags/' + tag.id)
            .then(success, failure);
    }

    get() {
        return this._http.get('/api/tags')
            .then((resp) => { this.tags.update(resp.data.tags); });
    }

    static TagStorageFactory($http){
        return new TagStorage($http);
    }
}

TagStorage.TagStorageFactory.$inject = ['$http'];
export default TagStorage;
