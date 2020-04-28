import { createReduxStore, createSelector } from '../redux-creators'
import mspReducer from './msp.reducers'
import * as mspActions from './msp.actions'


export const connectWithRedux = createSelector(mspActions)

export const mspStore = createReduxStore(mspReducer)