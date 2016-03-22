/*global appBundle, describe, it, beforeEach, inject, expect*/
/*jslint nomen: true*/

//var view = require('../../js/directive/scrapDetailView.js');

(function () {
    'use strict';

    describe('scrapDetailViewCtrl:', function () {
        var ctrl, scrap, store;

        beforeEach(inject(function (scrapStorage, $httpBackend) {
            var count = 0;

            store = scrapStorage;

            // Setup POST method to echo the input data.
            $httpBackend
                .when('POST', '/api/scraps')
                .respond(function (method, url, data) {
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

        describe('Pre-populate store with a scrap', function () {
            beforeEach(inject(function ($httpBackend) {
                ctrl = new appBundle.ScrapDetailViewController(store);
                store.insert({ title: 'Item 1' });
                $httpBackend.flush();
                scrap = store.scraps.get(1);
                ctrl.updateOriginalScrap(scrap);
            }));

            it('should remove scraps w/o title on saving', function () {
                scrap.title = '';
                ctrl.saveEdits(scrap);
                expect(store.scraps.length).toBe(0);
            });

            it('should trim scraps on saving', function () {
                scrap.title = ' buy moar unicorns  ';
                ctrl.saveEdits(scrap);
                expect(store.scraps.get(1).title).toBe('buy moar unicorns');
            });

            it('revertScrap() get a scrap to its previous state', function () {
                scrap.title = 'Unicorn sparkly skypuffles.';
                ctrl.revertEdits(scrap);
                expect(store.scraps.get(1).title).toBe('Item 1');
            });

        });
    });
}());
