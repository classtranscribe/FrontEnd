import { connect } from 'react-redux'
import * as globalActions from './global.actions'

export const connectWithRedux = (
  Component,
  requestedStates=[],
  requestedDispatches=[],
) => {
  const mapStateToProps = state => {
    const stateProps = {}
    requestedStates.forEach(requestedState => {
      stateProps[requestedState] = state[requestedState]
    })
    return stateProps
  }

  const mapDispatchToProps = dispatch => {
    const dispatchProps = {}
    requestedDispatches.forEach(requestedDispatch => {
      const dispatchFunc = globalActions[requestedDispatch]
      if (Boolean(dispatchFunc)) {
        dispatchProps[requestedDispatch] = value => dispatch(dispatchFunc(value))
      }
    })
    return dispatchProps
  }
  return connect(
    mapStateToProps, 
    mapDispatchToProps
  )(Component)
}