/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('directive: scrap-item', function () {
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

            element = '<scrap-item scrap=scrap></scrap-item>';
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('Scrap is properly initialized', function () {
            var isolated = element.isolateScope();
            expect(isolated.scrap).toBe(default_scrap);
        });

    });
}());
