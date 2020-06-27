import { createContext } from 'react';
import { compose } from 'redux';

import { createReduxStore, createSelector } from '../../redux-creators';
import { connectWithRedux as connectWithMSPRedux } from '../index';

import transReducer from './trans.reducers';
import * as transActions from './trans.actions';

export const transContext = createContext();
export const transStore = createReduxStore(transReducer);


const connectWithTransRedux = createSelector(transActions);

export const connectWithRedux = (
  Component,
  requestedStatesToTrans,
  requestedDispatchesToTrans,
  requestedStatesToMSP,
  requestedDispatchesToMSP,
) => compose(
  connectWithTransRedux(null, requestedStatesToTrans, requestedDispatchesToTrans, transContext),
  connectWithMSPRedux(null, requestedStatesToMSP, requestedDispatchesToMSP)
)(Component);