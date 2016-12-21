var React = require('react');
module.exports = React.createClass({
    displayName: 'FilterInput',
    render: () => {
        return <div className="input-group">

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

            </div>;
    },
})
