import React from 'react';

class FilterInput extends React.Component {

    render() {
        return (
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
        );
    }
}

export default FilterInput;
