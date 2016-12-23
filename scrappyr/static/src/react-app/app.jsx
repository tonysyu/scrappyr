/*jshint esnext: true*/

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ScrapRepository from '../core/scrap-repository';

const REQUEST_SCRAPS = 'REQUEST_SCRAPS';
const RECEIVE_SCRAPS = 'RECEIVE_SCRAPS';

const initialState = {
    scraps: [],
};

const repo = new ScrapRepository();

export function fetchScraps() {
    return dispatch => {
        return repo.get()
            .then(scraps => dispatch(receiveScraps(scraps)));
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
