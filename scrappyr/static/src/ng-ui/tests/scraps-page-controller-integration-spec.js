/*global describe, it, beforeEach, inject, expect*/
import * as core from '../../core';
import * as coreUI from '../../core-ui';
import * as coreTesting from '../../core/testing';

describe('scrapsPageCtrl:', () => {
    var ctrl, store;

    beforeEach(() => {
        var count = 0;

        var http = new coreTesting.MockAjax();
        // Setup POST method to echo the input data.
        http.when('POST', '/api/scraps')
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

        store = new core.ScrapStorage(http);
        ctrl = new coreUI.ScrapsPageController(store);
    });

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

        it('should trim whitespace in new scrap', () => {
            ctrl.newScrap = {title: '  buy some unicorns  '};
            ctrl.addScrap();
            expect(ctrl.scraps.length).toBe(1);
            expect(ctrl.scraps.get(1).title).toBe('buy some unicorns');
        });
    });
});
