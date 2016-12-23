/*jshint esnext: true*/

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ScrapsPage from './scraps-page';
import * as app from './app';

app.store.dispatch(app.fetchScraps());

class App extends React.Component {
    render () {
        return (
            <Provider store={ app.store }>
                <ScrapsPage />
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));
