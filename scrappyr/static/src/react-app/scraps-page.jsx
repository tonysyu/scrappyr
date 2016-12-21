/** @jsx React.DOM */

var React = require('react');
var NewScrapInput = require('./new-scrap-input');
var FilterInput = require('./filter-input');
var ScrapsList = require('./scraps-list');

module.exports = React.createClass({
    displayName: 'ScrapsPage',
    render: () => {
        return <div>
            <div className="col-xs-6">
                <div id="main">
                    <FilterInput />
                    <ScrapsList />
                </div>

                <footer id="info">
                    <p>Double-click to edit a scrap</p>
                </footer>

            </div>

            <NewScrapInput />
        </div>;
    },
})
