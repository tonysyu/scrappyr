/*global describe, it, beforeEach, inject, expect*/
// Import angular from index (not global), which defines appropriate providers.
import angular from '../../index';
import 'angular-mocks';

describe('scrap-basic-view directive:', () => {
    var element, scope,
        default_scrap = {title: 'Start with one scrap'};

    beforeEach(() => {
        angular.mock.module('scrappyr');
        angular.mock.module('my.templates');
        angular.mock.inject(($rootScope, $compile) => {
            scope = $rootScope.$new();
            scope.scrap = default_scrap;

            var html = '<scrap-basic-view scrap=scrap></scrap-basic-view>';
            element = $compile(html)(scope);
            scope.$digest();
        })
    });

    it('Scrap is properly initialized', () => {
        var isolated = element.isolateScope();
        expect(isolated.scrap).toBe(default_scrap);
    });

});
