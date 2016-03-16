/*global MathJax*/

export default function mathjax() {
    return {
        link: function (scope, element, attr) {
            scope.$watch(attr.ngBindHtml, function (value) {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0]]);
            });
        }
    };
}
