import { createContext } from 'react';
import { createReduxStore, createSelector } from '../../redux-creators';
import epubReducer from './epub.reducers';
import * as epubActions from './epub.actions';
import { compose } from 'redux';

import { 
    connectWithRedux as connectWithMSPRedux 
} from '../index'


const connectWithEpubRedux = createSelector(epubActions);

export const epubContext = createContext();

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

export const epubStore = createReduxStore(epubReducer);