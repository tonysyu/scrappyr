/*global describe, it, beforeEach, expect*/
// Import angular from index (not global), which defines appropriate providers.
import angular from '../../index';
import 'angular-mocks';

describe('scrapFocus directive', () => {
    var scope, compile, browser;

    beforeEach(() => {
        angular.mock.module('scrappyr');
        angular.mock.inject(($rootScope, $compile, $browser) => {
            scope = $rootScope.$new();
            compile = $compile;
            browser = $browser;
        });
    });

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
