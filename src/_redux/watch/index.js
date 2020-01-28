import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import watchReducer from './watch.reducers'
import * as watchActions_ from './watch.actions'

import { isDeveloping } from 'utils'

export { connectWithRedux } from './watch.selectors'

export const watchStore = createStore(
  watchReducer, 
  isDeveloping ? applyMiddleware(logger) : undefined
)

export const watchActions = watchActions_