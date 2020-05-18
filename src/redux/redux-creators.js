import _ from 'lodash';
import { createStore, applyMiddleware, Reducer } from 'redux';
import { connect } from 'react-redux';
import logger from 'redux-logger';
import { isDeveloping } from 'utils';

/**
 * Create a Redux action for dispatches
 * @param {String} type the action type
 */
export function createAction(type) {
    return value => ({ type, value });
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
    } = options;

    function connectWithRedux(
        Component, 
        requestedStates = defaultRequestedStates,
        requestedDispatches = defaultRequestedDispatches,
        context,
    ) {
        const mapStateToProps = state => {
            let stateProps = {};

            if (requestedStates[0] === 'all') {
                stateProps = { ...state };
            } else {
                requestedStates.forEach(requestedState => {
                    stateProps[requestedState] = state[requestedState];
                });
            }

            return stateProps;
        };
    
        const mapDispatchToProps = dispatch => {
            let dispatchProps = {};

            if (requestedDispatches[0] === 'all') {
                for (let key in actions) {
                    dispatchProps[key] = value => dispatch(actions[key](value));
                }
            } else {
                requestedDispatches.forEach(requestedDispatch => {
                    let dispatchFunc = actions[requestedDispatch];
                    if (Boolean(dispatchFunc)) {
                        dispatchProps[requestedDispatch] = value => dispatch(dispatchFunc(value));
                    }
                });
            }

            return dispatchProps;
        };
        
        if (Boolean(Component)) {
            return connect(
                mapStateToProps, 
                mapDispatchToProps,
                null,
                { context }
            )(Component);
        } else {
            return connect(
                mapStateToProps, 
                mapDispatchToProps,
                null,
                { context }
            )
        }
    }

    return connectWithRedux;
}


/**
 * Create a redux store
 * @param {Reducer} reducer 
 */
export function createReduxStore(reducer) {
    let store = createStore(
        reducer, 
        isDeveloping ? applyMiddleware(logger) : undefined
    );

    return store;
}