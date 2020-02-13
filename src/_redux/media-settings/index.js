import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import mspReducer from './msp.reducers'

import { isDeveloping } from '../../utils'

export { connectWithRedux } from './msp.selectors'

export const mspStore = createStore(
  mspReducer, 
  isDeveloping ? applyMiddleware(logger) : undefined
)