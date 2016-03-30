/*global describe, it, beforeEach, inject, expect, angular, module*/

// FIXME: Removing this breaks tests outside this file. Even if this whole
//        thing is wrapped in an IIFE, it affects tests outside this file.
beforeEach(module('scrappyr'));

describe('scrapFocus directive', () => {
    var scope, compile, browser;

    beforeEach(inject(($rootScope, $compile, $browser) => {
        scope = $rootScope.$new();
        compile = $compile;
        browser = $browser;
    }));

    it('should focus on truthy expression', () => {
        var el = angular.element('<input scrap-focus="focus">');
        scope.focus = false;

        compile(el)(scope);
        expect(browser.deferredFns.length).toBe(0);

        scope.$apply(() => {
            scope.focus = true;
        });

        expect(browser.deferredFns.length).toBe(1);
    });
});
