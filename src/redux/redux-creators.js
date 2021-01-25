import { createStore, applyMiddleware, Reducer } from 'redux';
import { connect } from 'dva';
import logger from 'redux-logger';
import { isDeveloping } from 'utils';

/**
 * Create a Redux action for dispatches
 * @param {String} type the action type
 */
export function createAction(type) {
  return (value) => ({ type, value });
}

/**
 * Create a Redux selector
 * @param {Function[]} actions action functions
 * @param {Object} options options for creating a Redux selector
 * @param {String[]} options.defaultRequestedStates default states to connect
 * @param {String[]} options.defaultRequestedDispatches default dispatches to connect
 * @returns {Function} the function used to connect with the redux store
 */
export function createSelector(
  actions,
  options = {
    defaultRequestedStates: [],
    defaultRequestedDispatches: [],
  },
) {
  const { defaultRequestedStates, defaultRequestedDispatches } = options;

  function connectWithRedux(
    Component,
    requestedStates = defaultRequestedStates,
    requestedDispatches = defaultRequestedDispatches,
    context,
  ) {
    const mapStateToProps = (state) => {
      let stateProps = {};

      if (requestedStates[0] === 'all') {
        stateProps = { ...state };
      } else {
        requestedStates.forEach((requestedState) => {
          stateProps[requestedState] = state[requestedState];
        });
      }

      return stateProps;
    };

    const mapDispatchToProps = (dispatch) => {
      const dispatchProps = {};

      if (requestedDispatches[0] === 'all') {
        Object.keys(actions).forEach((key) => {
          dispatchProps[key] = (value) => dispatch(actions[key](value));
        });
      } else {
        requestedDispatches.forEach((requestedDispatch) => {
          const dispatchFunc = actions[requestedDispatch];
          if (dispatchFunc) {
            dispatchProps[requestedDispatch] = (value) => dispatch(dispatchFunc(value));
          }
        });
      }

      return dispatchProps;
    };

    if (Component) {
      return connect(mapStateToProps, mapDispatchToProps, null, { context })(Component);
    }
    return connect(mapStateToProps, mapDispatchToProps, null, { context });
  }

  return connectWithRedux;
}

/**
 * Create a redux store
 * @param {Reducer} reducer
 */
export function createReduxStore(reducer) {
  const store = createStore(reducer, isDeveloping ? applyMiddleware(logger) : undefined);

  return store;
}
