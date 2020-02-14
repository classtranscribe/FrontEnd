import { connect } from 'react-redux'
import * as watchActions from './watch.actions'

export const connectWithRedux = (
  Component,
  requestedStates=['media', 'playlist', 'playlists'],
  requestedDispatches=['setMedia', 'setPlaylist', 'setPlaylists'],
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
      const dispatchFunc = watchActions[requestedDispatch]
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