import React from 'react';
import NewScrapInput from './new-scrap-input';
import FilterInput from './filter-input';
import ScrapsList from './scraps-list';

class ScrapsPage extends React.Component{
    render() {
        return (
            <div>
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
            </div>
        );
    }
}

export default ScrapsPage;
