/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('Scraps Controller', function () {
        var ctrl, scope, store;

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('scrappyr'));

        beforeEach(inject(function ($controller, $rootScope, api, $httpBackend) {
            scope = $rootScope.$new();
            store = api;

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

            ctrl = $controller('ScrapsCtrl', {
                $scope: scope,
                store: store
            });
        }));

        it('No scraps on start', function () {
            expect(scope.editedScrap).toBeNull();
        });

        it('No active scraps on start', function () {
            expect(scope.scraps.length).toBe(0);
        });

        it('No `editedScrap` on start', function () {
            expect(scope.editedScrap).toBeNull();
        });

        describe('having no scraps', function () {
            it('should not add empty scraps', function () {
                scope.newScrap = {title: ''};
                scope.addScrap();
                scope.$digest();
                expect(scope.scraps.length).toBe(0);
            });

            it('should not add items consisting only of whitespaces', function () {
                scope.newScrap = {title: '   '};
                scope.addScrap();
                scope.$digest();
                expect(scope.scraps.length).toBe(0);
            });


            it('should trim whitespace from new scraps', inject(
                function ($httpBackend) {
                    scope.newScrap = {title: '  buy some unicorns  '};
                    scope.addScrap();
                    $httpBackend.flush();

                    scope.$digest();
                    expect(scope.scraps.length).toBe(1);
                    expect(scope.scraps.get(1).title).toBe('buy some unicorns');
                }
            ));
        });

        describe('Pre-populate 5 scraps', function () {
            beforeEach(inject(function ($controller, $httpBackend) {
                ctrl = $controller('ScrapsCtrl', {
                    $scope: scope,
                    store: store
                });

                store.insert({ title: 'Item 1' });
                store.insert({ title: 'Item 2' });
                store.insert({ title: 'Item 3' });
                store.insert({ title: 'Item 4' });
                store.insert({ title: 'Item 5' });
                scope.$digest();
                $httpBackend.flush();
            }));

            it('should save scraps to local storage', function () {
                expect(scope.scraps.length).toBe(5);
            });

            it('should remove scraps w/o title on saving', function () {
                var scrap = store.scraps.get(2);
                scope.editScrap(scrap);
                scrap.title = '';
                scope.saveEdits(scrap);
                expect(scope.scraps.length).toBe(4);
            });

            it('should trim scraps on saving', function () {
                var scrap = store.scraps.get(1);
                scope.editScrap(scrap);
                scrap.title = ' buy moar unicorns  ';
                scope.saveEdits(scrap);
                expect(scope.scraps.get(1).title).toBe('buy moar unicorns');
            });

            it('revertScrap() get a scrap to its previous state', function () {
                var scrap = store.scraps.get(1);
                scope.editScrap(scrap);
                scrap.title = 'Unicorn sparkly skypuffles.';
                scope.revertEdits(scrap);
                scope.$digest();
                expect(scope.scraps.get(1).title).toBe('Item 1');
            });
        });
    });
}());
