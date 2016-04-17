/*global describe, it, beforeEach, inject, expect*/
import * as core from '../../core';
import * as coreUI from '../../core-ui';
import * as coreTesting from '../../core/testing';

describe('scrapEditor:', () => {
    var ctrl, scrap, store;

    beforeEach(() => {
        var count = 0;

        var http = new coreTesting.MockAjax();
        // Setup POST method to echo the input data.
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

        store = new core.ScrapStorage(http);
    });

    describe('Pre-populate store with a scrap', () => {
        beforeEach(() => {
            ctrl = new coreUI.ScrapEditor(store);
            store.insert({ title: 'Item 1' });
            scrap = store.scraps.get(1);
            ctrl.updateOriginalScrap(scrap);
        });

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
