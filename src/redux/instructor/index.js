import { createReduxStore, createSelector } from '../redux-creators'
import instpReducer from './instp.reducers'
import * as instpActions from './instp.actions'


export const connectWithRedux = createSelector(instpActions)

export const instpStore = createReduxStore(instpReducer)