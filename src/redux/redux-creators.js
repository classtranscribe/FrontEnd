import { createStore, applyMiddleware } from 'redux'
import { connect } from 'react-redux'
import logger from 'redux-logger'
import { isDeveloping } from 'utils'

/**
 * Create a Redux action for dispatches
 * @param {String} type the action type
 */
export function createAction(type) {
    return value => ({ type, value })
}

/**
 * Create a Redux selector
 * @param {Function[]} actions action functions
 * @param {Object} options options for creating a Redux selector
 * @param {String[]} options.defaultRequestedStates default states to connect
 * @param {String[]} options.defaultRequestedDispatches default dispatches to connect
 */
export function createSelector(actions, options = {
    defaultRequestedStates: [],
    defaultRequestedDispatches: [],
}) {
    const {
        defaultRequestedStates,
        defaultRequestedDispatches,
    } = options

    function connectWithRedux(
        Component, 
        requestedStates = defaultRequestedStates,
        requestedDispatches = defaultRequestedDispatches
    ) {
        const mapStateToProps = state => {
            let stateProps = {}
            requestedStates.forEach(requestedState => {
                stateProps[requestedState] = state[requestedState]
            })

            return stateProps
        }
    
        const mapDispatchToProps = dispatch => {
            let dispatchProps = {}
            requestedDispatches.forEach(requestedDispatch => {
                let dispatchFunc = actions[requestedDispatch]
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

    return connectWithRedux
}


/**
 * Create a redux store
 * @param {Function} reducer 
 */
export function createReduxStore(reducer) {
    let store = createStore(
        reducer, 
        isDeveloping ? applyMiddleware(logger) : undefined
    )

    return store
}