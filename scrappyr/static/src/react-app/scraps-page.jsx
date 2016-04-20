/** @jsx React.DOM */

var React = require('react')
module.exports = React.createClass({
    displayName: 'ScrapsPage',
    render: () => {
        return <div>
            <div className="col-xs-6">
                <div id="main">
                    <div className="input-group">

                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button">
                                <span className="glyphicon glyphicon-search">
                                </span>
                            </button>
                        </span>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Filter by..." />

                    </div>

                    <div>
                        <ol id="scrap-list">
                            <li className="scrap">
                                <div className="scrap-list-view">
                                    <div className="scrap-handle"></div>
                                </div>
                            </li>
                        </ol>
                    </div>

                </div>

                <footer id="info">
                    <p>Double-click to edit a scrap</p>
                </footer>

            </div>

            <div className="col-xs-6">
                <form id="scrap-form">
                    <input id="new-scrap"
                      placeholder="Enter a scrap of data"
                      autofocus/>
                </form>

                <div className="scrap"></div>
            </div>
        </div>;
    },
})
