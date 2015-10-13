/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('scrapDetailViewCtrl:', function () {
        var ctrl, element, scope, store;

        beforeEach(inject(function ($rootScope, scrapStorage, $httpBackend, $compile) {
            var count = 0;

            scope = $rootScope.$new();
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
            beforeEach(inject(function ($controller, $httpBackend) {
                ctrl = $controller('scrapDetailViewCtrl', {
                    $scope: scope,
                    store: store
                });
                store.insert({ title: 'Item 1' });
                $httpBackend.flush();

                scope.scrap = store.scraps.get(1);
                scope.$digest();
            }));

            it('should remove scraps w/o title on saving', function () {
                scope.scrap.title = '';
                scope.saveEdits(scope.scrap);
                expect(store.scraps.length).toBe(0);
            });

            it('should trim scraps on saving', function () {
                scope.scrap.title = ' buy moar unicorns  ';
                scope.saveEdits(scope.scrap);
                expect(store.scraps.get(1).title).toBe('buy moar unicorns');
            });

            it('revertScrap() get a scrap to its previous state', function () {
                scope.scrap.title = 'Unicorn sparkly skypuffles.';
                scope.revertEdits(scope.scrap);
                expect(store.scraps.get(1).title).toBe('Item 1');
            });

        });
    });
}());
