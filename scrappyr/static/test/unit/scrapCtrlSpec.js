/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('Scrap Controller', function () {
        var ctrl, scope, store;

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('scrappyr'));

        beforeEach(inject(function ($controller, $rootScope, api, $httpBackend) {
            scope = $rootScope.$new();
            store = api;

            // Setup POST method to echo the input data.
            $httpBackend
                .when('POST', '/api/scraps')
                .respond(function (method, url, data) {
                    return [200, JSON.parse(data)];
                });

            ctrl = $controller('ScrapCtrl', {
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
            var ctrl;

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
                    expect(scope.scraps[0].title).toBe('buy some unicorns');
                }
            ));
        });

        describe('Pre-populate 5 scraps', function () {
            var ctrl;

            beforeEach(inject(function ($controller, $httpBackend) {
                ctrl = $controller('ScrapCtrl', {
                    $scope: scope,
                    store: store
                });

                store.insert({ title: 'Item 0' });
                store.insert({ title: 'Item 1' });
                store.insert({ title: 'Item 2' });
                store.insert({ title: 'Item 3' });
                store.insert({ title: 'Item 4' });
                scope.$digest();
                $httpBackend.flush();
            }));

            it('should save scraps to local storage', function () {
                expect(scope.scraps.length).toBe(5);
            });

            it('should remove scraps w/o title on saving', function () {
                var scrap = store.scraps[2];
                scope.editScrap(scrap);
                scrap.title = '';
                scope.saveEdits(scrap);
                expect(scope.scraps.length).toBe(4);
            });

            it('should trim scraps on saving', function () {
                var scrap = store.scraps[0];
                scope.editScrap(scrap);
                scrap.title = ' buy moar unicorns  ';
                scope.saveEdits(scrap);
                expect(scope.scraps[0].title).toBe('buy moar unicorns');
            });

            it('revertScrap() get a scrap to its previous state', function () {
                var scrap = store.scraps[0];
                scope.editScrap(scrap);
                scrap.title = 'Unicorn sparkly skypuffles.';
                scope.revertEdits(scrap);
                scope.$digest();
                expect(scope.scraps[0].title).toBe('Item 0');
            });
        });
    });
}());
