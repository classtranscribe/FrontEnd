import React from 'react';
import { Provider } from 'react-redux';
import { transContext, transStore } from '../trans';

function TransReduxProvider({ children }) {
  return (
    <Provider store={transStore} context={transContext}>
      {children}
    </Provider>
  );
}

export default TransReduxProvider;