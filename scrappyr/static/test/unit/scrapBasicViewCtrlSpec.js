/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('scrapBasicViewCtrl:', function () {
        var ctrl, element, scope, store,
            default_scrap = {title: 'Start with one scrap'};

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('scrappyr'));
        beforeEach(module('my.templates'));

        beforeEach(inject(function ($rootScope, api, $httpBackend, $compile) {
            var count = 0;

            scope = $rootScope.$new();
            scope.scrap = default_scrap;
            store = api;

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

        describe('Pre-populate 5 scraps', function () {
            beforeEach(inject(function ($controller, $httpBackend) {
                ctrl = $controller('scrapBasicViewCtrl', {
                    $scope: scope,
                    store: store
                });
                store.insert({ title: 'Item 1' });
                store.insert({ title: 'Item 2' });
                store.insert({ title: 'Item 3' });
                scope.$digest();
                $httpBackend.flush();
            }));

            it('should save scraps to local storage', function () {
                expect(store.scraps.length).toBe(3);
            });

        });
    });
}());
