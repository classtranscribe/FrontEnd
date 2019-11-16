import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import watchReducer from './watch.reducers'
import * as watchActions_ from './watch.actions'

export { connectWithRedux } from './watch.selectors'

export const watchStore = createStore(
  watchReducer, 
  //window.location.origin === 'http://localhost:3000' ? applyMiddleware(logger) : undefined
)

export const watchActions = watchActions_