/*jshint esnext: true*/

'use strict';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const REQUEST_SCRAPS = 'REQUEST_SCRAPS'
const RECEIVE_SCRAPS = 'RECEIVE_SCRAPS'

const initialState = {
    scraps: [],
};

export function fetchScraps() {
    return dispatch => {
        return fetch('/api/scraps')
                .then(blob => blob.json())
                .then(json => dispatch(receiveScraps(json.scraps)));
    };
}

function receiveScraps(scraps) {
    return {
        type: RECEIVE_SCRAPS,
        scraps: scraps,
        receivedAt: Date.now(),
    };
}

function scrappyrApp(state, action={}) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case RECEIVE_SCRAPS:
            return Object.assign({}, state, {
                scraps: action.scraps,
                lastUpdated: action.receivedAt,
            });
        case REQUEST_SCRAPS:
        default:
            return state;
    }
}

export const store = createStore(
    scrappyrApp,
    applyMiddleware(thunk)
);
