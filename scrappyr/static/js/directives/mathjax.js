/*global angular, MathJax*/

angular.module('scrappyr')
    .directive('mathjax', function () {
        "use strict";

        return {
            link: function (scope, element, attr) {
                scope.$watch(attr.ngBindHtml, function (value) {
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0]]);
                });
            }
        };
    });
