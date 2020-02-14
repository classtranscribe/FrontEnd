import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import instpReducer from './instp.reducers'
// import * as instpActions_ from './instp.actions'

import { isDeveloping } from '../../utils'

export { connectWithRedux } from './instp.selectors'

export const instpStore = createStore(
  instpReducer, 
  isDeveloping ? applyMiddleware(logger) : undefined
)

// export const instpActions = instpActions_