import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import instpReducer from './instp.reducers'
// import * as instpActions_ from './instp.actions'

export { connectWithRedux } from './instp.selectors'

export const instpStore = createStore(
  instpReducer, 
  window.location.origin === 'http://localhost:3000' ? applyMiddleware(logger) : undefined
)

// export const instpActions = instpActions_