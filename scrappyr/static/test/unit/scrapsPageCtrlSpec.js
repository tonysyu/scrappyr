/*global bundle, describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('scrapsPageCtrl:', function () {
        var ctrl, store;

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('scrappyr'));

        beforeEach(inject(function ($controller, $rootScope, scrapStorage, $httpBackend) {
            store = scrapStorage;

            var count = 0;

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

            ctrl = new bundle.ScrapsPageController(store);
        }));

        it('No active scraps on start', function () {
            expect(ctrl.scraps.length).toBe(0);
        });

        it('No `selectedScrap` on start', function () {
            expect(ctrl.selectedScrap).toBeNull();
        });

        describe('Empty scraps list', function () {
            it('should not add null title', function () {
                ctrl.newScrap = {title: ''};
                ctrl.addScrap();
                expect(ctrl.scraps.length).toBe(0);
            });

            it('should not add scrap with empty title', function () {
                ctrl.newScrap = {title: '   '};
                ctrl.addScrap();
                expect(ctrl.scraps.length).toBe(0);
            });

            it('should trim whitespace in new scrap', inject(
                function ($httpBackend) {
                    ctrl.newScrap = {title: '  buy some unicorns  '};
                    ctrl.addScrap();
                    $httpBackend.flush();

                    expect(ctrl.scraps.length).toBe(1);
                    expect(ctrl.scraps.get(1).title).toBe('buy some unicorns');
                }
            ));
        });
    });
}());
