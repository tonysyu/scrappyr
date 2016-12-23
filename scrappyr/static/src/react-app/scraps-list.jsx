/*jshint esnext: true*/

import React from 'react';
import {connect} from 'react-redux';
import {renderHandle, renderTitle} from './scrap-renderers';

class ScrapsList extends React.Component {
    render() {
        const renderScrap = createListItemRenderer([
            renderHandle,
            renderTitle,
        ]);
        return (
            <div>
                <ol id="scrap-list">
                    { this.props.scraps.map(renderScrap) }
                </ol>
            </div>
        );
    }
}

function createListItemRenderer(renderers) {
    return function renderScrap(scrap) {
        return (
            <li key={scrap.id} className="scrap">
                <div className="scrap-list-view">
                    { renderers.map(render => render(scrap)) }
                </div>
            </li>
        );
    }
}

function selectProps (state){
    return {scraps: state.scraps};
}

function mapDispatchToProps(dispatch){
    return {};
}

export default connect(selectProps, mapDispatchToProps)(ScrapsList);
