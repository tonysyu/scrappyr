/*global describe, it, beforeEach, inject, expect*/
import 'angular-mocks';
import * as coreUI from '../../core-ui';

describe('scrapsPageCtrl:', () => {
    var ctrl, store;

    // Load the module containing the app, only 'ng' is loaded by default.
    beforeEach(angular.mock.module('scrappyr'));

    beforeEach(inject((scrapStorage, $httpBackend) => {
        store = scrapStorage;

        var count = 0;

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

        ctrl = new coreUI.ScrapsPageController(store);
    }));

    it('No active scraps on start', () => {
        expect(ctrl.scraps.length).toBe(0);
    });

    it('No `selectedScrap` on start', () => {
        expect(ctrl.selectedScrap).toBeNull();
    });

    describe('Empty scraps list', () => {
        it('should not add null title', () => {
            ctrl.newScrap = {title: ''};
            ctrl.addScrap();
            expect(ctrl.scraps.length).toBe(0);
        });

        it('should not add scrap with empty title', () => {
            ctrl.newScrap = {title: '   '};
            ctrl.addScrap();
            expect(ctrl.scraps.length).toBe(0);
        });

        it('should trim whitespace in new scrap', inject(($httpBackend) => {
            ctrl.newScrap = {title: '  buy some unicorns  '};
            ctrl.addScrap();
            $httpBackend.flush();

            expect(ctrl.scraps.length).toBe(1);
            expect(ctrl.scraps.get(1).title).toBe('buy some unicorns');
        }));
    });
});
