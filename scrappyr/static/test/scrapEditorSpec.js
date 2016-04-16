/*global coreUIBundle, describe, it, beforeEach, inject, expect*/
import 'angular-mocks';

describe('scrapEditor:', () => {
    var ctrl, scrap, store;

    beforeEach(angular.mock.module('scrappyr'));

    beforeEach(angular.mock.inject(function(scrapStorage, $httpBackend) {
        var count = 0;

        store = scrapStorage;

        // Setup POST method to echo the input data.
        $httpBackend
            .when('POST', '/api/scraps')
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

    }));

    describe('Pre-populate store with a scrap', () => {
        beforeEach(angular.mock.inject(($httpBackend) => {
            ctrl = new coreUIBundle.ScrapEditor(store);
            store.insert({ title: 'Item 1' });
            $httpBackend.flush();
            scrap = store.scraps.get(1);
            ctrl.updateOriginalScrap(scrap);
        }));

        it('should remove scraps w/o title on saving', () => {
            scrap.title = '';
            ctrl.saveEdits(scrap);
            expect(store.scraps.length).toBe(0);
        });

        it('should trim scraps on saving', () => {
            scrap.title = ' buy moar unicorns  ';
            ctrl.saveEdits(scrap);
            expect(store.scraps.get(1).title).toBe('buy moar unicorns');
        });

        it('revertScrap() get a scrap to its previous state', () => {
            scrap.title = 'Unicorn sparkly skypuffles.';
            ctrl.revertEdits(scrap);
            expect(store.scraps.get(1).title).toBe('Item 1');
        });

    });
});
