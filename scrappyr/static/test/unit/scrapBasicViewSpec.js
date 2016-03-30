/*global describe, it, beforeEach, inject, expect, module*/
describe('scrap-basic-view directive:', () => {
    var ctrl, element, scope, store,
        default_scrap = {title: 'Start with one scrap'};

    // Load the module containing the app, only 'ng' is loaded by default.
    beforeEach(module('scrappyr'));
    beforeEach(module('my.templates'));

    beforeEach(inject(($rootScope, scrapStorage, $httpBackend, $compile) => {
        var count = 0;

        scope = $rootScope.$new();
        scope.scrap = default_scrap;
        store = scrapStorage;

        element = '<scrap-basic-view scrap=scrap></scrap-basic-view>';
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('Scrap is properly initialized', () => {
        var isolated = element.isolateScope();
        expect(isolated.scrap).toBe(default_scrap);
    });

});
