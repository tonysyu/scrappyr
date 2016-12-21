/** @jsx React.DOM */

var React = require('react');
module.exports = React.createClass({
    displayName: 'NewScrapInput',
    render: () => {

        return <div className="col-xs-6">
                <form id="scrap-form">
                    <input id="new-scrap"
                      placeholder="Enter a scrap of data"
                      autofocus/>
                </form>

                <div className="scrap"></div>
            </div>;
    },
})
