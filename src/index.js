import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { CTContextProvider } from './components'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render((
  <CTContextProvider>
    <Router basename="/">
      <App />
    </Router>
  </CTContextProvider>
), document.getElementById('root'));
// serviceWorker.unregister();
