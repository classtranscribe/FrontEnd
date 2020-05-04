import { createContext } from 'react';
import { createReduxStore, createSelector } from '../redux-creators';
import mspReducer from './msp.reducers';
import * as mspActions from './msp.actions';

export const mspContext = createContext();

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


export const mspStore = createReduxStore(mspReducer);