import React from 'react';
import {connect} from 'react-redux';

class ScrapsList extends React.Component {
    render() {
        return (
            <div>
                <ol id="scrap-list">
                    { this.props.scraps.map(renderScrap) }
                </ol>
            </div>
        );
    }
}

function renderScrap(item) {
    return (
        <li key={item.id} className="scrap">
            <div className="scrap-list-view">
                <div className="scrap-handle"></div>

                <div className="scrap-title"
                    data-mathjax="true"
                    dangerouslySetInnerHTML={ {__html: item.html_title} }>
                </div>

            </div>
        </li>
    );
}

function selectProps (state){
    return {scraps: state.scraps};
}

function mapDispatchToProps(dispatch){
    return {};
}

export default connect(selectProps, mapDispatchToProps)(ScrapsList);
