/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('scrapStorage:', function () {
        var store,
            defaultScrap = {id: 1, title: 'Start with one scrap'};

        function notImplementedError(methodName) {
            return "`" + methodName + "` not implemented";
        }

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('scrappyr'));

        beforeEach(inject(function (api) {
            store = api;
        }));

        it('Unimplemented MappedArray methods should throw error', function () {
            expect(function () { store.scraps.concat([defaultScrap]); })
                .toThrow(notImplementedError('concat'));
            expect(function () { store.scraps.pop(); })
                .toThrow(notImplementedError('pop'));
            expect(function () { store.scraps.push(defaultScrap); })
                .toThrow(notImplementedError('push'));
            expect(function () { store.scraps.reverse(); })
                .toThrow(notImplementedError('reverse'));
            expect(function () { store.scraps.sort(); })
                .toThrow(notImplementedError('sort'));
            expect(function () { store.scraps.splice(0, 1); })
                .toThrow(notImplementedError('splice'));
            expect(function () { store.scraps.shift(defaultScrap); })
                .toThrow(notImplementedError('shift'));
            expect(function () { store.scraps.unshift(); })
                .toThrow(notImplementedError('unshift'));
        });

    });
}());
