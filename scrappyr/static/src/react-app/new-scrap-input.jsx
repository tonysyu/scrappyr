import React from 'react';

class NewScrapInput extends React.Component {
    render() {
        return (
            <div className="col-xs-6">
                <form id="scrap-form">
                    <input id="new-scrap"
                      placeholder="Enter a scrap of data"
                      autofocus/>
                </form>

                <div className="scrap"></div>
            </div>
        );
    }
}

export default NewScrapInput;