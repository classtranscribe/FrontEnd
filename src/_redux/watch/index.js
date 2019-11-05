import { createStore } from 'redux'
import watchReducer from './watch.reducers'
import * as watchActions_ from './watch.actions'

export { connectWithRedux } from './watch.selectors'

export const watchStore = createStore(watchReducer)
export const watchActions = watchActions_