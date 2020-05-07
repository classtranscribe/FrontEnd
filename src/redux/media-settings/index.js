import { createContext } from 'react';
import { createReduxStore, createSelector } from '../redux-creators';
import mspReducer from './msp.reducers';
import * as mspActions from './msp.actions';

export const mspContext = createContext();
export const mspStore = createReduxStore(mspReducer);

const connectWithMSPRedux = createSelector(mspActions);

export const connectWithRedux = (
    Component,
    requestedStates,
    requestedDispatches
) => connectWithMSPRedux(
    Component,
    requestedStates,
    requestedDispatches,
    mspContext
);