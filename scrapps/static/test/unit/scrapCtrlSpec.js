/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('Scrap Controller', function () {
        var ctrl, scope, store;

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('scrapps'));

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

        it('All scraps completed on start', function () {
            scope.$digest();
            // Is this worth checking? There are no checked scraps because
            // there are no scraps period.
            expect(scope.allChecked).toBeTruthy();
        });

        describe('Filter', function () {
            it('should default to ""', function () {
                scope.$emit('$routeChangeSuccess');

                expect(scope.status).toBe('');
                expect(scope.statusFilter).toBeNull();
            });

            describe('being at /active', function () {
                it('should filter non-completed', inject(function ($controller) {
                    ctrl = $controller('ScrapCtrl', {
                        $scope: scope,
                        store: store,
                        $routeParams: {
                            status: 'active'
                        }
                    });

                    scope.$emit('$routeChangeSuccess');
                    expect(scope.statusFilter.completed).toBeFalsy();
                }));
            });

            describe('being at /completed', function () {
                it('should filter completed', inject(function ($controller) {
                    ctrl = $controller('ScrapCtrl', {
                        $scope: scope,
                        $routeParams: {
                            status: 'completed'
                        },
                        store: store
                    });

                    scope.$emit('$routeChangeSuccess');
                    expect(scope.statusFilter.completed).toBeTruthy();
                }));
            });
        });

        describe('having no scraps', function () {
            var ctrl;

            it('should not add empty scraps', function () {
                scope.newScrap = '';
                scope.addScrap();
                scope.$digest();
                expect(scope.scraps.length).toBe(0);
            });

            it('should not add items consisting only of whitespaces', function () {
                scope.newScrap = '   ';
                scope.addScrap();
                scope.$digest();
                expect(scope.scraps.length).toBe(0);
            });


            it('should trim whitespace from new scraps', inject(
                function ($httpBackend) {
                    scope.newScrap = '  buy some unicorns  ';
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

                store.insert({ title: 'Uncompleted Item 0', completed: false });
                store.insert({ title: 'Uncompleted Item 1', completed: false });
                store.insert({ title: 'Uncompleted Item 2', completed: false });
                store.insert({ title: 'Completed Item 0', completed: true });
                store.insert({ title: 'Completed Item 1', completed: true });
                scope.$digest();
                $httpBackend.flush();
            }));

            it('should count scraps correctly', function () {
                expect(scope.scraps.length).toBe(5);
                expect(scope.remainingCount).toBe(3);
                expect(scope.completedCount).toBe(2);
                expect(scope.allChecked).toBeFalsy();
            });

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

            it('clearCompletedScraps() should clear completed scraps', function () {
                scope.clearCompletedScraps();
                expect(scope.scraps.length).toBe(3);
            });

            it('markAll() should mark all scraps completed', inject(
                function ($httpBackend) {
                    $httpBackend
                        .when('PUT', '/api/scraps/undefined')
                        .respond(200, {status: 'success'});

                    scope.markAll(true);
                    scope.$digest();
                    expect(scope.completedCount).toBe(5);
                }
            ));

            it('revertScrap() get a scrap to its previous state', function () {
                var scrap = store.scraps[0];
                scope.editScrap(scrap);
                scrap.title = 'Unicorn sparkly skypuffles.';
                scope.revertEdits(scrap);
                scope.$digest();
                expect(scope.scraps[0].title).toBe('Uncompleted Item 0');
            });
        });
    });
}());
