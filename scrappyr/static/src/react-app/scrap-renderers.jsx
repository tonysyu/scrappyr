/*jshint esnext: true*/

export function renderHandle(scrap) {
    return <div className="scrap-handle"></div>;
}

export function renderTitle(scrap) {
    return (
        <div className="scrap-title"
            data-mathjax="true"
            dangerouslySetInnerHTML={ {__html: scrap.html_title} }>
        </div>
    );
}
