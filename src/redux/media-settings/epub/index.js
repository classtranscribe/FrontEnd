import { createContext } from 'react';
import { compose } from 'redux';

import { createReduxStore, createSelector } from '../../redux-creators';
import { connectWithRedux as connectWithMSPRedux } from '../index';

import epubReducer from './epub.reducers';
import * as epubActions from './epub.actions';

export const epubContext = createContext();
export const epubStore = createReduxStore(epubReducer);


const connectWithEpubRedux = createSelector(epubActions);

export const connectWithRedux = (
    Component,
    requestedStatesToEpub,
    requestedDispatchesToEpub,
    requestedStatesToMSP,
    requestedDispatchesToMSP,
) => compose(
    connectWithEpubRedux(null, requestedStatesToEpub, requestedDispatchesToEpub, epubContext),
    connectWithMSPRedux(null, requestedStatesToMSP, requestedDispatchesToMSP)
)(Component);