import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import globalReducer from './global.reducers'
// import * as globalActions_ from './global.actions'

import { isDeveloping } from '../../utils'

export { connectWithRedux } from './global.selectors'

export const globalStore = createStore(
  globalReducer, 
  isDeveloping ? applyMiddleware(logger) : undefined
)

// export const globalActions = globalActions_