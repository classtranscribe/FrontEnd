import React from 'react';
import { Provider } from 'react-redux';

/**
 * Connect the component to the provided redux store
 * @param {*} Component - the component to connect
 * @param {*} reduxStore - the redux store to this component
 * @param {Function} connectWithRedux - the redux selector to this store
 * @param {String[]} requestedStates - the requested states' names
 * @param {String[]} requestedDispatches - the requested dispatch functions' names
 */
export function withReduxProvider(
  Component,
  reduxStore,
  connectWithRedux,
  requestedStates = [],
  requestedDispatches = [],
) {
  function ConnectedComponent(props) {
    const ConnectToRedux = connectWithRedux(
      Component,
      requestedStates,
      requestedDispatches
    );
  
    return (
      <Provider store={reduxStore}>
        <ConnectToRedux {...props} />
      </Provider>
    );
  }

  return ConnectedComponent;
}