import React from 'react'
import ReactDOM from 'react-dom'
import { CTContextProvider } from './components'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render((
  <CTContextProvider>
    <App />
  </CTContextProvider>
), document.getElementById('root'));
// serviceWorker.unregister();
