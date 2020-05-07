import React from 'react';
import { Provider } from 'react-redux';
import { 
  epubContext, 
  epubStore 
} from '../epub';

function EpubReduxProvider({ children }) {
  return (
    <Provider store={epubStore} context={epubContext}>
      {children}
    </Provider>
  );
}

export default EpubReduxProvider;
