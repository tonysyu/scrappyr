import * as testing from '../testing';
import ScrapStorage from '../scrap-storage';

describe('ScrapStorage:', () => {
    var store;

    beforeEach(() => {
        var count = 0;

        var http = new testing.MockAjax();
        // Create mock response that simply returns the input data.
        http.when('POST', '/api/scraps')
            .respond((method, url, data) => {
                data = JSON.parse(data);
                // The server adds an ID to new scraps.
                if (typeof data.id !== 'number') {
                    // Increment first: The server starts IDs at 1.
                    count += 1;
                    data.id = count;
                }
                return [200, data];
            });

        store = new ScrapStorage(http);
    });

    it('insert adds to scraps array', () => {
        expect(store.scraps.length).toBe(0);
        store.insert({ title: 'Item 1' });
        expect(store.scraps.length).toBe(1);
        store.insert({ title: 'Item 2' });
        expect(store.scraps.length).toBe(2);
    });
});
