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

        it('No active scraps on start', function () {
            expect(scope.scraps.length).toBe(0);
        });

        it('No `editedScrap` on start', function () {
            expect(scope.editedScrap).toBeNull();
        });

        describe('having no scraps', function () {
            it('should not add null title', function () {
                scope.newScrap = {title: ''};
                scope.addScrap();
                scope.$digest();
                expect(scope.scraps.length).toBe(0);
            });

            it('should not add scrap with empty title', function () {
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
    });
}());
