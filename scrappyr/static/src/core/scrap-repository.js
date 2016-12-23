/*jshint esnext: true*/

import urlJoin from 'url-join';

export default class ScrapRepository {
    constructor() {
        this.resourcePath = '/api/scraps';
    }

    get() {
        return fetch(this.resourcePath)
            .then(response => response.json())
            .then(data => data.scraps);
    }

    insert(scrap) {
        const options = {
            method: 'POST',
            body: JSON.stringify(scrap)
        };
        return fetch(this.resourcePath, options)
            .then(response => response.json())
            .then(data => data.id);
    }

    update(scrap) {
        const url = urlJoin(this.resourcePath, scrap.id);
        const options = {
            method: 'PUT',
            body: JSON.stringify(scrap)
        };
        return fetch(url, options);
    }

    remove(scrap) {
        const url = urlJoin(this.resourcePath, scrap.id);
        return fetch(url, {method: 'DELETE'})
            .then(() => scrap.id);
    }
}
