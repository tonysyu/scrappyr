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

        beforeEach(inject(function (scrapStorage) {
            store = scrapStorage;
        }));

        describe('Inserted scrap', function () {

            beforeEach(inject(function (scrapStorage) {
                store.scraps.update([{id: 'a', title: 'a'},
                                     {id: 'b', title: 'b'}]);
                store.scraps.splice(1, 0, {id: 'x', title: 'inserted'});
            }));

            it('gives expected title order', function () {
                var titles = [];
                store.scraps.forEach(function (s) { titles.push(s.title); });
                expect(titles).toEqual(['a', 'inserted', 'b']);
            });

            it('gives expected id order', function () {
                var ids = [];
                store.scraps.forEach(function (s) { ids.push(s.id); });
                expect(ids).toEqual(['a', 'x', 'b']);
            });

            it('is correctly modified', function () {
                var s = store.scraps.get('x');
                s.title = 'changed';
                expect(store.scraps.get('x').title).toBe('changed');
            });

            it('does not screw up later scrap', function () {
                var s = store.scraps.get('b');
                s.title = 'changed';
                expect(store.scraps.get('b').title, 'changed');
            });

        });

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
            expect(function () { store.scraps.shift(defaultScrap); })
                .toThrow(notImplementedError('shift'));
            expect(function () { store.scraps.unshift(); })
                .toThrow(notImplementedError('unshift'));
        });

    });
}());
