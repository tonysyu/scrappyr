import React from 'react';

class ScrapsList extends React.Component {
    render() {
        return (
            <div>
                <ol id="scrap-list">
                    <li className="scrap">
                        <div className="scrap-list-view">
                            <div className="scrap-handle"></div>
                        </div>
                    </li>
                </ol>
            </div>
        );
    }
}

export default ScrapsList;
