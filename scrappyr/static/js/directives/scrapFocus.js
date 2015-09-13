/*global angular */

/**
 * Directive that places focus on the element it is applied to when the
 * expression it binds to evaluates to true.
 *
 * The behavior of this directive differs from ng-if and ng-focus since
 * clicking away from an element is enough remove focus.
 */
angular.module('scrappyr')
    .directive('scrapFocus', function scrapFocus($timeout) {
        'use strict';

        return function (scope, elem, attrs) {
            scope.$watch(attrs.scrapFocus, function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        };
    });