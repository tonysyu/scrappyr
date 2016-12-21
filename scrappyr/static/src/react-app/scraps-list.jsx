var React = require('react');
module.exports = React.createClass({
    displayName: 'ScrapsList',
    render: () => {
        return <div>
            <ol id="scrap-list">
                <li className="scrap">
                    <div className="scrap-list-view">
                        <div className="scrap-handle"></div>
                    </div>
                </li>
            </ol>
        </div>;
    },
})

