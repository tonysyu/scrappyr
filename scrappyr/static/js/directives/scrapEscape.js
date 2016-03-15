const ESCAPE_KEY = 27;

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
export default function scrapEscape() {
    return function (scope, elem, attrs) {
        elem.bind('keydown', function (event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(attrs.scrapEscape);
            }
        });
    };
}
