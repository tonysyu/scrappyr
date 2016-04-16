/*global describe, it, beforeEach, inject, expect, module*/
import 'angular-mocks';

describe('scrapBasicViewCtrl:', () => {
    var scope, store,
        default_scrap = {title: 'Start with one scrap'};

    // Load the module containing the app, only 'ng' is loaded by default.
    beforeEach(angular.mock.module('scrappyr'));
    beforeEach(angular.mock.module('my.templates'));

    beforeEach(inject(($rootScope, scrapStorage, $httpBackend) => {
        var count = 0;

        scope = $rootScope.$new();
        scope.scrap = default_scrap;
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

    describe('Pre-populate 3 scraps', () => {
        beforeEach(inject(($httpBackend) => {
            store.insert({ title: 'Item 1' });
            store.insert({ title: 'Item 2' });
            store.insert({ title: 'Item 3' });
            scope.$digest();
            $httpBackend.flush();
        }));

        it('should save scraps to local storage', () => {
            expect(store.scraps.length).toBe(3);
        });

    });
});
